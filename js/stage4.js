/**
 * stage4.js - ระบบการเล่นด่านที่ 4 (เกมแต่งคำประพันธ์ สุ่มโจทย์ & ส่งให้ครูตรวจ 1,200 คะแนน)
 */

let stage4SelectedTopic = null;
let stage4SelectedVerseType = null;
let stage4HasSpun = false;

function initStage4() {
  const student = gameState.student;
  
  // เช็คว่าเคยสุ่มโจทย์หรือส่งงานไปแล้วหรือยัง
  if (student.stage4Submission) {
    stage4SelectedTopic = student.stage4Submission.topic;
    stage4SelectedVerseType = student.stage4Submission.verseType;
    stage4HasSpun = true;
  } else {
    stage4SelectedTopic = null;
    stage4SelectedVerseType = null;
    stage4HasSpun = false;
  }

  // เริ่มจับเวลาด่าน 4 (12 นาที = 720 วินาที)
  startStageTimer(720, () => {
    alert("⏰ หมดเวลาทำภารกิจด่านที่ 4 แล้ว! ระบบจะส่งคำตอบที่คุณพิมพ์ไว้เท่าที่มีให้คุณครูตรวจครับ");
    submitStage4Composition(true);
  });

  renderStage4Screen();
}

function renderStage4Screen() {
  const container = document.getElementById("stage4Container");
  if (!container) return;

  const student = gameState.student;
  const isSubmitted = student.stage4Submission && student.stage4Submission.submitted;

  container.innerHTML = `
    <div class="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border-2 border-purple-300 max-w-3xl mx-auto transition-all">
      <div class="flex justify-between items-center mb-4">
        <span class="bg-purple-100 text-purple-900 font-bold px-3 py-1 rounded-full text-sm">
          ด่านที่ 4: จารึกคำประพันธ์ลงผลึก
        </span>
        <span class="text-purple-800 font-bold text-sm">
          <i class="fas fa-award text-amber-500 mr-1"></i>คะแนนจากครู: <span id="s4ScoreText">${student.stageScores?.stage4 !== undefined ? student.stageScores.stage4 : 'รอตรวจ (เต็ม 1,200)'}</span>
        </span>
      </div>

      <!-- Story Banner -->
      <div class="bg-gradient-to-r from-purple-800 to-indigo-900 text-white rounded-2xl p-5 mb-6 shadow-lg border border-purple-400">
        <h3 class="text-lg font-bold text-amber-300 mb-1"><i class="fas fa-gem mr-2"></i>ภารกิจหลอมรวมศิลาลงผลึก</h3>
        <p class="text-xs text-purple-100 leading-relaxed">
          กดปุ่มวงล้อสุ่มโจทย์เพื่อรับ "เนื้อเรื่อง" และ "ประเภทคำประพันธ์" จากนั้นร่วมกันแต่งบทประพันธ์ตามโจทย์ที่ได้รับ แล้วพิมพ์ส่งเข้าสู่ระบบ เพื่อให้คุณครูตรวจประเมินคะแนน 1,200 คะแนน!
        </p>
      </div>

      <!-- Spinner Section -->
      <div class="bg-purple-50/80 rounded-2xl p-5 border-2 border-dashed border-purple-300 mb-6 text-center">
        <h4 class="text-xs font-bold text-purple-900 uppercase tracking-wider mb-3">โจทย์คำประพันธ์ที่คุณได้รับ:</h4>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div class="bg-white p-4 rounded-xl border border-purple-200 shadow-sm">
            <span class="text-xs text-purple-600 font-bold block mb-1">📌 เนื้อเรื่อง / หัวข้อ</span>
            <span id="s4TopicText" class="text-base font-extrabold text-purple-950">
              ${stage4SelectedTopic || '--- ยังไม่ได้สุ่มโจทย์ ---'}
            </span>
          </div>

          <div class="bg-white p-4 rounded-xl border border-purple-200 shadow-sm">
            <span class="text-xs text-purple-600 font-bold block mb-1">📜 ประเภทคำประพันธ์</span>
            <span id="s4VerseTypeText" class="text-base font-extrabold text-purple-950">
              ${stage4SelectedVerseType || '--- ยังไม่ได้สุ่มโจทย์ ---'}
            </span>
          </div>
        </div>

        ${!isSubmitted ? `
          <button 
            id="s4SpinBtn"
            onclick="spinStage4Prompt()" 
            class="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-amber-950 font-extrabold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mx-auto active:scale-95 cursor-pointer">
            <i class="fas fa-sync-alt animate-spin-slow"></i> กดสุ่มโจทย์คำประพันธ์
          </button>
        ` : ''}
      </div>

      <!-- Composition Textarea Form -->
      <div class="mb-6">
        <label class="block font-bold text-purple-950 text-sm mb-2">
          <i class="fas fa-edit text-purple-600 mr-1"></i>พิมพ์แต่งคำประพันธ์ของคุณที่นี่:
        </label>
        <textarea 
          id="s4TextInput"
          rows="6"
          ${isSubmitted ? 'disabled' : ''}
          placeholder="พิมพ์คำประพันธ์ที่แต่งขึ้นตามหัวข้อและประเภทที่ได้รับสุ่ม..."
          class="w-full p-4 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 font-medium text-gray-800 transition-all text-base leading-relaxed resize-y ${isSubmitted ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}">${student.stage4Submission?.poemText || ''}</textarea>
      </div>

      <!-- Submitted Status Card -->
      ${isSubmitted ? `
        <div class="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-xl mb-6 flex items-center gap-3 text-emerald-900">
          <i class="fas fa-check-circle text-2xl text-emerald-600"></i>
          <div>
            <strong class="block font-bold">ส่งบทประพันธ์เข้าสู่ระบบเรียบร้อยแล้ว!</strong>
            <span class="text-xs text-emerald-700">สถานะ: ${student.stage4Submission.graded ? '✅ ตรวจคะแนนแล้ว (' + student.stageScores.stage4 + '/1,200 คะแนน)' : '⏳ กำลังรอคุณครูเข้ามาตรวจให้คะแนนในหลังบ้าน'}</span>
          </div>
        </div>
      ` : ''}

      <!-- Footer Buttons -->
      <div class="flex justify-between items-center pt-2">
        <button 
          onclick="openKnowledgePopup()" 
          class="text-purple-700 hover:text-purple-900 font-bold text-sm bg-purple-50 border border-purple-300 hover:bg-purple-100 px-4 py-2 rounded-xl transition-all flex items-center gap-2">
          <i class="fas fa-lightbulb text-amber-500"></i> เปิดคลังความรู้ (-100 คะแนน)
        </button>

        ${!isSubmitted ? `
          <button 
            onclick="submitStage4Composition()" 
            class="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-extrabold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 active:scale-95 cursor-pointer">
            ส่งจารึกคำประพันธ์ <i class="fas fa-paper-plane"></i>
          </button>
        ` : `
          <button 
            onclick="finishStage4()" 
            class="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 active:scale-95 cursor-pointer">
            ไปที่ Dashboard สรุปผล <i class="fas fa-trophy"></i>
          </button>
        `}
      </div>
    </div>
  `;
}

