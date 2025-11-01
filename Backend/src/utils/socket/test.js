
// /////////////////////////
// import express from "express";
// import path from "node:path";
// import dotenv from "dotenv";
// import cors from "cors";
// import http from "http";
// import { Server } from "socket.io";

// // 🧩 Routes
// import authRoute from "./modules/auth/auth.route.js";
// import imgController from "./modules/image/image.route.js";
// import operationRouter from "./modules/operation/operation.route.js";
// import userController from "./modules/user/user.route.js";
// import reportRouter from "./modules/report/report.route.js";
// import bookController from "./modules/Book/book.contoroller.js";
// import messageRoutes from "./modules/Message/message.routes.js";

// // 🧩 Utils & Config
// import { testConnection } from "./DB/connection.db.js";
// import { glopalErrorHandling } from "./utils/glopalErrorHandling.js";
// import { chatSocket } from "./utils/socket/chatSocket.js";

// // 🌿 Load .env file
// // dotenv.config({
// //   path: path.resolve("./config/dev.env"),
// // });

// // 🚀 Start App
// async function bootstrap() {
//   const app = express();
//   const port = process.env.PORT || 5000;

//   // Connect DB
//   await testConnection();

//   // Middleware
//   app.use(cors());
//   app.use(express.json());

//   // Routes
//   app.get("/", (req, res) => res.json({ message: "📚 Eshare Books is running" }));
//   app.use("/auth", authRoute);
//   app.use("/operations", operationRouter);
//   app.use("/image", imgController);
//   app.use("/user", userController);
//   app.use("/reports", reportRouter);
//   app.use("/books", bookController);
//   app.use("/messages", messageRoutes);

//   // Error handling
//   app.use(glopalErrorHandling);

//   // HTTP + SOCKET setup
//   const server = http.createServer(app);
//   const io = new Server(server, {
//     cors: { origin: "*" },
//   });

//   // Initialize chat sockets
//   chatSocket(io);

//   // Start listening
//   server.listen(port, () => console.log(`✅ Server running on port ${port}`));
// }

// export default bootstrap;
