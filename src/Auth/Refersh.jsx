import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Context } from "../context/Context";
import { Outlet } from "react-router-dom";
import Cookies from "universal-cookie";
import Loader from "../components/Loader";
import "../components/loader.css";

const Refresh = () => {
  const [loading, setLoading] = useState(true);
  const context = useContext(Context);
  const tokenContext = context.userDetails.token;

  const cookie = new Cookies();
  const tokenValue = cookie.get("school-token");

  const refreshToken = async () => {
    try {
      const profile = await axios.get(
        "http://localhost:8000/api/users/profile",
        {
          headers: { Authorization: "Bearer " + tokenValue },
        }
      );

      const data = profile.data.user;
      const isAdmin = data.role === "Admin";
      const isTeacher = data.role === "Teacher";
      const isStudent = data.role === "Student";

      context.setUserDetails({
        isAdmin,
        isTeacher,
        isStudent,
        token: tokenValue,
        userDetails: data.profileId,
        role: data.role,
      });
    } catch (err) {
      console.error("Error refreshing token:", err);
      // Optionally handle errors here (e.g., show an error message to the user)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!tokenContext) {
      refreshToken();
    } else {
      setLoading(false);
    }
  }, [tokenContext]);

  return loading ? <Loader /> : <Outlet />;
};

export default Refresh;
