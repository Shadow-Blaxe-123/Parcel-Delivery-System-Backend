import express, { Application } from "express";
import cors from "cors";
import notFound from "./middleware/404NotFound";
import globalErrorHandler from "./middleware/globalErrorHandler";
import router from "./routes";
import cookieParser from "cookie-parser";
const app: Application = express();

// 3rd party middleware
app.use(express.json());
app.set("trust proxy", 1);
app.use(cors());
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});
app.use("/api/v1", router);

// Error handlers
app.use(globalErrorHandler);
app.use(notFound);
export default app;
