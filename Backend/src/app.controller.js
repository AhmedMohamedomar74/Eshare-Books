import { testConnection } from "./DB/connection.db.js";
import express from "express";
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
import { intializer } from "./Gateways/soketio.gateway.js";

async function bootstrap() {
  dotenv.config();
  const port = process.env.PORT;
  const app = express();
  // DB
  testConnection();

  app.use(express.json());
  app.use("/auth", authRoute);
  app.use("/operations", operationRouter);
  app.use("/image", imgController);
  app.use("/user", userController);
  app.use("/reports", reportRouter);
  app.use("/books", bookController);
  app.use("/categories", categoryRouter);

  app.get("/", (req, res) => {
    res.json({ message: "Eshare Books is running" });
  });

  app.use(glopalErrorHandling);
  const httpServer = app.listen(port, () => {
    console.log(`Server is running on port = ${port}`);
  });
  intializer(httpServer)
}

export default bootstrap;
