/**
 * stage3.js - ระบบการเล่นด่านที่ 3 (เรียงร้อยบทร้อยกรอง - รองรับทั้งการลากวาง Drag & Drop และการกดแตะสลับบรรทัดบนมือถือ Tap-to-Swap)
 */

let stage3CurrentIndex = 0;
let stage3Score = 0;
let stage3UserOrder = [];
let stage3SelectedIdx = null; // สำหรับโหมดกดแตะเลือกย้ายบนมือถือ

function initStage3() {
  stage3CurrentIndex = 0;
  stage3Score = gameState.student.stageScores?.stage3 || 0;
  stage3UserOrder = [];
  stage3SelectedIdx = null;

  startStageTimer(480, () => {
    deductScore(200);
    showCenteredResultPopup("⏰ หมดเวลาทำภารกิจ!", "หมดเวลาทำภารกิจด่านที่ 3 แล้วครับ! หัก 200 คะแนน และให้คุณเริ่มทำภารกิจต่อ", "warning", () => {
      initStage3();
    });
  });

  renderStage3Task();
}

function renderStage3Task(isReadOnly = false) {
  const container = document.getElementById("stage3Container");
  if (!container) return;

  const totalTasks = STAGE3_REORDER_TASKS.length;
  if (stage3CurrentIndex >= totalTasks && !isReadOnly) {
    finishStage3();
    return;
  }

  const task = STAGE3_REORDER_TASKS[stage3CurrentIndex] || STAGE3_REORDER_TASKS[0];

  if (isReadOnly) {
    stage3UserOrder = task.correctOrder.map(id => task.shuffledLines.find(l => l.id === id)).filter(Boolean);
  } else {
    if (stage3UserOrder.length === 0 || stage3UserOrder.length !== task.shuffledLines.length) {
      stage3UserOrder = [...task.shuffledLines];
    }
  }

  stage3SelectedIdx = null;

  container.innerHTML = `
    <div class="bg-white/95 backdrop-blur-md rounded-3xl p-5 md:p-8 shadow-2xl border-2 border-rose-400 max-w-4xl mx-auto transition-all">
      <!-- Progress & Header -->
      <div class="flex justify-between items-center mb-3">
        <div>
          <span class="bg-rose-100 text-rose-900 font-extrabold px-4 py-1.5 rounded-full text-xs md:text-sm shadow-sm">
            ข้อที่ ${stage3CurrentIndex + 1} / ${totalTasks} (${task.type})
          </span>
          <h3 class="text-lg md:text-xl font-extrabold text-rose-950 mt-1">${task.title}</h3>
        </div>
        <span class="text-rose-900 font-bold text-xs md:text-sm bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
          <i class="fas fa-coins text-amber-500 mr-1"></i>คะแนนด่านนี้: <span id="s3ScoreText">${stage3Score}</span>
        </span>
      </div>

      <p class="text-gray-600 text-xs md:text-sm mb-4">
        ${isReadOnly ? '👁️ <strong>โหมดดูเฉลยทบทวนผลคะแนน</strong> (แสดงการเรียงลำดับบทประพันธ์ที่ถูกต้อง)' : '<i class="fas fa-hand-pointer text-rose-600 mr-1"></i>' + 'ลากสลับตำแหน่ง หรือ <strong>กดแตะบรรทัดแรกแล้วกดแตะอีกบรรทัดเพื่อสลับตำแหน่ง (สำหรับมือถือ)</strong>'}
      </p>

      <!-- Reorder List Container -->
      <div id="stage3SortableList" class="space-y-2.5 mb-6">
        ${stage3UserOrder.map((item, idx) => `
          <div 
            id="s3_item_${idx}"
            draggable="${!isReadOnly}"
            ondragstart="handleStage3DragStart(event, ${idx})"
            ondragover="handleStage3DragOver(event)"
            ondrop="handleStage3Drop(event, ${idx})"
            onclick="${isReadOnly ? '' : `handleStage3ItemClick(${idx})`}"
            class="p-3.5 md:p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 select-none ${isReadOnly ? 'bg-amber-50/60 border-amber-300 text-gray-800' : 'bg-white hover:bg-rose-50/50 border-rose-200 cursor-pointer shadow-sm active:scale-[0.99]'}">
            
            <div class="flex items-center gap-3 flex-1">
              <span class="w-7 h-7 rounded-full bg-rose-100 text-rose-900 font-extrabold text-xs flex items-center justify-center shadow-inner shrink-0">
                ${idx + 1}
              </span>
              <span class="text-sm md:text-base font-bold text-gray-800 leading-relaxed">${item.text}</span>
            </div>

            ${!isReadOnly ? `
              <div class="flex items-center gap-1 text-gray-400">
                <button type="button" onclick="event.stopPropagation(); moveStage3Item(${idx}, -1)" class="p-1.5 rounded-lg hover:bg-rose-100 text-rose-600 transition-all ${idx === 0 ? 'opacity-30 pointer-events-none' : ''}">
                  <i class="fas fa-chevron-up"></i>
                </button>
                <button type="button" onclick="event.stopPropagation(); moveStage3Item(${idx}, 1)" class="p-1.5 rounded-lg hover:bg-rose-100 text-rose-600 transition-all ${idx === stage3UserOrder.length - 1 ? 'opacity-30 pointer-events-none' : ''}">
                  <i class="fas fa-chevron-down"></i>
                </button>
                <i class="fas fa-grip-vertical text-rose-300 ml-1"></i>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap justify-between items-center gap-3">
        ${isReadOnly ? `
          <div class="flex gap-2">
            ${stage3CurrentIndex > 0 ? `
              <button onclick="stage3CurrentIndex--; renderStage3Task(true);" class="px-4 py-2 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700">
                <i class="fas fa-chevron-left"></i> ข้อก่อนหน้า
              </button>
            ` : ''}
            ${stage3CurrentIndex < totalTasks - 1 ? `
              <button onclick="stage3CurrentIndex++; renderStage3Task(true);" class="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white">
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
              onclick="shuffleStage3Items()" 
              class="px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all flex items-center gap-1 cursor-pointer shadow-sm">
              <i class="fas fa-random"></i> สลับตำแหน่งใหม่
            </button>
            <button 
              onclick="openKnowledgePopup()" 
              class="px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 transition-all flex items-center gap-1 cursor-pointer shadow-sm">
              <i class="fas fa-lightbulb text-amber-500"></i> เปิดคลังความรู้ (-100 คะแนน)
            </button>
          </div>

          <button 
            onclick="submitStage3Answer()" 
            class="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-extrabold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 active:scale-95 cursor-pointer">
            ตรวจคำตอบ <i class="fas fa-check"></i>
          </button>
        `}
      </div>
    </div>
  `;
}

// โหมดกดแตะสลับบรรทัดสำหรับมือถือ (Tap-to-Swap Mobile UX)
function handleStage3ItemClick(targetIdx) {
  if (stage3SelectedIdx === null) {
    stage3SelectedIdx = targetIdx;
    highlightStage3Item(targetIdx, true);
    showToast("📍 เลือกบรรทัดแล้ว แตะอีกบรรทัดที่ต้องการสลับตำแหน่ง", "info");
  } else {
    if (stage3SelectedIdx !== targetIdx) {
      // สลับตำแหน่งระหว่างบรรทัด
      const temp = stage3UserOrder[stage3SelectedIdx];
      stage3UserOrder[stage3SelectedIdx] = stage3UserOrder[targetIdx];
      stage3UserOrder[targetIdx] = temp;
      showToast("🔄 สลับตำแหน่งบรรทัดเรียบร้อยแล้ว", "success");
    }
    stage3SelectedIdx = null;
    renderStage3Task();
  }
}

function highlightStage3Item(idx, isSelected) {
  const el = document.getElementById(`s3_item_${idx}`);
  if (el) {
    if (isSelected) {
      el.classList.add("border-amber-500", "bg-amber-50", "ring-2", "ring-amber-300");
    } else {
      el.classList.remove("border-amber-500", "bg-amber-50", "ring-2", "ring-amber-300");
    }
  }
}

function moveStage3Item(idx, direction) {
  const targetIdx = idx + direction;
  if (targetIdx < 0 || targetIdx >= stage3UserOrder.length) return;

  const temp = stage3UserOrder[idx];
  stage3UserOrder[idx] = stage3UserOrder[targetIdx];
  stage3UserOrder[targetIdx] = temp;

  renderStage3Task();
}

let stage3DraggedIdx = null;

function handleStage3DragStart(e, idx) {
  stage3DraggedIdx = idx;
  e.dataTransfer.effectAllowed = "move";
}

function handleStage3DragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

function handleStage3Drop(e, targetIdx) {
  e.preventDefault();
  if (stage3DraggedIdx === null || stage3DraggedIdx === targetIdx) return;

  const temp = stage3UserOrder[stage3DraggedIdx];
  stage3UserOrder[stage3DraggedIdx] = stage3UserOrder[targetIdx];
  stage3UserOrder[targetIdx] = temp;

  stage3DraggedIdx = null;
  renderStage3Task();
}

function shuffleStage3Items() {
  const task = STAGE3_REORDER_TASKS[stage3CurrentIndex];
  if (!task) return;
  
  stage3UserOrder = [...task.shuffledLines].sort(() => Math.random() - 0.5);
  renderStage3Task();
  showToast("🔀 สลับตำแหน่งข้อความเรียบร้อยแล้ว", "info");
}

function submitStage3Answer() {
  const task = STAGE3_REORDER_TASKS[stage3CurrentIndex];
  const userOrderIds = stage3UserOrder.map(l => l.id);

  let isCorrect = true;
  for (let i = 0; i < task.correctOrder.length; i++) {
    if (userOrderIds[i] !== task.correctOrder[i]) {
      isCorrect = false;
      break;
    }
  }

  if (isCorrect) {
    stage3Score += 400;
    addScore(400);

    showCenteredResultPopup("✨ ถูกต้องสมบูรณ์!", "คุณเรียงลำดับวรรคคำประพันธ์ได้ถูกต้องตามฉันทลักษณ์! ได้รับ +400 คะแนน", "success", () => {
      stage3CurrentIndex++;
      if (!gameState.student.stageScores) gameState.student.stageScores = {};
      gameState.student.stageScores.stage3 = stage3Score;
      saveStudentData(gameState.student);
      renderStage3Task();
    });
  } else {
    decrementHeart();
    showCenteredResultPopup("❌ การเรียงลำดับยังไม่ถูกต้อง!", "การเรียงลำดับบทประพันธ์ยังไม่ถูกต้องตามเนื้อหา หัก 1 หัวใจ ลองตรวจสอบและสลับตำแหน่งใหม่อีกครั้งครับ!", "error");
  }
}

function finishStage3() {
  stopStageTimer();

  if (!gameState.student.tablets) gameState.student.tablets = [false, false, false, false];
  gameState.student.tablets[2] = true;
  gameState.student.currentStage = Math.max(gameState.student.currentStage || 1, 4);
  saveStudentData(gameState.student);

  updateTabletBadgesUI();

  showStageCompleteModal(
    "3",
    "ศิลาแห่งฉันทลักษณ์ (ชิ้นที่ 3)",
    stage3Score,
    "ยอดเยี่ยมมาก! คุณเรียงร้อยบทประพันธ์ถูกต้องทุกข้อ ได้รับชิ้นส่วนศิลาชิ้นที่ 3 พร้อมปลดล็อกสู่ด่านที่ 4 สร้างสรรค์กวีนิพนธ์!"
  );
}
