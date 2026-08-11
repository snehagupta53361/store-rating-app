import express from "express";
import {
  authenticate,
  requireFields,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

import {
  createUserValidator,
  getAllUsersValidator,
} from "../validators/userValidator.js";
import validate from "../middleware/validateMiddleware.js";
import * as userController from "../controllers/userController.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();

router.use(authenticate, authorizeRoles(ROLES.ADMIN));

// create user
router.post(
  "/",
  requireFields(["name", "email", "address", "password", "role"]),
  createUserValidator,
  validate,
  userController.createUser,
);

// get all users
router.get("/", getAllUsersValidator, validate, userController.getAllUsers);

router.get("/:id", userController.getUserById);

export default router;
