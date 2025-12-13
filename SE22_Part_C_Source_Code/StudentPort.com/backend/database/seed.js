import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

import User from "../src/models/User.js";
import Portfolio from "../src/models/Portfolio.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected for seeding");

    // ลบข้อมูลเก่า (dummy only)
    await User.deleteMany();
    await Portfolio.deleteMany();

    // สร้าง users ตัวอย่าง
    // สร้าง users ตัวอย่าง (dummy data)
    const hashedPassword = await bcrypt.hash("123", 10);

    const superAdmin = await User.create({
      email: "super_admin@kmutt.ac.th",
      password: hashedPassword,
      displayName: "Thursday day",
      role: "SuperAdmin",
      status: "approved",
    });

    const advisorAdmin = await User.create({
      email: "admin_advisor@kmutt.ac.th",
      password: hashedPassword,
      displayName: "Wednesday day",
      role: "AdvisorAdmin",
      status: "approved",
    });

    const student = await User.create({
      email: "student@kmutt.ac.th",
      password: hashedPassword,
      displayName: "Monday day",
      role: "Student",
      status: "approved",
    });

    const recruiter = await User.create({
      email: "recruiter@company.com",
      password: hashedPassword,
      displayName: "Recruiter User",
      role: "Recruiter",
      status: "approved",
    });

    // สร้าง portfolio ตัวอย่าง
    await Portfolio.create({
      owner: student._id,
      title: "Sample Portfolio",
      university: "KMUTT",
      year: 2024,
      category: "Software Engineering",
      desc: "This is a dummy portfolio for testing.",
      visibility: "public",
      status: "approved",
    });

    console.log("🌱 Database seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();
