import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RecruiterRegister.css";
import homeIcon from "../assets/home_icon.png";

const BASE = "https://regis-production-ca14.up.railway.app";

export default function RecruiterRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    password: "",
    email: "",
    organization: "",
    employeeCard: null,
  });

  const [showWarning, setShowWarning] = useState(false);
  const [loading, setLoading] = useState(false);

  // เมื่อพิมพ์ข้อมูลในช่องกรอก
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    const anyFilled = Object.values(updated).some((v) => v && v !== "");
    const allFilled = Object.values(updated).every((v) => v && v !== "");
    setShowWarning(anyFilled && !allFilled);
  };

  // เมื่ออัปโหลดรูป
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, employeeCard: file });
  };

  // ปุ่มลบรูป
  const handleRemoveImage = () => {
    setFormData({ ...formData, employeeCard: null });
  };

  // เมื่อกด Submit → ส่ง API จริง
  const handleSubmit = async (e) => {
    e.preventDefault();

    const allFilled = Object.values(formData).every((v) => v && v !== "");
    if (!allFilled) {
      setShowWarning(true);
      return;
    }

    try {
      setLoading(true);

      // สร้าง FormData สำหรับอัปโหลดไฟล์
      const data = new FormData();
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("displayName", `${formData.firstName} ${formData.surname}`);
      data.append("organization", formData.organization);
      data.append("role", "Recruiter");
      if (formData.employeeCard) {
        data.append("employeeCard", formData.employeeCard);
      }

      // เรียก API backend
      const res = await fetch(`${BASE}/auth/register`, {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        alert("สมัครสมาชิกสำเร็จ! 🎉 กรุณารอการอนุมัติจากระบบ");
        console.log("Response:", result);
        navigate("/pending");
      } else {
        alert(result.message || "สมัครไม่สำเร็จ ลองใหม่อีกครั้ง");
      }
    } catch (err) {
      console.error("Register error:", err);
      alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recruiter-register-page">
      <h2>Recruiter Account Registration</h2>

      <form onSubmit={handleSubmit} className="recruiter-form">
        <div>
          Role : <b>Recruiter</b>
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

        <label>
          Organization name :
          <input
            type="text"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
          />
        </label>

        <div>
          <label>Attach your employee card:</label>
          <div className="file-upload">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              id="fileInput"
              style={{ display: "none" }}
            />
            {!formData.employeeCard && (
              <label htmlFor="fileInput" className="upload-label">
                Select file / Open camera
              </label>
            )}

            {formData.employeeCard && (
              <div className="image-preview">
                <img
                  src={URL.createObjectURL(formData.employeeCard)}
                  alt="Employee Card"
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

      {/* ปุ่ม Home มุมซ้ายล่าง */}
      <img
        src={homeIcon}
        alt="Home"
        className="home-icon"
        onClick={() => navigate("/")}
      />
    </div>
  );
}
