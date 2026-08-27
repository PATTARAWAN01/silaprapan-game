/**
 * app.js - ตัวจัดการระบบหลัก (Light Mode Glassmorphism Theme, Read-Only Review for Passed Stages, Timers, Hearts, Rest 10s)
 */

const gameState = {
  currentScreen: "register",
  student: null,
  stageTimer: null,
  stageTimerRemaining: 0,
  restTimer: null,
  restTimerRemaining: 0
};

document.addEventListener("DOMContentLoaded", () => {
  const savedStudent = getCurrentStudentLocal();
  if (savedStudent && savedStudent.studentId) {
    gameState.student = savedStudent;
    switchScreen("knowledge");
  } else {
    switchScreen("register");
  }

  renderKnowledgeHubTabs();
});

function switchScreen(screenName) {
  gameState.currentScreen = screenName;

  const screens = ["registerScreen", "knowledgeScreen", "gameScreen", "dashboardScreen", "adminScreen", "restScreen"];
  screens.forEach(s => {
    const el = document.getElementById(s);
    if (el) el.classList.add("hidden");
  });

  const target = document.getElementById(screenName + "Screen");
  if (target) target.classList.remove("hidden");

  updateNavHeaderUI();

  if (screenName === "game") {
    renderStageSelectionHub();
  } else if (screenName === "dashboard") {
    renderDashboard();
  } else if (screenName === "admin") {
    initAdminPanel();
  }
}

function updateNavHeaderUI() {
  const student = gameState.student;
  const navUser = document.getElementById("navUserStats");
  if (student && student.studentId) {
    if (navUser) {
      navUser.classList.remove("hidden");
      navUser.innerHTML = `
        <div class="flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-amber-300 shadow-md text-xs md:text-sm font-bold">
          <span class="text-amber-950"><i class="fas fa-user-circle text-amber-600 mr-1"></i>${student.fullName}</span>
          <span class="text-red-500 font-extrabold"><i class="fas fa-heart"></i> ${student.hearts ?? 10}</span>
          <span class="text-amber-800 bg-amber-100 px-3 py-1 rounded-full"><i class="fas fa-coins text-amber-500 mr-1"></i>${(student.score || 0).toLocaleString()}</span>
        </div>
      `;
    }
  } else {
    if (navUser) navUser.classList.add("hidden");
  }

  updateTabletBadgesUI();
}

function updateTabletBadgesUI() {
  const tablets = gameState.student?.tablets || [false, false, false, false];
  const container = document.getElementById("navTabletBadges");
  if (!container) return;

  const names = ["กาพย์", "โคลง", "กลอน", "ฉันท์"];
  const colors = ["emerald", "indigo", "rose", "purple"];

  container.innerHTML = tablets.map((has, idx) => `
    <div 
      title="ศิลาชิ้นที่ ${idx+1}: ${names[idx]}" 
      class="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition-all shadow-md ${has ? `bg-${colors[idx]}-500 text-white ring-2 ring-amber-300 scale-110` : 'bg-gray-200 text-gray-400 opacity-50'}">
      <i class="fas ${has ? 'fa-gem animate-pulse' : 'fa-lock'}"></i>
    </div>
  `).join('');
}

function handleRegistrationSubmit(e) {
  e.preventDefault();
  
  const studentId = document.getElementById("regStudentId").value.trim();
  const prefix = document.getElementById("regPrefix").value;
  const fullName = document.getElementById("regFullName").value.trim();
  const grade = document.getElementById("regGrade").value;
  const room = document.getElementById("regRoom").value;

  if (!/^\d{5}$/.test(studentId)) {
    showToast("⚠️ กรุณากรอกเลขประจำตัวนักเรียนเป็นตัวเลข 5 หลักเท่านั้นครับ (เช่น 12345)", "error");
    return;
  }

  if (!fullName) {
    showToast("⚠️ กรุณากรอกชื่อ-นามสกุลด้วยครับ", "warning");
    return;
  }

  const newStudent = {
    studentId,
    prefix,
    fullName,
    grade,
    room,
    hearts: 10,
    score: 0,
    penaltyCount: 0,
    currentStage: 1,
    tablets: [false, false, false, false],
    stageScores: { stage1: 0, stage2: 0, stage3: 0, stage4: 0 },
    gameCompleted: false,
    createdTime: new Date().toISOString()
  };

  gameState.student = newStudent;
  saveStudentData(newStudent);
  logAccessEvent("LOGIN", newStudent, { action: "ลงทะเบียนและเข้าสู่ระบบใหม่" });

  showToast(`🎉 ยินดีต้อนรับ ${prefix}${fullName}! ลงทะเบียนสำเร็จแล้ว`, "success");
  switchScreen("knowledge");
}

