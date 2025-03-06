/* eslint-disable react/prop-types */
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;
import { useNavigate } from 'react-router-dom';


function Listings({item}) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]); // Missing state for items
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${BASE_URL}/user/all-listing`, { withCredentials: true });
        if(response.data.success){
          const allItem = response.data.allListing;
          setItems(allItem); 
        }else{
          toast(response.data.message)
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast(error.message)
      }finally{
        setLoading(false)
      }
    };
    
    fetchData();
  }, [item]);

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <svg className="w-10 h-10 animate-spin fill-pink-300" viewBox="0 0 100 101" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 md:max-w-7xl md:m-auto">
          {items.length === 0 ? (
             <div className='text-3xl text-center font-semibold my-5'> No listing</div>
          ) : (
            items.map((item) => (
              <div 
                key={item._id} 
                className="bg-gradient-to-r from-purple-300 via-pink-300 to-red-300 p-[1px] rounded-lg mx-4 my-2"
              >
                <div className="shadow-lg hover:bg-gradient-to-r from-purple-50 via-pink-50 to-red-50 transition-all bg-white rounded-lg p-4">
                  <h2 className="text-2xl font-semibold text-center">{item.name}</h2>
                  <img src={item.image} alt="img" className="w-full h-[40vh] object-cover py-3 rounded-lg" />
                  <p className="text-gray-700">Price Per Day - {item.priceday}</p>
                  <p className="text-gray-700 my-2">Location - {item.location}</p>
                  <button 
                    onClick={() => navigate(`/listing/${item._id}`)} 
                    className="border-gray-500 p-2 bg-pink-400 hover:bg-pink-500 w-full cursor-pointer"
                  >
                    See Details
                  </button>
                </div>
              </div>
            ))
          )}            
        </div>
      )}
    </div>
  );
}

export default Listings;
