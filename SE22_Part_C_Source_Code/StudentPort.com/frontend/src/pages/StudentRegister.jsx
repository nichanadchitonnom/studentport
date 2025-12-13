// src/pages/StudentRegister.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentRegister.css";
import homeIcon from "../assets/home_icon.png";

const BASE = "https://regis-production-ca14.up.railway.app";

export default function StudentRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    password: "",
    email: "",
    studentIdFile: null,
  });

  const [showWarning, setShowWarning] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ เมื่อพิมพ์ข้อมูลในช่องต่างๆ
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ เมื่อเลือกไฟล์
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, studentIdFile: file }));
  };

  // ✅ ปุ่มลบรูป
  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, studentIdFile: null }));
  };

  // ✅ เมื่อกดปุ่ม Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // เช็กว่ากรอกครบหรือยัง
    const allFilled = Object.values(formData).every((v) => v && v !== "");
    if (!allFilled) {
      setShowWarning(true); // ⚠️ ขึ้นเตือนเฉพาะตอนกด submit
      return;
    }

    try {
      setLoading(true);

      // สร้าง FormData สำหรับอัปโหลดไฟล์
      const data = new FormData();
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("displayName", `${formData.firstName} ${formData.surname}`);
      data.append("role", "Student");
      if (formData.studentIdFile) {
        data.append("studentCard", formData.studentIdFile);
      }

      // ส่งไป backend
      const res = await fetch(`${BASE}/auth/register`, {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        alert("สมัครสมาชิกสำเร็จ! 🎉 รอการอนุมัติจากระบบ");
        console.log("Response:", result);
        navigate("/pending");
      } else {
        alert(result.message || "สมัครไม่สำเร็จ ลองใหม่อีกครั้ง");
      }
    } catch (err) {
      console.error("Register error:", err);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-register-page">
      <h2>Student Account Registration</h2>

      <form onSubmit={handleSubmit} className="student-form">
        <div>
          Role : <b>Student</b>
        </div>

        <div className="input-row">
          <label>
            First name :
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </label>
          <label>
            Surname :
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="input-row">
          <label>
            Password :
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </label>
          <label>
            Email Address (Organization) :
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
        </div>

        <div>
          <label>Attach your student ID card :</label>
          <div className="file-upload">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              id="fileInput"
              style={{ display: "none" }}
            />

            {!formData.studentIdFile && (
              <label htmlFor="fileInput" className="upload-label">
                Select file / Open camera
              </label>
            )}

            {formData.studentIdFile && (
              <div className="image-preview">
                <img
                  src={URL.createObjectURL(formData.studentIdFile)}
                  alt="Preview"
                  className="preview-img"
                />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={handleRemoveImage}
                >
                  ✖
                </button>
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>

        {showWarning && (
          <div className="warning-text">
            ⚠️ กรุณากรอกข้อมูลให้ครบทุกช่องก่อนนะ
          </div>
        )}
      </form>

      {/* ปุ่ม Home */}
      <img
        src={homeIcon}
        alt="Home"
        className="home-icon"
        onClick={() => navigate("/")}
      />
    </div>
  );
}
