import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/studentport_logo.png";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const navigate = useNavigate();

  // State ทั้งหมดที่ต้องใช้
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: reset password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const API = "http://localhost:3000/auth";

  // -----------------------------
  // STEP 1: ส่ง email เพื่อขอ OTP
  // -----------------------------
  const sendEmail = async () => {
    setLoading(true);
    setError("");
    setMsg("");
    try {
      await axios.post(`${API}/forgot-password`, { email });
      setMsg("OTP has been sent to your email.");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // STEP 2: ส่ง OTP เพื่อรับ resetToken
  // -----------------------------
  const verifyOtp = async () => {
    setLoading(true);
    setError("");
    setMsg("");
    try {
      const res = await axios.post(`${API}/verify-otp`, { otp });
      setResetToken(res.data.resetToken);
      setMsg("OTP verified. Please set a new password.");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // STEP 3: ส่ง resetToken + newPassword
  // -----------------------------
  const resetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    setMsg("");

    try {
      await axios.post(`${API}/reset-password`, {
        resetToken,
        newPassword,
        confirmPassword,
      });

      setMsg("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      setError(err.response?.data?.message || "Reset password failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <img src={logo} alt="StudentPort Logo" className="forgot-logo" />

        <h2 className="forgot-title">StudentPort.com</h2>

        {error && <p className="error-text">{error}</p>}
        {msg && <p className="success-text">{msg}</p>}

        {/* ---------------- STEP 1: EMAIL ---------------- */}
        {step === 1 && (
          <>
            <p className="forgot-subtitle">please enter your email</p>
            <input
              type="email"
              placeholder="email"
              className="forgot-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="submit-btn" onClick={sendEmail} disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {/* ---------------- STEP 2: OTP ---------------- */}
        {step === 2 && (
          <>
            <p className="forgot-subtitle">please enter the OTP</p>

            <div className="otp-row">
              <input
                type="text"
                placeholder="OTP"
                className="otp-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <span className="resend" onClick={sendEmail}>
                Resend
              </span>
            </div>

            <button className="submit-btn" onClick={verifyOtp} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* ---------------- STEP 3: RESET PASSWORD ---------------- */}
        {step === 3 && (
          <>
            <p className="forgot-subtitle">Set New Password</p>

            <input
              type="password"
              placeholder="New Password"
              className="forgot-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="forgot-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button className="submit-btn" onClick={resetPassword} disabled={loading}>
              {loading ? "Updating..." : "Submit"}
            </button>
          </>
        )}

        <p className="back-login" onClick={() => navigate("/login")}>
          Go To Login
        </p>
      </div>
    </div>
  );
}
