import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./slices/globalSlice";
import { apiSlice } from "./api/apiSlice";

export const store = configureStore({
  reducer: {
    global: globalReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
