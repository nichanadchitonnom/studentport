# StudentPort.com
### Project Overview

StudentPort.com เป็นแพลตฟอร์มออนไลน์ที่ให้นักศึกษาเก็บ รวบรวมผลงาน สามารถจัดการผลงานของตนเองและเผยแพร่ผลงานสู่สาธารณะ เพื่อสร้างโอกาสต่อยอด เช่น การสมัครทุนหรือหางาน 
ระบบนี้ช่วยให้นักศึกษาสามารถสร้างโปรไฟล์ อัปโหลดผลงานพร้อมข้อมูลประกอบ และเผยแพร่ผลงานต่อ Recruiter ได้ตามสิทธิ์ที่กำหนด 
และยังมีการตรวจสอบโดย Advisor Admin และ Super Admin ก่อนเผยแพร่เพื่อความน่าเชื่อถือ 

### Tech Stack
- Frontend: React (Create React App)
- Backend: Node.js with Express
- Database: MongoDB Atlas
- Authentication: JSON Web Token (JWT)
- External Services: Email Notification Service
- Development Tools: GitHub, Postman, Visual Studio Code

### Required Sections
**1. Prerequisites**
- Node.js v18+
- npm
- MongoDB Atlas

**2. Installation**

*Backend*
```
cd SE22_Part_C_Source_Code
cd StudentPort.com
cd backend
npm install
```

*Frontend*
```
cd SE22_Part_C_Source_Code
cd StudentPort.com
cd frontend
npm install
```

**3. Configuration**

*Backend* ใช้ environment variables สำหรับการตั้งค่าระบบ

1. เข้าไปที่โฟลเดอร์ `backend`
2. สร้างไฟล์ `.env` โดยอ้างอิงจาก `.env.example`
3. กำหนดค่าตัวแปรดังนี้:

   - MONGO_URI = MongoDB Atlas connection string  
    - PORT = Port ที่ใช้รัน backend (ค่าเริ่มต้นคือ 3000)  
    - JWT_SECRET = Secret key สำหรับ JWT authentication  
    - BREVO_API_KEY = API key สำหรับระบบส่งอีเมลแจ้งเตือน

*Frontend* ถูกตั้งค่าให้เรียกใช้งาน backend ที่ deploy แล้วโดยตรง

API ทั้งหมดจะเรียกไปที่: https://regis-production-ca14.up.railway.app

Frontend ใช้ production API แบบ hardcode และมีค่า default สำหรับตัวแปรที่จำเป็น
จึงไม่ต้องตั้งค่า environment variables เพิ่มเติม

**4. How to Run**

*Backend*
```
cd backend
npm run seed
npm run dev
```

*Frontend*
```
cd frontend
npm start
```

**5. How to import DB data**

โครงการนี้ใช้ฐานข้อมูล MongoDB

ระบบมีไฟล์สำหรับใส่ข้อมูลตัวอย่าง (Dummy Data) เพื่อใช้ในการทดสอบระบบ โดยมีขั้นตอนดังนี้:
1.ตรวจสอบว่า MongoDB Atlas สามารถเชื่อมต่อได้ หรือมี MongoDB ทำงานอยู่
2.ตั้งค่าไฟล์ .env ในโฟลเดอร์ backend โดยอ้างอิงจากไฟล์ .env.example
3.เปิด Terminal และเข้าไปที่โฟลเดอร์ backend
4.รันคำสั่งต่อไปนี้เพื่อเพิ่มข้อมูลตัวอย่างลงในฐานข้อมูล

```bash
npm run seed
```
หลังจากรันคำสั่งนี้ ระบบจะสร้างผู้ใช้ตัวอย่างและข้อมูล Portfolio สำหรับการทดสอบระบบโดยอัตโนมัติ
ข้อมูลทั้งหมดเป็นข้อมูลสมมติ (Dummy Data) ใช้เพื่อการศึกษาและนำส่งอาจารย์รายวิชาเท่านั้น และไม่มีข้อมูลส่วนบุคคลจริง

**6. Test Credentials**

หลังจากนำเข้าข้อมูลฐานข้อมูลเรียบร้อยแล้ว สามารถใช้บัญชีผู้ใช้ตัวอย่างต่อไปนี้ในการทดสอบระบบ:

### Super Admin

Email: super_admin@kmutt.ac.th

Password: 123

### Advisor Admin

Email: admin_advisor@kmutt.ac.th

Password: 123

### Student

Email: student@kmutt.ac.th

Password: 123 

### Recruiter

Email: recruiter@company.com

Password: 123

หมายเหตุ: รหัสผ่านที่ระบุเป็นรหัสผ่านก่อนการเข้ารหัส
ระบบมีการเข้ารหัสรหัสผ่านด้วย bcrypt ในฝั่ง backend

**7. Project Status & Known Issues**

*Project Status*
- ฟีเจอร์หลักของระบบสามารถใช้งานได้ครบถ้วน เช่น
  - ระบบสมัครสมาชิกและเข้าสู่ระบบ (Authentication)
  - ระบบ Forgot password และ Change password
  - ระบบจัดการผู้ใช้หลายบทบาท (Student, Recruiter, Advisor Admin, Super Admin)
  - ระบบอัปโหลดและจัดการผลงาน (Portfolio)
  - ระบบอนุมัติผลงานโดย Advisor Admin และ Super Admin
  - ระบบอนุมัติผู้ใช้โดย Super Admin
  - ระบบกำหนดสถานะและการมองเห็นของผลงาน (Public/Private)

- Frontend และ Backend ได้รับการ deploy และสามารถใช้งานร่วมกันได้ตามปกติ
  
*Known Issues*

 - ระบบยังไม่ได้มีการทดสอบในส่วนของ Non-Functional Testing อย่างเป็นทางการ  เช่น การทดสอบประสิทธิภาพ (Performance), ความสามารถในการรองรับผู้ใช้จำนวนมาก (Scalability) และความทนทานของระบบ (Reliability)
 - รูปภาพที่อัปโหลดผ่านระบบอาจแสดงผลไม่สม่ำเสมอ (ขึ้นบ้างไม่ขึ้นบ้าง) เนื่องจาก frontend ถูก deploy บน GitHub Pages (HTTPS) ขณะที่บาง image URL จาก backend ถูกส่งกลับมาเป็น HTTP ทำให้เบราว์เซอร์บางครั้งบล็อกการโหลดรูปภาพ (Mixed Content)
