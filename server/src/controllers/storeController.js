import { validationResult } from "express-validator";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import storeService from "../services/storeService.js";

export const createStore = asyncHandler(async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw ApiError.badRequest("Request body is required");
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw ApiError.unprocessable("Validation failed", errors.array());
  }

  const { name, email, address, ownerId } = req.body;
  const store = await storeService.createStore({
    name,
    email,
    address,
    ownerId,
  });

  return new ApiResponse(201, "Store created successfully", store).send(res);
});

export const getAllStores = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw ApiError.unprocessable("Validation failed", errors.array());
  }

  const { name, email, address } = req.query;
  const filters = { name, email, address };

  let stores;
  if (req.user.role === "ADMIN") {
    stores = await storeService.getAllStoresForAdmin(filters);
  } else if (req.user.role === "NORMAL_USER") {
    stores = await storeService.getAllStoresForUser(filters, req.user.id);
  } else {
    throw ApiError.forbidden("This role cannot list stores here");
  }

  return new ApiResponse(200, "Stores fetched successfully", stores).send(res);
});

export const submitRating = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw ApiError.unprocessable("Validation failed", errors.array());
  }

  const storeId = req.params.id;
  const { rating } = req.body;

  const result = await storeService.upsertRating({
    userId: req.user.id,
    storeId,
    rValue: rating,
  });

  const message = result.wasUpdated
    ? "Rating updated successfully"
    : "Rating submitted successfully";
  return new ApiResponse(200, message, result).send(res);
});
