import { configureStore } from "@reduxjs/toolkit";
import { orderReducer } from "./slices/OrderSlice";
import { configureStore } from "@reduxjs/toolkit";
import wishlistReducer from "./slices/wishlist.slice";
import reportReducer from "./slices/report.slice";

const store = configureStore({
  reducer: {
    orders: orderReducer,
    wishlist: wishlistReducer,
    reports: reportReducer,
  },
});

export default store;
