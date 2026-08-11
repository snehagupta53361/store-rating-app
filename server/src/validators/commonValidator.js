import { body, query, param } from "express-validator";
import { ALL_ROLES } from "../constants/roles.js";

const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>~`[\]|\\/?"'])[A-Za-z\d!@#$%^&*()\-_=+{};:,<.>~`[\]|\\/?"']{8,16}$/;

export const nameRule = body("name")
  .trim()
  .notEmpty()
  .withMessage("Name is required.")
  .isLength({ min: 10, max: 60 })
  .withMessage("Name must be between 20 and 60 characters");

export const emailRule = body("email")
  .trim()
  .notEmpty()
  .withMessage("Email is required.")
  .isEmail()
  .withMessage("A valid email is required")
  .normalizeEmail();

export const addressRule = body("address")
  .trim()
  .notEmpty()
  .withMessage("Address is required.")
  .isLength({ max: 400 })
  .withMessage("Address must not exceed 400 characters");

export const passwordRule = (field = "password") =>
  body(field)
    .notEmpty()
    .withMessage(`${field === "password" ? "Password" : field} is required`)
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be 8-16 characters")
    .matches(PASSWORD_REGEX)
    .withMessage(
      "Password must include at least one uppercase letter and one special character",
    );

export const idParamValidator = (field = "id") =>
  param(field)
    .trim()
    .notEmpty()
    .withMessage(`${field} is required.`)
    .isInt({ min: 1 })
    .withMessage(`A valid ${field} is required`)
    .toInt();
