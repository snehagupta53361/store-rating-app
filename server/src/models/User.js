import { DataTypes } from "sequelize";
import { sequelize } from "../config/database_config.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: { len: [3, 60] },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("ADMIN", "NORMAL_USER", "STORE_OWNER"),
      allowNull: false,
      defaultValue: "NORMAL_USER",
    },
  },
  {
    tableName: "users",
    timestamps: true,
    defaultScope: {
      attributes: { exclude: ["password"] },
    },

    scopes: {
      withPassword: {
        attributes: {},
      },
    },
  },
);

export default User;
