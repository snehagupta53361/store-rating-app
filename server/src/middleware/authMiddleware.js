import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { verifyAccessToken } from "../utils/token.js";
import User from "../models/User.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw ApiError.unauthorized(
      "Authentication token missing. Expected: Authorization: Bearer <token>",
    );
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw ApiError.unauthorized("Session expired. Please log in again.");
    }
    throw ApiError.unauthorized("Invalid authentication token.");
  }

  const user = await User.findOne({ where: { id: payload.sub } });
  if (!user) {
    throw ApiError.unauthorized(
      "User belonging to this token no longer exists.",
    );
  }

  req.user = user.dataValues;

  next();
});

export const requireFields = (fields) => {
  return (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      throw ApiError.badRequest("Request body is required");
    }
    const missing = fields.filter((key) => {
      const value = req.body[key];
      return value === undefined || value === null || value === "";
    });

    if (missing.length > 0) {
      return next(
        ApiError.badRequest(`Missing required field(s): ${missing.join(", ")}`),
      );
    }
    next();
  };
};

export const authorizeRoles =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized("Authentication required."));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          "You do not have permission to perform this action.",
        ),
      );
    }
    return next();
  };