function spinStage4Prompt() {
  const spinBtn = document.getElementById("s4SpinBtn");
  if (spinBtn) {
    spinBtn.disabled = true;
    spinBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> กำลังหมุนสุ่มโจทย์...`;
  }

  setTimeout(() => {
    const randomTopic = STAGE4_TOPICS[Math.floor(Math.random() * STAGE4_TOPICS.length)];
    const randomVerse = STAGE4_VERSE_TYPES[Math.floor(Math.random() * STAGE4_VERSE_TYPES.length)];

    stage4SelectedTopic = randomTopic;
    stage4SelectedVerseType = randomVerse;
    stage4HasSpun = true;

    // บันทึกโจทย์
    if (!gameState.student.stage4Submission) gameState.student.stage4Submission = {};
    gameState.student.stage4Submission.topic = randomTopic;
    gameState.student.stage4Submission.verseType = randomVerse;
    gameState.student.stage4Submission.submitted = false;
    saveStudentData(gameState.student);

    renderStage4Screen();
    showToast("🎉 สุ่มโจทย์สำเร็จ! อ่านหัวข้อและแต่งคำประพันธ์ได้เลย", "success");
  }, 1000);
}

function submitStage4Composition(isAutoTimeout = false) {
  if (!stage4HasSpun) {
    showToast("⚠️ กรุณากดปุ่มสุ่มโจทย์ก่อนแต่งคำประพันธ์ครับ", "warning");
    return;
  }

  const textInput = document.getElementById("s4TextInput");
  const poemText = textInput ? textInput.value.trim() : "";

  if (!poemText && !isAutoTimeout) {
    showToast("⚠️ กรุณาพิมพ์แต่งคำประพันธ์ก่อนกดส่งครับ", "warning");
    return;
  }

  // อัปเดตข้อมูลการส่งงาน
  gameState.student.stage4Submission = {
    topic: stage4SelectedTopic,
    verseType: stage4SelectedVerseType,
    poemText: poemText,
    submitted: true,
    submitTime: new Date().toISOString(),
    graded: false
  };

  // ด่าน 4 ยังไม่มีคะแนนทันที จนกว่าครูจะตรวจในหลังบ้าน
  if (!gameState.student.stageScores) gameState.student.stageScores = {};
  if (gameState.student.stageScores.stage4 === undefined) {
    gameState.student.stageScores.stage4 = 0; // รอตะแนนเพิ่มจากครู
  }

  // ปลดล็อกชิ้นส่วนศิลาชิ้นที่ 4 (ศิลาแห่งมหาผลึก)
  if (!gameState.student.tablets) gameState.student.tablets = [false, false, false, false];
  gameState.student.tablets[3] = true;
  gameState.student.gameCompleted = true;

  // เพิ่มโบนัสหัวใจเหลือ (remaining_hearts * 100)
  if (!gameState.student.heartBonusAdded) {
    const bonus = (gameState.student.hearts || 10) * 100;
    gameState.student.score = (gameState.student.score || 0) + bonus;
    gameState.student.heartBonusAdded = true;
    showToast(`💖 ได้รับโบนัสหัวใจเหลือ (${gameState.student.hearts} ดวง x 100) +${bonus} คะแนน!`, "success");
  }

  saveStudentData(gameState.student);
  updateTabletBadgesUI();

  stopStageTimer();
  renderStage4Screen();

  showStageCompleteModal(
    "4",
    "ศิลาแห่งมหาผลึก (ชิ้นที่ 4)",
    0,
    "🎉 ยินดีด้วย! คุณสะสมชิ้นส่วนศิลาครบทั้ง 4 ชิ้นและหลอมรวมผลึกสำเร็จ! ส่งบทประพันธ์ให้คุณครูเรียบร้อยแล้ว"
  );
}

function finishStage4() {
  switchScreen("dashboard");
}
