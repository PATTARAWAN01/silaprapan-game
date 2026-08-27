/**
 * data.js - คลังข้อมูลเนื้อหาการเรียนรู้ ข้อสอบ และผังฉันทลักษณ์ (อัปเดตตำแหน่ง เอก โท และการโยงเส้นฉาก โคลงสี่สุภาพ 100%)
 */

const KNOWLEDGE_DATA = [
  {
    id: "general",
    title: "1. ความรู้ทั่วไปเกี่ยวกับการแต่งคำประพันธ์",
    icon: "fa-book-open",
    content: `
      <h3 class="text-xl font-bold text-amber-800 mb-3">คำประพันธ์คืออะไร?</h3>
      <p class="mb-4 text-gray-700 leading-relaxed">
        <strong>คำประพันธ์</strong> คือ การนำถ้อยคำมาเรียบเรียงให้เป็นระเบียบตามรูปแบบที่กำหนดไว้ให้มีสัมผัสที่ไพเราะ เช่น โคลง ฉันท์ กาพย์ กลอน เป็นต้น ซึ่งแต่ละชนิดมีรูปแบบและวิธีการประพันธ์ที่แตกต่างกัน
      </p>
      
      <h3 class="text-lg font-bold text-amber-800 mb-2">วิธีการแต่งคำประพันธ์ (5 ขั้นตอน)</h3>
      <ul class="list-disc list-inside mb-4 text-gray-700 space-y-1 font-bold">
        <li>กำหนดหัวข้อเรื่องที่จะนำมาแต่งคำประพันธ์</li>
        <li>กำหนดชนิด รูปแบบของคำประพันธ์ว่าจะแต่งในรูปแบบใด</li>
        <li>กำหนดโครงเรื่อง พร้อมตั้งชื่อเรื่อง</li>
        <li>แต่งคำประพันธ์ตามโครงเรื่องที่ได้วางไว้และให้เนื้อหาสอดคล้องกับชื่อเรื่องที่ตั้งไว้</li>
        <li>อ่านทบทวนคำประพันธ์ที่แต่งเสร็จแล้วอีกครั้งหนึ่งหากพบข้อผิดพลาดให้รีบแก้ไข</li>
      </ul>

      <h3 class="text-lg font-bold text-amber-800 mb-2">ลักษณะของคำประพันธ์ที่ดี</h3>
      <ol class="list-decimal list-inside mb-4 text-gray-700 space-y-1">
        <li>รูปแบบถูกต้องตามลักษณะบังคับของแต่ละชนิด</li>
        <li>มีการใช้ข้อความหรือถ้อยคำที่ดี</li>
        <li>มีสัมผัสที่ดีเกิดความไพเราะ</li>
      </ol>

      <h3 class="text-lg font-bold text-amber-800 mb-2">สัมผัสสระ VS สัมผัสอักษร / สัมผัสนอก VS สัมผัสใน</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
        <div class="p-3 bg-amber-100/70 rounded-xl border border-amber-300">
          <strong class="text-amber-900">สัมผัสสระ:</strong> ใช้สระและมาตราตัวสะกดเดียวกัน
        </div>
        <div class="p-3 bg-amber-100/70 rounded-xl border border-amber-300">
          <strong class="text-amber-900">สัมผัสอักษร:</strong> ใช้เสียงพยัญชนะต้นเดียวกัน
        </div>
        <div class="p-3 bg-amber-100/70 rounded-xl border border-amber-300">
          <strong class="text-amber-900">สัมผัสนอก:</strong> สัมผัสต่างวรรค บังคับเฉพาะสัมผัสสระเท่านั้น
        </div>
        <div class="p-3 bg-amber-100/70 rounded-xl border border-amber-300">
          <strong class="text-amber-900">สัมผัสใน:</strong> สัมผัสในวรรคเดียวกัน ไม่บังคับ (สัมผัสสระหรือพยัญชนะก็ได้)
        </div>
      </div>
    `
  },
  {
    id: "kap",
    title: "2. การแต่งกาพย์ (กาพย์ยานี 11)",
    icon: "fa-feather",
    content: `
      <h3 class="text-xl font-bold text-emerald-800 mb-3">ผังผูกพันฉันทลักษณ์ กาพย์ยานี 11</h3>
      <p class="mb-3 text-gray-700 leading-relaxed">
        <strong>กาพย์ยานี 11</strong> 1 บทมี 2 บาท 4 วรรค วรรคหน้า 5 คำ วรรคหลัง 6 คำ ("วรรคหน้ามีห้าคำ วรรคหลังจำไว้มีหก")
      </p>

      <div class="my-4 p-4 bg-white rounded-2xl border-2 border-emerald-300 shadow-md flex flex-col items-center">
        <img src="img/kap11.png" alt="ผังกาพย์ยานี 11" class="max-w-full h-auto rounded-xl shadow-sm my-2" />
        <p class="text-xs text-emerald-900 font-bold mt-2 text-center">สัมผัสบังคับ: คำสุดท้ายวรรค 1 สัมผัสคำที่ 3 วรรค 2 | คำสุดท้ายวรรค 2 สัมผัสคำสุดท้ายวรรค 3</p>
      </div>

      <div class="overflow-x-auto mb-4">
        <table class="w-full text-sm text-left text-gray-700 border border-emerald-200">
          <thead class="text-xs text-emerald-900 bg-emerald-100 uppercase font-bold">
            <tr>
              <th class="px-3 py-2 border">ชนิดกาพย์</th>
              <th class="px-3 py-2 border">คณะ (บท/บาท/วรรค)</th>
              <th class="px-3 py-2 border">พยางค์หรือคำ</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white border-b">
              <td class="px-3 py-2 border font-bold">กาพย์ยานี 11</td>
              <td class="px-3 py-2 border">บทหนึ่งมี 2 บาท บาทหนึ่งมี 2 วรรค (4 วรรค)</td>
              <td class="px-3 py-2 border">วรรคหน้า 5 คำ วรรคหลัง 6 คำ</td>
            </tr>
            <tr class="bg-emerald-50/50 border-b">
              <td class="px-3 py-2 border font-bold">กาพย์ฉบัง 16</td>
              <td class="px-3 py-2 border">บทหนึ่งมี 16 คำ 3 วรรค</td>
              <td class="px-3 py-2 border">วรรคแรก 6 คำ วรรคสอง 4 คำ วรรคสาม 6 คำ</td>
            </tr>
            <tr class="bg-white border-b">
              <td class="px-3 py-2 border font-bold">กาพย์สุรางคนางค์ 28</td>
              <td class="px-3 py-2 border">บทหนึ่งมี 28 คำ 7 วรรค</td>
              <td class="px-3 py-2 border">แต่ละวรรคมี 4 คำ</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  },
  {
    id: "khlong",
    title: "3. การแต่งโคลง (โคลงสี่สุภาพ)",
    icon: "fa-scroll",
    content: `
      <h3 class="text-xl font-bold text-indigo-800 mb-3">ผังผูกพันฉันทลักษณ์ โคลงสี่สุภาพ</h3>
      <p class="mb-3 text-gray-700 leading-relaxed">
        <strong>โคลงสี่สุภาพ</strong> 1 บทมี 4 บาท บังคับ <strong>คำเอก 7 แห่ง</strong> และ <strong>คำโท 4 แห่ง</strong> (มีสร้อยคำในบาท 1 และ 3)
      </p>

      <div class="my-4 p-4 bg-white rounded-2xl border-2 border-indigo-300 shadow-md flex flex-col items-center">
        <img src="img/khlong4.png" alt="ผังโคลงสี่สุภาพ" class="max-w-full h-auto rounded-xl shadow-sm my-2" />
        <p class="text-xs text-indigo-900 font-bold mt-2 text-center">บังคับคำเอก 7 แห่ง คำโท 4 แห่ง | สัมผัสคำท้ายบาท 1 ➔ คำที่ 5 บาท 2 และ บาท 3 | คำท้ายบาท 2 ➔ คำที่ 5 บาท 4</p>
      </div>
    `
  },
  {
    id: "klon",
    title: "4. การแต่งกลอน (กลอนแปด / กลอนสุภาพ)",
    icon: "fa-pen-nib",
    content: `
      <h3 class="text-xl font-bold text-rose-800 mb-3">ผังผูกพันฉันทลักษณ์ กลอนแปด</h3>
      <p class="mb-3 text-gray-700 leading-relaxed">
        <strong>กลอนแปด</strong> 1 บทมี 2 บาท 4 วรรค (สดับ, รับ, รอง, ส่ง)
      </p>

      <div class="my-4 p-4 bg-white rounded-2xl border-2 border-rose-300 shadow-md flex flex-col items-center">
        <img src="img/klon8.jpg" alt="ผังกลอนแปด" class="max-w-full h-auto rounded-xl shadow-sm my-2" />
        <p class="text-xs text-rose-900 font-bold mt-2 text-center">สัมผัสบังคับ: คำท้ายวรรคสดับ ➔ คำที่ 3 วรรครับ | คำท้ายวรรครับ ➔ คำท้ายวรรครอง | คำท้ายวรรครอง ➔ คำที่ 3 วรรคส่ง</p>
      </div>
    `
  },
  {
    id: "chan",
    title: "5. การแต่งฉันท์ (อินทรวิเชียรฉันท์ 11)",
    icon: "fa-crown",
    content: `
      <h3 class="text-xl font-bold text-purple-800 mb-3">ผังผูกพัน อินทรวิเชียรฉันท์ 11</h3>
      <p class="mb-3 text-gray-700 leading-relaxed">
        บังคับคำ <strong>ครุ ( ั )</strong> เสียงหนัก และ <strong>ลหุ ( ุ )</strong> เสียงเบา
      </p>

      <div class="my-4 p-4 bg-white rounded-2xl border-2 border-purple-300 shadow-md flex flex-col items-center">
        <img src="img/inthanawichian11.png" alt="ผังอินทรวิเชียรฉันท์ 11" class="max-w-full h-auto rounded-xl shadow-sm my-2" />
        <p class="text-xs text-purple-900 font-bold mt-2 text-center">สัมผัสบังคับ: คำสุดท้ายวรรค 1 สัมผัสคำที่ 3 วรรค 2 | คำสุดท้ายวรรค 2 สัมผัสคำสุดท้ายวรรค 3</p>
      </div>
    `
  }
];

const STAGE1_QUESTIONS = [
  {
    id: 1,
    question: "1. ข้อใดอธิบายความหมายของ 'คำประพันธ์' ได้ถูกต้องที่สุด",
    options: [
      "การนำคำมาเรียงกันโดยไม่จำเป็นต้องมีรูปแบบ",
      "การนำถ้อยคำมาเรียบเรียงตามรูปแบบที่กำหนดและมีสัมผัสที่ไพเราะ",
      "การนำเรื่องราวมาเขียนเป็นความเรียงให้มีเนื้อหายาว",
      "การนำคำศัพท์ยาก ๆ มาเรียบเรียงเป็นประโยค"
    ],
    answer: 1,
    explanation: "การนำถ้อยคำมาเรียบเรียงตามรูปแบบที่กำหนดและมีสัมผัสที่ไพเราะ"
  },
  {
    id: 2,
    question: "2. ข้อใดกล่าวถึง 'การแต่งคำประพันธ์' ได้ถูกต้อง",
    options: [
      "การนำคำมาเรียบเรียงเป็นบทร้อยแก้วตามความต้องการ",
      "การนำคำมาเรียบเรียงเป็นบทร้อยกรองตามรูปแบบที่กำหนด",
      "การนำคำมาเขียนเป็นเรื่องสั้นโดยไม่มีข้อบังคับ",
      "การนำคำที่มีความหมายเหมือนกันมาเรียงต่อกัน"
    ],
    answer: 1,
    explanation: "การนำคำมาเรียบเรียงเป็นบทร้อยกรองตามรูปแบบที่กำหนด"
  },
  {
    id: 3,
    question: "3. หากนักเรียนต้องการแต่งคำประพันธ์เกี่ยวกับ 'การอนุรักษ์สิ่งแวดล้อม' ขั้นตอนแรกควรทำสิ่งใด",
    options: [
      "แต่งคำประพันธ์ทันที",
      "กำหนดจำนวนบทก่อน",
      "กำหนดหัวข้อเรื่องที่จะนำมาแต่ง",
      "อ่านทบทวนคำประพันธ์ที่แต่งเสร็จแล้ว"
    ],
    answer: 2,
    explanation: "ขั้นตอนแรกของการแต่งคำประพันธ์คือกำหนดหัวข้อเรื่องที่จะนำมาแต่ง"
  },
  {
    id: 4,
    question: "4. ข้อใดเรียงลำดับวิธีการแต่งคำประพันธ์ได้เหมาะสมที่สุด",
    options: [
      "กำหนดหัวข้อ ➔ กำหนดชนิดคำประพันธ์ ➔ กำหนดโครงเรื่อง ➔ แต่ง ➔ ทบทวนแก้ไข",
      "กำหนดโครงเรื่อง ➔ แต่ง ➔ กำหนดหัวข้อ ➔ ทบทวน ➔ กำหนดชนิดคำประพันธ์",
      "แต่ง ➔ กำหนดหัวข้อ ➔ กำหนดชนิดคำประพันธ์ ➔ ทบทวน ➔ กำหนดโครงเรื่อง",
      "กำหนดชนิดคำประพันธ์ ➔ แต่ง ➔ กำหนดหัวข้อ ➔ กำหนดโครงเรื่อง ➔ ทบทวน"
    ],
    answer: 0,
    explanation: "ลำดับที่ถูกต้อง: กำหนดหัวข้อ ➔ กำหนดชนิดคำประพันธ์ ➔ กำหนดโครงเรื่อง ➔ แต่ง ➔ ทบทวนแก้ไข"
  },
  {
    id: 5,
    question: "5. หากแต่งคำประพันธ์เสร็จแล้วพบว่าจำนวนคำและสัมผัสไม่ตรงตามข้อบังคับ ควรดำเนินการอย่างไร",
    options: [
      "ปล่อยไว้เพราะเนื้อหาสำคัญกว่า",
      "เปลี่ยนชื่อเรื่องเพื่อให้เข้ากับบทประพันธ์",
      "อ่านทบทวนและแก้ไขข้อผิดพลาดให้ถูกต้อง",
      "ตัดบทที่มีข้อผิดพลาดออกทั้งหมด"
    ],
    answer: 2,
    explanation: "อ่านทบทวนและแก้ไขข้อผิดพลาดให้ถูกต้อง"
  },
  {
    id: 6,
    question: "6. ข้อใด ไม่ใช่ ลักษณะของคำประพันธ์ที่ดี",
    options: [
      "มีรูปแบบถูกต้องตามลักษณะบังคับ",
      "มีการใช้ข้อความหรือถ้อยคำที่ดี",
      "มีสัมผัสที่ทำให้เกิดความไพเพราะ",
      "ใช้คำศัพท์ยากและซับซ้อนมากที่สุด"
    ],
    answer: 3,
    explanation: "คำประพันธ์ที่ดีไม่จำเป็นต้องใช้คำศัพท์ยากและซับซ้อนมากที่สุด"
  },
  {
    id: 7,
    question: "7. ข้อใดกล่าวถึง 'สัมผัสสระ' ได้ถูกต้อง",
    options: [
      "การใช้พยัญชนะต้นเหมือนกันโดยไม่สนใจเสียงสระ",
      "การใช้คำที่มีเสียงสระเหมือนกันและเป็นไปตามหลักของสัมผัส",
      "การใช้คำที่มีความหมายเหมือนกันมาเรียงกัน",
      "การใช้คำที่มีวรรณยุกต์เหมือนกันทุกคำ"
    ],
    answer: 1,
    explanation: "สัมผัสสระ คือ การใช้คำที่มีเสียงสระและตัวสะกดมาตราเดียวกัน"
  },
  {
    id: 8,
    question: "8. ข้อใดเป็นลักษณะสำคัญของ 'สัมผัสพยัญชนะ'",
    options: [
      "ใช้พยัญชนะต้นตัวเดียวกันหรือเสียงเดียวกัน",
      "ใช้สระเดียวกันและตัวสะกดมาตราเดียวกัน",
      "ใช้คำที่อยู่ท้ายวรรคเท่านั้น",
      "ใช้คำที่มีความหมายตรงข้ามกัน"
    ],
    answer: 0,
    explanation: "สัมผัสพยัญชนะ (สัมผัสอักษร) คือการใช้พยัญชนะต้นตัวเดียวกันหรือเสียงเดียวกัน"
  },
  {
    id: 9,
    question: "9. ข้อใดอธิบายความแตกต่างระหว่าง 'สัมผัสนอก' และ 'สัมผัสใน' ได้ถูกต้องที่สุด",
    options: [
      "สัมผัสนอกเป็นสัมผัสบังคับ ส่วนสัมผัสในเป็นสัมผัสที่เพิ่มเพื่อความไพเราะ",
      "สัมผัสนอกใช้เฉพาะสัมผัสพยัญชนะ ส่วนสัมผัสในใช้เฉพาะสัมผัสสระ",
      "สัมผัสนอกอยู่ในวรรคเดียวกัน ส่วนสัมผัสในอยู่ระหว่างบท",
      "สัมผัสนอกไม่จำเป็นต้องมี แต่สัมผัสในเป็นข้อบังคับ"
    ],
    answer: 0,
    explanation: "สัมผัสนอกเป็นสัมผัสบังคับระหว่างวรรค ส่วนสัมผัสในเป็นสัมผัสในวรรคเพื่อเพิ่มความไพเราะ"
  },
  {
    id: 10,
    question: "10. เพราะเหตุใด 'สัมผัสนอก' จึงมีความสำคัญต่อคำประพันธ์",
    options: [
      "เพราะช่วยกำหนดความยาวของเรื่อง",
      "เพราะเป็นสัมผัสบังคับ หากไม่เป็นไปตามฉันทลักษณ์ถือว่าผิด",
      "เพราะทำให้คำประพันธ์มีเนื้อหามากขึ้น",
      "เพราะช่วยให้สามารถใช้คำซ้ำได้ทุกตำแหน่ง"
    ],
    answer: 1,
    explanation: "เพราะสัมผัสนอกเป็นสัมผัสบังคับ หากไม่ถูกต้องถือว่าผิดฉันทลักษณ์"
  },
  {
    id: 11,
    question: "11. 'ฉันทลักษณ์' หมายถึงข้อใด",
    options: [
      "ศิลปะการเลือกใช้คำให้มีความหมาย",
      "ตำราว่าด้วยคำประพันธ์หรือลักษณะบังคับของคำประพันธ์",
      "การกำหนดหัวข้อในการแต่งคำประพันธ์",
      "การตรวจสอบความถูกต้องของตัวสะกด"
    ],
    answer: 1,
    explanation: "ตำราว่าด้วยคำประพันธ์หรือลักษณะบังคับของคำประพันธ์"
  },
  {
    id: 12,
    question: "12. ข้อใดเป็น 'ลักษณะบังคับร่วม' ของคำประพันธ์",
    options: [
      "คำเอกและคำโท",
      "คำครุและคำลหุ",
      "คณะและสัมผัส",
      "คำเป็นและคำตาย"
    ],
    answer: 2,
    explanation: "คณะและสัมผัส เป็นลักษณะบังคับร่วมที่คำประพันธ์ทุกชนิดต้องมี"
  },
  {
    id: 13,
    question: "13. ข้อใดกล่าวถึง 'วรรค' ได้ถูกต้อง",
    options: [
      "ส่วนย่อยของบท",
      "ส่วนย่อยของบาท",
      "คำประพันธ์ตอนหนึ่ง ๆ",
      "การกำหนดจำนวนคำในบทประพันธ์"
    ],
    answer: 2,
    explanation: "วรรค หมายถึง คำประพันธ์ตอนหนึ่ง ๆ"
  },
  {
    id: 14,
    question: "14. หากกล่าวว่า 'โคลงสี่สุภาพ 1 บาท มี 2 วรรค' ข้อความนี้แสดงความสัมพันธ์ของข้อใด",
    options: [
      "คำกับวรรค",
      "วรรคกับบาท",
      "บาทกับบท",
      "คณะกับสัมผัส"
    ],
    answer: 1,
    explanation: "ข้อความแสดงความสัมพันธ์ระหว่าง วรรคกับบาท"
  },
  {
    id: 15,
    question: "15. ข้อใดอธิบายคำว่า 'คณะ' ในการแต่งคำประพันธ์ได้ถูกต้องที่สุด",
    options: [
      "การกำหนดหัวข้อและเนื้อหาของคำประพันธ์",
      "การกำหนดเสียงวรรณยุกต์ของคำทุกคำ",
      "การกำหนดตำแหน่งของสัมผัสพยัญชนะ",
      "การกำหนดจำนวนคำในวรรค บาท หรือบทของคำประพันธ์"
    ],
    answer: 3,
    explanation: "คณะ คือการกำหนดจำนวนคำในวรรค บาท หรือบทของคำประพันธ์"
  }
];

// ข้อสอบด่าน 2 (โคลงสี่สุภาพ 1 บท 4 บาท ตรงตามต้นฉบับฝั่งซ้าย 100%)
const STAGE2_DIAGRAMS = [
  {
    id: "kap_11",
    title: "ข้อที่ 1: กาพย์ยานี 11 (จำนวน 2 บท - ตรงตามต้นฉบับ 100%)",
    subtitle: "ลากเส้นตรงฉากเชื่อมจุดสัมผัสบังคับของ กาพย์ยานี 11 (2 บท 8 วรรค 5 เส้นบังคับ) ให้ถูกต้องตามผัง",
    type: "กาพย์ยานี 11",
    syllables: [
      // บทที่ 1 บาทที่ 1 (วรรค 1: 5 คำ, วรรค 2: 6 คำ)
      { id: "w1_1", text: "", x: 48, y: 30, lahokhu: "normal" },
      { id: "w1_2", text: "", x: 76, y: 30, lahokhu: "normal" },
      { id: "w1_3", text: "", x: 104, y: 30, lahokhu: "normal" },
      { id: "w1_4", text: "", x: 132, y: 30, lahokhu: "normal" },
      { id: "w1_5", text: "", x: 160, y: 30, lahokhu: "target" },

      { id: "w2_1", text: "", x: 290, y: 30, lahokhu: "normal" },
      { id: "w2_2", text: "", x: 318, y: 30, lahokhu: "normal" },
      { id: "w2_3", text: "", x: 346, y: 30, lahokhu: "target" },
      { id: "w2_4", text: "", x: 374, y: 30, lahokhu: "normal" },
      { id: "w2_5", text: "", x: 402, y: 30, lahokhu: "normal" },
      { id: "w2_6", text: "", x: 430, y: 30, lahokhu: "target" },

      // บทที่ 1 บาทที่ 2 (วรรค 3: 5 คำ, วรรค 4: 6 คำ)
      { id: "w3_1", text: "", x: 20, y: 80, lahokhu: "normal" },
      { id: "w3_2", text: "", x: 48, y: 80, lahokhu: "normal" },
      { id: "w3_3", text: "", x: 76, y: 80, lahokhu: "normal" },
      { id: "w3_4", text: "", x: 104, y: 80, lahokhu: "normal" },
      { id: "w3_5", text: "", x: 132, y: 80, lahokhu: "target" },

      { id: "w4_1", text: "", x: 290, y: 80, lahokhu: "normal" },
      { id: "w4_2", text: "", x: 318, y: 80, lahokhu: "normal" },
      { id: "w4_3", text: "", x: 346, y: 80, lahokhu: "normal" },
      { id: "w4_4", text: "", x: 374, y: 80, lahokhu: "normal" },
      { id: "w4_5", text: "", x: 402, y: 80, lahokhu: "normal" },
      { id: "w4_6", text: "", x: 430, y: 80, lahokhu: "target" },

      // บทที่ 2 บาทที่ 1 (วรรค 5: 5 คำ, วรรค 6: 6 คำ)
      { id: "w5_1", text: "", x: 48, y: 130, lahokhu: "normal" },
      { id: "w5_2", text: "", x: 76, y: 130, lahokhu: "normal" },
      { id: "w5_3", text: "", x: 104, y: 130, lahokhu: "normal" },
      { id: "w5_4", text: "", x: 132, y: 130, lahokhu: "normal" },
      { id: "w5_5", text: "", x: 160, y: 130, lahokhu: "target" },

      { id: "w6_1", text: "", x: 290, y: 130, lahokhu: "normal" },
      { id: "w6_2", text: "", x: 318, y: 130, lahokhu: "normal" },
      { id: "w6_3", text: "", x: 346, y: 130, lahokhu: "target" },
      { id: "w6_4", text: "", x: 374, y: 130, lahokhu: "normal" },
      { id: "w6_5", text: "", x: 402, y: 130, lahokhu: "normal" },
      { id: "w6_6", text: "", x: 430, y: 130, lahokhu: "target" },

      // บทที่ 2 บาทที่ 2 (วรรค 7: 5 คำ, วรรค 8: 6 คำ)
      { id: "w7_1", text: "", x: 20, y: 180, lahokhu: "normal" },
      { id: "w7_2", text: "", x: 48, y: 180, lahokhu: "normal" },
      { id: "w7_3", text: "", x: 76, y: 180, lahokhu: "normal" },
      { id: "w7_4", text: "", x: 104, y: 180, lahokhu: "normal" },
      { id: "w7_5", text: "", x: 132, y: 180, lahokhu: "target" },

      { id: "w8_1", text: "", x: 290, y: 180, lahokhu: "normal" },
      { id: "w8_2", text: "", x: 318, y: 180, lahokhu: "normal" },
      { id: "w8_3", text: "", x: 346, y: 180, lahokhu: "normal" },
      { id: "w8_4", text: "", x: 374, y: 180, lahokhu: "normal" },
      { id: "w8_5", text: "", x: 402, y: 180, lahokhu: "normal" },
      { id: "w8_6", text: "", x: 430, y: 180, lahokhu: "normal" }
    ],
    correctConnections: [
      { from: "w1_5", to: "w2_3", altTo: ["w2_1", "w2_2", "w2_3"] },
      { from: "w2_6", to: "w3_5" },
      { from: "w4_6", to: "w6_6", altTo: ["w4_6", "w6_6", "w5_5"], isInterStanza: true },
      { from: "w5_5", to: "w6_3", altTo: ["w6_1", "w6_2", "w6_3"] },
      { from: "w6_6", to: "w7_5" }
    ]
  },
  {
    id: "khlong_4",
    title: "ข้อที่ 2: โคลงสี่สุภาพ (จำนวน 1 บท 4 บาท - ตรงตามต้นฉบับ 100%)",
    subtitle: "ลากเส้นตรงฉากเชื่อมจุดสัมผัสบังคับของ โคลงสี่สุภาพ (สังเกตตำแหน่ง เอก โท และคำสร้อยในวงเล็บ)",
    type: "โคลงสี่สุภาพ",
    hasParentheses: true,
    syllables: [
      // บาท 1 (ย่อหน้าเริ่ม x=48)
      { id: "k1_1", text: "", x: 48, y: 35, lahokhu: "normal" },
      { id: "k1_2", text: "", x: 76, y: 35, lahokhu: "normal" },
      { id: "k1_3", text: "", x: 104, y: 35, lahokhu: "normal" },
      { id: "k1_4", text: "", x: 132, y: 35, lahokhu: "ek" },
      { id: "k1_5", text: "", x: 160, y: 35, lahokhu: "tho" },
      { id: "k1_6", text: "", x: 290, y: 35, lahokhu: "normal" },
      { id: "k1_7", text: "", x: 318, y: 35, lahokhu: "target" },
      { id: "k1_8", text: "", x: 366, y: 35, lahokhu: "normal", inParens: "left" },
      { id: "k1_9", text: "", x: 394, y: 35, lahokhu: "normal", inParens: "right" },

      // บาท 2 (ชิดซ้าย x=20)
      { id: "k2_1", text: "", x: 20, y: 85, lahokhu: "normal" },
      { id: "k2_2", text: "", x: 48, y: 85, lahokhu: "ek" },
      { id: "k2_3", text: "", x: 76, y: 85, lahokhu: "normal" },
      { id: "k2_4", text: "", x: 104, y: 85, lahokhu: "normal" },
      { id: "k2_5", text: "", x: 132, y: 85, lahokhu: "ek_target" },
      { id: "k2_6", text: "", x: 290, y: 85, lahokhu: "tho" },
      { id: "k2_7", text: "", x: 318, y: 85, lahokhu: "target" },

      // บาท 3 (ย่อหน้าเริ่ม x=48)
      { id: "k3_1", text: "", x: 48, y: 135, lahokhu: "normal" },
      { id: "k3_2", text: "", x: 76, y: 135, lahokhu: "normal" },
      { id: "k3_3", text: "", x: 104, y: 135, lahokhu: "ek" },
      { id: "k3_4", text: "", x: 132, y: 135, lahokhu: "normal" },
      { id: "k3_5", text: "", x: 160, y: 135, lahokhu: "tho_target" },
      { id: "k3_6", text: "", x: 290, y: 135, lahokhu: "ek" },
      { id: "k3_7", text: "", x: 318, y: 135, lahokhu: "normal" },
      { id: "k3_8", text: "", x: 366, y: 135, lahokhu: "normal", inParens: "left" },
      { id: "k3_9", text: "", x: 394, y: 135, lahokhu: "normal", inParens: "right" },

      // บาท 4 (ชิดซ้าย x=20)
      { id: "k4_1", text: "", x: 20, y: 185, lahokhu: "normal" },
      { id: "k4_2", text: "", x: 48, y: 185, lahokhu: "ek" },
      { id: "k4_3", text: "", x: 76, y: 185, lahokhu: "normal" },
      { id: "k4_4", text: "", x: 104, y: 185, lahokhu: "normal" },
      { id: "k4_5", text: "", x: 132, y: 185, lahokhu: "tho_target" },
      { id: "k4_6", text: "", x: 290, y: 185, lahokhu: "ek" },
      { id: "k4_7", text: "", x: 318, y: 185, lahokhu: "tho" },
      { id: "k4_8", text: "", x: 346, y: 185, lahokhu: "normal" },
      { id: "k4_9", text: "", x: 374, y: 185, lahokhu: "normal" }
    ],
    correctConnections: [
      { from: "k1_7", to: "k2_5", altTo: ["k2_5", "k3_5"] },
      { from: "k1_7", to: "k3_5", altTo: ["k2_5", "k3_5"] },
      { from: "k2_7", to: "k4_5" }
    ]
  },
  {
    id: "klon_8",
    title: "ข้อที่ 3: กลอนแปด (จำนวน 2 บท - ย่อหน้าบรรทัดตรงตามต้นฉบับ 100%)",
    subtitle: "ลากเส้นตรงฉากเชื่อมจุดสัมผัสบังคับของ กลอนแปด (2 บท 8 วรรค) ให้ถูกต้องตามผัง",
    type: "กลอนแปด",
    syllables: [
      // บทที่ 1 วรรค 1 (8 คำ - ย่อหน้าเริ่มที่ x=48)
      { id: "g1_1", text: "", x: 48, y: 30, lahokhu: "normal" },
      { id: "g1_2", text: "", x: 76, y: 30, lahokhu: "normal" },
      { id: "g1_3", text: "", x: 104, y: 30, lahokhu: "normal" },
      { id: "g1_4", text: "", x: 132, y: 30, lahokhu: "normal" },
      { id: "g1_5", text: "", x: 160, y: 30, lahokhu: "normal" },
      { id: "g1_6", text: "", x: 188, y: 30, lahokhu: "normal" },
      { id: "g1_7", text: "", x: 216, y: 30, lahokhu: "normal" },
      { id: "g1_8", text: "", x: 244, y: 30, lahokhu: "target" },

      // บทที่ 1 วรรครับ (8 คำ)
      { id: "g2_1", text: "", x: 300, y: 30, lahokhu: "normal" },
      { id: "g2_2", text: "", x: 328, y: 30, lahokhu: "normal" },
      { id: "g2_3", text: "", x: 356, y: 30, lahokhu: "target" },
      { id: "g2_4", text: "", x: 384, y: 30, lahokhu: "normal" },
      { id: "g2_5", text: "", x: 412, y: 30, lahokhu: "normal" },
      { id: "g2_6", text: "", x: 440, y: 30, lahokhu: "normal" },
      { id: "g2_7", text: "", x: 468, y: 30, lahokhu: "normal" },
      { id: "g2_8", text: "", x: 496, y: 30, lahokhu: "target" },

      // บทที่ 1 วรรครอง (8 คำ - เริ่มต้นชิดซ้าย x=20)
      { id: "g3_1", text: "", x: 20, y: 80, lahokhu: "normal" },
      { id: "g3_2", text: "", x: 48, y: 80, lahokhu: "normal" },
      { id: "g3_3", text: "", x: 76, y: 80, lahokhu: "normal" },
      { id: "g3_4", text: "", x: 104, y: 80, lahokhu: "normal" },
      { id: "g3_5", text: "", x: 132, y: 80, lahokhu: "normal" },
      { id: "g3_6", text: "", x: 160, y: 80, lahokhu: "normal" },
      { id: "g3_7", text: "", x: 188, y: 80, lahokhu: "normal" },
      { id: "g3_8", text: "", x: 216, y: 80, lahokhu: "target" },

      // บทที่ 1 วรรคส่ง (8 คำ)
      { id: "g4_1", text: "", x: 300, y: 80, lahokhu: "normal" },
      { id: "g4_2", text: "", x: 328, y: 80, lahokhu: "normal" },
      { id: "g4_3", text: "", x: 356, y: 80, lahokhu: "target" },
      { id: "g4_4", text: "", x: 384, y: 80, lahokhu: "normal" },
      { id: "g4_5", text: "", x: 412, y: 80, lahokhu: "normal" },
      { id: "g4_6", text: "", x: 440, y: 80, lahokhu: "normal" },
      { id: "g4_7", text: "", x: 468, y: 80, lahokhu: "normal" },
      { id: "g4_8", text: "", x: 496, y: 80, lahokhu: "target" },

      // บทที่ 2 วรรคสดับ (8 คำ - ย่อหน้าเริ่มที่ x=48)
      { id: "g5_1", text: "", x: 48, y: 130, lahokhu: "normal" },
      { id: "g5_2", text: "", x: 76, y: 130, lahokhu: "normal" },
      { id: "g5_3", text: "", x: 104, y: 130, lahokhu: "normal" },
      { id: "g5_4", text: "", x: 132, y: 130, lahokhu: "normal" },
      { id: "g5_5", text: "", x: 160, y: 130, lahokhu: "normal" },
      { id: "g5_6", text: "", x: 188, y: 130, lahokhu: "normal" },
      { id: "g5_7", text: "", x: 216, y: 130, lahokhu: "normal" },
      { id: "g5_8", text: "", x: 244, y: 130, lahokhu: "target" },

      // บทที่ 2 วรรครับ (8 คำ)
      { id: "g6_1", text: "", x: 300, y: 130, lahokhu: "normal" },
      { id: "g6_2", text: "", x: 328, y: 130, lahokhu: "normal" },
      { id: "g6_3", text: "", x: 356, y: 130, lahokhu: "target" },
      { id: "g6_4", text: "", x: 384, y: 130, lahokhu: "normal" },
      { id: "g6_5", text: "", x: 412, y: 130, lahokhu: "normal" },
      { id: "g6_6", text: "", x: 440, y: 130, lahokhu: "normal" },
      { id: "g6_7", text: "", x: 468, y: 130, lahokhu: "normal" },
      { id: "g6_8", text: "", x: 496, y: 130, lahokhu: "target" },

      // บทที่ 2 วรรครอง (8 คำ - เริ่มต้นชิดซ้าย x=20)
      { id: "g7_1", text: "", x: 20, y: 180, lahokhu: "normal" },
      { id: "g7_2", text: "", x: 48, y: 180, lahokhu: "normal" },
      { id: "g7_3", text: "", x: 76, y: 180, lahokhu: "normal" },
      { id: "g7_4", text: "", x: 104, y: 180, lahokhu: "normal" },
      { id: "g7_5", text: "", x: 132, y: 180, lahokhu: "normal" },
      { id: "g7_6", text: "", x: 160, y: 180, lahokhu: "normal" },
      { id: "g7_7", text: "", x: 188, y: 180, lahokhu: "normal" },
      { id: "g7_8", text: "", x: 216, y: 180, lahokhu: "target" },

      // บทที่ 2 วรรคส่ง (8 คำ)
      { id: "g8_1", text: "", x: 300, y: 180, lahokhu: "normal" },
      { id: "g8_2", text: "", x: 328, y: 180, lahokhu: "normal" },
      { id: "g8_3", text: "", x: 356, y: 180, lahokhu: "target" },
      { id: "g8_4", text: "", x: 384, y: 180, lahokhu: "normal" },
      { id: "g8_5", text: "", x: 412, y: 180, lahokhu: "normal" },
      { id: "g8_6", text: "", x: 440, y: 180, lahokhu: "normal" },
      { id: "g8_7", text: "", x: 468, y: 180, lahokhu: "normal" },
      { id: "g8_8", text: "", x: 496, y: 180, lahokhu: "normal" }
    ],
    correctConnections: [
      // บทที่ 1
      { from: "g1_8", to: "g2_3", altTo: ["g2_3", "g2_5"] },
      { from: "g2_8", to: "g3_8" },
      { from: "g3_8", to: "g4_3", altTo: ["g4_3", "g4_5"] },
      
      // สัมผัสระหว่างบท (บท 1 วรรคส่งคำ 8 ➔ บท 2 วรรครับคำ 8)
      { from: "g4_8", to: "g6_8", altTo: ["g4_8", "g6_8", "g5_8"], isInterStanza: true },

      // บทที่ 2
      { from: "g5_8", to: "g6_3", altTo: ["g6_3", "g6_5"] },
      { from: "g6_8", to: "g7_8" },
      { from: "g7_8", to: "g8_3", altTo: ["g8_3", "g8_5"] }
    ]
  },
  {
    id: "inthanawichian_11",
    title: "ข้อที่ 4: อินทรวิเชียรฉันท์ 11 (จำนวน 2 บท - ตรงตามต้นฉบับ 100%)",
    subtitle: "ลากเส้นตรงฉากเชื่อมจุดสัมผัสบังคับ อินทรวิเชียรฉันท์ 11 (2 บท 8 วรรค) ให้ถูกต้องตามผัง",
    type: "อินทรวิเชียรฉันท์ 11",
    syllables: [
      // บทที่ 1 (บาท 1 และ บาท 2)
      { id: "i1_1", text: "", x: 40, y: 30, lahokhu: "kru" },
      { id: "i1_2", text: "", x: 80, y: 30, lahokhu: "kru" },
      { id: "i1_3", text: "", x: 120, y: 30, lahokhu: "lahu" },
      { id: "i1_4", text: "", x: 160, y: 30, lahokhu: "kru" },
      { id: "i1_5", text: "", x: 200, y: 30, lahokhu: "kru_target" },

      { id: "i1_6", text: "", x: 250, y: 30, lahokhu: "lahu" },
      { id: "i1_7", text: "", x: 290, y: 30, lahokhu: "kru" },
      { id: "i1_8", text: "", x: 330, y: 30, lahokhu: "lahu_target" },
      { id: "i1_9", text: "", x: 370, y: 30, lahokhu: "lahu" },
      { id: "i1_10", text: "", x: 410, y: 30, lahokhu: "kru" },
      { id: "i1_11", text: "", x: 450, y: 30, lahokhu: "kru_target" },

      { id: "i2_1", text: "", x: 40, y: 80, lahokhu: "kru" },
      { id: "i2_2", text: "", x: 80, y: 80, lahokhu: "kru" },
      { id: "i2_3", text: "", x: 120, y: 80, lahokhu: "lahu" },
      { id: "i2_4", text: "", x: 160, y: 80, lahokhu: "kru" },
      { id: "i2_5", text: "", x: 200, y: 80, lahokhu: "kru_target" },

      { id: "i2_6", text: "", x: 250, y: 80, lahokhu: "lahu" },
      { id: "i2_7", text: "", x: 290, y: 80, lahokhu: "kru" },
      { id: "i2_8", text: "", x: 330, y: 80, lahokhu: "lahu" },
      { id: "i2_9", text: "", x: 370, y: 80, lahokhu: "lahu" },
      { id: "i2_10", text: "", x: 410, y: 80, lahokhu: "kru" },
      { id: "i2_11", text: "", x: 450, y: 80, lahokhu: "kru_target" },

      // บทที่ 2 (บาท 3 และ บาท 4)
      { id: "i3_1", text: "", x: 40, y: 130, lahokhu: "kru" },
      { id: "i3_2", text: "", x: 80, y: 130, lahokhu: "kru" },
      { id: "i3_3", text: "", x: 120, y: 130, lahokhu: "lahu" },
      { id: "i3_4", text: "", x: 160, y: 130, lahokhu: "kru" },
      { id: "i3_5", text: "", x: 200, y: 130, lahokhu: "kru_target" },

      { id: "i3_6", text: "", x: 250, y: 130, lahokhu: "lahu" },
      { id: "i3_7", text: "", x: 290, y: 130, lahokhu: "kru" },
      { id: "i3_8", text: "", x: 330, y: 130, lahokhu: "lahu_target" },
      { id: "i3_9", text: "", x: 370, y: 130, lahokhu: "lahu" },
      { id: "i3_10", text: "", x: 410, y: 130, lahokhu: "kru" },
      { id: "i3_11", text: "", x: 450, y: 130, lahokhu: "kru_target" },

      { id: "i4_1", text: "", x: 40, y: 180, lahokhu: "kru" },
      { id: "i4_2", text: "", x: 80, y: 180, lahokhu: "kru" },
      { id: "i4_3", text: "", x: 120, y: 180, lahokhu: "lahu" },
      { id: "i4_4", text: "", x: 160, y: 180, lahokhu: "kru" },
      { id: "i4_5", text: "", x: 200, y: 180, lahokhu: "kru_target" },

      { id: "i4_6", text: "", x: 250, y: 180, lahokhu: "lahu" },
      { id: "i4_7", text: "", x: 290, y: 180, lahokhu: "kru" },
      { id: "i4_8", text: "", x: 330, y: 180, lahokhu: "lahu" },
      { id: "i4_9", text: "", x: 370, y: 180, lahokhu: "lahu" },
      { id: "i4_10", text: "", x: 410, y: 180, lahokhu: "kru" },
      { id: "i4_11", text: "", x: 450, y: 180, lahokhu: "kru" }
    ],
    correctConnections: [
      // บทที่ 1
      { from: "i1_5", to: "i1_8" },
      { from: "i1_11", to: "i2_5" },

      // สัมผัสระหว่างบท (คำสุดท้ายวรรค 4 ➔ คำสุดท้ายวรรค 6)
      { from: "i2_11", to: "i3_11", altTo: ["i3_11", "i3_5"], isInterStanza: true },

      // บทที่ 2
      { from: "i3_5", to: "i3_8" },
      { from: "i3_11", to: "i4_5" }
    ]
  }
];

const STAGE3_REORDER_TASKS = [
  {
    id: 1,
    type: "กาพย์ยานี 11",
    title: "ข้อที่ 1: กาพย์ยานี 11 (เรื่องเสน่ห์อาหารไทย 2 บท)",
    unitName: "วรรค",
    shuffledLines: [
      { id: "line_1_4", text: "เมื่อลิ้มลองจะติดใจ" },
      { id: "line_1_1", text: "เสน่ห์อาหารไทย" },
      { id: "line_1_3", text: "สำรับไทยทั้งผอง" },
      { id: "line_1_2", text: "มีอะไรให้ลิ้มลอง" },
      { id: "line_1_8", text: "แซ่บสะใจเมื่อได้ชิม" },
      { id: "line_1_5", text: "เริ่มที่ต้มยำกุ้ง" },
      { id: "line_1_7", text: "รสเด็ดเกินกว่าใคร" },
      { id: "line_1_6", text: "ใส่เครื่องปรุงสมุนไพร" }
    ],
    correctOrder: [
      "line_1_1", "line_1_2", "line_1_3", "line_1_4",
      "line_1_5", "line_1_6", "line_1_7", "line_1_8"
    ]
  },
  {
    id: 2,
    type: "กลอนแปด",
    title: "ข้อที่ 2: กลอนแปด (เรื่องเกิดเป็นคนดิ้นรนสู้ชีวิต 2 บท)",
    unitName: "วรรค",
    shuffledLines: [
      { id: "line_2_4", text: "แต่สังขารไม่อยู่อย่างยั่งยืน" },
      { id: "line_2_1", text: "เกิดเป็นคนดิ้นรนสู้ชีวิต" },
      { id: "line_2_3", text: "มีสมบัติมากค่าอ่าโอฬาร" },
      { id: "line_2_2", text: "ต่างมุ่งคิดหาทรัพย์สร้างหลักฐาน" },
      { id: "line_2_8", text: "ชื่อยังตื่นฟื้นความดีที่ได้ทำ" },
      { id: "line_2_5", text: "แบ่งเวลาหาทรัพย์สร้างความดี" },
      { id: "line_2_7", text: "แม้ชีพดับลับร่างผ่านวันคืน" },
      { id: "line_2_6", text: "ให้เป็นที่เล่าขานของผู้อื่น" }
    ],
    correctOrder: [
      "line_2_1", "line_2_2", "line_2_3", "line_2_4",
      "line_2_5", "line_2_6", "line_2_7", "line_2_8"
    ]
  },
  {
    id: 3,
    type: "โคลงสี่สุภาพ",
    title: "ข้อที่ 3: โคลงสี่สุภาพ (ห้ามเพลิงไว้อย่าให้มีควัน - แยก 8 วรรค)",
    unitName: "วรรค",
    shuffledLines: [
      { id: "line_3_4", text: "ส่องไซร้" },
      { id: "line_3_1", text: "ห้ามเพลิงไว้อย่าให้" },
      { id: "line_3_3", text: "ห้ามสุริยแสงจันทร์" },
      { id: "line_3_2", text: "มีควัน" },
      { id: "line_3_8", text: "จึ่งห้ามนินทา" },
      { id: "line_3_5", text: "ห้ามอายุให้ทัน" },
      { id: "line_3_7", text: "ห้ามดั่งนี้ไว้ได้" },
      { id: "line_3_6", text: "คืนเล่า" }
    ],
    correctOrder: [
      "line_3_1", "line_3_2", "line_3_3", "line_3_4",
      "line_3_5", "line_3_6", "line_3_7", "line_3_8"
    ]
  },
  {
    id: 4,
    type: "อินทรวิเชียรฉันท์ 11",
    title: "ข้อที่ 4: อินทรวิเชียรฉันท์ 11 (พึงมรรยาทยึด - แยก 8 วรรค)",
    unitName: "วรรค",
    shuffledLines: [
      { id: "line_4_4", text: "อุปเฉทไมตรี" },
      { id: "line_4_1", text: "พึงมรรยาทยึด" },
      { id: "line_4_3", text: "รื้อริษยาอัน" },
      { id: "line_4_2", text: "สุประพฤติสงวนพรรค์" },
      { id: "line_4_8", text: "รวิวาทระแวงกัน" },
      { id: "line_4_5", text: "ดั่งนั้น ณ หมู่ใด" },
      { id: "line_4_7", text: "พร้อมเพรียงนิพัทธ์นี" },
      { id: "line_4_6", text: "ผิบไร้สมัครมี" }
    ],
    correctOrder: [
      "line_4_1", "line_4_2", "line_4_3", "line_4_4",
      "line_4_5", "line_4_6", "line_4_7", "line_4_8"
    ]
  }
];

const STAGE4_TOPICS = [
  "1. โรงเรียนน่าอยู่",
  "2. อนุรักษ์ธรรมชาติและสิ่งแวดล้อม",
  "3. ความเพียรพยายามนำสู่ความสำเร็จ",
  "4. วัฒนธรรมไทยงดงามล้ำค่า",
  "5. วินัยชนะความเกียจคร้าน"
];

const STAGE4_VERSE_TYPES = [
  "กาพย์ยานี 11 (จำนวน 2 บท)",
  "กลอนแปด / กลอนสุภาพ (จำนวน 2 บท)",
  "โคลงสี่สุภาพ (จำนวน 1 บท)",
  "อินทรวิเชียรฉันท์ 11 (จำนวน 1 บท)"
];
