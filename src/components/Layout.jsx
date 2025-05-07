import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { jwtDecode } from "jwt-decode";

const Layout = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/unauthorized");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role === "ADMIN") {
        setIsAuthorized(true);
      } else {
        navigate("/unauthorized");
      }
    } catch (err) {
      navigate("/unauthorized");
    }
  }, [navigate]);

  if (!isAuthorized) return null;

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 p-6 w-full min-h-screen bg-gray-100">
        {children}
      </div>
    </div>
  );
};

export default Layout;