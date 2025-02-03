import { Routes, Route } from "react-router-dom"
import { UserLoginAuth } from "../utils/UserLoginAuth"
import { OTPPage } from "../pages/user/OTPPage"
import { UserSignupPage } from "../pages/user/UserSignupPage"
import { UserLoginPage } from "../pages/user/UserLoginPage"
import { ResetPasswordPage } from "../pages/user/ResetPasswordPage"
import { OTPPageResetPassword } from "../pages/user/OTPPageResetPassword"
import { ResetPasswordConfirmPage } from "../pages/user/ResetPasswordConfirmPage"
import { UserProtectedRoute } from "../utils/UserProtectedRoute"
import { UserHomePage } from "../pages/user/UserHomePage"
import { ProductDetailsPage } from "../pages/user/ProductDetailsPage"
import { ProductListPage } from "../pages/user/ProductListPage"
import { CartPage } from "../pages/user/CartPage"
import { UserProfilePage } from "../pages/user/profile/UserProfilePage"
import { UserAddressPage } from "../pages/user/profile/UserAddressPage"
import { UserChangePassword } from "../pages/user/profile/UserChangePassword"
import { CheckoutPage } from "../pages/user/CheckoutPage"
import { PaymentPage } from "../pages/user/PaymentPage"
import { OrderSuccessPage } from "../pages/user/OrderSuccessPage"
import { OrdersPage } from "../pages/user/profile/OrdersPage"
import { OrderDetailsPage } from "../pages/user/profile/OrderDetailspage"
import { WishListPage } from "../pages/user/WishListPage"
import { WalletPage } from "../pages/user/profile/WalletPage"
import { PaymentFailedPage } from "../pages/user/PaymentFailedPage"
import { ErrorPage } from "@/pages/user/ErrorPage"
import { AboutPage } from "@/pages/user/AboutPage"

export const AuthUserRoutes = () => {
  return (
    <Routes>
      <Route element={<UserLoginAuth />}>
        <Route path="/verify-otp" element={<OTPPage />} />
        <Route path="/sign-up" element={<UserSignupPage />} />
        <Route path="/sign-in" element={<UserLoginPage />} />
      </Route>
      
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/reset-verify-otp" element={<OTPPageResetPassword />} />
      <Route path="/confirm-reset-password" element={<ResetPasswordConfirmPage />} />

      {/* User */}
            <Route element={<UserProtectedRoute allowedRoles={["user", "admin"]} />}>
              <Route path="/home" element={<UserHomePage />} />
              <Route path="/product-details/:id" element={<ProductDetailsPage />} />
              <Route path="/product-list" element={<ProductListPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/address" element={<UserAddressPage />} />
              <Route path="/change-password" element={<UserChangePassword />} />
              <Route path="/checkout-page" element={<CheckoutPage />} />
              <Route path="/payment-page" element={<PaymentPage />} />
              <Route path="/order-success-page" element={<OrderSuccessPage />} />
              <Route path="/my-orders" element={<OrdersPage />} />
              <Route path="/order-details/:orderId" element={<OrderDetailsPage />} />
              <Route path="/wishlist" element={<WishListPage />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/payment-failed-page" element={<PaymentFailedPage />} />
              <Route path="/about-page" element={<AboutPage />} />
              <Route path="/*" element={<ErrorPage />} />
            </Route>
      
    </Routes>
  )
}


