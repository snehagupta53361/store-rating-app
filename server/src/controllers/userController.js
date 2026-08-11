import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import * as userService from "../services/userService.js";
import { validationResult } from "express-validator";

const sanitizeUser = (user) => {
  if (!user) return null;

  const { password, ...safe } = user;

  return safe;
};

export const createUser = asyncHandler(async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw ApiError.badRequest("Request body is required");
  }

  const user = await userService.createUser(req.body);

  return new ApiResponse(201, "User created successfully.", {
    user: sanitizeUser(user.dataValues),
  }).send(res);
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw ApiError.unprocessable("Validation failed", errors.array());
  }

  const { name, email, address, role } = req.query;
  const users = await userService.getAllUsers({ name, email, address, role });

  return new ApiResponse(200, "Users fetched successfully", users).send(res);
});

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !/^\d+$/.test(id)) {
    throw ApiError.badRequest("A valid numeric user id is required");
  }
  const user = await userService.getUserById(id);
  return new ApiResponse(200, "User fetched successfully", user).send(res);
});
