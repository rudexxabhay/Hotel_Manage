import  {useContext, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserSecret, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
const BASE_URL = import.meta.env.VITE_BASE_URL;
console.log("base", BASE_URL)
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../AuthContext";

const formReducer = (formData, action) => {
  return { ...formData, [action.type.toLowerCase()]: action.payload };
};

function Register() {
  const [state, setState] = useState("Sign up");
  const {setIsAuth} = useContext(AuthContext)
  console.log(state)
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const initialState = { name: "", email: "", password: "", role: "" };
  const [formData, dispatch] = useReducer(formReducer, initialState);
  console.log(formData)
  const handleSubmit = async (e) => {
    console.log(BASE_URL)
    e.preventDefault();
    setLoading(true);
    if(state === "Sign up"){
      try {
        const response = await axios.post(`${BASE_URL}/user/register`
         ,formData
        )
        if(response.data.success){
          toast(response.data.message)
          navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
        }else{
          toast.error(response.data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }finally{
        setLoading(false)
      }
    }else{
   try {
     const response = await axios.post(`${BASE_URL}/user/login`, formData, {withCredentials: true})
     if(response.data.success){
      toast.success(response.data.message);
      setIsAuth(true)
      navigate("/dashboard")
     }else{
      toast.error(response.data.message)
     }
   } catch (error) {
    toast.error(error.message)
   }finally{
    setLoading(false)
  }
    }
    
  }

  return (
    <div className="flex bg-gradient-to-br from-pink-200 to-purple-400 min-h-screen justify-center items-center">
      <div className="bg-gray-900 p-10 rounded-lg shadow-lg w-[95%] sm:w-96">
        <h2 className="text-white font-semibold text-center text-3xl">{state === "Sign up" ? "Create Account" : "Login"}</h2>
        <p className="text-gray-400 my-5 text-center text-sm">{state === "Sign up" ? "Create your account" : "Login your account"}</p>

        <form onSubmit={handleSubmit}>
          {state === "Sign up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-800">
              <FontAwesomeIcon icon={faUserSecret} className="text-gray-400" />
              <input type="text" placeholder="Enter name" className="bg-transparent outline-none text-white w-full"
                onChange={(e) => dispatch({ type: "NAME", payload: e.target.value })} />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-800">
            <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
            <input type="email" placeholder="Enter email" className="bg-transparent outline-none text-white w-full"
              onChange={(e) => dispatch({ type: "EMAIL", payload: e.target.value })} />
          </div>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-800">
            <select className="bg-transparent text-white w-full outline-none"
              onChange={(e) => dispatch({ type: "ROLE", payload: e.target.value })} required>
              <option className="text-black ">Please enter</option>
              <option value="owner" className="text-black">Owner</option>
              <option value="client" className="text-black">Client</option>
            </select>
          </div>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-800">
            <FontAwesomeIcon icon={faLock} className="text-gray-400" />
            <input type="password" placeholder="Enter password" className="bg-transparent outline-none text-white w-full"
              onChange={(e) => dispatch({ type: "PASSWORD", payload: e.target.value })} />
          </div>

          <button disabled={loading} className="text-white w-full rounded-full py-2.5 bg-gradient-to-r from-pink-500 to-pink-700 font-medium hover:from-pink-600 hover:to-pink-800 transition">
            {loading ? (
              <svg className="inline w-4 h-4 animate-spin fill-pink-300" viewBox="0 0 100 101" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
            ) : (state === "Sign up" ? "Register" : "Login")}
          </button>
        </form>

        <p className="text-gray-400 text-center text-xs mt-4">
          {state === "Sign up" ? "Already have an account?" : "Don't have an account?"}
          <span className="text-pink-400 cursor-pointer underline ml-1" onClick={() => setState(state === "Sign up" ? "Login" : "Sign up")}>
            {state === "Sign up" ? "Login here" : "Sign up"}
          </span>
        </p>
      </div>
     
    </div>
  );
  }

export default Register;
