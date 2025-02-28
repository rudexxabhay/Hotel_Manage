import  { useState, useRef } from "react";
const BASE_URL = import.meta.env.VITE_BASE_URL;
import { useLocation, useNavigate } from "react-router-dom";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
function OtpVerify() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryparams = new URLSearchParams(location.search);
  const email = queryparams.get("email")
  const [loding, setLoding] = useState(false)
  const otpLength = 6;
  const [otps, setOtp] = useState(new Array(otpLength).fill(""));
  
  const inputRefs = useRef([]);
  const handleChange = (index, e) => {
    console.log(index,e)
    const value = e.target.value;
    if (isNaN(value))
     return; // Only allow numbers

    const newOtp = [...otps];
    newOtp[index] = value.substring(value.length - 1); 
    setOtp(newOtp);

    // // Move to the next input if a digit is entered
    if (value && index < otpLength - 1) {
      inputRefs.current[index + 1].focus();
    }
  };
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otps[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoding(true);
    const otp = otps.join("");
    try {
    const response = await  axios.post(`${BASE_URL}/user/verify-otp`,{email, otp},{withCredentials:true} )
      if(response.data.success){
       toast.success(response.data.message)
       navigate("/")
      }else{
       toast.error(response.data.message)
      }
      setLoding(false);
      
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
       toast.error(error.response?.data?.message);
    }
  
  };

  return (
    <div className="flex bg-gradient-to-br
     from-blue-200 to-purple-400 min-h-screen
      justify-center items-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[95%] sm:w-96 text-center">
        <h2 className="text-white text-2xl font-semibold">Verify OTP</h2>
        <p className="text-gray-400 mt-2">Enter the 6-digit OTP sent to your email</p>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex justify-center gap-2">
            {otps.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                value={digit}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength={1}
                className="w-12 h-12 text-center text-white text-lg font-semibold bg-gray-700 border border-gray-600 rounded-md focus:border-blue-500 outline-none"
              />
            ))}
          </div>
          <button
            type="submit"
            className="mt-5 text-white w-full rounded-full py-2.5 bg-gradient-to-r from-pink-500 to-pink-700 font-medium hover:from-pink-600 hover:to-pink-800 transition"
          >
            {loding ? (
              <div role="status">
              <svg aria-hidden="true" className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
            ) : ("Verify Otp")}
          </button>
        </form>
      </div>
     
    </div>
  );
}

export default OtpVerify;
