import { Routes, Route } from "react-router-dom"
import { AdminProtectedRoute } from "../utils/AdminProtectedRoute"
import { Dashboard } from "../pages/admin/Dashboard"
import { ProductPage } from "../pages/admin/ProductPage"
import { ProductAddPage } from "../pages/admin/ProductAddPage"
import { ProductEditPage } from "../pages/admin/ProductEditPage"
import { CategoryPage } from "../pages/admin/CategoryPage"
import { CategoryAddPage } from "../pages/admin/CategoryAddPage"
import { UsersPage } from "../pages/admin/UsersPage"
import { BrandPage } from "../pages/admin/BrandPage"
import { BrandAddPage } from "../pages/admin/BrandAddPage"
import { ProductsVariantsAddPage } from "../pages/admin/ProductsVariantsAddPage"
import { OrdersListPage } from "../pages/admin/OrdersListPage"
import { OrderManagePage } from "../pages/admin/OrderManagePage"
import { OfferPage } from "../pages/admin/OfferPage"
import { OfferAddPage } from "../pages/admin/OfferAddPage"
import { SalesReportPage } from "../pages/admin/SalesReportPage"
import { ReturnItemsPage } from "../pages/admin/ReturnItemsPage"
import { CouponPage } from "../pages/admin/CouponPage"
import { CouponAddPage } from "../pages/admin/CouponAddPage"
import { OfferEditPage } from "../pages/admin/OfferEditPage"
import { CouponEditPage } from "../pages/admin/CouponEditPage"
import { AdminLogin } from "@/pages/admin/AdminLogin"

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/sign-in" element={<AdminLogin />} />
      <Route element={<AdminProtectedRoute allowedRoles="admin" />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/products/add-products" element={<ProductAddPage />} />
        <Route path="/products/edit-products/:id" element={<ProductEditPage />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/category/add-category" element={<CategoryAddPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/brands" element={<BrandPage />} />
        <Route path="/brands/add-brands" element={<BrandAddPage />} />
        <Route path="/products/add-variants/:productId" element={<ProductsVariantsAddPage />} />
        <Route path="/orders" element={<OrdersListPage />} />
        <Route path="/orders/order-manage/:orderId" element={<OrderManagePage />} />
        <Route path="/offers" element={<OfferPage />} />
        <Route path="/offers/add-offer" element={<OfferAddPage />} />
        <Route path="/offers/edit-offer/:id" element={<OfferEditPage />} />
        <Route path="/sales-report" element={<SalesReportPage />} />
        <Route path="/returns" element={<ReturnItemsPage />} />
        <Route path="/coupons" element={<CouponPage />} />
        <Route path="/coupons/add-coupon" element={<CouponAddPage />} />
        <Route path="/coupons/edit-coupon/:id" element={<CouponEditPage />} />
      </Route>
    </Routes>
  )
}


