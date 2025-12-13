import React from "react";
import { Link } from "react-router-dom";
import "./NormalCard.css";
const FAIL_PATH = "/student/fail-status-error";

export default function NormalCard({
  id, title, name, university, year, description, image, category,
  status = "", editMode = false, isPublic = false, onVisibilityChange,
}) {
  const statusLower = String(status || "").toLowerCase(); // draft/pending/in_process/approved/rejected
  const statusClass = statusLower.replace(/\s+/g, "");
  const isApproved = statusLower === "approved";
  const isRejected = statusLower.includes("reject");

  const linkPath =
    statusLower === "draft"   ? `/student/edit/${id}` :
    statusLower === "failed" || statusLower === "rejected" ? `/student/resubmit/${id}` :
    null;

  const commentPath = `/project/${id}`; // ลิงก์ไปหน้าอ่าน public (จะกันในหน้าอ่านอีกชั้น)

  const body = (
    <div className="card normal-card">
      <div className="card-top">
        <h3 className="card-title">{title}</h3>
        {status && <span className={`status-badge ${statusClass}`}>{status}</span>}
      </div>

      <img
        src={image || "https://via.placeholder.com/600x320?text=Project"}
        alt={title}
        className="card-img"
        loading="lazy"
      />

      <div className="card-content">
        <p><strong>Name:</strong> {name || "-"}</p>
        <p><strong>University:</strong> {university || "-"}</p>
        <p><strong>Year:</strong> {year || "-"}</p>
        <p><strong>Category:</strong> {category || "-"}</p>
        <p className="desc"><strong>Description:</strong> {description || "-"}</p>

        {isApproved && typeof onVisibilityChange === "function" && (
          <div className="visibility-control">
            <label className="switch-label">
              <span className="private-text">Private</span>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => onVisibilityChange(id, e.target.checked)}
              />
              <span className="slider round" />
              <span className="public-text">Public</span>
            </label>
          </div>
        )}

        {editMode && (
          <div className="edit-buttons">
            {linkPath ? (
              <Link to={linkPath} className="edit-btn" aria-label="Edit">📝</Link>
            ) : (
              <button className="edit-btn" type="button" aria-label="Edit">📝</button>
            )}
            <button className="delete-btn" type="button" aria-label="Delete">🗑️</button>
          </div>
        )}
      </div>
    </div>
  );

return (
    <div className="card-wrapper">
        {isRejected ? (
            <Link 
                to={`${FAIL_PATH}/${id}`} 
                className="card-link-wrapper"
            >
                {body}
            </Link>
        ) : (
            <div className="card-display-wrapper">
                {body}
            </div>
        )}
    </div> 
);
}
