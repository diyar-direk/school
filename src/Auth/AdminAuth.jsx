import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const AdminAuth = () => {
  const { userDetails } = useAuth();

  const isAdmin = userDetails?.isAdmin;

  const location = useLocation();
  return isAdmin ? (
    <Outlet />
  ) : (
    <Navigate state={{ from: location }} replace to={"/not_found"} />
  );
};

export default AdminAuth;
