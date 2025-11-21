// src/pages/WorkStatusPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProfileHeader from "../components/ProfileHeader";
import NormalCard from "../components/NormalCard";
import "./StatusPage.css";
import homeIcon from "../assets/home_icon.png";

import { getMyPortfolios, updateVisibility } from "../api/portfolio-v2.js";

const USE_BACKEND = String(process.env.REACT_APP_USE_BACKEND || "true")
  .toLowerCase() === "true";

export default function WorkStatusPage({ showControls }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // -----------------------------
  // 1) โหลดข้อมูล user จาก localStorage
  // -----------------------------
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  // -----------------------------
  // 2) โหลด portfolios ของ user
  // -----------------------------
  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      try {
        if (!USE_BACKEND) {
          setProjects([]);
          return;
        }

        const raw = await getMyPortfolios();
        const mapped = raw.map((it) => {
          const name = it.owner?.displayName || user?.name || "Me";
          return {
            id: it._id || it.id,
            title: it.title || "",
            description: it.desc || it.description || "",
            name,
            university:
              it.university || it.owner?.university || user?.university || "KMUTT",
            year: it.yearOfProject || it.year || "",
            category: it.category || "",
            image:
              it.cover_img ||
              (it.files && it.files[0]) ||
              (it.images && it.images[0]) ||
              "",
            rawStatus: it.statusV2 || it.status || "",
            status: (it.statusV2 || it.status || "")
              .replace(/_/g, " ")
              .replace(/\b\w/g, (s) => s.toUpperCase()),
            isPublic: it.visibility === "public",
          };
        });

        if (alive) setProjects(mapped);
      } catch (err) {
        if (alive) setError(err.message || "Failed to load projects");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => (alive = false);
  }, [user]);

  // -----------------------------
  // 3) Filter เฉพาะ Draft/Reject ตอน Editing Mode
  // -----------------------------
  const filtered = useMemo(() => {
    if (!isEditing) return projects;
    return projects.filter((p) => {
      const s = p.rawStatus?.toLowerCase() || "";
      return s.includes("draft") || s.includes("reject");
    });
  }, [projects, isEditing]);

  // -----------------------------
  // UI Part
  // -----------------------------
  if (!user) {
    return <div style={{ padding: 20 }}>Loading user...</div>;
  }

  return (
    <>
      {/* 🔙 Home Icon */}
      <img
        src={homeIcon}
        alt="Home"
        className="home-icon"
        onClick={() => navigate("/student/home")}
      />

      <div className="profile-container">
        <div className="profile-header-wrapper">
          <ProfileHeader
            name={user.name}
            university={user.university || "KMUTT"}
            contact={user.email}
            showEdit={isEditing}
            onClickEdit={() => setIsEditing(true)}
            onClickSave={() => setIsEditing(false)}
            showControls={showControls}
            image={user.image || ""} // ถ้ามีรูป user
            imageLetter={user.name[0].toUpperCase()} // ตัวแรกของชื่อ
          />
        </div>

        {loading && <div style={{ margin: "16px 0" }}>Loading…</div>}
        {error && (
          <div style={{ margin: "16px 0", color: "crimson" }}>{error}</div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div style={{ margin: "16px 0", color: "#666" }}>
            ไม่มีผลงานให้แสดง
          </div>
        )}

        <main className="status-projects-grid">
          {filtered.map((p) => (
            <NormalCard
              key={p.id}
              {...p}
              onVisibilityChange={async (id, checked) => {
                // optimistic UI
                setProjects((prev) =>
                  prev.map((x) =>
                    x.id === id ? { ...x, isPublic: checked } : x
                  )
                );
                try {
                  await updateVisibility(id, checked);
                } catch (e) {
                  // rollback
                  setProjects((prev) =>
                    prev.map((x) =>
                      x.id === id ? { ...x, isPublic: !checked } : x
                    )
                  );
                  alert(e.message || "Update visibility failed");
                }
              }}
              editMode={
                (p.rawStatus?.toLowerCase().includes("draft") ||
                  p.rawStatus?.toLowerCase().includes("reject")) &&
                isEditing
              }
            />
          ))}
        </main>
      </div>
    </>
  );
}
