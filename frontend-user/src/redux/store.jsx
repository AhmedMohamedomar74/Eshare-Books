import { configureStore } from '@reduxjs/toolkit';
import wishlistReducer from './slices/wishlist.slice';
import reportReducer from './slices/report.slice';

const store = configureStore({
  reducer: {
    wishlist: wishlistReducer,
    reports: reportReducer,
  },
});

export default store;
