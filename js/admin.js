/**
 * admin.js - ระบบหลังบ้านสำหรับครู (Password nwsp1234, Firebase Manager, Access Logs Viewer)
 */

let isAdminAuthenticated = false;

function initAdminPanel() {
  if (!isAdminAuthenticated) {
    promptAdminPassword();
  } else {
    renderAdminDashboard();
  }
}

function promptAdminPassword() {
  const container = document.getElementById("adminContainer");
  if (!container) return;

  container.innerHTML = `
    <div class="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border-2 border-amber-300 max-w-md mx-auto text-center my-8">
      <div class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-700 text-2xl shadow-inner border border-amber-300">
        <i class="fas fa-user-shield"></i>
      </div>

      <h3 class="text-2xl font-extrabold text-amber-950 mb-2">เข้าสู่ระบบหลังบ้านสำหรับครู</h3>
      <p class="text-xs text-gray-500 mb-6">กรุณาระบุรหัสผ่านเข้าใช้งานระบบจัดการข้อมูลนักเรียน</p>

      <form onsubmit="handleAdminLogin(event)" class="space-y-4">
        <div>
          <input 
            type="password" 
            id="adminPasswordInput"
            placeholder="ป้อนรหัสผ่าน..."
            required
            class="w-full p-4 rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-300 text-center text-lg font-bold tracking-widest text-amber-950 transition-all outline-none"
          />
        </div>

        <button 
          type="submit"
          class="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold p-4 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95">
          <i class="fas fa-key"></i> ยืนยันรหัสผ่าน
        </button>
      </form>
    </div>
  `;
}

function handleAdminLogin(e) {
  e.preventDefault();
  const input = document.getElementById("adminPasswordInput");
  const pwd = input ? input.value : "";

  if (pwd === "nwsp1234") {
    isAdminAuthenticated = true;
    logAccessEvent("ADMIN_LOGIN", null, { action: "ครูเข้าสู่ระบบแผงจัดการ Admin" });
    showToast("🔓 เข้าสู่ระบบหลังบ้านสำเร็จ!", "success");
    renderAdminDashboard();
  } else {
    showToast("❌ รหัสผ่านไม่ถูกต้อง! กรุณาลองใหม่อีกครั้ง", "error");
    if (input) input.value = "";
  }
}

