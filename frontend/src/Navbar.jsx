import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faUser, faCog } from "@fortawesome/free-solid-svg-icons";
import logo from "../src/assets/pink-blue-abstract-logo.png";
import { toast } from "react-toastify";
const BASE_URL = import.meta.env.VITE_BASE_URL;
import axios from "axios";
import { useNavigate, Link , useLocation } from "react-router-dom";

function Navbar() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loding, setLoding] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState();
  const location = useLocation(); 
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/auth-user`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);

    }
  };

  checkAuth();


  const handleLogout = async () => {
    setLoding(true);
    try {
      const response = await axios.get(`${BASE_URL}/user/logout`, { withCredentials: true });
      if (response.data.success) {
        toast.success("👋 Logout successful!", { autoClose: 3000 });
        setUserMenuOpen(false);
        navigate("/");
        setIsLoggedIn(false)
      }
    } catch (error) {
      toast.error("❌ Logout failed! " + error.message);
    } finally {
      setLoding(false);
    }
  };

  return (
    <nav className=" sticky top-0 bg-white shadow-md z-10">
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-300 to-red-300"></div>

      <div className="flex md:justify-between md:items-center md:px-10 py-2">
        <a href="#" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-[50px] md:w-[60px]" />
          <span className="text-xl md:text-2xl font-bold">Hotel Grand</span>
        </a>

        <div className="flex-grow hidden md:flex justify-center">
          <div className="relative w-full max-w-[300px] flex items-center gap-2">

            <input
              type="text"
              className="w-full border px-4 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Search here..."
            />
            <button className="border border-gray-200 px-4 py-1 rounded-lg
             bg-slate-50 hover:bg-slate-100 shadow-lg">Search</button>
          </div>
        </div>


        <div className="flex-grow hidden md:flex justify-center">
          <div className=" flex items-center gap-5">
         <Link
          to="/"
          className={`px-3 py-2 rounded ${location.pathname === "/" ? "text-pink-500" : "text-black"}`}
        >
          Home
        </Link>
        <Link
          to="/contact"
          className={`px-3 py-2 rounded ${location.pathname === "/contact" ? "text-pink-500" : "text-black"}`}
        >
          Contact
        </Link>
        <Link
          to="/my-booking"
          className={`px-3 py-2 rounded ${location.pathname === "/my-booking" ? "text-pink-500" : "text-black"}`}
        >
          My Booking
        </Link>
        <Link
          to="/dashboard"
          className={`px-3 py-2 rounded ${location.pathname === "/dashboard" ? "text-pink-500" : "text-black"}`}
        >
          Dashboard
        </Link>
          </div>
        </div>



        <div className="hidden md:flex items-center justify-end w-[150px]">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(prev => !prev)}
                className="border border-gray-300 rounded-full hover:bg-gray-100 transition-all px-5 py-1"
              >
                <FontAwesomeIcon icon={faUser} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-10 mt-2 w-48 bg-white border rounded-lg shadow-md">
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                    <FontAwesomeIcon icon={faCog} className="mr-2" /> Account Settings
                  </a>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    {loding ? (
                      <svg className="inline w-4 h-4 animate-spin fill-pink-300" viewBox="0 0 100 101" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                      </svg>
                    ) : "Logout"}
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
      </div>

    </nav>

  );
}

export default Navbar;
