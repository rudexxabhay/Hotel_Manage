import { useEffect, useState} from "react";
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
  const [listing, setListings] = useState({})
  
  const [item, setItem] = useState("")
const [requestedHotels, setRequestedHotels] = useState({});

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
    console.log(listId)
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
           ;

            // Filter only pending bookings and create a map of their listing IDs
            const bookingMap = {};
            userBookings
                .filter((booking) => booking.status === "pending" && booking.listing && booking.listing._id)
                .forEach((booking) => {
                    bookingMap[booking.listing._id] = true;
                });

            
            setRequestedHotels(bookingMap);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    };

    fetchBookings();
}, []);


const handlerChatOwner = async (userId) => {
  console.log("Owner ID:", userId); // Debugging ke liye

  try {
    const response = await axios.post(
      `${BASE_URL}/user/start`,
      { ownerId: userId }, // Data Send Karna
      { withCredentials: true }
    );

    console.log("Response:", response.data.chatId); // Debugging ke liye

    if ( response.data.chatId) {
      navigate(`/my-chats/${response.data.chatId}`); // Navigate to chat
    } else {
      toast.error("Failed to start chat!");
    }
  } catch (error) {
    console.error("Error starting chat:", error);
    toast.error(error.response?.data?.message || "Something went wrong!");
  }
};

  return (
    <>
      <div className="dark:bg-slate-700 my-3 mx-3  mb-3 md:max-w-7xl md:mx-auto min-h-screen
      md:p-5 md:py-5 items-center  bg-slate-50  md:m-5 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2  "
          >
           <FontAwesomeIcon icon={faArrowLeft} className="dark:text-white text-sm text-gray-500"/> <span className="dark:text-white text-gray-500">Back</span>
          </button>
         </div>
            <h1 className="dark:text-white text-lg md:text-3xl font-bold text-gray-800 mb-5 text-center">Detail About
            <span className=" text-lg md:text-3xl font-bold  mb-5 text-pink-400"> {listing.name} </span></h1>

        <div className="">
          {listing && (
            <div key={listing._id} className="bg-slate-50 dark:bg-slate-700">
              <img src={listing.image} alt={listing.name} className="w-full h-[50vh] md:h-screen
               object-cover rounded-lg p-4" />
              <div className="px-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-pink-400">{listing.name}</h2>
                <p className="text-gray-700 dark:text-white">Available Date - {listing.availabeldates}</p>
                <p className="text-gray-700 dark:text-white">Capacity - {listing.capacity}</p>
                <p className="text-gray-700 dark:text-white">Per Night - {listing.priceday}</p>
                <p className="text-gray-700 dark:text-white">Facility - {listing.facility}</p>
                <p className="text-gray-700 dark:text-white">Location - {listing.location}</p>
                <p className="text-gray-700 dark:text-white">Rating - {listing.rating}</p>
                <p className="text-gray-700 dark:text-white">Contact - {listing.contact}</p>
                <div className="flex flex-col md:flex-row">
                <button onClick={()=> handleBooking(listing._id)} disabled={requestedHotels[listing._id]}
                 className="mt-4 w-full bg-pink-400 text-white py-2 rounded-lg hover:bg-pink-500 transition">
                  {requestedHotels[listing._id] ? "Requested" : "Book"}
                </button>
                <button onClick={()=> handlerChatOwner(listing.userId)}
                 className="mt-4 w-full bg-pink-400 text-white py-2 rounded-lg hover:bg-pink-500 transition ml-2">
                  Chat owner
                </button>
                </div>
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