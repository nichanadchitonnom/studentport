import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/studentport_logo.png";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const navigate = useNavigate();

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <img src={logo} alt="StudentPort Logo" className="forgot-logo" />

        <h2 className="forgot-title">StudentPort.com</h2>
        <p className="forgot-subtitle">please enter your email</p>

        <input type="email" placeholder="email" className="forgot-input" />

        <div className="otp-row">
          <input type="text" placeholder="OTP" className="otp-input" />
          <span className="resend">Resend</span>
        </div>

        <button className="submit-btn">Submit</button>

        <p className="back-login" onClick={() => navigate("/login")}>
          Go To Login
        </p>
      </div>
    </div>
  );
}
