import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./AdminBaseQuery";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Product", "Category", "Users", "Brand", "Orders", "Return"],
  endpoints: (builder) => ({
    addProducts: builder.mutation({
      query: (productData) => ({
        url: "admin/products/add-products",
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),
    getCategoryAndBrand: builder.query({
      query: () => ({
        url: "admin/products/category-brand",
        method: "GET",
      }),
    }),
    addVariants: builder.mutation({
      query: ({ productData, productId }) => ({
        url: `admin/products/add-variants/${productId}`,
        method: "PATCH",
        body: { productData },
      }),
      invalidatesTags: ["Product"],
    }),
    getAllProducts: builder.query({
      query: ({ page, limit }) => ({
        url: `admin/products/all-products?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
    updateProductStatus: builder.mutation({
      query: ({ id, listed }) => ({
        url: `admin/products/update-status/${id}`,
        method: "PATCH",
        body: { listed },
      }),
      invalidatesTags: ["Product"],
    }),
    getProductById: builder.query({
      query: (id) => ({
        url: `admin/products/get-product/${id}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
    updateProductById: builder.mutation({
      query: ({ id, formData }) => ({
        url: `admin/products/edit-product/${id}`,
        method: "PUT",
        body: { id, formData },
      }),
      invalidatesTags: ["Product"],
    }),
    addCategories: builder.mutation({
      query: ({ name, description }) => ({
        url: "admin/category/add-category",
        method: "POST",
        body: { name, description },
      }),
      invalidatesTags: ["Category"],
    }),
    getAllCategories: builder.query({
      query: () => ({
        url: "admin/category/all-categories",
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
    updateCategoryStatus: builder.mutation({
      query: ({ id, listed }) => ({
        url: `admin/category/update-status/${id}`,
        method: "PATCH",
        body: { listed },
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation({
      query: ({ id, name, description }) => ({
        url: `admin/category/update-category/${id}`,
        method: "PUT",
        body: { name, description },
      }),
      invalidatesTags: ["Category"],
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: "admin/users/all-users",
        method: "GET",
      }),
      providesTags: ["Users"],
    }),
    updateUserStatus: builder.mutation({
      query: ({ id, active }) => ({
        url: `admin/users/update-status/${id}`,
        method: "PATCH",
        body: { active },
      }),
      invalidatesTags: ["Users"],
    }),
    addBrands: builder.mutation({
      query: ({ name, description }) => ({
        url: "admin/brands/add-brand",
        method: "POST",
        body: { name, description },
      }),
      invalidatesTags: ["Brand"],
    }),
    getAllBrands: builder.query({
      query: () => ({
        url: "admin/brands/all-brands",
        method: "GET",
      }),
      providesTags: ["Brands"],
    }),
    updateBrandStatus: builder.mutation({
      query: ({ id, listed }) => ({
        url: `admin/brands/update-status/${id}`,
        method: "PATCH",
        body: { listed },
      }),
      invalidatesTags: ["Brands"],
    }),
    updateBrand: builder.mutation({
      query: ({ id, name, description }) => ({
        url: `admin/brands/update-brand/${id}`,
        method: "PUT",
        body: { name, description },
      }),
      invalidatesTags: ["Brand"],
    }),
    getAllOrders: builder.query({
      query: () => ({
        url: "admin/orders/all-orders",
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),
    getOrderById: builder.query({
      query: (id) => ({
        url: `admin/orders/order-details/${id}`,
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ orderId, newStatus }) => ({
        url: "admin/orders/update-order-status",
        method: "PATCH",
        body: { orderId, newStatus },
      }),
      invalidatesTags: ["Orders", "Product"],
    }),
    updateItemStatus: builder.mutation({
      query: ({ itemId, orderId, newStatus }) => ({
        url: "admin/orders/update-item-status",
        method: "PATCH",
        body: { itemId, orderId, newStatus },
      }),
      invalidatesTags: ["Orders", "Product"],
    }),
    addOffer: builder.mutation({
      query: ({ values }) => ({
        url: "admin/offers/add-offer",
        method: "POST",
        body: { values },
      }),
      invalidatesTags: ["Offers"]
    }),
    getOffers:builder.query({
      query:()=>({
          url:'admin/offers/all-offers',
          method:"GET"
      }),
      providesTags:['Offers']
  }),
  updateOfferStatus: builder.mutation({
    query: ({offerId, status}) => ({
      url: "admin/offers/update-status",
      method: "PATCH",
      body: {offerId, status}
    }),
    invalidatesTags: ["Offers"]
  }),
  deleteOffer: builder.mutation({
    query: ({offerId}) => ({
      url: "admin/offers/delete-offer",
      method: "DELETE",
      body: {offerId}
    }),
    invalidatesTags: ["Offers"]
  }),
  getOfferById: builder.query({
    query: (id) => ({
      url: `admin/offers/offer?id=${id}`,
      method: "GET",
    }),
    providesTags: ["OfferEdit"]
  }),
  updateOffer: builder.mutation({
    query: ({id, values}) => ({
      url: "admin/offers/update-offer",
      method: "PATCH",
      body: {id, values}
    }),
    invalidatesTags: ["Offers", "OfferEdit"]
  }),
  dashboard: builder.query({
      query: (period = 'month') => `admin/dashboard?period=${period}`,
    }),
    getSales: builder.query({
      query: (params) => ({
        url: "admin/sales-report",
        params,
      }),
    }),
    getReturnOrders: builder.query({
      query: () => ({
        url: "admin/orders/return-orders",
        method: "GET",
      }),
      providesTags: ["Return"]
    }),
    updateReturnStatus: builder.mutation({
      query: ({orderId, itemId, result}) => ({
        url: "admin/orders/update-return",
        method: "PATCH",
        body: {orderId, itemId, result}
      }),
      invalidatesTags:["Return"]
    }),
    addCoupon: builder.mutation({
      query: (values) => ({
        url: "admin/coupons/add-coupon",
        method: "POST",
        body: {values}
      }),
      invalidatesTags: ["Coupons"]
    }),
    getCoupons: builder.query({
      query: () => ({
        url: "admin/coupons/all-coupons",
        method: "GET" 
      }),
      providesTags: ["Coupons"]
    }),
    updateCouponStatus: builder.mutation({
      query: ({couponId, status}) => ({
        url: "admin/coupons/update-status",
        method: "PATCH",
        body: {couponId, status}
      }),
      invalidatesTags: ["Coupons"]
    }),
    getCouponById: builder.query({
      query: (id) => ({
        url: `admin/coupons/coupon?id=${id}`,
        method: "GET"
      })

    }),
    updateCoupon: builder.mutation({
      query: ({id, values}) => ({
        url: "admin/coupons/update-coupon",
        method: "PATCH",
        body: {id, values}
      }),
      invalidatesTags: ["Coupons"]
    }),
    deleteCoupon : builder.mutation({
      query: ({couponId}) => ({
        url: "admin/coupons/delete-coupon",
        method: "DELETE",
        body: {couponId}
      }),
      invalidatesTags: ["Coupons"]
    })
  }),
});

export const {
  useGetAllProductsQuery,
  useGetCategoryAndBrandQuery,
  useUpdateProductStatusMutation,
  useAddProductsMutation,
  useAddVariantsMutation,
  useGetProductByIdQuery,
  useUpdateProductByIdMutation,
  useAddCategoriesMutation,
  useGetAllCategoriesQuery,
  useUpdateCategoryStatusMutation,
  useUpdateCategoryMutation,
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
  useAddBrandsMutation,
  useGetAllBrandsQuery,
  useUpdateBrandStatusMutation,
  useUpdateBrandMutation,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useUpdateItemStatusMutation,
  useAddOfferMutation,
  useGetOffersQuery,
  useUpdateOfferStatusMutation,
  useDeleteOfferMutation,
  useGetOfferByIdQuery,
  useUpdateOfferMutation,
  useDashboardQuery,
  useGetSalesQuery,
  useGetReturnOrdersQuery,
  useUpdateReturnStatusMutation,
  useAddCouponMutation,
  useGetCouponsQuery,
  useUpdateCouponStatusMutation,
  useGetCouponByIdQuery,
  useUpdateCouponMutation,
  useDeleteCouponMutation
} = adminApi;
