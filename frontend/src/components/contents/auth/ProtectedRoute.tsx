import React, { useEffect } from "react";
// import { Navigate, useLocation } from "react-router-dom";
import { useAuthState } from "../../zustand/useAuthState";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, getCurrentUser } = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/login", {
        replace: true,
      });
    } else if (accessToken && !isAuthenticated) {
      getCurrentUser();
    }
  }, [isAuthenticated, getCurrentUser, navigate]);

  return <>{children}</>;
};

export default ProtectedRoute;
