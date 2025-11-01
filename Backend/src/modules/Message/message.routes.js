import express from "express";
import { messageController } from "./message.controller.js";

const router = express.Router();

router.get("/getChat/:senderId/:receiverId", messageController.getMessages);
router.post("/sendMessage", messageController.sendMessage);
router.patch("/markAsRead/:senderId/:receiverId", messageController.markAsRead);

export default router;

