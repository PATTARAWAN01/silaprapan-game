/**
 * stage2.js - ระบบการเล่นด่านที่ 2 (ปรับปรุง 2-Mistake Skip Rule, ป้องกันเส้นทับซ้อน, และซ่อนข้อความเฉลยเมื่อตอบผิด)
 */

let stage2CurrentIndex = 0;
let stage2Score = 0;
let stage2Connections = [];
let stage2SelectedNode = null;
let stage2TaskWrongAttempts = 0; // นับจำนวนครั้งที่ตอบผิดในข้อปัจจุบัน

function initStage2() {
  stage2CurrentIndex = 0;
  stage2Score = gameState.student.stageScores?.stage2 || 0;
  stage2Connections = [];
  stage2SelectedNode = null;
  stage2TaskWrongAttempts = 0;

  startStageTimer(480, () => {
    deductScore(200);
    showCenteredResultPopup("⏰ หมดเวลาทำภารกิจ!", "หมดเวลาทำภารกิจด่านที่ 2 แล้วครับ! หัก 200 คะแนน และให้คุณเริ่มทำภารกิจต่อ", "warning", () => {
      initStage2();
    });
  });

  renderStage2Task();
}

function renderStage2Task(isReadOnly = false) {
  const container = document.getElementById("stage2Container");
  if (!container) return;

  const totalTasks = STAGE2_DIAGRAMS.length;
  if (stage2CurrentIndex >= totalTasks && !isReadOnly) {
    finishStage2();
    return;
  }

  const diagram = STAGE2_DIAGRAMS[stage2CurrentIndex] || STAGE2_DIAGRAMS[0];
  stage2TaskWrongAttempts = 0; // รีเซ็ตจำนวนครั้งที่ตอบผิดเมื่อเริ่มข้อใหม่
  
  if (isReadOnly) {
    stage2Connections = diagram.correctConnections.map(req => {
      const fromNode = diagram.syllables.find(s => s.id === req.from);
      const toNode = diagram.syllables.find(s => s.id === req.to);
      return {
        fromId: req.from,
        toId: req.to,
        fromCx: fromNode ? fromNode.x : 0,
        fromCy: fromNode ? fromNode.y : 0,
        toCx: toNode ? toNode.x : 0,
        toCy: toNode ? toNode.y : 0,
        isInterStanza: req.isInterStanza || false
      };
    });
  } else {
    stage2Connections = [];
  }
  
  stage2SelectedNode = null;

  container.innerHTML = `
    <div class="bg-white/95 backdrop-blur-md rounded-3xl p-5 md:p-8 shadow-2xl border-2 border-emerald-400 max-w-5xl mx-auto transition-all">
      <!-- Progress Bar & Header -->
      <div class="flex justify-between items-center mb-3">
        <div>
          <span class="bg-emerald-100 text-emerald-900 font-extrabold px-4 py-1.5 rounded-full text-xs md:text-sm shadow-sm">
            ข้อที่ ${stage2CurrentIndex + 1} / ${totalTasks}
          </span>
          <h3 class="text-lg md:text-xl font-extrabold text-emerald-950 mt-1">${diagram.title}</h3>
        </div>
        <span class="text-emerald-900 font-bold text-xs md:text-sm bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <i class="fas fa-coins text-amber-500 mr-1"></i>คะแนนด่านนี้: <span id="s2ScoreText">${stage2Score}</span>
        </span>
      </div>

      <p class="text-gray-600 text-xs md:text-sm mb-4">
        ${isReadOnly ? '👁️ <strong>โหมดดูเฉลยทบทวนผลคะแนน</strong> (แสดงผังเส้นสัมผัสบังคับที่ถูกต้อง)' : '<i class="fas fa-hand-pointer text-emerald-600 mr-1"></i>' + diagram.subtitle}
      </p>

      <!-- SVG Drawing Canvas Container -->
      <div class="relative bg-amber-50/40 rounded-2xl p-4 border-2 border-emerald-300 shadow-inner overflow-hidden mb-6 min-h-[240px]">
        <svg 
          id="stage2SvgCanvas" 
          viewBox="0 0 540 230" 
          preserveAspectRatio="xMidYMid meet"
          class="w-full h-auto max-h-[300px] select-none block">
          
          <!-- Layer 1: Render Connecting Lines -->
          <g id="s2LinesGroup"></g>

          <!-- Layer 2: Render Circle Nodes & Parentheses -->
          <g id="s2NodesGroup">
            ${diagram.syllables.map(s => {
              const cx = s.x;
              const cy = s.y;

              let fillColor = "#dc2626";
              let badgeText = "";

              if (s.lahokhu === "ek" || s.lahokhu === "ek_target") {
                badgeText = "เอก";
              } else if (s.lahokhu === "tho" || s.lahokhu === "tho_target") {
                badgeText = "โท";
              } else if (s.lahokhu === "kru" || s.lahokhu === "kru_target") {
                badgeText = "ั";
              } else if (s.lahokhu === "lahu" || s.lahokhu === "lahu_target") {
                badgeText = "ุ";
              }

              let parensMarkup = "";
              if (s.inParens === "left") {
                parensMarkup = `<text x="${cx - 15}" y="${cy + 4}" fill="#334155" font-size="16" font-weight="900" pointer-events="none">(</text>`;
              } else if (s.inParens === "right") {
                parensMarkup = `<text x="${cx + 13}" y="${cy + 4}" fill="#334155" font-size="16" font-weight="900" pointer-events="none">)</text>`;
              }

              return `
                <g 
                  class="${isReadOnly ? 'cursor-default' : 'cursor-pointer'}" 
                  ${isReadOnly ? '' : `onclick="handleStage2NodeClick('${s.id}', ${cx}, ${cy})"`}>
                  <!-- Touch Hit area -->
                  <circle cx="${cx}" cy="${cy}" r="18" fill="transparent" />

                  <!-- วงเล็บสร้อยคำ -->
                  ${parensMarkup}

                  <!-- วงกลมหลัก (ขนาด r=7.5) -->
                  <circle 
                    id="node_circle_${s.id}" 
                    cx="${cx}" 
                    cy="${cy}" 
                    r="7.5" 
                    fill="${fillColor}" 
                    stroke="#ffffff" 
                    stroke-width="1.5" />
                  
                  ${badgeText ? `
                    <text x="${cx}" y="${cy - 12}" text-anchor="middle" fill="#475569" font-size="10.5" font-weight="bold" pointer-events="none">${badgeText}</text>
                  ` : ''}
                </g>
              `;
            }).join('')}
          </g>
        </svg>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap justify-between items-center gap-3">
        ${isReadOnly ? `
          <div class="flex gap-2">
            ${stage2CurrentIndex > 0 ? `
              <button onclick="stage2CurrentIndex--; renderStage2Task(true);" class="px-4 py-2 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700">
                <i class="fas fa-chevron-left"></i> ข้อก่อนหน้า
              </button>
            ` : ''}
            ${stage2CurrentIndex < totalTasks - 1 ? `
              <button onclick="stage2CurrentIndex++; renderStage2Task(true);" class="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white">
                ข้อถัดไป <i class="fas fa-chevron-right"></i>
              </button>
            ` : ''}
          </div>
          <button 
            onclick="renderStageSelectionHub()" 
            class="bg-amber-500 hover:bg-amber-600 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-md transition-all">
            กลับสู่แผนที่ด่าน <i class="fas fa-map-marked-alt ml-1"></i>
          </button>
        ` : `
          <div class="flex gap-2">
            <button 
              onclick="clearStage2Lines()" 
              class="px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold bg-red-100 hover:bg-red-200 text-red-700 transition-all flex items-center gap-1 cursor-pointer shadow-sm">
              <i class="fas fa-trash-alt"></i> ล้างเส้นทั้งหมด
            </button>
            <button 
              onclick="openKnowledgePopup()" 
              class="px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 transition-all flex items-center gap-1 cursor-pointer shadow-sm">
              <i class="fas fa-lightbulb text-amber-500"></i> เปิดคลังความรู้ (-100 คะแนน)
            </button>
          </div>

          <button 
            onclick="submitStage2Answer()" 
            class="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 active:scale-95 cursor-pointer">
            ตรวจคำตอบ <i class="fas fa-check"></i>
          </button>
        `}
      </div>
    </div>
  `;

  redrawStage2Lines();
}

