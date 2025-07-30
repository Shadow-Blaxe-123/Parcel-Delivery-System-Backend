import express, { Application } from "express";
import cors from "cors";
import notFound from "./middleware/404NotFound";
import globalErrorHandler from "./middleware/globalErrorHandler";
const app: Application = express();

// 3rd party middleware
app.use(express.json());
app.use(cors);

// Routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

// Error handlers
app.use(globalErrorHandler);
app.use(notFound);
export default app;
