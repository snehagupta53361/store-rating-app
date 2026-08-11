import { body } from "express-validator";
import {
  nameRule,
  emailRule,
  addressRule,
  passwordRule,
} from "./commonValidator.js";

export const signupValidator = [
  nameRule,
  emailRule,
  addressRule,
  passwordRule("password"),
];

export const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const updatePasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  passwordRule("newPassword").custom((value, { req }) => {
    if (value === req.body.currentPassword) {
      throw new Error(
        "New password must be different from the current password",
      );
    }
    return true;
  }),
];
