import React from "react";
import { useNavigate } from "react-router-dom";
import homeIcon from "../assets/home_icon.png"; 
import "./SelectRole.css";

export default function SelectRole() {
  const navigate = useNavigate();

  return (
    <div className="role-page">
      <h2>Select your Role</h2>

      <div className="role-options">
        <div className="role-card" onClick={() => navigate("/register/student")}>
          <div className="emoji">🎓</div>
          <div className="role-text">Student</div>
        </div>

        <div className="role-card" onClick={() => navigate("/register/recruiter")}>
          <div className="emoji">💼</div>
          <div className="role-text">Recruiter</div>
        </div>
      </div>

      {/* ปุ่มกลับไปหน้า Login */}
      <img
        src={homeIcon}
        alt="Home"
        className="home-icon"
        onClick={() => navigate("/")}
      />
    </div>
  );
}
