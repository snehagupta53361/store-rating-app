import dotenv from "dotenv";
dotenv.config();

const REQUIRED_VARS = [
  "DB_HOST",
  "DB_PORT",
  "DB_USER",
  "DB_NAME",
  "DB_PASSWORD",
  "JWT_SECRET",
];

const assertedRequiredEnvVars = () => {
  const missing = REQUIRED_VARS.filter((key) => {
    const value = process.env[key];
    return !value || value === "undefined" || value.trim() === "";
  });

  if (missing.length > 0) {
    console.error(
      `[FATAL] Missing required environment variables: ${missing.join(",")}. ` +
        "Check your .env file against .env example.",
    );

    process.exit();
  }
};

assertedRequiredEnvVars();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 8000,

  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },

  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  clientOrigin: process.env.FRONTEND_URL || "*",
};

export default env;
