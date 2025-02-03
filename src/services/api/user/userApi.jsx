import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryUser";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "home",
    "Cart",
    "Address",
    "Profile",
    "ProductDetails",
    "MyOrders",
    "Wishlist",
    "Wallet",
  ],
  endpoints: (builder) => ({
    userHome: builder.query({
      query: () => ({
        url: "user/home",
        method: "GET",
        providesTags: ["home"],
      }),
    }),
    ProductDetails: builder.query({
      query: (id) => ({
        url: `user/product-details/${id}`,
        method: "GET",
      }),
      providesTags: ["ProductDetails"],
    }),
    productsList: builder.query({
      query: ({
        page,
        limit,
        minPrice,
        maxPrice,
        categories,
        brands,
        sort,
        search,
      }) => ({
        url: `user/product-page`,
        method: "GET",
        params: {
          page,
          limit,
          minPrice,
          maxPrice,
          categories: categories?.join(","),
          brands: brands?.join(","),
          sort,
          search,
        },
      }),
    }),
    allProductsForSearch: builder.query({
      query: () => ({
        url: "user/all-products-for-search",
      }),
    }),

    addToCart: builder.mutation({
      query: ({ productId, color }) => ({
        url: "user/add-to-cart",
        method: "POST",
        body: { productId, color },
      }),
      invalidatesTags: ["Cart"],
    }),
    cartProducts: builder.query({
      query: (userId) => ({
        url: `user/cart?userId=${userId}`,
        method: "GET",
      }),
      providesTags: ["Cart"],
    }),
    verifyStock: builder.query({
      query: () => ({
        url: "user/verify-stock",
        method: "GET",
      }),
    }),
    checkoutPage: builder.query({
      query: () => ({
        url: "user/checkout-page",
        method: "GET",
      }),
    }),
    getPaymentPage: builder.query({
      query: () => ({
        url: "user/payment-page",
        method: "GET",
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCartQuantity: builder.mutation({
      query: ({ productId, variantId, newQuantity }) => ({
        url: "user/update-quantity",
        method: "PUT",
        body: { productId, variantId, newQuantity },
      }),
      invalidatesTags: ["Cart"],
    }),
    removeCartItem: builder.mutation({
      query: ({ productId, variantId }) => ({
        url: "user/delete-cartitem",
        method: "DELETE",
        body: { productId, variantId },
      }),
      invalidatesTags: ["Cart"],
    }),

    addAddress: builder.mutation({
      query: ({ newAddress }) => ({
        url: `user/add-address`,
        method: "POST",
        body: { newAddress },
      }),
      invalidatesTags: ["Address"],
    }),
    getAddress: builder.query({
      query: () => ({
        url: `user/address`,
        method: "GET",
      }),
      providesTags: ["Address"],
    }),
    updateAddress: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: "user/update-address",
        method: "PATCH",
        body: { id, updatedData },
      }),
      invalidatesTags: ["Address"],
    }),
    deleteAddresss: builder.mutation({
      query: (id) => ({
        url: "user/delete-address",
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: ["Address"],
    }),
    changePassword: builder.mutation({
      query: ({ password, newPassword }) => ({
        url: "user/change-password",
        method: "POST",
        body: { password, newPassword },
      }),
    }),
    profileData: builder.query({
      query: () => ({
        url: "user/profile-details",
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "user/update-profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),
    addOrder: builder.mutation({
      query: ({
        addressId,
        paymentMethod,
        totalPrice,
        totalDiscount,
        couponUsed,
        couponCode,
      }) => ({
        url: "user/place-order",
        method: "POST",
        body: {
          addressId,
          paymentMethod,
          totalPrice,
          totalDiscount,
          couponUsed,
          couponCode,
        },
      }),
      invalidatesTags: ["ProductDetails", "Cart", "MyOrders", "Wallet"],
    }),
    myOrders: builder.query({
      query: () => ({
        url: "user/my-orders",
        method: "GET",
      }),
      providesTags: ["MyOrders"],
    }),
    OrderById: builder.query({
      query: (id) => ({
        url: `user/order-details/${id}`,
        method: "GET",
      }),
      providesTags: ["MyOrders"],
    }),
    cancelOrder: builder.mutation({
      query: (id) => ({
        url: "user/cancel-order",
        method: "PATCH",
        body: { id },
      }),
      invalidatesTags: ["MyOrders"],
    }),
    cancelItem: builder.mutation({
      query: ({ orderId, itemId }) => ({
        url: "user/cancel-item",
        method: "PATCH",
        body: { orderId, itemId },
      }),
      invalidatesTags: ["MyOrders"],
    }),
    returnItem: builder.mutation({
      query: ({ orderId, itemId, returnReason }) => ({
        url: "user/return-item",
        method: "PATCH",
        body: { orderId, itemId, returnReason },
      }),
      invalidatesTags: ["MyOrders"],
    }),
    getCategoryBrand: builder.query({
      query: () => ({
        url: "user/category-brand",
        method: "GET",
      }),
    }),
    razorpayPayment: builder.mutation({
      query: ({
        addressId,
        paymentMethod,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
        totalPrice,
        totalDiscount,
        couponUsed,
        couponCode,
        paymentStatus,
      }) => ({
        url: "user/razorpay-payment",
        method: "POST",
        body: {
          addressId,
          paymentMethod,
          razorpayPaymentId,
          razorpayOrderId,
          razorpaySignature,
          totalPrice,
          totalDiscount,
          couponUsed,
          couponCode,
          paymentStatus,
        },
      }),
      invalidatesTags: ["ProductDetails", "Cart", "MyOrders", "Wallet"],
    }),
    addToWishlist: builder.mutation({
      query: ({ productId, variantId }) => ({
        url: "user/add-to-wishlist",
        method: "POST",
        body: { productId, variantId },
      }),
      invalidatesTags: ["Wishlist"],
    }),
    getWishlist: builder.query({
      query: () => ({
        url: "user/wishlist",
        method: "GET",
      }),
      providesTags: ["Wishlist"],
    }),
    removeWishlistItem: builder.mutation({
      query: ({ productId, variantId }) => ({
        url: "user/wishlist-remove-item",
        method: "DELETE",
        body: { productId, variantId },
      }),
      invalidatesTags: ["Wishlist"],
    }),
    getWallet: builder.query({
      query: () => ({
        url: "user/wallet",
        method: "GET",
      }),
      providesTags: ["Wallet"],
    }),
    addMoneyToWallet: builder.mutation({
      query: (amount) => ({
        url: "/user/wallet/add-money",
        method: "POST",
        body: { amount },
      }),
    }),
    verifyPayment: builder.mutation({
      query: (paymentDetails) => ({
        url: "/user/wallet/verify-payment",
        method: "POST",
        body: paymentDetails,
      }),
      invalidatesTags: ["Wallet"],
    }),
    retryOrder: builder.mutation({
      query: ({ paymentMethod, orderId }) => ({
        url: "/user/retry-order",
        method: "POST",
        body: { paymentMethod, orderId },
      }),
      invalidatesTags: ["MyOrders"],
    }),
    retryRazorpayPayment: builder.mutation({
      query: ({
        orderId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
        paymentStatus,
      }) => ({
        url: "user/retry-razorpay-payment",
        method: "PATCH",
        body: {
          orderId,
          razorpayPaymentId,
          razorpayOrderId,
          razorpaySignature,
          paymentStatus,
        },
      }),
      invalidatesTags: ["MyOrders"]
    }),
  }),
});

export const {
  useUserHomeQuery,
  useProductDetailsQuery,
  useProductsListQuery,
  useAllProductsForSearchQuery,
  useAddToCartMutation,
  useCartProductsQuery,
  useLazyVerifyStockQuery,
  useCheckoutPageQuery,
  useGetPaymentPageQuery,
  useUpdateCartQuantityMutation,
  useRemoveCartItemMutation,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useGetAddressQuery,
  useDeleteAddresssMutation,
  useChangePasswordMutation,
  useProfileDataQuery,
  useUpdateProfileMutation,
  useAddOrderMutation,
  useMyOrdersQuery,
  useOrderByIdQuery,
  useCancelOrderMutation,
  useCancelItemMutation,
  useReturnItemMutation,
  useGetCategoryBrandQuery,
  useRazorpayPaymentMutation,
  useAddToWishlistMutation,
  useGetWishlistQuery,
  useRemoveWishlistItemMutation,
  useGetWalletQuery,
  useAddMoneyToWalletMutation,
  useVerifyPaymentMutation,
  useRetryOrderMutation,
  useRetryRazorpayPaymentMutation,
} = userApi;
