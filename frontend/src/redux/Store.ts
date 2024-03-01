import { configureStore } from "@reduxjs/toolkit";
import PostSlice from "./slice/PostingSlice";

export const Store = configureStore({
  reducer: {
    Post: PostSlice,
  },
});
