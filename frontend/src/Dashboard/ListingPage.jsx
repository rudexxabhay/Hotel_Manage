import { useEffect, useState } from "react";
import Rating from "./Rating";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;
import { useParams, useNavigate } from "react-router-dom";
import Review from "./Review";


const ListingPage = () => {
  const { id } = useParams();
  const [listing, setListings] = useState([])
  const [item, setItem] = useState("")
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
    const result = async () => {
      const response = await axios.get(`${BASE_URL}/user/listing/${id}`)
      const items = response.data.list
      setListings(items)
    }
    result();
  }, [id])


   const handleDelete = () =>{
    
   }
  return (
    <>
      <div className="mx-3 p-2 mb-3 md:max-w-7xl md:mx-auto min-h-screen
      md:p-5 md:py-5 items-center border bg-slate-50 border-gray-300 md:m-5 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Go Back
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Go Back
          </button>
         </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-5 text-center">Detail About
            <span className="text-3xl font-bold  mb-5 text-pink-400"> {listing.name} </span></h1>

        <div className="">
          {listing && (
            <div key={listing.id} className="bg-slate-50">
              <img src={listing.image} alt={listing.name} className="w-full
               h-[60vh] object-cover rounded-lg p-4" />
              <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-900">{listing.name}</h2>
                <p className="text-gray-700">Available Date - {listing.availabeldates}</p>
                <p className="text-gray-700">Capacity - {listing.capacity}</p>
                <p className="text-gray-700">Per Night - {listing.priceday}</p>
                <p className="text-gray-700">Facility - {listing.facility}</p>
                <p className="text-gray-700">Location - {listing.location}</p>
                <p className="text-gray-700">Rating - {listing.rating}</p>
                <p className="text-gray-700">Contact - {listing.contact}</p>
                <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                  Book Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Rating listingId={id} setItem={setItem} />
      <Review listingId={id} item={item} />
    </>
  );
};

export default ListingPage;