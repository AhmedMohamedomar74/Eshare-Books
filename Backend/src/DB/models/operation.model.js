import mongoose from "mongoose";

const operationSchema = new mongoose.Schema({
  user_src: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  user_dest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  book_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "completed"],
    default: "pending",
  },

  date: { type: Date, default: Date.now },
});

const operationModel = mongoose.model("operation", operationSchema);
export default operationModel;
