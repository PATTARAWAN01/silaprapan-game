/**
 * stage1.js - ระบบการเล่นด่านที่ 1 (ตอบคำถาม 4 ตัวเลือก 15 ข้อ - ข้อละ 200 คะแนน)
 */

let stage1CurrentIndex = 0;
let stage1SelectedOption = null;
let stage1Score = 0;
let stage1ShuffledOptions = [];

function initStage1() {
  stage1CurrentIndex = 0;
  stage1SelectedOption = null;
  
  const student = gameState.student;
  stage1Score = student.stageScores?.stage1 || 0;

  // เริ่มจับเวลาด่าน 1 (7 นาที = 420 วินาที)
  startStageTimer(420, () => {
    deductScore(200);
    showCenteredResultPopup("⏰ หมดเวลาทำภารกิจ!", "หมดเวลาทำภารกิจด่านที่ 1 แล้วครับ! หัก 200 คะแนน และให้คุณเริ่มทำภารกิจต่อ", "warning", () => {
      initStage1();
    });
  });

  renderStage1Question();
}

function renderStage1Question() {
  const container = document.getElementById("stage1Container");
  if (!container) return;

  const totalQuestions = STAGE1_QUESTIONS.length;
  if (stage1CurrentIndex >= totalQuestions) {
    finishStage1();
    return;
  }

  const q = STAGE1_QUESTIONS[stage1CurrentIndex];
  stage1SelectedOption = null;

  stage1ShuffledOptions = q.options.map((opt, idx) => ({ text: opt, originalIndex: idx }));
  shuffleArray(stage1ShuffledOptions);

  container.innerHTML = `
    <div class="bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-amber-300 max-w-3xl mx-auto transition-all">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <span class="bg-amber-100 text-amber-900 font-extrabold px-4 py-1.5 rounded-full text-xs md:text-sm">
          ข้อที่ ${stage1CurrentIndex + 1} / ${totalQuestions}
        </span>
        <span class="text-amber-800 font-bold text-sm">
          <i class="fas fa-coins text-amber-500 mr-1"></i>คะแนนด่านนี้: <span id="s1ScoreText">${stage1Score}</span>
        </span>
      </div>

      <div class="w-full bg-amber-100 h-3 rounded-full mb-6 overflow-hidden">
        <div class="bg-gradient-to-r from-amber-500 to-amber-600 h-full transition-all duration-300" style="width: ${((stage1CurrentIndex + 1) / totalQuestions) * 100}%"></div>
      </div>

      <!-- Question Text -->
      <h3 class="text-xl font-extrabold text-amber-950 mb-6 leading-snug">
        ${q.question}
      </h3>

      <!-- Shuffled Options List -->
      <div class="space-y-3 mb-6">
        ${stage1ShuffledOptions.map((optObj, idx) => `
          <button 
            onclick="selectStage1Option(${idx})" 
            id="s1Opt_${idx}"
            class="w-full text-left p-4 rounded-xl border-2 border-amber-200 hover:border-amber-500 hover:bg-amber-50 font-medium text-gray-800 transition-all flex items-center gap-3 group focus:outline-none cursor-pointer">
            <span class="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 font-bold flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
              ${['ก', 'ข', 'ค', 'ง'][idx]}
            </span>
            <span class="flex-1">${optObj.text}</span>
          </button>
        `).join('')}
      </div>

      <!-- Submit & Knowledge Buttons -->
      <div class="flex justify-between items-center pt-2">
        <button 
          onclick="openKnowledgePopup()" 
          class="text-amber-700 hover:text-amber-900 font-bold text-xs md:text-sm bg-amber-50 border border-amber-300 hover:bg-amber-100 px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer">
          <i class="fas fa-lightbulb text-amber-500"></i> เปิดคลังความรู้ (-100 คะแนน)
        </button>

        <button 
          id="s1NextBtn"
          onclick="submitStage1Answer()" 
          disabled
          class="bg-gray-300 text-gray-500 cursor-not-allowed font-extrabold px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2">
          ยืนยันคำตอบ <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  `;
}

function selectStage1Option(shuffledIdx) {
  stage1SelectedOption = shuffledIdx;
  stage1ShuffledOptions.forEach((_, idx) => {
    const btn = document.getElementById(`s1Opt_${idx}`);
    if (btn) {
      if (idx === shuffledIdx) {
        btn.className = "w-full text-left p-4 rounded-xl border-2 border-amber-600 bg-amber-100 font-bold text-amber-950 transition-all flex items-center gap-3 ring-2 ring-amber-400";
      } else {
        btn.className = "w-full text-left p-4 rounded-xl border-2 border-amber-200 hover:border-amber-500 hover:bg-amber-50 font-medium text-gray-800 transition-all flex items-center gap-3";
      }
    }
  });

  const nextBtn = document.getElementById("s1NextBtn");
  if (nextBtn) {
    nextBtn.disabled = false;
    nextBtn.className = "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-2 active:scale-95";
  }
}

function submitStage1Answer() {
  if (stage1SelectedOption === null) return;

  const selectedOptObj = stage1ShuffledOptions[stage1SelectedOption];
  const q = STAGE1_QUESTIONS[stage1CurrentIndex];
  const isCorrect = selectedOptObj.originalIndex === q.answer;

  if (isCorrect) {
    stage1Score += 200;
    addScore(200);

    showCenteredResultPopup("✨ ถูกต้องแล้ว!", "ยินดีด้วย คุณตอบถูกต้อง ได้รับ +200 คะแนน!", "success", () => {
      stage1CurrentIndex++;
      saveStage1Score();
      renderStage1Question();
    });

  } else {
    decrementHeart();
    
    showCenteredResultPopup(
      "❌ ตอบยังไม่ถูกต้อง!", 
      "หัก 1 หัวใจ! กรุณาอ่านโจทย์และลองใหม่อีกครั้ง (ระบบจะสลับลำดับตัวเลือกใหม่)", 
      "error", 
      () => {
        if (gameState.student.hearts > 0) {
          renderStage1Question();
        }
      }
    );
  }
}

function saveStage1Score() {
  if (!gameState.student.stageScores) gameState.student.stageScores = {};
  gameState.student.stageScores.stage1 = stage1Score;
  saveStudentData(gameState.student);
}

function finishStage1() {
  stopStageTimer();
  
  if (!gameState.student.tablets) gameState.student.tablets = [false, false, false, false];
  gameState.student.tablets[0] = true;
  gameState.student.currentStage = Math.max(gameState.student.currentStage || 1, 2);
  saveStudentData(gameState.student);

  updateTabletBadgesUI();

  showStageCompleteModal(
    "1",
    "ศิลาแห่งอักขระ (ชิ้นที่ 1)",
    stage1Score,
    "ยินดีด้วย! คุณผ่านด่านที่ 1 ได้รับชิ้นส่วนศิลาชิ้นแรกสำเร็จแล้ว เตรียมพร้อมเข้าสู่ด่านที่ 2 ลากเส้นผูกพันฉันทลักษณ์!"
  );
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
