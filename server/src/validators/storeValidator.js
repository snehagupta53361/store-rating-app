import { body, query } from "express-validator";
import {
  nameRule,
  emailRule,
  addressRule,
  idParamValidator,
} from "./commonValidator.js";

export const createStoreValidator = [
  nameRule,
  emailRule,
  addressRule,
  body("ownerId")
    .notEmpty()
    .withMessage("ownerId is required.")
    .isInt({ min: 1 })
    .withMessage("ownerId must be a valid positive integer")
    .toInt(),
];

export const getAllStoresValidator = [
  query("name").optional().trim().isLength({ max: 60 }),
  query("email").optional().trim().isLength({ max: 100 }),
  query("address").optional().trim().isLength({ max: 400 }),
];

export const submitRatingValidator = [
  idParamValidator("id"),
  body("rating")
    .notEmpty()
    .withMessage("rating is required.")
    .isInt({ min: 1, max: 5 })
    .withMessage("rating must be an integer between 1 and 5")
    .toInt(),
];
