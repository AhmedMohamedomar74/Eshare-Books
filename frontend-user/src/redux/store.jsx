  import { configureStore } from "@reduxjs/toolkit";
  import { orderReducer } from "./slices/OrderSlice";

  const store = configureStore({
    reducer: {
      orders: orderReducer,
    },
  });

  export default store;
