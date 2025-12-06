import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import orderReducer from "./slices/order-slice";
import cartReducer from "./slices/cart-slice";
import wishlistReducer from "./slices/wishlist-slice";
import appReducer from "./slices/app-slice";
import { api } from "./services/api";

const rootReducer = combineReducers({
  order: orderReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  app: appReducer,

  [api.reducerPath]: api.reducer,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["cart", "wishlist"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(api.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const store = makeStore();
export const persistor = persistStore(store);
