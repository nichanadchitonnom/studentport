// src/components/Student/HomeStudent.jsx

import React, { useEffect, useMemo, useState } from "react";
import SidebarStu from "../Student/SidebarStu";
import ProjectCard from "../ProjectCard";

const BASE = "https://regis-production-ca14.up.railway.app"; // 🎯 Base URL สำหรับ Backend (ใช้ใน Dev Proxy)

const norm = (x) => {
  if (!x) return x;
  const normalizedPath = x.replace(/\\/g, "/");

  return normalizedPath.startsWith("http")
    ? normalizedPath
    : `${BASE}${
        normalizedPath.startsWith("/") ? "" : "/"
      }${normalizedPath}`;
};

export default function HomeStudent() {
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // filters
  const [q, setQ] = useState("");
  const [year, setYear] = useState("");
  const [category, setCategory] = useState("");

  // โหลด public portfolios
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${BASE}/api/portfolio/public`);
        if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
        const data = await res.json();
        if (!alive) return;
        setRaw(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!alive) return;
        setError(e.message || "Failed to load portfolios");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // map ข้อมูล + filter
  const items = useMemo(() => {
    const mapped = raw.map((it) => {
      // ใช้ cover_img ก่อน ถ้าไม่มีค่อยไปหาจาก files
      const imgPath =
        it.cover_img ||
        (it.files || []).find((p) => /\.(png|jpe?g|gif)$/i.test(p));

      return {
        id: it._id || it.id,
        title: it.title || "",
        name: it.owner?.displayName || "",
        university: it.university || it.owner?.university || "",
        year: it.year ?? "",
        category: it.category || "",
        description: it.desc || it.description || "",
        image: norm(imgPath),
      };
    });

    return mapped.filter((x) => {
      const passQ =
        !q ||
        (x.title + " " + x.description + " " + x.category)
          .toLowerCase()
          .includes(q.toLowerCase());
      const passYear = !year || String(x.year) === String(year);
      const passCat = !category || x.category === category;
      return passQ && passYear && passCat;
    });
  }, [raw, q, year, category]);

  return (
    <div className="flex role-student">
      <SidebarStu />

      <main
        className="main-content"
        style={{ marginLeft: 270, padding: 20, width: "100%" }}
      >
        <div
          className="top-bar"
          style={{ display: "flex", gap: 12, marginBottom: 12 }}
        >
          <input
            className="search"
            placeholder="Search title / username"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ flex: 1 }}
          />
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">All years</option>
            {["2020", "2021", "2022", "2023", "2024", "2025"].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All categories</option>
            {[
              "AI",
              "ML",
              "BI",
              "QA",
              "UX/UI",
              "Database",
              "Software Engineering",
              "IOT",
              "Gaming",
              "Web Development",
              "Coding",
              "Data Science",
              "Hackathon",
              "Bigdata",
              "Data Analytics",
            ].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* states ต่าง ๆ */}
        {loading && <div>Loading…</div>}
        {error && <div style={{ color: "crimson" }}>{error}</div>}
        {!loading && !error && items.length === 0 && (
          <div>No public portfolios yet</div>
        )}

        {/* แสดงการ์ด */}
        <div
          className="grid"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "24px",
            padding: "10px 40px 40px",
          }}
        >
          {items.map((p) => (
            <div
              key={p.id}
              style={{
                flex: "0 0 calc(33.333% - 24px)", // 👉 3 ใบต่อแถว
                maxWidth: "calc(33.333% - 24px)",
                boxSizing: "border-box",
              }}
            >
              <ProjectCard {...p} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
