import Navbar from "../components/navbar/Navbar";
import { Outlet } from "react-router-dom";
import "../components/profile.css";
const Dashboard = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default Dashboard;
