import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import env from "./config/env.js";
import { notFoundHandler, errorHandler } from "./middleware/errorMiddleware.js";
import { connectDB, sequelize } from "../src/models/index.js";
import "./models/index.js";

// import routes
import routes from "./routes/index.js";

// initialize express app
const app = express();

// security & utility middleware
app.use(helmet());
//middleware to handle cors
console.log(process.env.FRONTEND_URL);
app.use(
  cors({
    origin: env.clientOrigin,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    // credentials: true,
  }),
);

app.use(express.json());
if (env.nodeEnv !== "test") {
  app.use(morgan(env.nodeEnv === "development" ? "dev" : "combined"));
}

// Routes

app.use("/api", routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Centralized error handler
app.use(notFoundHandler);
app.use(errorHandler);

// connect to database

await connectDB();
if (process.env.NODE_ENV !== "production") {
  await sequelize.sync();
}
console.log("Models synced - tables are ready.");

export default app;
