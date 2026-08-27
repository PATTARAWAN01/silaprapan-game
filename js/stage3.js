/**
 * stage3.js - ระบบการเล่นด่านที่ 3 (จัดเรียงประโยคคำประพันธ์ Drag & Drop 4 ข้อ - ข้อละ 600 คะแนน)
 */

let stage3CurrentIndex = 0;
let stage3Score = 0;
let stage3CurrentSlots = [];

function initStage3() {
  stage3CurrentIndex = 0;
  stage3Score = gameState.student.stageScores?.stage3 || 0;

  startStageTimer(480, () => {
    deductScore(200);
    showCenteredResultPopup("⏰ หมดเวลาทำภารกิจ!", "หมดเวลาทำภารกิจด่านที่ 3 แล้วครับ! หัก 200 คะแนน และให้คุณเริ่มทำภารกิจต่อ", "warning", () => {
      initStage3();
    });
  });

  renderStage3Task();
}

function renderStage3Task() {
  const container = document.getElementById("stage3Container");
  if (!container) return;

  const totalTasks = STAGE3_REORDER_TASKS.length;
  if (stage3CurrentIndex >= totalTasks) {
    finishStage3();
    return;
  }

  const task = STAGE3_REORDER_TASKS[stage3CurrentIndex];
  const numSlots = task.correctOrder.length;
  const unitLabel = task.unitName || "วรรค";
  stage3CurrentSlots = new Array(numSlots).fill(null);

  const slotPairs = [];
  for (let i = 0; i < numSlots; i += 2) {
    slotPairs.push({
      leftIdx: i,
      rightIdx: i + 1 < numSlots ? i + 1 : null
    });
  }

  container.innerHTML = `
    <div class="bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-indigo-300 max-w-5xl mx-auto transition-all">
      <!-- Progress Bar & Header -->
      <div class="flex justify-between items-center mb-4">
        <div>
          <span class="bg-indigo-100 text-indigo-900 font-extrabold px-4 py-1.5 rounded-full text-xs md:text-sm">
            ข้อที่ ${stage3CurrentIndex + 1} / ${totalTasks} (${task.type})
          </span>
          <h3 class="text-xl font-extrabold text-indigo-950 mt-1">${task.title}</h3>
        </div>
        <span class="text-indigo-800 font-bold text-sm">
          <i class="fas fa-coins text-amber-500 mr-1"></i>คะแนนด่านนี้: <span id="s3ScoreText">${stage3Score}</span>
        </span>
      </div>

      <p class="text-gray-600 text-xs md:text-sm mb-6">
        <i class="fas fa-hand-pointer text-indigo-600 mr-1"></i>แตะหรือลากกล่องประโยคคำประพันธ์ด้านบน มาวางลงในช่องว่างซ้าย-ขวาให้ถูกต้องตามลำดับ
      </p>

      <!-- Source Pool -->
      <div class="mb-8 p-4 bg-indigo-50/70 rounded-2xl border-2 border-dashed border-indigo-300">
        <h4 class="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-3">คลังประโยคคำประพันธ์ (เลือกแตะ/ลาก):</h4>
        <div id="s3SourcePool" class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          ${task.shuffledLines.map(line => `
            <div 
              id="lineCard_${line.id}" 
              onclick="handleStage3LineClick('${line.id}')"
              draggable="true" 
              ondragstart="handleStage3DragStart(event, '${line.id}')"
              class="p-3 bg-white hover:bg-indigo-100 rounded-xl border-2 border-indigo-200 shadow-md cursor-pointer transition-all hover:scale-[1.01] active:scale-95 text-indigo-950 font-bold flex items-center gap-3 text-sm">
              <span class="w-6 h-6 rounded-full bg-indigo-200 text-indigo-800 text-xs flex items-center justify-center shrink-0">
                <i class="fas fa-grip-lines"></i>
              </span>
              <span class="flex-1">${line.text}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Target Drop Slots -->
      <div class="space-y-3 mb-6">
        <h4 class="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">ตำแหน่งเรียงบทร้อยกรอง (จัดเป็นคู่วรรคในบรรทัดเดียวกัน):</h4>
        
        ${slotPairs.map((pair, rowIdx) => `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <!-- Left Slot -->
            ${renderSingleSlotHTML(pair.leftIdx, unitLabel)}

            <!-- Right Slot -->
            ${pair.rightIdx !== null ? renderSingleSlotHTML(pair.rightIdx, unitLabel) : ''}
          </div>
        `).join('')}
      </div>

      <!-- Footer Buttons -->
      <div class="flex justify-between items-center pt-2">
        <button 
          onclick="openKnowledgePopup()" 
          class="text-indigo-700 hover:text-indigo-900 font-bold text-xs md:text-sm bg-indigo-50 border border-indigo-300 hover:bg-indigo-100 px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer">
          <i class="fas fa-lightbulb text-amber-500"></i> เปิดคลังความรู้ (-100 คะแนน)
        </button>

        <button 
          onclick="submitStage3Answer()" 
          class="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-extrabold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 active:scale-95 cursor-pointer">
          ส่งตรวจจัดเรียง <i class="fas fa-check"></i>
        </button>
      </div>
    </div>
  `;
}

function renderSingleSlotHTML(idx, unitLabel) {
  return `
    <div 
      id="slot_${idx}"
      ondragover="handleStage3DragOver(event)"
      ondrop="handleStage3Drop(event, ${idx})"
      onclick="handleStage3SlotClick(${idx})"
      class="min-h-[56px] p-2.5 bg-amber-50/50 rounded-xl border-2 border-dashed border-amber-300 flex items-center justify-between gap-2 transition-all cursor-pointer">
      <span class="text-xs font-bold text-amber-900 bg-amber-200 px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 shadow-sm">
        ${unitLabel}ที่ ${idx + 1}
      </span>
      <div id="slotContent_${idx}" class="flex-1 text-center font-bold text-gray-400 italic text-xs md:text-sm">
        -- วางประโยคที่นี่ --
      </div>
      <button 
        id="slotClear_${idx}" 
        onclick="event.stopPropagation(); clearStage3Slot(${idx})" 
        class="hidden text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-all shrink-0">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
}