function handleStage2NodeClick(nodeId, cx, cy) {
  if (!stage2SelectedNode) {
    stage2SelectedNode = { id: nodeId, cx, cy };
    highlightNode(nodeId, true);
    showToast("📍 เลือกจุดเริ่มต้นแล้ว แตะจุดปลายทางเพื่อโยงเส้นสัมผัส", "info");
  } else {
    if (stage2SelectedNode.id === nodeId) {
      highlightNode(nodeId, false);
      stage2SelectedNode = null;
      return;
    }

    const fromId = stage2SelectedNode.id;
    const toId = nodeId;

    const existingIdx = stage2Connections.findIndex(
      c => (c.fromId === fromId && c.toId === toId) || (c.fromId === toId && c.toId === fromId)
    );

    if (existingIdx >= 0) {
      stage2Connections.splice(existingIdx, 1);
    } else {
      const diagram = STAGE2_DIAGRAMS[stage2CurrentIndex];
      const reqMatch = diagram.correctConnections.find(r => (r.from === fromId && r.to === toId) || (r.from === toId && r.to === fromId));

      stage2Connections.push({
        fromId,
        toId,
        fromCx: stage2SelectedNode.cx,
        fromCy: stage2SelectedNode.cy,
        toCx: cx,
        toCy: cy,
        isInterStanza: reqMatch ? reqMatch.isInterStanza || false : false
      });
    }

    highlightNode(stage2SelectedNode.id, false);
    stage2SelectedNode = null;
    redrawStage2Lines();
  }
}

