/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
//user
export function UserProtectedRoute({ allowedRoles }) {
  const { role, isAuthenticated } = useSelector((state) => state.user);
  const token = localStorage.getItem("userToken");

  if (!token || !isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
}
