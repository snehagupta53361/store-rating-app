import express from "express";
import * as authController from "../controllers/authController.js";
import validate from "../middleware/validateMiddleware.js";
import {
  authenticate,
  requireFields,
  authorizeRoles,
} from "../middleware/authMiddleware.js";
import { ROLES } from "../constants/roles.js";
import {
  signupValidator,
  loginValidator,
  updatePasswordValidator,
} from "../validators/authValidator.js";

const router = express.Router();

//  Public routes

router.post(
  "/signup",
  requireFields(["name", "email", "address", "password"]),
  signupValidator,
  validate,
  authController.signup,
);
router.post(
  "/login",
  requireFields(["email", "password"]),
  loginValidator,
  validate,
  authController.login,
);

// Authenticated routes (any role)
router.patch(
  "/update-password",
  authenticate,
  requireFields(["currentPassword", "newPassword"]),
  updatePasswordValidator,
  validate,
  authController.updatePassword,
);

export default router;
