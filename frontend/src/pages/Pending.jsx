import React from "react";
import { useNavigate } from "react-router-dom";

export default function Pending() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundColor: "#ff6b2b",
        height: "100vh",
        color: "white",
        fontFamily: "sans-serif", 
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "20px",
      }}
    >
      {/* ไอคอน clipboard */}
      <div style={{ fontSize: "100px", marginBottom: "10px" }}>📋</div>

      {/* ✅ หัวข้อ Pending ใช้ Poppins */}
      <h1
        style={{
          fontSize: "70px",
          marginBottom: "10px",
          fontFamily: 'Poppins', 
          fontWeight: "500",
        }}
      >
        Pending
      </h1>

      <p style={{ fontSize: "25px", marginBottom: "8px" }}>
        please wait to verify your account
      </p>
      <p style={{ fontSize: "25px", marginBottom: "8px" }}>
        check your email after this page
      </p>
      <p style={{ fontSize: "25px", marginBottom: "30px" }}>
        we’re working 8.00 - 16.00 (GMT +7)
      </p>

      <button
        onClick={() => navigate("/")}
        style={{
          backgroundColor: "#ffe0a0",
          color: "#e25a00",
          border: "none",
          borderRadius: "4px",
          padding: "10px 25px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "25px",
        }}
      >
        Go To Login
      </button>
    </div>
  );
}
