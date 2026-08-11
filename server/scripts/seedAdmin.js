import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import { sequelize } from "../src/models/index.js";
import User from "../src/models/User.js";
import env from "../src/config/env.js";

const ADMIN_EMAIL = "snehaGuptaAdmin@storeapp.com";
const ADMIN_PASSWORD = "Admin@1234";
const ADMIN_NAME = "Admin Name";
const ADMIN_ADDRESS = "Admin Address";

const seedAdmin = async () => {
  try {
    await sequelize.authenticate();

    const existing = await User.findOne({ where: { email: ADMIN_EMAIL } });
    if (existing) {
      console.log(`Admin already exists: ${ADMIN_EMAIL}`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      ADMIN_PASSWORD,
      env.bcryptSaltRounds,
    );

    const admin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      address: ADMIN_ADDRESS,
      role: "ADMIN",
    });

    console.log("Admin created successfully:");
    console.log(`  email:    ${ADMIN_EMAIL}`);
    console.log(`  password: ${ADMIN_PASSWORD}`);
    console.log(`  id:       ${admin.id}`);
    process.exit(0);
  } catch (err) {
    console.error("Failed to seed admin:", err);
    process.exit(1);
  }
};

seedAdmin();
