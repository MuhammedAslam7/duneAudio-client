import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adminId: null,
  email: null,
  role: null,
  isAuthenticated: false,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      const { admin } = action.payload;
      state.adminId = admin.adminId;
      state.email = admin.email;
      state.role = admin.role;
      state.isAuthenticated = true;
    },
    adminLogout: (state) => {
      state.adminId = null;
      state.email = null;
      state.role = null;
      state.isAuthenticated = false;
      localStorage.removeItem("adminToken");
    },
  },
});

export const { setAdmin, adminLogout } = adminSlice.actions;
export default adminSlice.reducer;