function renderStageSelectionHub() {
  const student = gameState.student;
  if (!student) {
    switchScreen("register");
    return;
  }

  if (student.hearts <= 0) {
    startRestCooldown();
    return;
  }

  const stage = student.currentStage || 1;
  const stageScores = student.stageScores || {};

  const completedCount = (student.tablets || []).filter(Boolean).length;
  const progressPercent = Math.min(100, Math.round((completedCount / 4) * 100));

  const hubContainer = document.getElementById("stageSelectionHub");
  if (!hubContainer) return;

  hubContainer.innerHTML = `
    <div class="max-w-5xl mx-auto space-y-6 py-2">
      <!-- Light Mode Glassmorphism Banner -->
      <div class="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-xl border-2 border-amber-300/80">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider mb-1 shadow-sm">
              <i class="fas fa-map-marked-alt text-amber-600"></i> แผนที่ภารกิจนักผจญภัย
            </div>
            <h2 class="text-2xl md:text-3xl font-black text-amber-950">
              แผนที่ภารกิจสะสมชิ้นส่วนศิลา
            </h2>
          </div>

          <div class="flex items-center gap-3 bg-amber-50 px-5 py-2.5 rounded-2xl border border-amber-200 shadow-sm">
            <span class="text-xs text-amber-900 font-bold block">ความก้าวหน้า:</span>
            <span class="text-2xl font-black text-amber-600 font-mono">${progressPercent}%</span>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-amber-100 h-4 rounded-full p-0.5 border border-amber-300 shadow-inner mb-3 overflow-hidden">
          <div 
            class="bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 h-full rounded-full transition-all duration-700 shadow-md" 
            style="width: ${progressPercent}%"></div>
        </div>

        <p class="text-xs text-gray-600">
          สะสมชิ้นส่วนศิลาประพันธ์แล้ว: <strong class="text-amber-900 font-bold">${completedCount} / 4 ชิ้น</strong> (ด่านที่ผ่านภารกิจแล้วสามารถคลิกเข้าดูข้อสอบและคำตอบเฉลยทบทวนได้)
        </p>
      </div>

      <!-- 4 Light Glass Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- CARD 1 -->
        <div 
          onclick="playSpecificStage(1)"
          class="group bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border-2 transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-[1.01] cursor-pointer ${stage >= 1 ? 'border-amber-400 hover:border-amber-500' : 'border-gray-200 opacity-50'}">
          
          <div class="flex justify-between items-start mb-4">
            <div class="w-12 h-12 rounded-2xl bg-amber-500 text-white font-black text-xl flex items-center justify-center shadow-md shadow-amber-500/30">
              1
            </div>
            <span class="px-3.5 py-1 rounded-full text-xs font-black border shadow-sm ${student.tablets?.[0] ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : stage === 1 ? 'bg-amber-400 text-amber-950 border-amber-300 animate-pulse' : 'bg-gray-100 text-gray-400 border-gray-200'}">
              ${student.tablets?.[0] ? '🏆 ผ่านภารกิจแล้ว (ดูผล)' : stage === 1 ? '⏳ กำลังลุย' : '🔒 รอปลดล็อก'}
            </span>
          </div>

          <h3 class="text-xl font-black text-amber-950 mb-1 group-hover:text-amber-600 transition-colors">
            ด่านที่ 1: คลังปัญญาคำประพันธ์
          </h3>
          <p class="text-xs text-gray-600 mb-6 leading-relaxed">
            ข้อสอบ 4 ตัวเลือก strictly 15 ข้อ สะสมชิ้นส่วนศิลาชิ้นที่ 1
          </p>

          <div class="flex justify-between items-center pt-3 border-t border-amber-100 text-xs font-bold">
            <span class="text-amber-800"><i class="fas fa-coins text-amber-500 mr-1.5"></i>คะแนน: ${(stageScores.stage1 || 0).toLocaleString()}</span>
            <span class="bg-amber-500 group-hover:bg-amber-600 text-white px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5 font-extrabold">
              ${student.tablets?.[0] ? 'ดูผลสรุป/เฉลย <i class="fas fa-search"></i>' : 'เข้าเล่นด่านนี้ <i class="fas fa-arrow-right"></i>'}
            </span>
          </div>
        </div>

        <!-- CARD 2 -->
        <div 
          onclick="playSpecificStage(2)"
          class="group bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border-2 transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-[1.01] cursor-pointer ${stage >= 2 ? 'border-emerald-400 hover:border-emerald-500' : 'border-gray-200 opacity-50'}">
          
          <div class="flex justify-between items-start mb-4">
            <div class="w-12 h-12 rounded-2xl bg-emerald-500 text-white font-black text-xl flex items-center justify-center shadow-md shadow-emerald-500/30">
              2
            </div>
            <span class="px-3.5 py-1 rounded-full text-xs font-black border shadow-sm ${student.tablets?.[1] ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : stage === 2 ? 'bg-emerald-400 text-emerald-950 border-emerald-300 animate-pulse' : 'bg-gray-100 text-gray-400 border-gray-200'}">
              ${student.tablets?.[1] ? '🏆 ผ่านภารกิจแล้ว (ดูผล)' : stage === 2 ? '⏳ กำลังลุย' : '🔒 รอปลดล็อก'}
            </span>
          </div>

          <h3 class="text-xl font-black text-emerald-950 mb-1 group-hover:text-emerald-600 transition-colors">
            ด่านที่ 2: ผังผูกพันฉันทลักษณ์
          </h3>
          <p class="text-xs text-gray-600 mb-6 leading-relaxed">
            ลากเส้นตรงฉาก SVG เชื่อมโยงสัมผัส 4 ข้อ สะสมชิ้นส่วนศิลาชิ้นที่ 2
          </p>

          <div class="flex justify-between items-center pt-3 border-t border-emerald-100 text-xs font-bold">
            <span class="text-emerald-800"><i class="fas fa-coins text-amber-500 mr-1.5"></i>คะแนน: ${(stageScores.stage2 || 0).toLocaleString()}</span>
            <span class="bg-emerald-500 group-hover:bg-emerald-600 text-white px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5 font-extrabold">
              ${student.tablets?.[1] ? 'ดูผลสรุป/เฉลย <i class="fas fa-search"></i>' : 'เข้าเล่นด่านนี้ <i class="fas fa-arrow-right"></i>'}
            </span>
          </div>
        </div>

        <!-- CARD 3 -->
        <div 
          onclick="playSpecificStage(3)"
          class="group bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border-2 transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-[1.01] cursor-pointer ${stage >= 3 ? 'border-indigo-400 hover:border-indigo-500' : 'border-gray-200 opacity-50'}">
          
          <div class="flex justify-between items-start mb-4">
            <div class="w-12 h-12 rounded-2xl bg-indigo-500 text-white font-black text-xl flex items-center justify-center shadow-md shadow-indigo-500/30">
              3
            </div>
            <span class="px-3.5 py-1 rounded-full text-xs font-black border shadow-sm ${student.tablets?.[2] ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : stage === 3 ? 'bg-indigo-400 text-indigo-950 border-indigo-300 animate-pulse' : 'bg-gray-100 text-gray-400 border-gray-200'}">
              ${student.tablets?.[2] ? '🏆 ผ่านภารกิจแล้ว (ดูผล)' : stage === 3 ? '⏳ กำลังลุย' : '🔒 รอปลดล็อก'}
            </span>
          </div>

          <h3 class="text-xl font-black text-indigo-950 mb-1 group-hover:text-indigo-600 transition-colors">
            ด่านที่ 3: เรียงร้อยบทร้อยกรอง
          </h3>
          <p class="text-xs text-gray-600 mb-6 leading-relaxed">
            Drag & Drop เรียงวรรคคำประพันธ์ 8 วรรค 4 ข้อ สะสมชิ้นส่วนศิลาชิ้นที่ 3
          </p>

          <div class="flex justify-between items-center pt-3 border-t border-indigo-100 text-xs font-bold">
            <span class="text-indigo-800"><i class="fas fa-coins text-amber-500 mr-1.5"></i>คะแนน: ${(stageScores.stage3 || 0).toLocaleString()}</span>
            <span class="bg-indigo-500 group-hover:bg-indigo-600 text-white px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5 font-extrabold">
              ${student.tablets?.[2] ? 'ดูผลสรุป/เฉลย <i class="fas fa-search"></i>' : 'เข้าเล่นด่านนี้ <i class="fas fa-arrow-right"></i>'}
            </span>
          </div>
        </div>

        <!-- CARD 4 -->
        <div 
          onclick="playSpecificStage(4)"
          class="group bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border-2 transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-[1.01] cursor-pointer ${stage >= 4 ? 'border-purple-400 hover:border-purple-500' : 'border-gray-200 opacity-50'}">
          
          <div class="flex justify-between items-start mb-4">
            <div class="w-12 h-12 rounded-2xl bg-purple-500 text-white font-black text-xl flex items-center justify-center shadow-md shadow-purple-500/30">
              4
            </div>
            <span class="px-3.5 py-1 rounded-full text-xs font-black border shadow-sm ${student.tablets?.[3] ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : stage === 4 ? 'bg-purple-400 text-purple-950 border-purple-300 animate-pulse' : 'bg-gray-100 text-gray-400 border-gray-200'}">
              ${student.tablets?.[3] ? '💎 หลอมผลึกสำเร็จ (ดูผล)' : stage === 4 ? '⏳ กำลังลุย' : '🔒 รอปลดล็อก'}
            </span>
          </div>

          <h3 class="text-xl font-black text-purple-950 mb-1 group-hover:text-purple-600 transition-colors">
            ด่านที่ 4: จารึกคำประพันธ์ลงผลึก
          </h3>
          <p class="text-xs text-gray-600 mb-6 leading-relaxed">
            สุ่มโจทย์ 2 ค่า แต่ง 2 บทส่งครูตรวจ รวมผลึกแลกรางวัลสูงสุด 1,200 คะแนน
          </p>

          <div class="flex justify-between items-center pt-3 border-t border-purple-100 text-xs font-bold">
            <span class="text-purple-800"><i class="fas fa-coins text-amber-500 mr-1.5"></i>คะแนน: ${(stageScores.stage4 || 0).toLocaleString()}</span>
            <span class="bg-purple-500 group-hover:bg-purple-600 text-white px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5 font-extrabold">
              ${student.tablets?.[3] ? 'ดูผลสรุป/เฉลย <i class="fas fa-search"></i>' : 'เข้าเล่นด่านนี้ <i class="fas fa-arrow-right"></i>'}
            </span>
          </div>
        </div>

      </div>
    </div>
  `;

  const mainHub = document.getElementById("stageSelectionHub");
  if (mainHub) mainHub.classList.remove("hidden");

  const stageBar = document.getElementById("gameTopStatusBar");
  if (stageBar) stageBar.classList.add("hidden");

  [1, 2, 3, 4].forEach(i => {
    const el = document.getElementById(`stage${i}Container`);
    if (el) el.classList.add("hidden");
  });
}

