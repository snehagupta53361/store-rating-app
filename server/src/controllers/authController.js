import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import * as authService from "../services/authService.js";

const sanitizeUser = (user) => {
  if (!user) return null;

  const { password, ...safe } = user;

  console.log(safe);
  return safe;
};

export const signup = asyncHandler(async (req, res) => {
  const result = await authService.signupUser(req.body);

  return new ApiResponse(201, "Account created successfully.", {
    user: sanitizeUser(result.user.dataValues),
    token: result.token,
  }).send(res);
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);
  return new ApiResponse(200, "Logged in successfully.", {
    user: sanitizeUser(result.user.dataValues),
    token: result.token,
  }).send(res);
});

export const updatePassword = asyncHandler(async (req, res) => {
  await authService.updateUserPassword({
    userId: req.user.id,
    currentPassword: req.body.currentPassword,
    newPassword: req.body.newPassword,
  });

  return new ApiResponse(200, "Password updated successfully.").send(res);
});
