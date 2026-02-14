// import { messageService } from "../../modules/Message/message.service.js";

// export const chatSocket = (io) => {
//   const onlineUsers = new Map();

//   io.on("connection", (socket) => {
//     console.log("🟢 New user connected:", socket.id);

//     // المستخدم يرسل userId أول ما يتصل
//     socket.on("join", (userId) => {
//       onlineUsers.set(userId, socket.id);
//       socket.join(userId); // عشان نستقبل الرسائل الموجهة ليه
//       console.log(`✅ User ${userId} joined`);
//     });

//     // إرسال رسالة
//     socket.on("sendMessage", async (data) => {
//       const { content, sender, receiver } = data;
//       if (!content || !sender || !receiver) return;

//       try {
//         // احفظ الرسالة في قاعدة البيانات
//         const message = await messageService.createMessage({ content, sender, receiver });

//         // ابعت الرسالة للمستقبل (لو متصل)
//         io.to(receiver).emit("receiveMessage", message);

//         // أكد للإرسال (يرجع للمرسل نفسه)
//         io.to(sender).emit("messageSent", message);
//       } catch (err) {
//         console.error("sendMessage error:", err);
//       }
//     });

//     // typing indicator
//     socket.on("typing", ({ sender, receiver }) => {
//       io.to(receiver).emit("typing", { sender });
//     });

//     socket.on("disconnect", () => {
//       for (const [userId, id] of onlineUsers.entries()) {
//         if (id === socket.id) onlineUsers.delete(userId);
//       }
//       console.log("🔴 User disconnected:", socket.id);
//     });
//   });
// };
