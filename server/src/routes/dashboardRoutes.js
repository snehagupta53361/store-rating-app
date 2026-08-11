import { Router } from "express";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";
import dashboardController from "../controllers/dashboardController.js";

const router = Router();

router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "STORE_OWNER"),
  dashboardController.getDashboard,
);

export default router;
