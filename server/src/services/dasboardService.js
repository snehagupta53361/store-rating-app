import { User, Store, Rating } from "../models/index.js";
import ApiError from "../utils/ApiError.js";

const getAdminDashboard = async () => {
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    User.count(),
    Store.count(),
    Rating.count(),
  ]);

  return { totalUsers, totalStores, totalRatings };
};

const getStoreOwnerDashboard = async (storeOwnerId) => {
  const store = await Store.findOne({ where: { ownerId: storeOwnerId } });
  if (!store) {
    throw ApiError.notFound("No store is registered under this account yet");
  }

  const ratings = await Rating.findAll({
    where: { storeId: store.id },
    include: [{ model: User, as: "User", attributes: ["id", "name", "email"] }],
    order: [["createdAt", "DESC"]],
  });

  const raters = ratings.map((r) => ({
    userId: r.User.id,
    name: r.User.name,
    email: r.User.email,
    rating: r.rating,
  }));

  const averageRating =
    raters.length > 0
      ? Math.round(
          (raters.reduce((sum, r) => sum + r.rating, 0) / raters.length) * 10,
        ) / 10
      : null;

  return {
    store: {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
    },
    averageRating,
    totalRatings: raters.length,
    raters,
  };
};

export default { getAdminDashboard, getStoreOwnerDashboard };
