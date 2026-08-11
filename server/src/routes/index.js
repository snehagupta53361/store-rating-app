import express from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import storeRoutes from "./storeRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Api is healthy." });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/stores", storeRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
