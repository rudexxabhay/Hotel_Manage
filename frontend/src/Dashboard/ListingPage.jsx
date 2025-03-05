import { useEffect, useState, } from "react";
import Rating from "./Rating";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;
import { useParams, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
import Review from "./Review";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";


const ListingPage = () => {
  const { id } = useParams();
  const [listing, setListings] = useState([])
  const [item, setItem] = useState("")
const [requestedHotels, setRequestedHotels] = useState({});
console.log("YE hai",requestedHotels)
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

  const handleBooking = async(listId)=>{
    try {
      const response = await axios.post(`${BASE_URL}/user/booking`, {listId}, {withCredentials: true});
      if(response.data.success){
        toast(response.data.message);
        setRequestedHotels((prev) => ({
          ...prev,
          [listId]: true, // Sirf jis hotel pe click hoga usko requested karega
        }));
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}/user/show-booking`,
          {},
          { withCredentials: true }
        );

        const userBookings = response.data.booking;
        console.log("USERBOOKING", userBookings)
        const bookingMap = {};

        userBookings.map((booking) => {
          bookingMap[booking.listing._id] = true; // Jo hotels booked hain unka tracking
        });
    console.log("BOOKINGMAP", bookingMap)
        setRequestedHotels(bookingMap);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);
 
  return (
    <>
      <div className="mx-3 p-2 mb-3 md:max-w-7xl md:mx-auto min-h-screen
      md:p-5 md:py-5 items-center border bg-slate-50 border-gray-300 md:m-5 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2  "
          >
           <FontAwesomeIcon icon={faArrowLeft} className="text-lg"/>
          </button>
         </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-5 text-center">Detail About
            <span className="text-3xl font-bold  mb-5 text-pink-400"> {listing.name} </span></h1>

        <div className="">
          {listing && (
            <div key={listing._id} className="bg-slate-50">
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
                <button onClick={()=> handleBooking(listing._id)} disabled={requestedHotels[listing._id]}
                 className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
               {requestedHotels[listing._id] ? "Requested" : "Book"}
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