function handleStage3LineClick(lineId) {
  const emptySlotIdx = stage3CurrentSlots.findIndex(s => s === null);
  if (emptySlotIdx >= 0) {
    placeLineInSlot(lineId, emptySlotIdx);
  } else {
    showToast("⚠️ ช่องวางเต็มแล้ว หากต้องการเปลี่ยน กรุณากดปุ่ม X ที่ช่องวางเพื่อนำออกก่อนครับ", "warning");
  }
}

function handleStage3SlotClick(slotIdx) {
  if (stage3CurrentSlots[slotIdx]) {
    clearStage3Slot(slotIdx);
  }
}

function placeLineInSlot(lineId, slotIdx) {
  const prevSlot = stage3CurrentSlots.findIndex(s => s === lineId);
  if (prevSlot >= 0) {
    stage3CurrentSlots[prevSlot] = null;
    updateSlotUI(prevSlot);
  }

  stage3CurrentSlots[slotIdx] = lineId;
  updateSlotUI(slotIdx);

  const card = document.getElementById(`lineCard_${lineId}`);
  if (card) card.classList.add("opacity-30", "pointer-events-none");
}

function clearStage3Slot(slotIdx) {
  const lineId = stage3CurrentSlots[slotIdx];
  if (lineId) {
    stage3CurrentSlots[slotIdx] = null;
    updateSlotUI(slotIdx);

    const card = document.getElementById(`lineCard_${lineId}`);
    if (card) card.classList.remove("opacity-30", "pointer-events-none");
  }
}

function updateSlotUI(slotIdx) {
  const container = document.getElementById(`slotContent_${slotIdx}`);
  const clearBtn = document.getElementById(`slotClear_${slotIdx}`);
  const slotEl = document.getElementById(`slot_${slotIdx}`);

  const lineId = stage3CurrentSlots[slotIdx];
  const task = STAGE3_REORDER_TASKS[stage3CurrentIndex];

  if (lineId) {
    const lineObj = task.shuffledLines.find(l => l.id === lineId);
    if (container && lineObj) {
      container.className = "flex-1 font-extrabold text-indigo-950 text-xs md:text-sm bg-white p-2 rounded-lg border border-indigo-200 shadow-sm text-left px-3";
      container.textContent = lineObj.text;
    }
    if (clearBtn) clearBtn.classList.remove("hidden");
    if (slotEl) slotEl.className = "min-h-[56px] p-2.5 bg-indigo-100/80 rounded-xl border-2 border-indigo-400 flex items-center justify-between gap-2 transition-all cursor-pointer";
  } else {
    if (container) {
      container.className = "flex-1 text-center font-bold text-gray-400 italic text-xs md:text-sm";
      container.textContent = "-- วางประโยคที่นี่ --";
    }
    if (clearBtn) clearBtn.classList.add("hidden");
    if (slotEl) slotEl.className = "min-h-[56px] p-2.5 bg-amber-50/50 rounded-xl border-2 border-dashed border-amber-300 flex items-center justify-between gap-2 transition-all cursor-pointer";
  }
}

function handleStage3DragStart(e, lineId) {
  e.dataTransfer.setData("text/plain", lineId);
}

function handleStage3DragOver(e) {
  e.preventDefault();
}

function handleStage3Drop(e, slotIdx) {
  e.preventDefault();
  const lineId = e.dataTransfer.getData("text/plain");
  if (lineId) {
    placeLineInSlot(lineId, slotIdx);
  }
}

function submitStage3Answer() {
  const task = STAGE3_REORDER_TASKS[stage3CurrentIndex];

  if (stage3CurrentSlots.some(s => s === null)) {
    showToast("⚠️ กรุณาจัดเรียงประโยคคำประพันธ์ให้ครบทุกช่องก่อนกดส่งตรวจครับ", "warning");
    return;
  }

  let isCorrect = true;
  for (let i = 0; i < task.correctOrder.length; i++) {
    if (stage3CurrentSlots[i] !== task.correctOrder[i]) {
      isCorrect = false;
      break;
    }
  }

  if (isCorrect) {
    stage3Score += 600;
    addScore(600);

    showCenteredResultPopup("✨ ถูกต้องสมบูรณ์!", "จัดเรียงบทร้อยกรองถูกต้องทุกตำแหน่ง! ได้รับ +600 คะแนน", "success", () => {
      stage3CurrentIndex++;
      if (!gameState.student.stageScores) gameState.student.stageScores = {};
      gameState.student.stageScores.stage3 = stage3Score;
      saveStudentData(gameState.student);
      renderStage3Task();
    });
  } else {
    decrementHeart();
    showCenteredResultPopup("❌ ลำดับคำประพันธ์ยังไม่ถูกต้อง!", "ลำดับการเรียงคำประพันธ์ยังไม่ถูกต้องตามฉันทลักษณ์ หัก 1 หัวใจ ลองสลับตำแหน่งแล้วส่งใหม่!", "error");
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
    "ศิลาแห่งวรรณศิลป์ (ชิ้นที่ 3)",
    stage3Score,
    "สุดยอดฝีมือ! คุณเรียงร้อยบทร้อยกรองถูกต้องทุกบท ได้รับชิ้นส่วนศิลาชิ้นที่ 3 พร้อมก้าวสู่ด่านสุดท้าย จารึกคำประพันธ์ลงผลึก!"
  );
}
