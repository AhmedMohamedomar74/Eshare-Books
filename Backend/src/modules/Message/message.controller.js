import MessageModel from "../../DB/models/message.model.js";

export const messageController = {
  // 📩 جلب المحادثة بين مستخدمين
  async getMessages(req, res) {
    try {
      const { senderId, receiverId } = req.params;

      const messages = await MessageModel.find({
        $or: [
          { sender: senderId, receiver: receiverId },
          { sender: receiverId, receiver: senderId },
        ],
      }).sort({ createdAt: 1 }); // ترتيب تصاعدي (من الأقدم للأحدث)

      res.status(200).json({ success: true, data: messages });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // ✉️ إرسال رسالة جديدة
  async sendMessage(req, res) {
    try {
      const { content, sender, receiver } = req.body;

      if (!content || !sender || !receiver) {
        return res
          .status(400)
          .json({ success: false, message: "Missing fields" });
      }

      const message = await MessageModel.create({ content, sender, receiver });
      const populatedMessage = await message.populate(["sender", "receiver"]);

      res.status(201).json({ success: true, data: populatedMessage });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // ✅ تحديث حالة القراءة
  async markAsRead(req, res) {
    try {
      const { senderId, receiverId } = req.params;

      await MessageModel.updateMany(
        { sender: senderId, receiver: receiverId, read: false },
        { $set: { read: true } }
      );

      res
        .status(200)
        .json({ success: true, message: "Messages marked as read" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};
