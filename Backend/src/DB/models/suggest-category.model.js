// models/suggest-category.model.js
import mongoose from 'mongoose';

const suggestCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },
    suggestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const suggestCategoryModel = mongoose.model('suggest-category', suggestCategorySchema);
export default suggestCategoryModel;
