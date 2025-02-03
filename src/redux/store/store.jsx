import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../../services/api/user/authApi";
import userReducer from "../slices/userSlice";
import { userApi } from "@/services/api/user/userApi";
import adminReducer from "../slices/AdminSlice";
import { adminApi } from "@/services/api/admin/adminApi";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "admin"], //persit user and admin
};

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [adminApi.reducerPath]: adminApi.reducer,

  user: userReducer,
  admin: adminReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(authApi.middleware)
      .concat(userApi.middleware)
      .concat(adminApi.middleware),
});

export const persistor = persistStore(store);
