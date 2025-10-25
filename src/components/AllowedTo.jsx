import { useAuth } from "../context/AuthContext";

const AllowedTo = ({ roles, children }) => {
  const { userDetails } = useAuth();

  return roles.includes(userDetails?.role) ? <> {children} </> : false;
};

export default AllowedTo;
