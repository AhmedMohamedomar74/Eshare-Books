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

  operationType: {
    type: String,
    enum: ["borrow", "buy"],
    required: true,
  },

  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  durationDays: { type: Number },
});

operationSchema.pre("save", function (next) {
  if (this.startDate && this.endDate) {
    const diff = (this.endDate - this.startDate) / (1000 * 60 * 60 * 24);
    this.durationDays = Math.ceil(diff);
  }
  next();
});

const operationModel = mongoose.model("operation", operationSchema);
export default operationModel;
