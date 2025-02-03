import { Navigate, Outlet } from "react-router-dom";

export const UserLoginAuth = () => {
  const token = localStorage.getItem("userToken");

  if (!token) {
    return <Outlet />;
  }

  return <Navigate to="/user/home" replace />;
};
