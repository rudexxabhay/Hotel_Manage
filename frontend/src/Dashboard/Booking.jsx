import axios from "axios";
import { useEffect,useState } from "react";
const BASE_URL = import.meta.env.VITE_BASE_URL;

function Booking() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState(null);
  
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
  
  const bookingsPerPage = 5;
  const filteredBookings = bookings.filter((b) =>
        b.listing?.name.toLowerCase().includes(search.toLowerCase()) &&
        (statusFilter === "all" || b.status.toLowerCase() === statusFilter)
    )
    .slice((currentPage - 1) * bookingsPerPage, currentPage * bookingsPerPage);

  return (
    <div className= "bg-gray-100 min-h-screen px-4 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Bookings</h1>
       
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-md mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="p-2 border rounded-lg w-full md:w-1/3 mb-2 md:mb-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-2 border rounded-lg w-full md:w-1/4"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Booking List */}
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="hidden md:flex justify-between items-center bg-gray-300 px-6 py-3 font-medium text-gray-700">
          <h1 className="w-1/3">Name</h1>
          <p className="w-1/3 text-center">Time / Date</p>
          <p className="w-1/3 text-right">Status</p>
        </div>

        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="flex flex-col md:flex-row justify-between items-center border-b border-gray-300 p-4 bg-white hover:bg-gray-50 transition"
            >
              <h2 className="text-lg font-semibold w-full md:w-1/3 text-center md:text-left">
                {booking.listing?.name}
              </h2>
              <p className="text-blue-600 text-sm w-full md:w-1/3 text-center font-medium">
                {new Date(booking.createdAt).toLocaleString()}
              </p>

              <div className="w-full md:w-1/3 flex justify-between md:justify-end items-center gap-3">
                <span
                  className={`px-4 py-1 text-sm font-semibold rounded-full shadow-md ${
                    booking.status.toLowerCase() === "approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {booking.status}
                </span>

                <button
                  className="px-4 py-2 text-sm font-semibold text-red-700 border border-red-500 rounded-lg hover:bg-red-500 hover:text-white transition"
                  onClick={() => setModal(booking._id)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-6 text-gray-500">No bookings found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <button
          className="px-4 py-2 mx-2 bg-gray-300 text-gray-800 rounded-lg disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <button
          className="px-4 py-2 mx-2 bg-gray-300 text-gray-800 rounded-lg disabled:opacity-50"
          disabled={filteredBookings.length < bookingsPerPage}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {/* Cancel Confirmation Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Are you sure?</h2>
            <p>Do you really want to cancel this booking?</p>
            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                onClick={() => setModal(null)}
              >
                No
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
                onClick={() => {
                  alert("Booking Cancelled!");
                  setModal(null);
                }}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Booking