function highlightNode(nodeId, isSelected) {
  const el = document.getElementById(`node_circle_${nodeId}`);
  if (el) {
    if (isSelected) {
      el.setAttribute("stroke", "#f59e0b");
      el.setAttribute("stroke-width", "3.5");
      el.setAttribute("fill", "#f59e0b");
    } else {
      el.setAttribute("stroke", "#ffffff");
      el.setAttribute("stroke-width", "1.5");
      el.setAttribute("fill", "#dc2626");
    }
  }
}

function redrawStage2Lines() {
  const linesGroup = document.getElementById("s2LinesGroup");
  if (!linesGroup) return;

  const currentDiagram = STAGE2_DIAGRAMS[stage2CurrentIndex] || STAGE2_DIAGRAMS[0];
  const isKhlong = currentDiagram.id === "khlong_4";

  linesGroup.innerHTML = stage2Connections.map(c => {
    const x1 = c.fromCx;
    const y1 = c.fromCy;
    const x2 = c.toCx;
    const y2 = c.toCy;

    let pathData = "";

    // 1. สัมผัสระหว่างบท ➔ อ้อมวนออกขวา
    if (c.isInterStanza) {
      const rightX = Math.max(x1, x2) + 20;
      pathData = `M ${x1} ${y1} H ${rightX} V ${y2} H ${x2}`;
    }
    // 2. ป้องกันเส้นทับซ้อนสำหรับ โคลงสี่สุภาพ
    else if (isKhlong) {
      // บาท 1 คำ 7 (318, 35) -> บาท 2 คำ 5 (132, 85)
      if ((c.fromId === "k1_7" && c.toId === "k2_5") || (c.toId === "k1_7" && c.fromId === "k2_5")) {
        pathData = `M ${x1} ${y1} V 58 H ${x2} V ${y2}`;
      }
      // บาท 1 คำ 7 (318, 35) -> บาท 3 คำ 5 (160, 135)
      else if ((c.fromId === "k1_7" && c.toId === "k3_5") || (c.toId === "k1_7" && c.fromId === "k3_5")) {
        pathData = `M ${x1} ${y1} H 338 V 135 H ${x2}`;
      }
      // บาท 2 คำ 7 (318, 85) -> บาท 4 คำ 5 (132, 185)
      else if ((c.fromId === "k2_7" && c.toId === "k4_5") || (c.toId === "k2_7" && c.fromId === "k4_5")) {
        pathData = `M ${x1} ${y1} V 110 H ${x2} V ${y2}`;
      }
      else if (Math.abs(y1 - y2) < 10) {
        pathData = `M ${x1} ${y1} V ${y1 - 15} H ${x2} V ${y2}`;
      } else {
        const midY = (y1 + y2) / 2;
        pathData = `M ${x1} ${y1} V ${midY} H ${x2} V ${y2}`;
      }
    }
    // 3. สัมผัสบรรทัดเดียวกัน (Intra-row) ➔ โค้งขึ้นด้านบน
    else if (Math.abs(y1 - y2) < 10) {
      const midY = y1 - 15;
      pathData = `M ${x1} ${y1} V ${midY} H ${x2} V ${y2}`;
    } 
    // 4. สัมผัสข้ามบรรทัดปกติ ➔ วิ่งตรงฉากผ่านช่องว่างกลางระหว่างบรรทัด (y1+y2)/2 !
    else {
      const midY = (y1 + y2) / 2;
      pathData = `M ${x1} ${y1} V ${midY} H ${x2} V ${y2}`;
    }

    return `
      <path 
        d="${pathData}" 
        fill="none" 
        stroke="#dc2626" 
        stroke-width="2.5" 
        stroke-linecap="round" 
        stroke-linejoin="round" />
    `;
  }).join('');
}

