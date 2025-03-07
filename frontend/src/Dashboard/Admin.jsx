import { useEffect, useState } from "react";
import Modal from "./Model";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;
import { toast } from "react-toastify";
function Admin() {
  const [activeTab, setActiveTab] = useState("upload"); // Default: "upload"
  const [currentPage, setCurrentPage] = useState(1);
  const [request, setRequest] = useState([])
  console.log(request)
  console.log("Current Page", currentPage)
  const navigate = useNavigate();
  const [lists, setLists] = useState([])
  useEffect(() => {
    const result = async () => {
      const response = await axios.get(`${BASE_URL}/user/my-listing`, { withCredentials: true })
      setLists(response.data.listing)
    }
    result();
  }, [])
  const myListing = async () => {
    setActiveTab("listings")
    try {
      const response = await axios.get(`${BASE_URL}/user/my-listing`, { withCredentials: true })
      console.log(response)
      setLists(response.data.listing
      )
    } catch (error) {
      toast.error(error.message)
    }
  }
  const requestPerPage = 4;

  const newLists = lists.slice((currentPage - 1) * requestPerPage, currentPage * requestPerPage);
 const newRequest = request.slice((currentPage - 1) * requestPerPage, currentPage * requestPerPage);

  const handleRequest = async () => {
    setActiveTab("requests")
    try {
      const response = await axios.get(`${BASE_URL}/user/request`, { withCredentials: true })
      setRequest(response.data.requests)
    } catch (error) {
      toast.error(error.message)
  }
}
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/user/del-listing/${id}`, { withCredentials: true })
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.message)
    }

  }

  
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-[300px] bg-gray-100 border-r border-gray-400 shadow-lg p-4 ">
        <div className="flex items-center ">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2  "
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 text-center  my-4">Admin Dashboard</h1>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setActiveTab("upload")}
            className={`border border-gray-300 rounded-lg py-2 transition-all ${activeTab === "upload" ? "bg-pink-500 text-white" : "bg-pink-400 hover:bg-pink-500"
              }`}
          >
            Upload Listing
          </button>
          <button
            onClick={myListing}
            className={`border border-gray-300 rounded-lg py-2 transition-all ${activeTab === "listings" ? "bg-pink-500 text-white" : "bg-pink-400 hover:bg-pink-500"
              }`}
          >
            My Listings
          </button>
          <button
            onClick={handleRequest}
            className={`border border-gray-300 rounded-lg py-2 transition-all ${activeTab === "listings" ? "bg-pink-500 text-white" : "bg-pink-400 hover:bg-pink-500"
              }`}
          >
            Requests
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className={`md:max-w-7xl md:mx-auto
            shadow-lg border
            border-gray-400 rounded-lg p-4 ${activeTab === "upload" ? "bg-white" : "bg-gray-100"}`}>

          {activeTab === "upload" && (
            <div className="bg-white w-full">
              <Modal handleClose={() => setActiveTab("requests")} />
            </div>
          )}

          {activeTab === "listings" ? (
            newLists.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <h1 className="text-2xl text-gray-500">No Listings Found</h1>
              </div>
            ) : (
              newLists.map((list) => (
                <div key={list._id} className="flex flex-col gap-4 mt-5">
                  <div className="bg-white shadow-md border border-gray-300 rounded-lg p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div>
                      <h2 className="md:text-lg font-semibold">{list.name}</h2>
                      <p className="text-gray-600">{list.location}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="border bg-green-400 text-white px-4 rounded-lg hover:bg-green-500 transition-all">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(list._id)}
                        className="border bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )
          ) : null}



{activeTab === "requests" && (
  <div className="flex flex-col gap-4 mt-5">
    {newRequest.length === 0 ? (
      <div className="flex items-center justify-center h-full">
        <h1 className="text-2xl text-gray-500">No Requests Found</h1>
      </div>
    ) : (
      newRequest.map((req) => (
        <div key={req._id} className="bg-white shadow-md border border-gray-300 rounded-lg p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h2 className="text-lg font-semibold">{req.listing.name}</h2>
            <p className="text-gray-600">Requested by: {req.user.name}</p>
            <p className="text-gray-500">Time: {new Date(req.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex gap-2">
            <button  className="border bg-green-400 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition-all">
              Accept
            </button>
            <button  className="border bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition-all">
              Reject
            </button>
          </div>
        </div>
      ))
    )}
  </div>
)}


        </div>
        <div className={`flex  justify-between items-center my-5 px-5 ${activeTab === "upload" ? "hidden" : "block"}`}>
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
          <button disabled={newLists.length < requestPerPage} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
        </div>
      </div>

    </div>
  );
}

export default Admin;
