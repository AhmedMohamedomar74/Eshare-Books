import { configureStore } from "@reduxjs/toolkit";
import { orderReducer } from "./slices/OrderSlice";
import wishlistReducer from "./slices/wishlist.slice";
import reportReducer from "./slices/report.slice";
import bookReducer from "./slices/bookSlice.js";

const store = configureStore({
  reducer: {
    orders: orderReducer,
    wishlist: wishlistReducer,
    reports: reportReducer,
    books: bookReducer,
  },
});

export default store;
