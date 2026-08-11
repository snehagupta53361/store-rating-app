export default class ApiError extends Error {
  /**
    @param {number} statusCode
    @param {string} message
    @param {Array<{field?: string, message: string}>} [errors]
   */

  constructor(statusCode, message, errors = []) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }
  static unauthorized(message = "Unauthorized") {
    return new ApiError(401, message);
  }

  static forbidden(message = "Forbidden") {
    return new ApiError(403, message);
  }

  static notFound(message = "Resource not found") {
    return new ApiError(404, message);
  }

  static conflict(message = "Resource already exists") {
    return new ApiError(409, message);
  }

  static unprocessable(message = "Validation failed", errors = []) {
    return new ApiError(422, message, errors);
  }

  static sequelizeValidation(
    message = "Sequelize Validation Error",
    errors = [],
  ) {
    message = errors.map((e) => e.message).join(",");
    return new ApiError(400, message, errors);
  }

  static sequelizeUniqueConstraint(
    message = "Field already exist in the database.",
    errors = [],
  ) {
    const field = errors?.[0]?.path || "field";
    message = `${field} already exists`;
    return new ApiError(409, message, errors);
  }

  static sequelizeForeignKeyConstraint(
    message = "Referenced record does not exist.",
  ) {
    return new ApiError(400, message);
  }
  static sequelizeDatabase(message = "Invalid request data") {
    return new ApiError(400, message);
  }

  static jsonWebToken(message = "Invalid Token") {
    return new ApiError(401, message);
  }

  static tokenExpired(message = "Token Expired") {
    return new ApiError(401, message);
  }

  static internal(message = "Something went wrong") {
    return new ApiError(500, message);
  }
}
