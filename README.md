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
cd backend
npm install
```

*Frontend*
```
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
npm run dev
```

*Frontend*
```
cd frontend
npm start
```

**5. How to import DB data**







**6. Test Credentials**








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



















