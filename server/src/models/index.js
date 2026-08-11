import { sequelize } from "../config/database_config.js";
import User from "./User.js";
import Store from "./Store.js";
import Rating from "./Rating.js";

Store.belongsTo(User, { as: "owner", foreignKey: "ownerId" });
User.hasOne(Store, { as: "ownedStore", foreignKey: "ownerId" });

Rating.belongsTo(User, { foreignKey: "userId" });
Rating.belongsTo(Store, { foreignKey: "storeId" });
User.hasMany(Rating, { foreignKey: "userId" });
Store.hasMany(Rating, { foreignKey: "storeId" });

export { sequelize, User, Store, Rating };
