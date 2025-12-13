import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FileInput from "../components/FileInput";
import { validateFiles } from "../utils/validators";
import { editPortfolioDraft } from "../api/portfolioDraft";
import { editPortfolio } from "../api/edit";
import { getFailPortfolio } from "../api/fail";

const YEAR_OPTIONS = ["2020", "2021", "2022", "2023", "2024", "2025"];
const CATEGORY_OPTIONS = [
  "AI", "ML", "BI", "QA", "UX/UI", "Database", "Software Engineering",
  "IOT", "Gaming", "Web Development", "Coding", "Data Science",
  "Hackathon", "Bigdata", "Data Analytics"
];

export default function EditPortfolio() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: "",
    university: "KMUTT",
    year: "",
    category: "",
    description: "",
    files: [], // Portfolio files
  });

  const [coverImage, setCoverImage] = useState(null); // สำหรับไฟล์ใหม่ Cover
  const [coverPreview, setCoverPreview] = useState(null); // preview cover
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // โหลด draft เดิม
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!id) return;

    async function fetchData() {
      try {
        const data = await getFailPortfolio(id, token);

        console.log("Files from backend:", data.files);

        console.log("Fetched portfolio data:", data);

        
        setForm({
          title: data.title || "",
          university: data.university || "KMUTT",
          year: data.year || "",
          category: data.category || "",
          description: data.desc || "",
          files: (data.files || []).map((url) => ({
    file: null,
    url: url.replace(/\\/g, "/"), // แปลง \ เป็น /
  })),
});

        if (data.cover_img) {
          setCoverImage(null);
          setCoverPreview(data.cover_img); // preview cover จาก URL
        }
      } catch (err) {
        console.error("Load draft error:", err);
        setError("ไม่สามารถโหลดข้อมูลได้");
      }
    }

    fetchData();
  }, [id]);

  // ฟังก์ชันเปลี่ยนไฟล์แนบ
  const onFilesChange = (newFiles) => {
    setForm((f) => ({
      ...f,
      files: [...newFiles],
    }));
  };

  function buildFormData(submitFlag /* "true"=upload / "false"=draft */) {
  const fd = new FormData();
  fd.append("title", form.title.trim());
  fd.append("university", form.university);
  fd.append("year", form.year);
  fd.append("category", form.category);
  fd.append("desc", form.description);

  // เปลี่ยนตรงนี้
  fd.append("saveDraft", submitFlag); // 🔹 แทน submit

  if (coverImage) fd.append("cover_img", coverImage);

  form.files.forEach(({ file }) => {
    if (file) fd.append("portfolioFiles", file);
  });

  return fd;
}


  const validateBeforeSend = () => {
    if (!form.title.trim()) return "กรุณากรอก Title";
    if (!YEAR_OPTIONS.includes(String(form.year))) return "กรุณาเลือกปีให้ถูกต้อง (2020–2025)";
    if (!CATEGORY_OPTIONS.includes(form.category)) return "กรุณาเลือก Category ให้ถูกต้อง";

    const fileCheck = validateFiles(form.files);
    if (!fileCheck.ok) return fileCheck.msg;

    if (!coverPreview && !coverImage) return "กรุณาเลือก Cover Image";

    return "";
  };

  const send = async (submitFlag) => {
  const token = localStorage.getItem("token") || undefined;

  try {
    setLoading(true);
    setError("");

    // ตรวจก่อน submit จริง
    if (submitFlag === "true") {
      const errMsg = validateBeforeSend();
      if (errMsg) throw new Error(errMsg);
    }

    const fd = buildFormData(submitFlag);

    for (let pair of fd.entries()) {
  console.log(pair[0] + ": " + pair[1]);
}


    if (submitFlag === "true") {
  await editPortfolio(id, fd, token); // Upload → pending
  navigate("/student/status");
} else {
  await editPortfolioDraft(id, fd, token); // Draft → draft
  navigate("/student/home");
}


  } catch (e) {
    setError(e.message || "เกิดข้อผิดพลาดในการอัปโหลด");
  } finally {
    setLoading(false);
  }
};

