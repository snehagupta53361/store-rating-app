import { Op, fn, col } from "sequelize";
import { User, Store, Rating } from "../models/index.js";
import ApiError from "../utils/ApiError.js";

const createStore = async ({ name, email, address, ownerId }) => {
  const owner = await User.findByPk(ownerId);
  if (!owner) {
    throw ApiError.badRequest(`No user found with id ${ownerId}`);
  }
  if (owner.role !== "STORE_OWNER") {
    throw ApiError.badRequest("Assigned owner must have the STORE_OWNER role");
  }

  const existingByEmail = await Store.findOne({ where: { email } });
  if (existingByEmail) {
    throw ApiError.conflict(`Store with email ${email} already exists`);
  }

  const existingByOwner = await Store.findOne({ where: { ownerId } });
  if (existingByOwner) {
    throw ApiError.conflict("This user already owns a store");
  }

  const store = await Store.create({ name, email, address, ownerId });

  return store.toJSON();
};

const getAllStoresForAdmin = async (filters = {}) => {
  const where = buildStoreWhere(filters, { includeEmail: true });

  const stores = await Store.findAll({ where, order: [["createdAt", "DESC"]] });

  const ratingMap = await getAverageRatingMap(stores.map((s) => s.id));

  return stores.map((store) => {
    const plain = store.toJSON();
    return { ...plain, overallRating: ratingMap.get(plain.id) ?? null };
  });
};

const getAllStoresForUser = async (filters = {}, userId) => {
  const where = buildStoreWhere(filters, { includeEmail: false });

  const stores = await Store.findAll({ where, order: [["createdAt", "DESC"]] });
  const storeIds = stores.map((s) => s.id);

  const [ratingMap, myRatingMap] = await Promise.all([
    getAverageRatingMap(storeIds),
    getUserRatingMap(storeIds, userId),
  ]);

  return stores.map((store) => {
    const plain = store.toJSON();
    return {
      ...plain,
      overallRating: ratingMap.get(plain.id) ?? null,
      myRating: myRatingMap.get(plain.id) ?? null,
    };
  });
};

const buildStoreWhere = (filters, { includeEmail }) => {
  const where = {};
  if (filters.name) {
    where.name = { [Op.like]: `%${filters.name}%` };
  }
  if (includeEmail && filters.email) {
    where.email = { [Op.like]: `%${filters.email}%` };
  }
  if (filters.address) {
    where.address = { [Op.like]: `%${filters.address}%` };
  }
  return where;
};

const getAverageRatingMap = async (storeIds) => {
  if (storeIds.length === 0) return new Map();

  const rows = await Rating.findAll({
    where: { storeId: { [Op.in]: storeIds } },
    attributes: ["storeId", [fn("AVG", col("rating")), "avgRating"]],
    group: ["storeId"],
    raw: true,
  });

  return new Map(
    rows.map((r) => [r.storeId, Math.round(parseFloat(r.avgRating) * 10) / 10]),
  );
};

const getUserRatingMap = async (storeIds, userId) => {
  if (storeIds.length === 0) return new Map();

  const rows = await Rating.findAll({
    where: { storeId: { [Op.in]: storeIds }, userId },
    attributes: ["storeId", "rating"],
    raw: true,
  });

  return new Map(rows.map((r) => [r.storeId, r.rating]));
};

const upsertRating = async ({ userId, storeId, rValue }) => {
  const store = await Store.findByPk(storeId);
  if (!store) {
    throw ApiError.notFound(`Store with id ${storeId} not found`);
  }

  const [rating, created] = await Rating.findOrCreate({
    where: { userId, storeId },
    defaults: { rating: rValue },
  });

  if (!created && rating.rating !== rValue) {
    rating.rating = rValue;
    await rating.save();
  }

  return { storeId, rating: rating.rating, wasUpdated: !created };
};

export default {
  createStore,
  getAllStoresForAdmin,
  getAllStoresForUser,
  upsertRating,
};
