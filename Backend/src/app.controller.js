import { testConnection } from "./DB/connection.db.js";
import express from "express";
import cors from "cors";
import path from "node:path";
import dotenv from "dotenv";
import authRoute from "./modules/auth/auth.route.js";
import imgController from "./modules/image/image.route.js";
import operationRouter from "./modules/operation/operation.route.js";
import userController from "./modules/user/user.route.js";
import reportRouter from "./modules/report/report.route.js";
import bookController from "./modules/Book/book.contoroller.js";
import { glopalErrorHandling } from "./utils/glopalErrorHandling.js";
import categoryRouter from "./modules/category/category.route.js";
import wishlistRouter from "./modules/wishlist/wishlist.route.js";

async function bootstrap() {
  dotenv.config({

    // path: path.resolve('./config/dev.env'),
     path: path.resolve("./.env"),
   });
  const port = process.env.PORT;
  const app = express();
  // DB
  testConnection();

  app.use(
    cors({
      origin: "*", // Allow all origins
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
      credentials: true,
    })
  );

  app.use(express.json());
  app.use("/auth", authRoute);
  app.use("/operations", operationRouter);
  app.use("/image", imgController);
  app.use("/user", userController);
  app.use("/reports", reportRouter);
  app.use("/books", bookController);
  app.use("/categories", categoryRouter);
  app.use("/wishlist", wishlistRouter);

  app.get("/", (req, res) => {
    res.json({ message: "Eshare Books is running" });
  });

  app.use(glopalErrorHandling);
  app.listen(port, () => {
    console.log(`Server is running on port = ${port}`);
  });
}

export default bootstrap;
