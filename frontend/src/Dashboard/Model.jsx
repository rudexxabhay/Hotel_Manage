/* eslint-disable react/prop-types */
import { useReducer, useState } from "react";
import { motion } from "framer-motion";
import axios from 'axios'
const BASE_URL = import.meta.env.VITE_BASE_URL;
import { toast } from "react-toastify";
const formReducer = (form, action) => {
    if(action.type === "RESET" ) return {...initialData}
    return { ...form, [action.type.toLowerCase()]: action.payload };
};

const initialData = {
    name: "", 
    location: "",
    facility: "",
    priceday: "",
    capacity: "",
    availabeldates: "",
    contact: ""
};

function Modal({ open, close, item }) {
    const [image, setImage] = useState(null);
    const [form, dispatch] = useReducer(formReducer, initialData);
    const [loding, setLoding] = useState(false);
    const handleImg = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoding(true);
        try {
            const imgData = new FormData(); 
            imgData.append("image", image);
            imgData.append("name", form.name);
            imgData.append("location", form.location);
            imgData.append("facility", form.facility);
            imgData.append("priceday", form.priceday);
            imgData.append("capacity", form.capacity);
            imgData.append("availabeldates", form.availabeldates); 
            imgData.append("contact", form.contact);
   
             console.log("IMGDATA", imgData)
            const response = await axios.post(
                `${BASE_URL}/user/new-listing`, 
                imgData, 
                {
                    withCredentials: true,
                    headers: { "Content-Type": "multipart/form-data" } 
                }
            );
            if(response.data.success){
                toast(response.data.message);
                item(response.data.item);

            }
            
            

            setLoding(false);
            setImage(null)
            dispatch({ type: "RESET" });
        } catch (error) {
            console.log("Error:", error.response?.data || error.message);
            setLoding(false);
        }
    };

      
    if (!open) return null; 
    
    return (
        <div className="fixed px-4 inset-0 flex  items-center  justify-center bg-blue-300 shado">
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}    // Start hidden
            animate={{ opacity: 1, scale: 1 }}   // Appear smoothly
            exit={{ opacity: 0, scale: 0.8 }}    // Hide smoothly
            transition={{ duration: 0.3 }}       // Speed of animation
            className="bg-white p-6 rounded-lg shadow-lg w-full  max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-700 mb-4 mt-3 text-center">Fill the Form</h2>
                <button onClick={close} className="text-red-500 text-lg font-semibold cursor-pointer">close</button>
            </div>

            {/* Form */}
            <form className="grid grid-col-1 md:grid-cols-2 space-y-3 gap-4" onSubmit={handleSubmit}>
                <div className=" flex items-center gap-2">
                    <label className="font-medium text-gray-600">Name</label>
                    <input 
                        type="text"
                        className="border w-full border-gray-300 rounded p-2"
                        placeholder="Enter name"
                        value={form.name}
                        onChange={(e)=> dispatch({type: "NAME", payload: e.target.value})}
                        required
                    />
                </div>


                <div className=" flex items-center gap-2">
                    <label className="font-medium text-gray-600">Location</label>
                    <input
                        type="text"
                        value={form.location}
                        className="border w-full border-gray-300 rounded p-2"
                        placeholder="Enter your location"
                        onChange={(e)=> dispatch({type: "LOCATION", payload: e.target.value})}
                        required
                    />
                </div>

                <div className=" flex items-center gap-2">
                    <label className="font-medium text-gray-600">Facilities</label>
                    <input
                        type="text"
                        value={form.facility}
                        className="border w-full border-gray-300 rounded p-2"
                        placeholder="Enter facilities"
                        onChange={(e)=> dispatch({type: "FACILITY", payload: e.target.value})}
                        required
                    />
                </div>

                <div className=" flex items-center gap-2">
                    <label className="font-medium text-gray-600">Price Per Day</label>
                    <input
                        type="text"
                        value={form.priceday}
                        className="border w-full border-gray-300 rounded p-2"
                        placeholder="Enter price per day"
                        onChange={(e)=> dispatch({type: "PRICEDAY", payload: e.target.value})}
                        required
                    />
                </div>
                <div className=" flex items-center gap-2">
                    <label className="font-medium text-gray-600">Capacity</label>
                    <input
                        type="text"
                        value={form.capacity}
                        className="border w-full border-gray-300 rounded p-2"
                        placeholder="Enter your space capacity"
                        onChange={(e)=> dispatch({type: "CAPACITY", payload: e.target.value})}
                        required
                    />
                </div>
                <div className=" flex items-center gap-2">
                    <label className="font-medium text-gray-600">Available Dates</label>
                    <input
                        type="text"
                        value={form.availabeldates}
                        className="border w-full border-gray-300 rounded p-2"
                        placeholder="Enter available dates"
                        onChange={(e)=> dispatch({type: "AVAILABELDATES", payload: e.target.value})}
                        required
                    />
                </div>
                <div className=" flex items-center gap-2">
                    <label className="font-medium text-gray-600">Upload Image</label>
                    <input
                    onChange={handleImg}
                        type="file"
                        
                        className="border w-full border-gray-300 rounded p-2"
                        placeholder="Upload an image"
                        required
                    />
                </div>
                <div className=" flex items-center gap-2">
                    <label className="font-medium text-gray-600">Contact</label>
                    <input
                        type="number"
                        value={form.contact}
                        className="border w-full border-gray-300 rounded p-2"
                        placeholder="Enter your name"
                        onChange={(e)=> dispatch({type: "CONTACT", payload: e.target.value})}
                        required
                    />
                </div>
                <button className="bg-blue-600 w-full text-white p-2 rounded hover:bg-blue-700">
                    {loding ? 
                    ( <svg className="inline w-4 h-4 animate-spin fill-pink-300" viewBox="0 0 100 101" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                      </svg>)
                     : 
                    ("Submit")}
                </button>
            </form>
           
        </motion.div>
       
    </div>
    );
}

export default Modal;
