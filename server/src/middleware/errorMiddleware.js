// src/middlewares/error.middleware.js
import ApiError from "../utils/ApiError.js";
import env from "../config/env.js";

export const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

const normalizeError = (err) => {
  if (err instanceof ApiError) return err;

  // Sequelize errors
  if (err.name === "SequelizeValidationError") {
    const safeErrors = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return ApiError.sequelizeValidation(undefined, safeErrors);
  }
  if (err.name === "SequelizeUniqueConstraintError") {
    const safeErrors = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return ApiError.sequelizeUniqueConstraint(undefined, err.errors);
  }
  if (err.name === "SequelizeForeignKeyConstraintError") {
    return ApiError.sequelizeForeignKeyConstraint();
  }
  if (err.name === "SequelizeDatabaseError") {
    return ApiError.sequelizeDatabase();
  }

  // JWT errors
  if (err.name === "TokenExpiredError") {
    return ApiError.tokenExpired();
  }
  if (err.name === "JsonWebTokenError") {
    return ApiError.jsonWebToken();
  }

  if (err.type === "entity.parse.failed") {
    return ApiError.badRequest("Malformed JSON in request body.");
  }

  return ApiError.internal("Something went wrong. Please try again later.");
};

export const errorHandler = (err, req, res, next) => {
  const apiError = normalizeError(err);
  if (err.original?.sqlMessage) {
    console.error("SQL message:", err.original.sqlMessage);
  }
  if (!apiError.isOperational || apiError.statusCode >= 500) {
    console.error("[Unhandled error]", err);
  }

  const responseBody = {
    success: false,
    statusCode: apiError.statusCode,
    message: apiError.message,
    errors:
      apiError.errors && apiError.errors.length > 0
        ? apiError.errors
        : undefined,
    stack: env.nodeEnv === "development" ? err.stack : undefined,
  };

  console.log(responseBody);
  res.status(apiError.statusCode).json(responseBody);
};
