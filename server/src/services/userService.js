import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { User, Store, Rating, sequelize } from "../models/index.js";
import ApiError from "../utils/ApiError.js";
import env from "../config/env.js";
import { ROLES } from "../constants/roles.js";

const CASE_INSENSITIVE_MATCH = Op.like;
// create user from admin service
export const createUser = async ({ name, email, address, password, role }) => {
  if (!Object.values(ROLES).includes(role)) {
    throw ApiError.badRequest("Invalid role.");
  }
  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    throw ApiError.conflict(`A user with this email ${email} already exists.`);
  }

  const hashedPassword = await bcrypt.hash(password, env.bcryptSaltRounds);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    address,
    role,
  });
  return user;
};

// get users service
export const getAllUsers = async (filters = {}) => {
  const where = {};

  if (filters.name) {
    where.name = { [CASE_INSENSITIVE_MATCH]: `%${filters.name}%` };
  }
  if (filters.email) {
    where.email = { [CASE_INSENSITIVE_MATCH]: `%${filters.email}%` };
  }
  if (filters.address) {
    where.address = { [CASE_INSENSITIVE_MATCH]: `%${filters.address}%` };
  }
  if (filters.role) {
    where.role = filters.role;
  }

  const users = await User.findAll({
    where,
    attributes: { exclude: ["password"] },
    order: [["createdAt", "DESC"]],
  });

  return Promise.all(users.map(attachRatingIfStoreOwner));
};

export const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ["password"] },
  });

  if (!user) {
    throw ApiError.notFound(`User with id ${id} not found`);
  }

  return attachRatingIfStoreOwner(user);
};

const attachRatingIfStoreOwner = async (user) => {
  const plain = user.toJSON ? user.toJSON() : user;

  if (plain.role !== "STORE_OWNER") {
    return plain;
  }

  const store = await Store.findOne({ where: { ownerId: plain.id } });
  if (!store) {
    return { ...plain, rating: null };
  }

  const result = await Rating.findOne({
    where: { storeId: store.id },
    attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "avgRating"]],
    raw: true,
  });

  const avg = result?.avgRating ? parseFloat(result.avgRating) : null;
  return { ...plain, rating: avg !== null ? Math.round(avg * 10) / 10 : null };
};
