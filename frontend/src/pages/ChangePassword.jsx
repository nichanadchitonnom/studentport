import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/studentport_logo.png";
import "./ChangePassword.css";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:3000/auth";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API}/change-password`, {
        email,
        oldPassword,
        newPassword,
        confirmPassword,
      });

      setMsg("Password changed successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-container">
      <div className="change-card">
        <img src={logo} alt="StudentPort Logo" className="change-logo" />
        <div className="title">StudentPort.com</div>

        {error && <p className="error-text">{error}</p>}
        {msg && <p className="success-text">{msg}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="old password"
            required
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="new password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="confirm password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Submit"}
          </button>
        </form>

        <p className="back-link" onClick={() => navigate("/login")}>
          Go To Login
        </p>
      </div>
    </div>
  );
}
