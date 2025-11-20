// src/routes/auth.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { upload } from "../middleware/upload.js";
import { sendEmail } from "../services/mail.js";
import crypto from "crypto";
import { VERIFICATION_EMAIL_TEMPLATE } from "../services/emailTemplates.js";
import { PASSWORD_RESET_SUCCESS_TEMPLATE } from "../services/emailTemplates.js";
import { PASSWORD_CHANGE_SUCCESS_TEMPLATE } from "../services/emailTemplates.js";

const router = express.Router();

/**
 * POST /auth/register
 */
router.post(
  "/register",
  upload.fields([
    { name: "studentCard", maxCount: 1 },
    { name: "employeeCard", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { email, password, displayName, role, university } = req.body || {};

      const allowedRoles = ["Student", "Recruiter"];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      if (!email) return res.status(400).json({ message: "email required" });
      if (!password)
        return res.status(400).json({ message: "password required" });

      // ❌ ลบการบังคับ university ออก
      // if (role === "Student" && !university) {
      //   return res.status(400).json({ message: "university is required for Student" });
      // }

      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(409).json({ message: "Email already exists" });
      }

      const studentCardFile = req.files?.studentCard?.[0] || null;
      const employeeCardFile = req.files?.employeeCard?.[0] || null;

      if ((role || "Student") === "Student") {
        if (!email.endsWith("@kmutt.ac.th")) {
          return res.status(400).json({
            message: "Student must use university email (@kmutt.ac.th)",
          });
        }
      }

      if (role === "Recruiter") {
        if (!email.includes("@")) {
          return res
            .status(400)
            .json({ message: "Invalid organization email" });
        }
      }

      const hashed = await bcrypt.hash(password, 10);

      const user = await User.create({
        email,
        password: hashed,
        displayName,
        role,
        studentCardUrl: studentCardFile ? studentCardFile.path : undefined,
        employeeCardUrl: employeeCardFile ? employeeCardFile.path : undefined,
        status: "pending",
      });

      return res.status(201).json({
        message: "User registered. Waiting for approval.",
        user: {
          _id: user._id,
          email: user.email,
          displayName: user.displayName,
          role: user.role,
          status: user.status,
        },
      });
    } catch (err) {
      console.error("Register error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ✅ เพิ่มส่วนนี้กลับมาด้วย
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(401)
        .json({ message: "Email or password is incorrect" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res
        .status(401)
        .json({ message: "Email or password is incorrect" });

    if (user.status !== "approved") {
      return res
        .status(403)
        .json({ message: "Your account is not approved yet." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Login success",
      user: {
        _id: user._id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// SEND OTP FOR FORGOT PASSWORD
// ===============================
// POST /auth/forgot-password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // สร้าง OTP 6 หลัก
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otpCode = otp;
    user.otpExpiresAt = Date.now() + 5 * 60 * 1000; // 5 นาที
    await user.save();

    const html = VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", otp);

    await sendEmail(html, user.email, "Your OTP Code");

    return res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("Forgot password (OTP) error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// VERIFY OTP & RESET PASSWORD
// ===============================
// POST /auth/reset-password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "email, otp, newPassword, confirmPassword are required",
      });
    }

    // ❗รหัสใหม่ต้องตรงกัน
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // ตรวจ OTP
    if (
      !user.otpCode ||
      user.otpCode !== otp ||
      user.otpExpiresAt < Date.now()
    ) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    // ตั้งรหัสใหม่
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    user.otpCode = undefined;
    user.otpExpiresAt = undefined;

    await user.save();

    // ส่งอีเมลแจ้งเตือนเปลี่ยนรหัสผ่านสำเร็จ
    await sendEmail(
      PASSWORD_RESET_SUCCESS_TEMPLATE,
      email,
      "Password Reset Successful"
    );

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// CHANGE PASSWORD (old password)
// ===============================
// POST /auth/change-password
router.post("/change-password", async (req, res) => {
  try {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;

    if (!email || !oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message:
          "email, oldPassword, newPassword, confirmPassword are required",
      });
    }

    // รหัสใหม่ต้องตรงกัน
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // หา user จาก email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // ตรวจรหัสเก่า
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // ตั้งรหัสใหม่
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    await user.save();

    // ส่งอีเมลแจ้งเตือนเปลี่ยนรหัสผ่าน (Change Password)
    await sendEmail(
      PASSWORD_CHANGE_SUCCESS_TEMPLATE,
      email,
      "Password Changed Successfully"
    );

    return res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password (no token) error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /auth/logout
router.get("/logout", (req, res) => {
  try {
    return res.status(200).json({
      message:
        "Logout successful. Please remove your token on the client side.",
    });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ✅ บรรทัดนี้สำคัญมาก ต้องอยู่ "ท้ายไฟล์จริง ๆ"
export default router;
