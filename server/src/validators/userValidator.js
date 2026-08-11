import { body, query } from "express-validator";
import { ALL_ROLES } from "../constants/roles.js";
import {
  nameRule,
  emailRule,
  addressRule,
  passwordRule,
} from "./commonValidator.js";

const roleRule = body("role")
  .trim()
  .notEmpty()
  .withMessage("Role is required.")
  .toUpperCase()
  .isIn(ALL_ROLES)
  .withMessage(`Role must be one of: ${ALL_ROLES.join(", ")}`);

export const createUserValidator = [
  nameRule,
  emailRule,
  addressRule,
  passwordRule("password"),
  roleRule,
];

export const getAllUsersValidator = [
  query("name").optional().trim().isLength({ max: 60 }),
  query("email").optional().trim().isLength({ max: 100 }),
  query("address").optional().trim().isLength({ max: 400 }),
  query("role")
    .optional()
    .trim()
    .toUpperCase()
    .isIn(ALL_ROLES)
    .withMessage(`Role filter must be one of: ${ALL_ROLES.join(", ")}`),
];
