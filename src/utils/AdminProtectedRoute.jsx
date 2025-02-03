import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export function AdminProtectedRoute({ allowedRoles }) {
  const { role, isAuthenticated } = useSelector((state) => state.admin);
  const token = localStorage.getItem("adminToken");

  if (!token || !isAuthenticated) {
    return <Navigate to="/admin/sign-in" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/admin/sign-in" replace />;
  }

  return <Outlet />;
}
