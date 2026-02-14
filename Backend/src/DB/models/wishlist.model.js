import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'User ID is required.'],
      unique: true,
      validate: {
        validator: mongoose.Types.ObjectId.isValid,
        message: 'Invalid user ID format.',
      },
    },
    items: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Book',
          required: [true, 'Book ID is required.'],
          validate: {
            validator: mongoose.Types.ObjectId.isValid,
            message: 'Invalid book ID format.',
          },
        },
      },
    ],
  },
  { timestamps: true }
);

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
export default Wishlist;
