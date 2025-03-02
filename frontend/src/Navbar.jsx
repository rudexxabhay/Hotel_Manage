import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faUser, faCog, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
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
        console.error("Auth Error:", error.response?.data || error.message);
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/user/logout`, { withCredentials: true });
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
    <nav className="sticky top-0 bg-white shadow-md z-20">
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-300 to-red-300"></div>

      <div className="px-4 flex justify-between items-center py-3 md:px-10">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-[45px] md:w-[60px]" />
          <span className="text-xl lg:text-2xl font-bold">Hotel Grand</span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden flex justify-end text-xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </button>

        {/* Navigation Links */}
        <div
          className={`absolute lg:static  top-14 left-0 w-full bg-white lg:bg-transparent transition-all duration-300 ease-in-out ${
            menuOpen ? "block shadow-md" : "hidden"
          } lg:flex lg:items-center lg:justify-center lg:w-auto transition-all `}
        >
          <div className=" flex flex-col lg:flex-row lg:items-center gap-4 p-4 md:p-0">
            {["/", "/contact", "/my-booking", "/dashboard"].map((path, index) => (
              <Link
                key={index}
                to={path}
                onClick={() => setMenuOpen(false)}
                className={`px-3 py-2 rounded transition ${
                  location.pathname === path ? "text-pink-500 font-semibold" : "text-black"
                } hover:text-pink-500`}
              >
                {path === "/" ? "Home" : path.replace("/", "").replace("-", " ")}
              </Link>
            ))}
          </div>
          <div>
          {isLoggedIn ? (
            <button onClick={() => navigate("/register")} className="border border-gray-300 rounded-lg px-5 py-1 hover:bg-gray-100 transition-all">
            Sign Out
          </button>
          ) : (
<button onClick={() => navigate("/register")} className="border border-gray-300 rounded-lg px-5 py-1 hover:bg-gray-100 transition-all">
              Login/Register
            </button>
          )}
          </div>
        </div>

        {/* User Profile Section */}
        <div className="hidden lg:flex items-center justify-end w-[150px]">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="border border-gray-300 rounded-full hover:bg-gray-100 transition-all px-5 py-1"
              >
                <FontAwesomeIcon icon={faUser} />
              </button>

              {/* User Menu Dropdown */}
              {userMenuOpen && (
                <div className={`absolute right-0 top-10 mt-2 w-48 bg-white border rounded-lg shadow-md transition-all duration-300 transform origin-top ${
                  userMenuOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
                }`}>
                  <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100">
                    <FontAwesomeIcon icon={faCog} className="mr-2" /> Account Settings
                  </Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    {loading ? (
                      <svg className="inline w-4 h-4 animate-spin fill-pink-300" viewBox="0 0 100 101" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                      </svg>
                    ) : (
                      "Logout"
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/register")}
              className="border border-gray-300 rounded-lg px-5 py-1 hover:bg-gray-100 transition-all"
            >
              Login/Register
            </button>
          )}
        </div>
      </div>



      {/* Mobile User Profile Section */}




      {menuOpen && (
        <div className="md:hidden flex flex-col items-center py-4 bg-white shadow-md">
          {isLoggedIn ? (
            <>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="border border-gray-300 rounded-full hover:bg-gray-100 transition-all px-5 py-1"
              >
                <FontAwesomeIcon icon={faUser} />
              </button>
              {userMenuOpen && (
                <div className="mt-2 w-48 bg-white border rounded-lg shadow-md text-center">
                  <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100">
                    <FontAwesomeIcon icon={faCog} className="mr-2" /> Account Settings
                  </Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <button onClick={() => navigate("/register")} className="border border-gray-300 rounded-lg px-5 py-1 hover:bg-gray-100 transition-all">
              Login/Register
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
