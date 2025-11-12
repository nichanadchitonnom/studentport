// src/components/ProjectCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./NormalCard.css";

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
  // ✅ route ที่ตรงกับ backend: /project/:projectId/comments
  const detailPath = `/project/${id}/comments`;

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
      {/* ส่วนหัว */}
      <div className="card-top">
        <h3 className="card-title">{title || "Untitled Project"}</h3>
      </div>

      {/* รูปโปรเจกต์ */}
      <img
        src={image || "https://via.placeholder.com/600x320?text=No+Image"}
        alt={title}
        className="card-img"
        loading="lazy"
      />

      {/* เนื้อหา */}
      <div className="card-content" style={{ paddingBottom: 16 }}>
        <p><strong>Name:</strong> {name || "-"}</p>
        <p><strong>University:</strong> {university || "-"}</p>
        <p><strong>Year:</strong> {year || "-"}</p>
        <p><strong>Category:</strong> {category || "-"}</p>
        <p
          className="desc"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          <strong>Description:</strong> {description || "-"}
        </p>
      </div>
    </Link>
  );
}