function clearStage2Lines() {
  stage2Connections = [];
  if (stage2SelectedNode) {
    highlightNode(stage2SelectedNode.id, false);
    stage2SelectedNode = null;
  }
  redrawStage2Lines();
  showToast("🗑️ ล้างเส้นทั้งหมดเรียบร้อยแล้ว", "info");
}

// ตรวจสอบความถูกต้องอย่างแม่นยำ (ยอมรับการเชื่อมคำที่ 3 และคำที่ 5 100%)
function evaluateStage2Connections(diagramId, connections) {
  function hasLine(fromList, toList) {
    const froms = Array.isArray(fromList) ? fromList : [fromList];
    const tos = Array.isArray(toList) ? toList : [toList];
    return connections.some(c => {
      const match1 = froms.includes(c.fromId) && tos.includes(c.toId);
      const match2 = tos.includes(c.fromId) && froms.includes(c.toId);
      return match1 || match2;
    });
  }

  let missingCount = 0;

  if (diagramId === "klon_8") {
    if (!hasLine(["g1_8"], ["g2_3", "g2_5"])) missingCount++;
    if (!hasLine(["g2_8"], ["g3_8", "g3_1"])) missingCount++;
    if (!hasLine(["g3_8", "g3_1"], ["g4_3", "g4_5"])) missingCount++;
    if (!hasLine(["g4_8"], ["g6_8", "g5_8", "g6_3", "g6_5", "g7_8", "g7_1"])) missingCount++;
    if (!hasLine(["g5_8", "g4_8"], ["g6_3", "g6_5"])) missingCount++;
    if (!hasLine(["g6_8"], ["g7_8", "g7_1"])) missingCount++;
    if (!hasLine(["g7_8", "g7_1"], ["g8_3", "g8_5"])) missingCount++;

    return { isCorrect: missingCount === 0 };
  }

  if (diagramId === "kap_11") {
    if (!hasLine(["w1_5"], ["w2_1", "w2_2", "w2_3"])) missingCount++;
    if (!hasLine(["w2_6"], ["w3_5"])) missingCount++;
    if (!hasLine(["w4_6"], ["w6_6", "w5_5"])) missingCount++;
    if (!hasLine(["w5_5"], ["w6_1", "w6_2", "w6_3"])) missingCount++;
    if (!hasLine(["w6_6"], ["w7_5"])) missingCount++;
    return { isCorrect: missingCount === 0 };
  }

  if (diagramId === "khlong_4") {
    if (!hasLine(["k1_7"], ["k2_5"])) missingCount++;
    if (!hasLine(["k1_7"], ["k3_5"])) missingCount++;
    if (!hasLine(["k2_7"], ["k4_5"])) missingCount++;
    return { isCorrect: missingCount === 0 };
  }

  if (diagramId === "inthanawichian_11") {
    if (!hasLine(["i1_5"], ["i1_8"])) missingCount++;
    if (!hasLine(["i1_11"], ["i2_5"])) missingCount++;
    if (!hasLine(["i2_11"], ["i3_11"])) missingCount++;
    if (!hasLine(["i3_5"], ["i3_8"])) missingCount++;
    if (!hasLine(["i3_11"], ["i4_5"])) missingList.push("คำท้ายวรรค 6 ➔ คำท้ายวรรค 7");
    return { isCorrect: missingCount === 0 };
  }

  return { isCorrect: true };
}