function playSpecificStage(stageNum) {
  const student = gameState.student;
  if (!student) return;

  if (stageNum > (student.currentStage || 1) && !student.tablets?.[stageNum - 1]) {
    showToast(`🔒 ด่านที่ ${stageNum} ยังไม่ปลดล็อก กรุณาทำภารกิจด่านที่ ${student.currentStage} ให้สำเร็จก่อนครับ`, "warning");
    return;
  }

  if (student.tablets?.[stageNum - 1]) {
    showStageReviewModal(stageNum);
    return;
  }

  const stageTitles = [
    "ด่านที่ 1: คลังปัญญาคำประพันธ์ (4 ตัวเลือก 15 ข้อ)",
    "ด่านที่ 2: ผังผูกพันฉันทลักษณ์ (ลากเส้น SVG 4 ข้อ)",
    "ด่านที่ 3: เรียงร้อยบทร้อยกรอง (Drag & Drop 4 ข้อ)",
    "ด่านที่ 4: จารึกคำประพันธ์ลงผลึก (สุ่มโจทย์ & ส่งครูตรวจ)"
  ];

  const hub = document.getElementById("stageSelectionHub");
  if (hub) hub.classList.add("hidden");

  const stageBar = document.getElementById("gameTopStatusBar");
  if (stageBar) stageBar.classList.remove("hidden");

  const titleEl = document.getElementById("gameStageTitle");
  if (titleEl) titleEl.textContent = stageTitles[stageNum - 1];

  [1, 2, 3, 4].forEach(i => {
    const el = document.getElementById(`stage${i}Container`);
    if (el) el.classList.add("hidden");
  });

  const currentEl = document.getElementById(`stage${stageNum}Container`);
  if (currentEl) currentEl.classList.remove("hidden");

  if (stageNum === 1) initStage1();
  else if (stageNum === 2) initStage2();
  else if (stageNum === 3) initStage3();
  else if (stageNum === 4) initStage4();
}