const handleDraft = () => send("true");  // saveDraft = true → draft
const handleUpload = (e) => {            
  e.preventDefault();
  send("false"); // saveDraft = false → pending
};





  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fd9061", display: "flex", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 1000, background: "#fd9061", padding: 20, borderRadius: 12, position: "relative" }}>
        <button
          onClick={() => navigate("/student/status")}
          style={{ position: "absolute", top: 20, right: 20, border: "none", background: "transparent", fontSize: 40, fontWeight: "bold", cursor: "pointer", color: "#fff" }}
        >×</button>

        <h2 style={{ textAlign: "center", color: "#5b8db8", marginBottom: 16, fontSize: 52, fontWeight: "bold" }}>Edit Portfolio</h2>

        {error && <div style={{ marginBottom: 12, padding: "10px 12px", borderRadius: 8, background: "#ffe6e6", color: "#c62828", border: "1px solid #fff", fontSize: 14 }}>{error}</div>}

        <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Title */}
          <div>
            <label style={{ color: "white", display: "block", marginBottom: 8 }}>Title :</label>
            <input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="เช่น Smart IoT Home Controller"
              style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #ccc", background: "#fff" }}/>
          </div>

          {/* University */}
          <div>
            <label style={{ color: "white", display: "block", marginBottom: 6 }}>University :</label>
            <input value={form.university} readOnly
              style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #ccc", background: "#f7f7f7", color: "#444" }}/>
          </div>

          {/* Year */}
          <div>
            <label style={{ color: "white", display: "block", marginBottom: 6 }}>Year :</label>
            <select value={form.year} onChange={(e) => setForm(f => ({ ...f, year: e.target.value }))}
              style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #ccc", background: "#fff" }}>
              <option value="">Select...</option>
              {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {/* Category */}
          <div>
            <label style={{ color: "white", display: "block", marginBottom: 6 }}>Category :</label>
            <select value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
              style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #ccc", background: "#fff" }}>
              <option value="">Select...</option>
              {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Cover Image */}
          <div>
            <label style={{ color: "white", display: "block", marginBottom: 6 }}>Cover Image:</label>
            <FileInput
              files={coverImage ? [{ file: coverImage, url: null }] : []}
              onChange={(arr) => {
                const file = arr[0]?.file || null;
                setCoverImage(file);
                setCoverPreview(file ? URL.createObjectURL(file) : coverPreview);
              }}
            />
            {coverPreview && (
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <img
        src={coverPreview}
        alt="Cover"
        style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8, marginBottom: 4 }}
      />
      <button
        type="button"
        onClick={() => { setCoverImage(null); setCoverPreview(null); }}
        style={{ background: "red", color: "#fff", border: "none", borderRadius: 4, padding: "2px 6px", cursor: "pointer" }}
      >
        ลบ
      </button>
          </div>
           )}
</div>
          {/* Portfolio Files */}
          <div>
            <label style={{ color: "white", display: "block", marginBottom: 6 }}>Attach Files:</label>
            <FileInput files={form.files} onChange={onFilesChange} />
          </div>

          {/* Description */}
          <div>
            <label style={{ color: "white", display: "block", marginBottom: 6 }}>Description :</label>
            <textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="สรุปผลงาน และรายละเอียดสำคัญ"
              rows={5}
              style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #ccc", background: "#fff" }}/>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            <button type="button" onClick={handleDraft} disabled={loading}
              style={{ flex: 1, padding: 12, borderRadius: 8, fontSize: 16, background: "#c2bcbc", border: "1px solid #c0bdbdff" }}>{loading ? "Saving..." : "Draft"}</button>
            <button type="submit" disabled={loading}
              style={{ flex: 1, padding: 12, borderRadius: 8, fontSize: 16, background: "#5b8db8", color: "#fff", border: "1px solid #c0bdbdff" }}>{loading ? "Uploading..." : "Upload"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
