import { DataTypes } from "sequelize";
import { sequelize } from "../config/database_config.js";

const Store = sequelize.define(
  "Store",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      field: "ownerId",
    },
  },
  {
    tableName: "stores",
    timestamps: true,
  },
);

export default Store;
