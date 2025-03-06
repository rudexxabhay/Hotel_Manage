import { useState } from "react";
import Modal from "./Model";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import {  useNavigate } from "react-router-dom";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;
import { toast } from "react-toastify";
function Admin() {
  const [activeTab, setActiveTab] = useState("upload"); // Default: "upload"
const navigate = useNavigate();
const [lists, setLists] = useState([])
const myListing = async()=>{
  setActiveTab("listings")
  try {
    const response = await axios.get(`${BASE_URL}/user/my-listing`, {withCredentials: true})
    console.log(response)
    setLists(response.data.listing
    )
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
                   <FontAwesomeIcon icon={faArrowLeft} className="text-lg"/>
                  </button>
        <h1 className="text-2xl font-bold text-gray-800 text-center  my-4">Admin Dashboard</h1>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setActiveTab("upload")}
            className={`border border-gray-300 rounded-lg py-2 transition-all ${
              activeTab === "upload" ? "bg-pink-500 text-white" : "bg-pink-400 hover:bg-pink-500"
            }`}
          >
            Upload Listing
          </button>
          <button
            onClick={myListing}
            className={`border border-gray-300 rounded-lg py-2 transition-all ${
              activeTab === "listings" ? "bg-pink-500 text-white" : "bg-pink-400 hover:bg-pink-500"
            }`}
          >
            My Listings
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`border border-gray-300 rounded-lg py-2 transition-all ${
              activeTab === "listings" ? "bg-pink-500 text-white" : "bg-pink-400 hover:bg-pink-500"
            }`}
          >
           Requests
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="md:max-w-7xl md:mx-auto bg-gray-100 shadow-lg border border-gray-400 rounded-lg p-4">
          
          {/* Upload Listing Form (Only shows when "Upload Listing" is active) */}
          {activeTab === "upload" && (
            <div className="bg-white shadow-md border border-gray-300 rounded-lg w-full">
              <Modal handleClose={()=> setActiveTab("requests")}/>
            </div>
          )}

          {/* My Listings (Only shows when "My Listings" is active) */}
          {activeTab === "listings" && (
           lists.map((list)=>(
            <div key={list._id} className="flex flex-col gap-4 mt-5">
            <div className="bg-white shadow-md border border-gray-300 rounded-lg p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div>
                <h2 className="md:text-lg font-semibold">{list.name}</h2>
                <p className="text-gray-600">{list.location}</p>
                {/* <p className="text-gray-500">Time: 2:30 PM</p> */}
              </div>
              <div className="flex gap-2">
                <button className="border bg-green-400 text-white px-4 rounded-lg hover:bg-green-500 transition-all">
                  Edit
                </button>
                <button className="border bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition-all">
                  Delete
                </button>
              </div>
            </div>
          </div>
           ))
          )}
         
         {activeTab === "requests" && (
            <div className="flex flex-col gap-4 mt-5">
              <div className="bg-white shadow-md border border-gray-300 rounded-lg p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <h2 className="text-lg font-semibold">Ocean View Resort</h2>
                  <p className="text-gray-600">Requested by: John Doe</p>
                  <p className="text-gray-500">Time: 2:30 PM</p>
                </div>
                <div className="flex gap-2">
                  <button className="border bg-green-400 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition-all">
                    Accept
                  </button>
                  <button className="border bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition-all">
                    Reject
                  </button>
                </div>
              </div>
              
            </div>
          )}
     
        </div>
      </div>
    </div>
  );
}

export default Admin;
