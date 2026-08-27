/**
 * config.js - การเชื่อมต่อ Firebase Firestore และการบันทึก ประวัติการเข้าใช้งาน (Access Logs)
 */

const STORAGE_KEYS = {
  CURRENT_STUDENT: "silaprapan_current_student",
  ALL_STUDENTS: "silaprapan_all_students",
  ACCESS_LOGS: "silaprapan_access_logs",
  FIREBASE_CONFIG: "silaprapan_firebase_config"
};

/**
 * 🔑 คีย์ Firebase Config ของโปรเจกต์ (games-thai)
 */
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyA2DG9r1mJBa6OWbO2ow5Nf5CvI1Ks3emc",
  authDomain: "games-thai.firebaseapp.com",
  projectId: "games-thai",
  storageBucket: "games-thai.firebasestorage.app",
  messagingSenderId: "441081719100",
  appId: "1:441081719100:web:7ed9116376c896c5de1639",
  measurementId: "G-4F3B5SDG3J"
};

let firebaseApp = null;
let firestoreDb = null;

// ดึง Firebase Config จากตัวแปรหลัก หรือ LocalStorage
function getFirebaseConfig() {
  if (DEFAULT_FIREBASE_CONFIG && DEFAULT_FIREBASE_CONFIG.apiKey) {
    return DEFAULT_FIREBASE_CONFIG;
  }
  const saved = localStorage.getItem(STORAGE_KEYS.FIREBASE_CONFIG);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Invalid saved Firebase config", e);
    }
  }
  return null;
}

// บันทึก Firebase Config ลง LocalStorage
function saveFirebaseConfig(configObj) {
  localStorage.setItem(STORAGE_KEYS.FIREBASE_CONFIG, JSON.stringify(configObj));
  initFirebase();
}

// เริ่มต้น Firebase SDK ถ้ามีการตั้งค่า
function initFirebase() {
  const config = getFirebaseConfig();
  if (config && config.apiKey && typeof firebase !== 'undefined') {
    try {
      if (!firebase.apps.length) {
        firebaseApp = firebase.initializeApp(config);
      } else {
        firebaseApp = firebase.app();
      }
      firestoreDb = firebase.firestore();
      console.log("🟢 Firebase (games-thai) initialized successfully!");
    } catch (e) {
      console.warn("⚠️ Firebase initialization warning, falling back to LocalStorage:", e);
    }
  } else {
    console.log("ℹ️ Running in LocalStorage fallback mode");
  }
}

// ดึงรายชื่อนักเรียนทั้งหมดจาก LocalStorage
function getAllStudentsLocal() {
  const data = localStorage.getItem(STORAGE_KEYS.ALL_STUDENTS);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }
  return [];
}

// ดึงประวัติ Log การเข้าใช้จาก LocalStorage
function getAccessLogsLocal() {
  const data = localStorage.getItem(STORAGE_KEYS.ACCESS_LOGS);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }
  return [];
}

// บันทึกประวัติการเข้าใช้งาน (Log Access Event) ทั้ง LocalStorage และ Firebase Firestore
async function logAccessEvent(eventType, studentObj = null, extraData = {}) {
  const logEntry = {
    id: "log_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    timestamp: new Date().toISOString(),
    eventType: eventType, // LOGIN, STAGE_COMPLETE, SCORE_UPDATE, ADMIN_LOGIN
    studentId: studentObj?.studentId || "GUEST",
    studentName: studentObj?.fullName ? (studentObj.prefix || '') + studentObj.fullName : "แขกผู้เยี่ยมชม",
    classRoom: studentObj?.grade ? `${studentObj.grade}/${studentObj.room}` : "-",
    number: studentObj?.studentId || "-",
    score: studentObj?.score || 0,
    currentStage: studentObj?.currentStage || 1,
    details: extraData
  };

  // 1. เซฟลง LocalStorage
  let logs = getAccessLogsLocal();
  logs.unshift(logEntry); // เอาเหตุการณ์ล่าสุดไว้บนสุด
  if (logs.length > 500) logs = logs.slice(0, 500); // จำกัดไม่เกิน 500 รายการ
  localStorage.setItem(STORAGE_KEYS.ACCESS_LOGS, JSON.stringify(logs));

  // 2. Sync ไปยัง Firebase Firestore (Collection: access_logs)
  if (firestoreDb) {
    try {
      await firestoreDb.collection("access_logs").doc(logEntry.id).set(logEntry);
      console.log("📌 Access Log synced to Firebase (games-thai):", eventType, logEntry.studentId);
    } catch (e) {
      console.warn("Failed to sync log to Firebase", e);
    }
  }
}

