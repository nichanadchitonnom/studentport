import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/studentport_logo.png";
import "./ChangePassword.css";

export default function ChangePassword() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Password changed successfully! (mock only)");
    navigate("/login");
  };

  return (
    <div className="change-container">
      <div className="change-card">
        <img src={logo} alt="StudentPort Logo" className="change-logo" />
        <div className="title">StudentPort.com</div>

        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="email" required />
          <input type="password" placeholder="new password" required />
          <input type="password" placeholder="confirm password" required />

          <button type="submit">Submit</button>
        </form>

        <a className="back-link" href="/login">
          Go To Login
        </a>
      </div>
    </div>
  );
}
