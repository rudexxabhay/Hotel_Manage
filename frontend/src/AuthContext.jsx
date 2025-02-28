/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import { BASE_URL } from "../axios";
import axios from "axios";

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}/user/auth-user`,
          {},
          { withCredentials: true }
        );

        if (response.data.success) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        setIsAuth(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth,setIsAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
