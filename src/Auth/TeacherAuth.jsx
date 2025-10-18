import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TeacherAuth = () => {
  const { userDetails } = useAuth();
  const isAdmin = userDetails?.isAdmin;
  const isTeacher = userDetails?.isTeacher;
  const location = useLocation();
  return isAdmin || isTeacher ? (
    <Outlet />
  ) : (
    <Navigate state={{ from: location }} replace to={"/not_found"} />
  );
};

export default TeacherAuth;
