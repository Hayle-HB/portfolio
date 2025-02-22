import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "../features/ui/uiSlice";
import themeReducer from "../features/theme/themeSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["ui/updateScreenSize"],
      },
    }),
});

export default store;
