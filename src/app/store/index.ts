import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/users/userSlice";
import cartReducer from "./features/cart/cartSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
};

const combinedReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
});

const persistedReducer = persistReducer(persistConfig, combinedReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
