import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faBars, faTimes, faMoon, faSun  } from "@fortawesome/free-solid-svg-icons";
import logo from "../src/assets/pink-blue-abstract-logo.png";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function Navbar() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}/user/auth-user`,
          {},
          { withCredentials: true }
        );
        setIsLoggedIn(response.data.success);
      } catch (error) {
        setIsLoggedIn(false);
        toast.error(error.message)
      }
    };
    checkAuth();
  }, [isLoggedIn]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/user/logout`, {}, { withCredentials: true });
      if (response.data.success) {
        toast.success("👋 Logout successful!", { autoClose: 3000 });
        setUserMenuOpen(false);
        setIsLoggedIn(false);
        navigate("/");
      }
    } catch (error) {
      toast.error("❌ Logout failed! " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="sticky top-0 bg-white dark:bg-slate-800 dark:text-pink-500 shadow-md z-20">
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-300 to-red-300"></div>

      <div className="px-4 flex items-center justify-between py-3 md:px-10">
        <button
          className="lg:hidden text-xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </button>

        <Link to="/" className="flex items-center sm:gap-2">
          <img src={logo} alt="Logo" className="w-[40px] md:w-[60px]" />
          <span className="md:text-xl lg:text-2xl font-bold">Hotel Grand</span>
        </Link>

        <div className="hidden lg:flex gap-6">
          {['/', '/contact', '/my-booking', '/dashboard', '/admin'].map((path, index) => (
            <Link
              key={index}
              to={path}
              className={`px-4 py-2 ${location.pathname === path ? 'text-pink-500 font-semibold' : 'text-black dark:text-white'} hover:text-pink-500`}
            >
              {path === '/' ? 'Home' : path.replace('/', '').replace('-', ' ')}
            </Link>
          ))}
        </div>
         <div>
          <button
      onClick={() => setDarkMode(!darkMode)}
      className=" text-[20px]"
    >
      {darkMode ? <FontAwesomeIcon icon={faMoon} /> :<FontAwesomeIcon icon={faSun} />}
    </button>
         </div>
          
        <div className="lg:flex items-center gap-4 hidden">
          {isLoggedIn ? (
            <div className="relative">
              <img
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="User"
              />
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md text-center">
                  <button onClick={handleLogout} className="block w-full py-2 hover:bg-gray-100">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => navigate("/register")} className="border border-gray-300 rounded-lg px-5 py-1 hover:bg-gray-100 transition-all">
              Login/Register
            </button>
          )}
        </div>

        <div className="lg:hidden " >
          <img
          
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="User"
          />
          {userMenuOpen && (
            <div className="absolute right-4 mt-2 w-40 bg-white border rounded-lg shadow-md text-center">
              
              {!isLoggedIn ? (
                <button onClick={() => navigate("/register")} className="block w-full py-2 hover:bg-gray-100">
                  Login/Register
                </button>
              ) : (
                <button onClick={handleLogout} className="block w-full py-2 hover:bg-gray-100">
                  Logout
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {menuOpen && (
        <div className="lg:hidden flex flex-col py-4 shadow-md">
          {['/', '/contact', '/my-booking', '/dashboard', '/admin'].map((path, index) => (
            <Link
              key={index}
              to={path}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-2 w-full ${location.pathname === path ? 'text-pink-500 font-semibold' : 'text-black dark:text-white'} hover:text-pink-500`}
            >
              {path === '/' ? 'Home' : path.replace('/', '').replace('-', ' ')}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
