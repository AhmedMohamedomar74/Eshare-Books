import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    ISBN: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    Title: {
      type: String,
      required: true,
      trim: true,
    },
    Description: {
      type: String,
      trim: true,
    },
    Category: {
      type: String,
      required: true,
      trim: true,
    },
    IsModerated: {
      type: Boolean,
      default: false,
    },
    UserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Condition: {
      type: String,
      enum: ["New", "Like New", "Used", "Very Used"],
      default: "Used",
    },
    TransactionType: {
      type: String,
      enum: ["Sale", "Borrow"], // بيع أو اقتراض
      required: true,
      default: "Sale",
    },
    image:{
      secure_url: {type:String},
      public_id: {type:String}
    },
    // Image: {
    //   type: String, // store image URL or file path
    //   trim: true,
    // },
    Price: {
      type: Number,
      required: true,
      min: 0,
    },
    Status: {
      type: String,
      enum: ["Available", "Sold", "Reserved"],
      default: "Available",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Book", bookSchema);