// บันทึกข้อมูลนักเรียนลง LocalStorage และ Sync ไปยัง Firebase (Collection: students)
async function saveStudentData(studentObj) {
  if (!studentObj || !studentObj.studentId) return;

  // 1. บันทึกเป็น Current Student
  localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, JSON.stringify(studentObj));

  // 2. อัปเดตใน All Students Array
  let allStudents = getAllStudentsLocal();
  const index = allStudents.findIndex(s => s.studentId === studentObj.studentId);
  const now = new Date().toISOString();

  if (index >= 0) {
    allStudents[index] = { ...allStudents[index], ...studentObj, lastUpdated: now };
  } else {
    allStudents.push({ ...studentObj, createdTime: now, lastUpdated: now });
  }
  localStorage.setItem(STORAGE_KEYS.ALL_STUDENTS, JSON.stringify(allStudents));

  // 3. Sync ไป Firebase (Collection: students)
  if (firestoreDb) {
    try {
      await firestoreDb.collection("students").doc(studentObj.studentId).set({
        ...studentObj,
        lastUpdated: now
      }, { merge: true });
      console.log("☁️ Student synced to Firebase (games-thai):", studentObj.studentId);
    } catch (e) {
      console.warn("Failed to sync student to Firebase, saved locally", e);
    }
  }
}

// ลบข้อมูลนักเรียน
async function deleteStudentData(studentId) {
  let allStudents = getAllStudentsLocal();
  allStudents = allStudents.filter(s => s.studentId !== studentId);
  localStorage.setItem(STORAGE_KEYS.ALL_STUDENTS, JSON.stringify(allStudents));

  const current = getCurrentStudentLocal();
  if (current && current.studentId === studentId) {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_STUDENT);
  }

  if (firestoreDb && studentId) {
    try {
      await firestoreDb.collection("students").doc(studentId).delete();
      console.log("Deleted from Firebase:", studentId);
    } catch (e) {
      console.warn("Failed to delete from Firebase", e);
    }
  }
}

// ดึงนักเรียนคนปัจจุบัน
function getCurrentStudentLocal() {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  }
  return null;
}

// ดึงรายชื่อนักเรียนทั้งหมด (รวมทั้ง Local & Firebase)
async function fetchAllStudents() {
  let localData = getAllStudentsLocal();
  if (firestoreDb) {
    try {
      const snapshot = await firestoreDb.collection("students").get();
      const firebaseData = [];
      snapshot.forEach(doc => {
        firebaseData.push(doc.data());
      });
      if (firebaseData.length > 0) {
        const map = new Map();
        localData.forEach(s => map.set(s.studentId, s));
        firebaseData.forEach(s => map.set(s.studentId, s));
        const merged = Array.from(map.values());
        localStorage.setItem(STORAGE_KEYS.ALL_STUDENTS, JSON.stringify(merged));
        return merged;
      }
    } catch (e) {
      console.warn("Error fetching from Firebase, returning local data", e);
    }
  }
  return localData;
}

// ดึงประวัติ Access Logs ทั้งหมด (รวม Local & Firebase)
async function fetchAllAccessLogs() {
  let localLogs = getAccessLogsLocal();
  if (firestoreDb) {
    try {
      const snapshot = await firestoreDb.collection("access_logs").orderBy("timestamp", "desc").limit(200).get();
      const firebaseLogs = [];
      snapshot.forEach(doc => {
        firebaseLogs.push(doc.data());
      });
      if (firebaseLogs.length > 0) {
        const map = new Map();
        localLogs.forEach(l => map.set(l.id, l));
        firebaseLogs.forEach(l => map.set(l.id, l));
        const merged = Array.from(map.values()).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        localStorage.setItem(STORAGE_KEYS.ACCESS_LOGS, JSON.stringify(merged));
        return merged;
      }
    } catch (e) {
      console.warn("Error fetching access logs from Firebase, returning local data", e);
    }
  }
  return localLogs;
}

// เรียกใช้เมื่อโหลดไฟล์
initFirebase();
