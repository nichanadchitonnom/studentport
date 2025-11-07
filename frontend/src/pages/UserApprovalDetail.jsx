// src/pages/UserApprovalDetail.jsx
import React, { useState } from "react";
import "./StudentRegister.css";
import "./RecruiterRegister.css";

export default function UserApprovalDetail() {
  // ✅ ข้อมูลจำลอง (mock data)
  const [user, setUser] = useState({
    role: "Student", // ลองเปลี่ยนเป็น "Recruiter" เพื่อดูธีมของ recruiter
    displayName: "Nicha Chitonnom",
    email: "nicha.chi@kmutt.ac.th",
    password: "********",
    organization: "Shining Stars Co., Ltd.",
    studentCardUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Thai_Student_ID_Card_Sample.png/600px-Thai_Student_ID_Card_Sample.png",
    employeeCardUrl:
      "https://upload.wikimedia.org/wikipedia/commons/6/6b/Employee_ID_card_sample.png",
  });

  // ✅ กำหนดธีมตาม role
  const isStudent = user.role === "Student";
  const mainClass = isStudent
    ? "student-register-page"
    : "recruiter-register-page";
  const formClass = isStudent ? "student-form" : "recruiter-form";

  // ✅ URL ของบัตร (เลือกตาม role)
  const cardUrl = isStudent ? user.studentCardUrl : user.employeeCardUrl;

  // ✅ ปุ่ม mock
  const handleAction = (action) => {
    alert(
      action === "approve"
        ? "✅ อนุมัติผู้ใช้งานเรียบร้อย (mock)"
        : "❌ ปฏิเสธผู้ใช้งานเรียบร้อย (mock)"
    );
  };

  return (
    <div className={mainClass}>
      <h2>
        {isStudent
          ? "Student Account Verification"
          : "Recruiter Account Verification"}
      </h2>

      <div className={formClass}>
        <div>
          Role : <b>{user.role}</b>
        </div>

        <div className="input-row">
          <label>
            First name :
            <input
              type="text"
              value={user.displayName.split(" ")[0]}
              readOnly
            />
          </label>
          <label>
            Surname :
            <input
              type="text"
              value={user.displayName.split(" ")[1]}
              readOnly
            />
          </label>
        </div>

        <div className="input-row">
          <label>
            Email Address (Organization) :
            <input type="email" value={user.email} readOnly />
          </label>
          <label>
            Password :
            <input type="password" value={user.password} readOnly />
          </label>
        </div>

        {/* ✅ แสดง Organization name เฉพาะ Recruiter เท่านั้น */}
        {!isStudent && (
          <label>
            Organization name :
            <input type="text" value={user.organization} readOnly />
          </label>
        )}

        {/* ✅ ส่วนแสดงภาพบัตร */}
        <div>
          <label>
            {isStudent
              ? "Attach your student ID card :"
              : "Attach your employee ID card :"}
          </label>

          <div className="file-upload">
            <div className="image-preview">
              <img src={cardUrl} alt="User Card" className="preview-img" />
            </div>

            <div className="action-buttons">
              <button
                className="approve"
                onClick={() => handleAction("approve")}
              >
                Approve
              </button>
              <button
                className="reject"
                onClick={() => handleAction("reject")}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
