import Navbar from "../components/navbar/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import "../components/profile.css";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
const Dashboard = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname]);
  return (
    <>
      <Navbar />
      {loading ? <Loader /> : <Outlet />}
    </>
  );
};

export default Dashboard;
