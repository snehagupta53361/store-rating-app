import env from "./src/config/env.js";

import app from "./src/app.js";

let server;

const start = async () => {
  try {
    server = app.listen(env.port, () => {
      console.log(`Server Running in ${env.nodeEnv} mode on port ${env.port}`);
    });
  } catch (err) {
    console.error("[FATAL] failed to start server:", err.message);
    process.exit(1);
  }
};

const shutDown = (signal) => {
  console.log(`Server received ${signal}. Shutting down gracefully...`);
  if (server) {
    server.close(async () => {
      console.log(`Server closed remaining connections. Exiting.`);
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on("SIGINT", () => shutDown("SIGINT"));
process.on("SIGTERM", () => shutDown("SIGTERM"));

process.on("unhandledRejection", (reason) => {
  console.error("[UNHANDLED REJECTION]", reason);
  process.exit(1);
});

start();
