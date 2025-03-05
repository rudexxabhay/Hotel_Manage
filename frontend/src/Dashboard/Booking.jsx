import axios from "axios";
import { useEffect,useState } from "react";
const BASE_URL = import.meta.env.VITE_BASE_URL;

function Booking() {
  const [bookings, setBookings] = useState([]);
  console.log("Bookings",bookings)
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}/user/show-booking`,
          {},
          { withCredentials: true }
        );

        const userBookings = response.data.booking;
        setBookings(userBookings);
        
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);
  return (
    <div className="min-h-screen">
        <h1 className="text-center my-4 text-3xl text-black font-semibold">My booking</h1>

          <div className="border rounded-lg max-w-7xl p-2 bg-gray-100 m-auto ">
            <div className="flex justify-between items-center border-b border-gray-400 p-4">
              <h1 className="w-1/3">Name</h1>
              <p className="w-1/3">Time/date</p>
              <p className="w-1/3">Status</p>
            </div>
            {bookings.map((booking) => (
              <div key={booking._id} className="my-3 rounded-lg p-4 flex justify-between items-center border border-gray-400 bg-white">
              <h2 className=" text-lg w-1/3 font-semibold text-gray-600">{booking.listing?.name}</h2>
              <p className="text-blue-500 text-sm w-1/3">{booking.createdAt}</p>
              <button className="text-red-600 w-1/3 flex justify-start">{booking.status}</button>
            </div>
            ))}
          </div>
        </div>
  )
}

export default Booking