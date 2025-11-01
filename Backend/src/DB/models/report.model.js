import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'Reporter ID is required.'],
      validate: {
        validator: mongoose.Types.ObjectId.isValid,
        message: 'Invalid reporter ID format.',
      },
    },

    targetType: {
      type: String,
      required: [true, 'Target type is required.'],
      enum: {
        values: ['Book', 'user'],
        message: "Target type must be either 'Book' or 'User'.",
      },
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Target ID is required.'],
      validate: {
        validator: mongoose.Types.ObjectId.isValid,
        message: 'Invalid target ID format.',
      },
    },

    reason: {
      type: String,
      required: [true, 'Report reason is required.'],
      trim: true,
      enum: {
        values: [
          'Inappropriate Content',
          'Spam or Fake',
          'Offensive Language',
          'Harassment',
          'Scam or Fraud',
          'Other',
        ],
        message: 'Invalid reason type.',
      },
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters.'],
      default: '',
    },

    status: {
      type: String,
      enum: {
        values: ['Pending', 'Reviewed', 'Dismissed', 'Cancelled'],
        message: 'Status must be one of: Pending, Reviewed, or Dismissed.',
      },
      default: 'Pending',
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

reportSchema.index(
  { reporterId: 1, targetId: 1, targetType: 1 },
  { unique: true, message: 'You have already reported this target.' }
);

const Report = mongoose.model('Report', reportSchema);
export default Report;
