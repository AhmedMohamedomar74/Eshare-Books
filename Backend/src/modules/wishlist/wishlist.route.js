import express from 'express';
import {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  getUserWishlist,
} from './wishlist.controller.js';
import { auth } from '../../middelwares/auth.middleware.js';
import { validateWishlist } from '../../middelwares/validation.middleware.js';

const wishlistRouter = express.Router();

wishlistRouter.use(auth);

// Add to wishlist
wishlistRouter.post('/', validateWishlist, addToWishlist);

// Get wishlist
wishlistRouter.get('/', getUserWishlist);

// Remove single book
wishlistRouter.delete('/:bookId', removeFromWishlist);

// Clear wishlist
wishlistRouter.delete('/', clearWishlist);

export default wishlistRouter;