async function renderAdminDashboard() {
  const container = document.getElementById("adminContainer");
  if (!container) return;

  const students = await fetchAllStudents();
  const logs = await fetchAllAccessLogs();

  container.innerHTML = `
    <div class="bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-amber-300 max-w-6xl mx-auto my-6">
      <!-- Admin Header -->
      <div class="flex flex-wrap justify-between items-center pb-6 border-b border-amber-200 gap-4 mb-6">
        <div>
          <h2 class="text-2xl font-extrabold text-amber-950 flex items-center gap-2">
            <i class="fas fa-tasks text-amber-600"></i> แผงจัดการระบบหลังบ้าน (Teacher Dashboard)
          </h2>
          <p class="text-xs text-gray-500 mt-1">จัดการข้อมูลนักเรียน ตรวจประวัติการเข้าใช้งาน (Logs) และตั้งค่า Firebase</p>
        </div>

        <div class="flex gap-2">
          <button 
            onclick="openFirebaseConfigModal()" 
            class="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-300 font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-1.5">
            <i class="fas fa-database"></i> ตั้งค่า Firebase Key
          </button>
          <button 
            onclick="isAdminAuthenticated = false; promptAdminPassword();" 
            class="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-1.5">
            <i class="fas fa-sign-out-alt"></i> ออกจากระบบ
          </button>
        </div>
      </div>

      <!-- Quick Summary Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-center">
          <span class="text-xs font-bold text-amber-800 uppercase block mb-1">จำนวนนักเรียนทั้งหมด</span>
          <span class="text-3xl font-black text-amber-950">${students.length} คน</span>
        </div>
        <div class="bg-purple-50 p-4 rounded-2xl border border-purple-200 text-center">
          <span class="text-xs font-bold text-purple-800 uppercase block mb-1">ด่าน 4 รอตรวจ</span>
          <span class="text-3xl font-black text-purple-950">
            ${students.filter(s => s.stage4Submission?.submitted && !s.stage4Submission?.graded).length} รายการ
          </span>
        </div>
        <div class="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-center">
          <span class="text-xs font-bold text-emerald-800 uppercase block mb-1">ประวัติ Access Logs</span>
          <span class="text-3xl font-black text-emerald-950">${logs.length} รายการ</span>
        </div>
        <div class="bg-rose-50 p-4 rounded-2xl border border-rose-200 text-center">
          <span class="text-xs font-bold text-rose-800 uppercase block mb-1">คะแนนเฉลี่ยรวม</span>
          <span class="text-3xl font-black text-rose-950">
            ${students.length > 0 ? Math.round(students.reduce((acc, s) => acc + (s.score || 0), 0) / students.length) : 0}
          </span>
        </div>
      </div>

      <!-- Section 1: Students Table -->
      <h3 class="text-lg font-bold text-amber-950 mb-4 flex items-center gap-2">
        <i class="fas fa-users text-amber-600"></i> รายชื่อและสรุปผลการเล่นเกมของนักเรียน
      </h3>

      <div class="overflow-x-auto rounded-2xl border border-amber-200 shadow-sm mb-8">
        <table class="w-full text-sm text-left text-gray-700">
          <thead class="text-xs text-amber-950 bg-amber-100 uppercase font-extrabold">
            <tr>
              <th class="px-4 py-3 border-b">เลขประจำตัว</th>
              <th class="px-4 py-3 border-b">ชื่อ-สกุล</th>
              <th class="px-4 py-3 border-b">ชั้น/ห้อง</th>
              <th class="px-4 py-3 border-b text-center">หัวใจ / ถูกพัก</th>
              <th class="px-4 py-3 border-b text-center">คะแนนรวม</th>
              <th class="px-4 py-3 border-b text-center">สถานะด่าน 4</th>
              <th class="px-4 py-3 border-b text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-amber-100 bg-white">
            ${students.length === 0 ? `
              <tr>
                <td colspan="7" class="text-center py-8 text-gray-400 italic">ยังไม่มีข้อมูลการเข้าเล่นเกมของนักเรียน</td>
              </tr>
            ` : students.map(s => {
              const hasSub = s.stage4Submission?.submitted;
              const isGraded = s.stage4Submission?.graded;

              return `
                <tr class="hover:bg-amber-50/50 transition-colors">
                  <td class="px-4 py-3 font-mono font-bold text-amber-900">${s.studentId || '-'}</td>
                  <td class="px-4 py-3 font-bold text-gray-900">${s.prefix || ''}${s.fullName || ''}</td>
                  <td class="px-4 py-3 text-xs">${s.grade || ''}/${s.room || ''}</td>
                  <td class="px-4 py-3 text-center">
                    <span class="text-red-500 font-bold"><i class="fas fa-heart"></i> ${s.hearts ?? 10}</span>
                    <span class="text-xs text-gray-400 block">พัก ${s.penaltyCount || 0} ครั้ง</span>
                  </td>
                  <td class="px-4 py-3 text-center font-extrabold text-amber-700 text-base">
                    ${(s.score || 0).toLocaleString()}
                  </td>
                  <td class="px-4 py-3 text-center text-xs">
                    ${!hasSub ? `<span class="bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">ยังไม่ถึงด่าน 4</span>` :
                      !isGraded ? `<button onclick="openGradingModal('${s.studentId}')" class="bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold px-3 py-1 rounded-full animate-pulse"><i class="fas fa-pen"></i> รอครูตรวจ</button>` :
                      `<span class="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">✅ ตรวจแล้ว (+${s.stageScores?.stage4 || 0})</span>`}
                  </td>
                  <td class="px-4 py-3 text-center">
                    <button 
                      onclick="confirmDeleteStudent('${s.studentId}', '${s.fullName}')"
                      class="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- Section 2: Access Logs Table -->
      <h3 class="text-lg font-bold text-amber-950 mb-4 flex items-center gap-2 pt-4 border-t border-amber-200">
        <i class="fas fa-history text-amber-600"></i> ประวัติการเข้าใช้งานและกิจกรรม (Firebase Access Logs)
      </h3>

      <div class="overflow-x-auto rounded-2xl border border-amber-200 shadow-sm max-h-96">
        <table class="w-full text-sm text-left text-gray-700">
          <thead class="text-xs text-amber-950 bg-amber-100 uppercase font-extrabold sticky top-0">
            <tr>
              <th class="px-4 py-3 border-b">วัน-เวลา</th>
              <th class="px-4 py-3 border-b">เหตุการณ์</th>
              <th class="px-4 py-3 border-b">รหัสนักเรียน</th>
              <th class="px-4 py-3 border-b">ชื่อนักเรียน</th>
              <th class="px-4 py-3 border-b">ชั้น/ห้อง</th>
              <th class="px-4 py-3 border-b">รายละเอียดกิจกรรม</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-amber-100 bg-white">
            ${logs.length === 0 ? `
              <tr>
                <td colspan="6" class="text-center py-8 text-gray-400 italic">ยังไม่มีประวัติการเข้าใช้งาน (Access Logs)</td>
              </tr>
            ` : logs.map(l => {
              const dt = new Date(l.timestamp);
              const formattedDate = dt.toLocaleString('th-TH');

              let badgeColor = "bg-blue-100 text-blue-800";
              if (l.eventType === "LOGIN") badgeColor = "bg-emerald-100 text-emerald-800";
              if (l.eventType === "STAGE_COMPLETE") badgeColor = "bg-purple-100 text-purple-800";
              if (l.eventType === "ADMIN_LOGIN") badgeColor = "bg-amber-100 text-amber-800";

              return `
                <tr class="hover:bg-amber-50/50 transition-colors">
                  <td class="px-4 py-2.5 text-xs text-gray-500 font-mono">${formattedDate}</td>
                  <td class="px-4 py-2.5">
                    <span class="${badgeColor} font-bold px-2.5 py-0.5 rounded-full text-xs">${l.eventType}</span>
                  </td>
                  <td class="px-4 py-2.5 font-mono font-bold text-amber-900">${l.studentId || '-'}</td>
                  <td class="px-4 py-2.5 font-bold text-gray-800">${l.studentName || '-'}</td>
                  <td class="px-4 py-2.5 text-xs">${l.classRoom || '-'}/${l.number || '-'}</td>
                  <td class="px-4 py-2.5 text-xs text-gray-600">${JSON.stringify(l.details || {})}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Modal ตรวจบทกลอนด่าน 4
async function openGradingModal(studentId) {
  const students = await fetchAllStudents();
  const student = students.find(s => s.studentId === studentId);
  if (!student || !student.stage4Submission) return;

  const modal = document.createElement("div");
  modal.id = "gradingModal";
  modal.className = "fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4";
  modal.innerHTML = `
    <div class="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl border-2 border-purple-400 animate-scale-up">
      <div class="flex justify-between items-center mb-4 pb-3 border-b border-purple-100">
        <h3 class="text-xl font-extrabold text-purple-950">
          <i class="fas fa-award text-amber-500 mr-2"></i>ตรวจให้คะแนนการแต่งคำประพันธ์
        </h3>
        <button onclick="document.getElementById('gradingModal').remove()" class="text-gray-400 hover:text-gray-600 text-xl font-bold">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="mb-4 bg-purple-50 p-4 rounded-2xl border border-purple-200">
        <p class="text-sm font-bold text-purple-900">นักเรียน: <span class="text-purple-700">${student.prefix}${student.fullName} (ชั้น ${student.grade}/${student.room})</span></p>
        <p class="text-xs text-purple-700 mt-1">📌 หัวข้อ: <strong>${student.stage4Submission.topic}</strong> | 📜 ประเภท: <strong>${student.stage4Submission.verseType}</strong></p>
      </div>

      <div class="mb-6">
        <label class="block text-xs font-bold text-gray-500 mb-2">บทประพันธ์ที่นักเรียนพิมพ์ส่งมา:</label>
        <div class="bg-slate-900 text-amber-200 font-mono p-4 rounded-xl leading-relaxed whitespace-pre-line text-base border border-slate-700 shadow-inner">
          ${student.stage4Submission.poemText || '(ไม่พบข้อความ)'}
        </div>
      </div>

      <form onsubmit="saveGradeSubmit(event, '${student.studentId}')" class="space-y-4">
        <div>
          <label class="block text-sm font-bold text-gray-800 mb-1">
            ระบุคะแนนที่ได้ (สูงสุด 1,200 คะแนน):
          </label>
          <input 
            type="number" 
            id="gradeScoreInput" 
            min="0" 
            max="1200" 
            required 
            value="${student.stageScores?.stage4 || 1000}"
            class="w-full p-3 rounded-xl border-2 border-purple-300 focus:border-purple-600 text-center font-extrabold text-2xl text-purple-950 outline-none"
          />
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button 
            type="button" 
            onclick="document.getElementById('gradingModal').remove()" 
            class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-5 py-2.5 rounded-xl text-sm transition-all">
            ยกเลิก
          </button>
          <button 
            type="submit" 
            class="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-lg transition-all">
            บันทึกคะแนน <i class="fas fa-save ml-1"></i>
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);
}

async function saveGradeSubmit(e, studentId) {
  e.preventDefault();
  const input = document.getElementById("gradeScoreInput");
  const scoreVal = parseInt(input ? input.value : 0, 10);

  const students = await fetchAllStudents();
  const student = students.find(s => s.studentId === studentId);

  if (student) {
    const oldStage4Score = student.stageScores?.stage4 || 0;
    const scoreDiff = scoreVal - oldStage4Score;

    if (!student.stageScores) student.stageScores = {};
    student.stageScores.stage4 = scoreVal;
    student.score = (student.score || 0) + scoreDiff;

    if (!student.stage4Submission) student.stage4Submission = {};
    student.stage4Submission.graded = true;

    await saveStudentData(student);
    logAccessEvent("GRADE_SAVED", student, { scoreVal });
    showToast(`✅ บันทึกคะแนน ${scoreVal} คะแนน ให้ ${student.fullName} เรียบร้อยแล้ว!`, "success");

    const modal = document.getElementById("gradingModal");
    if (modal) modal.remove();

    renderAdminDashboard();
  }
}

async function confirmDeleteStudent(studentId, fullName) {
  if (confirm(`⚠️ คุณแน่ใจหรือไม่ที่จะลบข้อมูลการเล่นเกมของ "${fullName}" (ID: ${studentId})?`)) {
    await deleteStudentData(studentId);
    showToast(`🗑️ ลบข้อมูลของ ${fullName} เรียบร้อยแล้ว`, "info");
    renderAdminDashboard();
  }
}

function openFirebaseConfigModal() {
  const currentConfig = getFirebaseConfig() || {};

  const modal = document.createElement("div");
  modal.id = "firebaseModal";
  modal.className = "fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4";
  modal.innerHTML = `
    <div class="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border-2 border-blue-400 animate-scale-up">
      <div class="flex justify-between items-center mb-4 pb-3 border-b border-blue-100">
        <h3 class="text-xl font-extrabold text-blue-950">
          <i class="fas fa-database text-blue-600 mr-2"></i>ตั้งค่า Firebase Credentials
        </h3>
        <button onclick="document.getElementById('firebaseModal').remove()" class="text-gray-400 hover:text-gray-600 text-xl font-bold">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <form onsubmit="saveFirebaseSettingsSubmit(event)" class="space-y-3 text-left">
        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1">API Key:</label>
          <input type="text" id="fbApiKey" value="${currentConfig.apiKey || ''}" class="w-full p-2.5 rounded-lg border border-gray-300 text-xs font-mono" />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1">Auth Domain:</label>
          <input type="text" id="fbAuthDomain" value="${currentConfig.authDomain || ''}" class="w-full p-2.5 rounded-lg border border-gray-300 text-xs font-mono" />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-700 mb-1">Project ID:</label>
          <input type="text" id="fbProjectId" value="${currentConfig.projectId || ''}" class="w-full p-2.5 rounded-lg border border-gray-300 text-xs font-mono" />
        </div>

        <div class="flex justify-end gap-2 pt-3">
          <button type="button" onclick="document.getElementById('firebaseModal').remove()" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-xs font-bold">ยกเลิก</button>
          <button type="submit" class="bg-blue-600 text-white px-5 py-2 rounded-lg text-xs font-bold">บันทึกคีย์ Firebase</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
}

function saveFirebaseSettingsSubmit(e) {
  e.preventDefault();
  const apiKey = document.getElementById("fbApiKey").value.trim();
  const authDomain = document.getElementById("fbAuthDomain").value.trim();
  const projectId = document.getElementById("fbProjectId").value.trim();

  saveFirebaseConfig({ apiKey, authDomain, projectId });
  showToast("💾 บันทึกการตั้งค่า Firebase สำเร็จ!", "success");
  const modal = document.getElementById("firebaseModal");
  if (modal) modal.remove();
}
