import mongoose from "mongoose";
import { operationStatusEnum, operationTypeEnum } from "../../enum.js";

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

  book_src_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
  },
  book_dest_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
  },

  status: {
    type: String,
    enum: Object.values(operationStatusEnum),
    default: operationStatusEnum.PENDING,
  },

  operationType: {
    type: String,
    enum: Object.values(operationTypeEnum),
    required: true,
  },

  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  durationDays: { type: Number },
  isDeleted: { type: Boolean, default: false },
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
