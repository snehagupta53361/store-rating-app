import bcrypt from "bcryptjs";
import ApiError from "../utils/ApiError.js";
import User from "../models/User.js";
import { signAccessToken } from "../utils/token.js";
import env from "../config/env.js";
import { ROLES } from "../constants/roles.js";

// Signup service
export const signupUser = async ({ name, email, address, password }) => {
  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    throw ApiError.conflict("An account with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, env.bcryptSaltRounds);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    address,
    role: ROLES.NORMAL_USER,
  });

  const token = signAccessToken({
    id: user.id,
    role: user.role,
  });

  return {
    user,
    token,
  };
};

// login service
export const loginUser = async ({ email, password }) => {
  const user = await User.scope("withPassword").findOne({ where: { email } });

  if (!user) {
    throw ApiError.unauthorized("Invalid email or password.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw ApiError.unauthorized("Invalid email or password.");
  }

  const token = signAccessToken({
    id: user.id,
    role: user.role,
  });

  return {
    user,
    token,
  };
};

// update password service
export const updateUserPassword = async ({
  userId,
  currentPassword,
  newPassword,
}) => {
  const user = await User.scope("withPassword").findByPk(userId);

  if (!user) {
    throw ApiError.notFound("User not found.");
  }

  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!isCurrentPasswordValid) {
    throw ApiError.unauthorized("Current password is incorrect.");
  }

  const hashedPassword = await bcrypt.hash(newPassword, env.bcryptSaltRounds);

  await User.update({ password: hashedPassword }, { where: { id: userId } });
};
