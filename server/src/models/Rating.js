import { DataTypes } from "sequelize";
import { sequelize } from "../config/database_config.js";

const Rating = sequelize.define(
  "Rating",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "userId",
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "storeId",
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
  },
  {
    tableName: "ratings",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "storeId"],
      },
    ],
  },
);

export default Rating;
