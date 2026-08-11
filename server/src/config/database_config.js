import dotenv from "dotenv";
dotenv.config();
import mysql from "mysql2/promise";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
  },
);

// const ensureDatabaseExists = async () => {
//   const connection = await mysql.createConnection({
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//   });

//   await connection.query(
//     `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``,
//   );
//   await connection.end();
//   console.log(`Database "${process.env.DB_NAME}" is ready.`);
// };

const connectDB = async () => {
  try {
    // await ensureDatabaseExists();
    await sequelize.authenticate();
    console.log(`Database connected successfully.`);
  } catch (error) {
    console.error("Unable to connect to the database", error.message);
    process.exit(1);
  }
};

export { sequelize, connectDB };
