// src/api/upload.js
const BASE = "https://regis-production-ca14.up.railway.app";

export async function uploadPortfolio(formData, token) {
  try {
    const res = await fetch(`${BASE}/api/portfolio`, {
      method: "POST",
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
      body: formData,
    });

    // ตรวจ type ของ response
    const contentType = res.headers.get("content-type") || "";

    let data;
    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      console.error("Non-JSON response:", text);

      throw new Error(
        `Server error (${res.status}) – โปรดตรวจสอบ log ที่ Railway`
      );
    }

    if (!res.ok) {
      throw new Error(data.message || "Upload failed");
    }

    return data;
  } catch (err) {
    console.error("Upload error:", err);
    throw err;
  }
}
