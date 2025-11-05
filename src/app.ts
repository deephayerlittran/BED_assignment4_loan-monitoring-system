import express, { Express } from "express";
import morgan from "morgan";
import helmet from "helmet";
import v1Router from "./api/v1/routes";
import { errorHandler } from "./api/v1/errors/errorHandler";

const app: Express = express();

app.use(helmet());
app.use(express.json());

// logging - use morgan in dev
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

app.use("/api/v1", v1Router);

// health
app.get("/api/v1/health", (_req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// global error handler (last)
app.use(errorHandler);

export default app;
