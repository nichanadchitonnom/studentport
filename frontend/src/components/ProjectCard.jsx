// src/components/ProjectCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./NormalCard.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3000";

export default function ProjectCard({
  id,
  title,
  name,
  university,
  year,
  category,
  description,
  image,
}) {
  const detailPath = `/project/${id}/comments`;

  // ใช้ฟังก์ชันเดียวกับที่ NormalCard ใช้ (ให้ behavior รูปเหมือนกัน)
  const normImage = (raw) => {
    if (!raw) return "";

    // เคสหลอน ๆ แบบ "/http://localhost:3000/..." -> "http://localhost:3000/..."
    const x = raw.trim().replace(/^\/+http/, "http");

    // ถ้าเป็น URL เต็มแล้ว เช่น "http://localhost:3000/uploads/xxx.jpg"
    if (x.startsWith("http")) return x;

    // ถ้าเป็น path เช่น "uploads/xxx.jpg" หรือ "/uploads/xxx.jpg"
    const relative = x.startsWith("/") ? x : `/${x}`;
    return `${API_BASE}${relative}`;
  };

  const imgSrc = image
    ? normImage(image)
    : "https://via.placeholder.com/600x320?text=No+Image";

  // เอาไว้ debug ดูว่า ProjectCard ได้ค่า image มาเป็นอะไร
  console.log("ProjectCard image prop =", image);
  console.log("ProjectCard imgSrc =", imgSrc);

  return (
    <Link
      to={detailPath}
      className="card normal-card"
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
        cursor: "pointer",
      }}
      aria-label={`Open project ${title}`}
    >
      {/* Title */}
      <div className="card-top">
        <h3 className="card-title">{title || "Untitled Project"}</h3>
      </div>

      {/* Cover image */}
      <img
        src={imgSrc}
        alt={title}
        className="card-img"
        loading="lazy"
      />

      {/* Content */}
      <div className="card-content">
        <p><strong>Name:</strong> {name || "-"}</p>
        <p><strong>University:</strong> {university || "-"}</p>
        <p><strong>Year:</strong> {year || "-"}</p>
        <p><strong>Category:</strong> {category || "-"}</p>
        <p className="desc"><strong>Description:</strong> {description || "-"}</p>
      </div>
    </Link>
  );
}