function submitStage2Answer() {
  const diagram = STAGE2_DIAGRAMS[stage2CurrentIndex];

  if (stage2Connections.length === 0) {
    showToast("⚠️ กรุณาลากเส้นสัมผัสอย่างน้อย 1 เส้นก่อนกดตรวจคำตอบครับ", "warning");
    return;
  }

  const result = evaluateStage2Connections(diagram.id, stage2Connections);

  if (result.isCorrect) {
    stage2Score += 400;
    addScore(400);

    showCenteredResultPopup("✨ ถูกต้องสมบูรณ์!", "คุณลากเส้นสัมผัสบังคับได้ถูกต้องตามผังฉาก! ได้รับ +400 คะแนน", "success", () => {
      stage2CurrentIndex++;
      if (!gameState.student.stageScores) gameState.student.stageScores = {};
      gameState.student.stageScores.stage2 = stage2Score;
      saveStudentData(gameState.student);
      renderStage2Task();
    });
  } else {
    stage2TaskWrongAttempts++;
    decrementHeart();

    // กฎตอบผิดเกิน 2 ครั้งในข้อเดิม -> ให้ผ่านไปข้อถัดไปอัตโนมัติ!
    if (stage2TaskWrongAttempts >= 2) {
      showCenteredResultPopup(
        "⚠️ พยายามได้ดีมากครับ!", 
        "คุณพยายามโยงเส้นในข้อนี้อย่างเต็มที่แล้ว! ระบบนำคุณเข้าสู่ภารกิจข้อถัดไปเรียบร้อยครับ", 
        "warning",
        () => {
          stage2CurrentIndex++;
          if (!gameState.student.stageScores) gameState.student.stageScores = {};
          gameState.student.stageScores.stage2 = stage2Score;
          saveStudentData(gameState.student);
          renderStage2Task();
        }
      );
    } else {
      // แจ้งเตือนกระชับ ไม่ขึ้นเฉลยสปอยล์คำตอบ
      showCenteredResultPopup(
        "❌ เส้นสัมผัสยังไม่ถูกต้อง!", 
        "เส้นสัมผัสยังไม่ถูกต้องตามฉันทลักษณ์ หัก 1 หัวใจ ลองตรวจสอบผังและโยงใหม่อีกครั้งครับ!", 
        "error"
      );
    }
  }
}

function finishStage2() {
  stopStageTimer();
  
  if (!gameState.student.tablets) gameState.student.tablets = [false, false, false, false];
  gameState.student.tablets[1] = true;
  gameState.student.currentStage = Math.max(gameState.student.currentStage || 1, 3);
  saveStudentData(gameState.student);

  updateTabletBadgesUI();

  showStageCompleteModal(
    "2",
    "ศิลาแห่งฉันทลักษณ์ (ชิ้นที่ 2)",
    stage2Score,
    "ยอดเยี่ยมมาก! คุณลากเส้นโยงสัมผัสถูกต้องทุกข้อ ได้รับชิ้นส่วนศิลาชิ้นที่ 2 พร้อมปลดล็อกสู่ด่านที่ 3 เรียงร้อยบทร้อยกรอง!"
  );
}
