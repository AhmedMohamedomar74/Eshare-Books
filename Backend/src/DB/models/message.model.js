import mongoose, { Schema, Types } from "mongoose";

const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    sender: {
      type: Types.ObjectId,
      ref: "user", // 👈 لازم نفس الاسم اللي في userModel
      required: true,
    },
    receiver: {
      type: Types.ObjectId,
      ref: "user", // 👈 نفس الشيء
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const MessageModel = mongoose.model("Message", messageSchema);
export default MessageModel;
