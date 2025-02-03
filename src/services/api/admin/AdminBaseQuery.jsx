import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { adminLogout } from "@/redux/slices/AdminSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_BASE_URL}/api`,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  console.log("result", result);

  if (result?.error && result?.error?.status === 401) {
    const refreshResult = await baseQuery(
      "/auth/admin-refresh-token",
      api,
      extraOptions
    );
    console.log("refresh", refreshResult);

    if (refreshResult?.data) {
      const { accessToken } = refreshResult.data;
      if (accessToken) {
        localStorage.setItem("adminToken", accessToken);

        result = await baseQuery(args, api, extraOptions);
      }
    } else {
      api.dispatch(adminLogout());
    }
  }

  return result;
};
