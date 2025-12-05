import { configureStore } from "@reduxjs/toolkit";
import { orderReducer } from "./slices/OrderSlice";
import wishlistReducer from "./slices/wishlist.slice";
import reportReducer from "./slices/report.slice";
import bookReducer from "./slices/bookSlice.js";
import suggestCategoryReducer from "./slices/suggestCategory.slice.js";
import LangReducer from "./slices/LangReducer.js";
import ThemeReducer from "./slices/ThemeReducer.js";
import authReducer from "./slices/authReducer.js";

const store = configureStore({
  reducer: {
    orders: orderReducer,
    wishlist: wishlistReducer,
    reports: reportReducer,
    books: bookReducer,
    suggestCategory: suggestCategoryReducer,
    lang: LangReducer,
    theme: ThemeReducer,
    auth: authReducer,
  },
});

export default store;