function showStageReviewModal(stageNum) {
  const student = gameState.student;
  const stageScores = student.stageScores || {};
  const earnedScore = stageScores[`stage${stageNum}`] || 0;

  const names = ["กาพย์ยานี 11", "ผังฉันทลักษณ์", "เรียงร้อยบทร้อยกรอง", "จารึกคำประพันธ์"];
  const stageTitles = [
    "ด่านที่ 1: คลังปัญญาคำประพันธ์",
    "ด่านที่ 2: ผังผูกพันฉันทลักษณ์",
    "ด่านที่ 3: เรียงร้อยบทร้อยกรอง",
    "ด่านที่ 4: จารึกคำประพันธ์ลงผลึก"
  ];

  const modal = document.createElement("div");
  modal.id = "stageReviewModal";
  modal.className = "fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4";

  modal.innerHTML = `
    <div class="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full text-center shadow-2xl border-4 border-amber-400 animate-scale-up">
      <div class="w-20 h-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-4xl mx-auto mb-3 shadow-md">
        🏆
      </div>
      
      <span class="bg-emerald-100 text-emerald-800 font-extrabold px-4 py-1 rounded-full text-xs inline-block mb-2">
        ✅ ผ่านภารกิจแล้ว (ทบทวนผลย้อนหลัง)
      </span>
      <h3 class="text-2xl font-black text-amber-950 mb-1">${stageTitles[stageNum - 1]}</h3>
      <p class="text-xs text-gray-500 mb-4">ศิลาประจำด่าน: <strong class="text-amber-700">ศิลาชิ้นที่ ${stageNum} (${names[stageNum - 1]})</strong></p>

      <div class="bg-amber-50 p-4 rounded-2xl border border-amber-200 mb-6">
        <span class="text-xs text-amber-800 font-bold block mb-1">คะแนนสะสมที่ได้รับจากด่านนี้:</span>
        <span class="text-3xl font-black text-amber-600 font-mono">+${earnedScore.toLocaleString()} คะแนน</span>
        <p class="text-[11px] text-gray-500 mt-2">
          (ด่านนี้ทำภารกิจสำเร็จเรียบร้อยแล้ว ไม่มีการเปิดให้สะสมคะแนนเพิ่มซ้ำเพื่อความถูกต้องของระบบอันดับคะแนน)
        </p>
      </div>

      <div class="space-y-2">
        <button 
          onclick="document.getElementById('stageReviewModal').remove(); loadStageReadOnlyView(${stageNum});" 
          class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-3 rounded-xl shadow-md transition-all text-sm cursor-pointer flex items-center justify-center gap-2">
          <i class="fas fa-eye"></i> เข้าดูข้อสอบและคำตอบเฉลยทบทวน
        </button>
        <button 
          onclick="document.getElementById('stageReviewModal').remove(); switchScreen('game');" 
          class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-all text-sm cursor-pointer">
          ปิดหน้าทบทวนผลคะแนน
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

function loadStageReadOnlyView(stageNum) {
  const hub = document.getElementById("stageSelectionHub");
  if (hub) hub.classList.add("hidden");

  const stageBar = document.getElementById("gameTopStatusBar");
  if (stageBar) stageBar.classList.remove("hidden");

  const titleEl = document.getElementById("gameStageTitle");
  if (titleEl) titleEl.textContent = `👁️ โหมดดูเฉลยทบทวนผลคะแนน ด่านที่ ${stageNum}`;

  [1, 2, 3, 4].forEach(i => {
    const el = document.getElementById(`stage${i}Container`);
    if (el) el.classList.add("hidden");
  });

  const currentEl = document.getElementById(`stage${stageNum}Container`);
  if (currentEl) currentEl.classList.remove("hidden");

  stopStageTimer();

  if (stageNum === 2) {
    stage2CurrentIndex = 0;
    renderStage2Task(true);
  } else if (stageNum === 1) {
    stage1CurrentIndex = 0;
    renderStage1Question();
  } else if (stageNum === 3) {
    stage3CurrentIndex = 0;
    renderStage3Task();
  } else if (stageNum === 4) {
    renderStage4Screen();
  }
}

function decrementHeart() {
  if (!gameState.student) return;

  gameState.student.hearts = Math.max(0, (gameState.student.hearts ?? 10) - 1);
  saveStudentData(gameState.student);
  updateNavHeaderUI();

  if (gameState.student.hearts <= 0) {
    showCenteredResultPopup("💔 หัวใจของคุณหมดลงแล้ว!", "หัวใจหมด 0 ดวง! ระบบจะพาท่านเข้าสู่หน้าพักทบทวนความรู้ 10 วินาทีเพื่อรับหัวใจคืน", "error", () => {
      startRestCooldown();
    });
  }
}

function addScore(points) {
  if (!gameState.student) return;
  gameState.student.score = (gameState.student.score || 0) + points;
  saveStudentData(gameState.student);
  updateNavHeaderUI();
}

function deductScore(points) {
  if (!gameState.student) return;
  gameState.student.score = Math.max(0, (gameState.student.score || 0) - points);
  saveStudentData(gameState.student);
  updateNavHeaderUI();
}

function startRestCooldown() {
  stopStageTimer();
  switchScreen("rest");

  deductScore(500);
  gameState.student.penaltyCount = (gameState.student.penaltyCount || 0) + 1;
  saveStudentData(gameState.student);

  gameState.restTimerRemaining = 10;
  const restText = document.getElementById("restTimerText");
  
  if (gameState.restTimer) clearInterval(gameState.restTimer);

  gameState.restTimer = setInterval(() => {
    gameState.restTimerRemaining--;
    if (restText) restText.textContent = gameState.restTimerRemaining;

    if (gameState.restTimerRemaining <= 0) {
      clearInterval(gameState.restTimer);
      gameState.student.hearts = 10;
      saveStudentData(gameState.student);
      showCenteredResultPopup("💖 หัวใจเต็มแล้ว!", "หัวใจกลับมาครบ 10 ดวงแล้ว! สามารถลุยเกมต่อได้เลยครับ", "success", () => {
        switchScreen("game");
      });
    }
  }, 1000);
}

function startStageTimer(seconds, onTimeout) {
  stopStageTimer();
  gameState.stageTimerRemaining = seconds;
  updateTimerUI();

  gameState.stageTimer = setInterval(() => {
    gameState.stageTimerRemaining--;
    updateTimerUI();

    if (gameState.stageTimerRemaining <= 0) {
      stopStageTimer();
      if (onTimeout) onTimeout();
    }
  }, 1000);
}

function stopStageTimer() {
  if (gameState.stageTimer) {
    clearInterval(gameState.stageTimer);
    gameState.stageTimer = null;
  }
}

function updateTimerUI() {
  const el = document.getElementById("gameTimerDisplay");
  if (!el) return;

  const mins = Math.floor(gameState.stageTimerRemaining / 60);
  const secs = gameState.stageTimerRemaining % 60;
  el.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  if (gameState.stageTimerRemaining <= 60) {
    el.className = "text-red-600 font-extrabold animate-pulse text-base";
  } else {
    el.className = "text-amber-900 font-bold text-base";
  }
}

function openKnowledgePopup() {
  const currentScore = gameState.student?.score || 0;
  
  if (currentScore < 100) {
    showCenteredResultPopup(
      "⚠️ คะแนนไม่เพียงพอ!", 
      "คุณต้องมีคะแนนสะสมอย่างน้อย 100 คะแนน เพื่อใช้ตัวช่วยเปิดคลังความรู้ (ปัจจุบันคุณมี " + currentScore + " คะแนน)", 
      "warning"
    );
    return;
  }

  deductScore(100);
  showToast("💡 เปิดคลังความรู้ (-100 คะแนน)", "warning");

  renderKnowledgeModalContent();

  const modal = document.getElementById("knowledgeModal");
  if (modal) {
    modal.classList.remove("hidden");
  }
}

function renderKnowledgeModalContent() {
  const bodyEl = document.getElementById("knowledgeModalBody");
  if (!bodyEl) return;

  bodyEl.innerHTML = KNOWLEDGE_DATA.map(k => `
    <div class="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 shadow-sm">
      <h4 class="text-base font-extrabold text-amber-950 mb-2 flex items-center gap-2">
        <i class="fas ${k.icon} text-amber-600"></i> ${k.title}
      </h4>
      <div class="text-gray-800 leading-relaxed">${k.content}</div>
    </div>
  `).join('');
}

function closeKnowledgePopup() {
  const modal = document.getElementById("knowledgeModal");
  if (modal) {
    modal.classList.add("hidden");
  }
}

function renderKnowledgeHubTabs() {
  const tabsContainer = document.getElementById("knowledgeTabs");
  const contentContainer = document.getElementById("knowledgeContentDisplay");
  if (!tabsContainer || !contentContainer) return;

  tabsContainer.innerHTML = KNOWLEDGE_DATA.map((k, idx) => `
    <button 
      onclick="selectKnowledgeTab('${k.id}')" 
      id="kTab_${k.id}"
      class="px-4 py-3 rounded-xl font-bold text-xs md:text-sm transition-all text-left flex items-center gap-2 cursor-pointer ${idx === 0 ? 'bg-amber-500 text-white shadow-md' : 'bg-amber-100/70 text-amber-900 hover:bg-amber-200'}">
      <i class="fas ${k.icon}"></i> ${k.title}
    </button>
  `).join('');

  selectKnowledgeTab(KNOWLEDGE_DATA[0].id);
}

function selectKnowledgeTab(id) {
  KNOWLEDGE_DATA.forEach(k => {
    const tab = document.getElementById(`kTab_${k.id}`);
    if (tab) {
      if (k.id === id) {
        tab.className = "px-4 py-3 rounded-xl font-bold text-xs md:text-sm transition-all text-left flex items-center gap-2 bg-amber-500 text-white shadow-md";
      } else {
        tab.className = "px-4 py-3 rounded-xl font-bold text-xs md:text-sm transition-all text-left flex items-center gap-2 bg-amber-100/70 text-amber-900 hover:bg-amber-200";
      }
    }
  });

  const selected = KNOWLEDGE_DATA.find(k => k.id === id);
  const display = document.getElementById("knowledgeContentDisplay");
  if (display && selected) {
    display.innerHTML = selected.content;
  }
}

async function renderDashboard() {
  const container = document.getElementById("dashboardContent");
  if (!container) return;

  const students = await fetchAllStudents();
  students.sort((a, b) => (b.score || 0) - (a.score || 0));

  const current = gameState.student;

  container.innerHTML = `
    <div class="max-w-5xl mx-auto space-y-6">
      ${current ? `
        <div class="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white rounded-3xl p-6 shadow-xl border-2 border-amber-300 flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-white/20 border-2 border-amber-200 flex items-center justify-center text-3xl shadow-inner">
              🧙‍♂️
            </div>
            <div>
              <h2 class="text-2xl font-extrabold">${current.prefix}${current.fullName}</h2>
              <p class="text-xs text-amber-100">เลขประจำตัว: <span class="font-mono font-bold">${current.studentId}</span> | ชั้น ${current.grade}/${current.room}</p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-4 text-center md:text-right">
            <div class="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/30">
              <span class="text-xs text-amber-100 block">คะแนนสะสมรวม</span>
              <span class="text-2xl font-black text-white">${(current.score || 0).toLocaleString()}</span>
            </div>
            <div class="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/30">
              <span class="text-xs text-amber-100 block">หัวใจ / การพัก</span>
              <span class="text-xl font-bold text-red-200"><i class="fas fa-heart"></i> ${current.hearts ?? 10}</span>
              <span class="text-[10px] text-amber-200 block">ถูกพัก ${current.penaltyCount || 0} ครั้ง</span>
            </div>
          </div>
        </div>
      ` : ''}

      <div class="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl border-2 border-amber-300">
        <h3 class="text-xl font-extrabold text-amber-950 mb-4 flex items-center gap-2">
          <i class="fas fa-trophy text-amber-500"></i> ตารางอันดับคะแนน (Leaderboard)
        </h3>

        <div class="overflow-x-auto rounded-2xl border border-amber-200">
          <table class="w-full text-sm text-left text-gray-700">
            <thead class="text-xs text-amber-950 bg-amber-100 uppercase font-extrabold">
              <tr>
                <th class="px-4 py-3 border-b text-center">อันดับ</th>
                <th class="px-4 py-3 border-b">ชื่อ-สกุล</th>
                <th class="px-4 py-3 border-b text-center">ชั้น/ห้อง</th>
                <th class="px-4 py-3 border-b text-center">ศิลาที่สะสม</th>
                <th class="px-4 py-3 border-b text-center">ด่านที่ 4</th>
                <th class="px-4 py-3 border-b text-center">คะแนนรวม</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-amber-100">
              ${students.length === 0 ? `
                <tr><td colspan="6" class="text-center py-6 text-gray-400">ยังไม่มีข้อมูลคะแนน</td></tr>
              ` : students.map((s, idx) => {
                const rankBadge = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`;
                const isCurrent = current && current.studentId === s.studentId;

                return `
                  <tr class="${isCurrent ? 'bg-amber-100/80 font-bold border-l-4 border-l-amber-600' : 'hover:bg-amber-50/50'}">
                    <td class="px-4 py-3 text-center text-lg font-bold">${rankBadge}</td>
                    <td class="px-4 py-3 font-bold text-gray-900">${s.prefix || ''}${s.fullName || ''}</td>
                    <td class="px-4 py-3 text-center text-xs">${s.grade || ''}/${s.room || ''}</td>
                    <td class="px-4 py-3 text-center">
                      <div class="flex justify-center gap-1">
                        ${(s.tablets || [false, false, false, false]).map((has, i) => `
                          <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${has ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-400'}">
                            ${i + 1}
                          </span>
                        `).join('')}
                      </div>
                    </td>
                    <td class="px-4 py-3 text-center text-xs">
                      ${s.stage4Submission?.graded ? `<span class="text-emerald-600 font-bold">✅ ${s.stageScores?.stage4 || 0}</span>` :
                        s.stage4Submission?.submitted ? `<span class="text-purple-600 font-bold">⏳ รอตรวจ</span>` :
                        `<span class="text-gray-400">-</span>`}
                    </td>
                    <td class="px-4 py-3 text-center font-black text-amber-700 text-base">
                      ${(s.score || 0).toLocaleString()}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function showCenteredResultPopup(title, message, type = "info", onClose = null) {
  const existing = document.getElementById("centeredResultPopupModal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "centeredResultPopupModal";
  modal.className = "fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4";

  let iconHeader = "✨";
  let borderColor = "border-amber-400";
  let btnColor = "bg-amber-500 hover:bg-amber-600 text-white";

  if (type === "success") {
    iconHeader = "🎉";
    borderColor = "border-emerald-400";
    btnColor = "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white";
  } else if (type === "error") {
    iconHeader = "❌";
    borderColor = "border-red-400";
    btnColor = "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white";
  } else if (type === "warning") {
    iconHeader = "⚠️";
    borderColor = "border-amber-500";
    btnColor = "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white";
  }

  modal.innerHTML = `
    <div class="bg-white rounded-3xl p-6 md:p-8 max-w-sm md:max-w-md w-full text-center shadow-2xl border-4 ${borderColor} animate-scale-up">
      <div class="text-5xl mb-3">${iconHeader}</div>
      <h3 class="text-2xl font-black text-slate-900 mb-2">${title}</h3>
      <p class="text-sm font-medium text-gray-700 leading-relaxed mb-6">${message}</p>
      
      <button 
        id="resultPopupCloseBtn"
        class="w-full font-extrabold py-3.5 px-6 rounded-xl shadow-lg transition-all active:scale-95 text-base cursor-pointer ${btnColor}">
        ตกลง / ดำเนินการต่อ <i class="fas fa-check ml-1"></i>
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("resultPopupCloseBtn").onclick = () => {
    modal.remove();
    if (onClose) onClose();
  };
}

function showStageCompleteModal(stageNum, tabletName, scoreEarned, msg) {
  const modal = document.createElement("div");
  modal.id = "stageCompleteModal";
  modal.className = "fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4";
  modal.innerHTML = `
    <div class="bg-gradient-to-b from-amber-50 to-amber-100 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border-4 border-amber-400 animate-scale-up">
      <div class="w-20 h-20 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg animate-bounce">
        💎
      </div>
      <h3 class="text-2xl font-black text-amber-950 mb-1">ปลดล็อกชิ้นส่วนศิลาสำเร็จ!</h3>
      <p class="text-sm font-bold text-amber-700 mb-4">${tabletName}</p>

      <div class="bg-white p-4 rounded-2xl border border-amber-200 mb-6 shadow-inner">
        <p class="text-gray-700 text-sm leading-relaxed mb-2">${msg}</p>
        <span class="text-amber-600 font-extrabold text-lg block">+${scoreEarned} คะแนน</span>
      </div>

      <button 
        onclick="document.getElementById('stageCompleteModal').remove(); switchScreen('game');" 
        class="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black py-4 rounded-xl shadow-xl transition-all active:scale-95 text-lg cursor-pointer">
        ไปยังแผนที่ภารกิจ <i class="fas fa-map-marked-alt ml-1"></i>
      </button>
    </div>
  `;
  document.body.appendChild(modal);
}

function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  let bgClass = "bg-amber-900 text-white border-amber-600";
  if (type === "success") bgClass = "bg-emerald-800 text-white border-emerald-500";
  if (type === "error") bgClass = "bg-red-800 text-white border-red-500";
  if (type === "warning") bgClass = "bg-amber-600 text-white border-amber-300";

  toast.className = `p-4 rounded-2xl border-2 shadow-2xl text-sm font-bold flex items-center gap-3 transition-all duration-300 transform translate-y-4 opacity-0 ${bgClass}`;
  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove("translate-y-4", "opacity-0");
  }, 50);

  setTimeout(() => {
    toast.classList.add("opacity-0", "-translate-y-2");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
