import Navbar from "./Navbar";
import { Routes, Route } from "react-router-dom";
import { useEffect ,Suspense, lazy } from "react";
import Register from "./Auth/Register";
import HomePage from "./Dashboard/HomePage";
import OtpVerify from "./Auth/OtpVerify";
import Home from "./Home/Home";
import ForgetPass from "./Auth/ForgetPass";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Toastify CSS import
import ListingPage from "./Dashboard/ListingPage";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Footer from "./Footer";
import Booking from "./Dashboard/Booking";
import Admin from "./Dashboard/Admin";

function App() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);


  return (
    <>
      <AuthProvider>
        <Navbar />
        
        {/* ✅ ToastContainer Added Globally */}
        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
     
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<OtpVerify />} />
          <Route path="/forget-pass" element={<ForgetPass />} />
          <Route path="/dashboard" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/listing/:id" element={<ProtectedRoute><ListingPage /></ProtectedRoute>} />
          <Route path="/my-booking" element={<ProtectedRoute><Booking/></ProtectedRoute>} />
          <Route path="/admin" element={<Admin/>} />
        </Routes>
      
      </AuthProvider>

      <Footer />
    </>
  );
}

export default App;
