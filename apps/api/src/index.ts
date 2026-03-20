import cors from "cors";
import "dotenv/config";
import express from "express";
import { env } from "./env.js";
import { errorHandler } from "./middleware/error.js";
import { sendResponse } from "./utils/response.js";

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/health", (req, res) => {
  sendResponse(res, {
    status: "Healthy",
    uptime: process.uptime(),
  });
});

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`🚀 API Server running at http://localhost:${env.PORT}`);
});
