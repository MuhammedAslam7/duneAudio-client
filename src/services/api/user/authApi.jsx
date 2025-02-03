import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryUser";

export const authApi = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (formData) => ({
        url: "auth/signup",
        method: "POST",
        body: formData,
      }),
    }),
    verifyOTP: builder.mutation({
      query: ({ email, otpValue }) => ({
        url: "auth/verify-otp",
        method: "POST",
        body: { email, otpValue },
      }),
    }),
    resendOTP: builder.mutation({
      query: ({ email }) => ({
        url: "auth/resend-otp",
        method: "POST",
        body: { email },
      }),
    }),
    signIn: builder.mutation({
      query: (credentials) => ({
        url: "/auth/signin",
        method: "POST",
        body: credentials,
      }),
    }),
    adminSignIn: builder.mutation({
      query: (credentials) => ({
        url: "/auth/admin/signin",
        method: "POST",
        body: credentials,
      }),
    }),
    adminlogout: builder.mutation({
      query: () => ({
        url: "/auth/admin/logout",
        method: "POST",
      }),
    }),
    userlogout: builder.mutation({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
    }),
    resetPassword: builder.mutation({
      query: (formData) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: formData,
      }),
    }),
    resetVerifyOTp: builder.mutation({
      query: ({ email, otpValue }) => ({
        url: "/auth/reset-verify-otp",
        method: "POST",
        body: { email, otpValue },
      }),
    }),
    confirmResetPassword: builder.mutation({
      query: ({ newPassword, email }) => ({
        url: "auth/confirm-reset-password",
        method: "POST",
        body: { newPassword, email },
      }),
    }),
    signWithGoogleAuth: builder.mutation({
      query: ({ username, email }) => ({
        url: "auth/google-auth",
        method: "POST",
        body: { username, email },
      }),
    }),
  }),
});

export const {
  useSignUpMutation,
  useVerifyOTPMutation,
  useResendOTPMutation,
  useSignInMutation,
  useAdminSignInMutation,
  useAdminlogoutMutation,
  useUserlogoutMutation,
  useResetPasswordMutation,
  useResetVerifyOTpMutation,
  useConfirmResetPasswordMutation,
  useSignWithGoogleAuthMutation,
} = authApi;
