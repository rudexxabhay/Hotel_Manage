/* eslint-disable react/prop-types */
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function Listings({ search }) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
   
   


    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/user/all-listing`, {
          withCredentials: true,
        });
        if (response.data.success) {
          setItems(response.data.allListing);
        } else {
          toast(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
   

  }, []);

  const filteredItems = items.filter(
    (item) =>
      item?.name?.toLowerCase().includes(search?.toLowerCase() || "") ||
      item?.location?.toLowerCase().includes(search?.toLowerCase() || "")
  );
  const unreadMessages = 6;

  return (
    <div className=" min-h-screen  py-10 px-4 md:px-8 dark:bg-slate-800">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-16 h-16 border-4 border-pink-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className=" grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:max-w-7xl mx-auto">
          {filteredItems.length === 0 ? (
            <div className="text-3xl dark:text-pink-600 text-center font-semibold my-5">
              No Listings Found
            </div>
             ):(
            filteredItems.map((item) => (
              <div
                key={item._id}
                className="relative group rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105 bg-white/60 dark:bg-slate-600 dark:text-pink-600 backdrop-blur-md border border-gray-200 p-4"
              >
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={item.image}
                    alt="Hotel"
                    className="w-full h-56 object-cover rounded-lg transition-all group-hover:scale-110 group-hover:opacity-80"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-30 transition-all"></div>
                </div>

                <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs shadow-md font-semibold">
                  ₹{item.priceday} / day
                </div>

                <div className="p-4">
                  <h2 className="dark:text-pink-300 text-2xl font-bold text-gray-800 group-hover:text-pink-500 transition-all">
                    {item.name}
                  </h2>
                  <p className="text-gray-600 mt-1 flex items-center gap-2 dark:text-white">
                    📍 {item.location}
                  </p>
                  <button
                    onClick={() => navigate(`/listing/${item._id}`)}
                    className="mt-4 w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2  shadow-md transition-all"
                  >
                    View Details
                  </button>
                </div>
                
              </div>
            ))
          )}
        </div>
      )}
      <div className="fixed bottom-6 right-6 z-50">
      <button 
        onClick={() => navigate("/my-chats")} 
        className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14
         bg-pink-500 text-white rounded-full shadow-lg hover:bg-pink-600 transition duration-300"
      >
        💬
        {unreadMessages > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {unreadMessages}
          </span>
        )}
      </button>
    </div>
    </div>
  );
}

export default Listings;
