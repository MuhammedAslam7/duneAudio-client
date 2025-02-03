import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  email: null,
  role: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user } = action.payload;

      state.userId = user.userId;
      state.email = user.email;
      state.role = user.role;
      state.isAuthenticated = true;
    },

    userLogout: (state) => {
      state.userId = null;
      state.email = null;
      state.role = null;
      state.isAuthenticated = false;
      localStorage.removeItem("userToken");
    },
  },
});

export const { setUser, userLogout } = userSlice.actions;
export default userSlice.reducer;
export const selectCurrentUser = (state) => state.auth.user;
