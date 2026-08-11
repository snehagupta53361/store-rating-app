import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";

const validate = (req, res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  const error = result.array({ onlyFirstError: true }).map((err) => ({
    field: err.type === "field" ? err.path : undefined,
    message: err.msg,
  }));

  return next(ApiError.unprocessable("Validation Failed", error));
};

export default validate;
