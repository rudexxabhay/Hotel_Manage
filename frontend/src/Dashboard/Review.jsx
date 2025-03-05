/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;
import { useEffect, useState } from "react";
function Review({listingId, item}) {
  
    const maxStars = 5;
    const [review, setReview] = useState([])
    const handleRemove = async(itemId)=>{
  
      try {
        // eslint-disable-next-line no-unused-vars
        const response = await axios.delete(
          `${BASE_URL}/user/${listingId}/review/${itemId}`);
          setReview((prevReviews) => prevReviews.filter(review => review._id !== itemId));

         toast.success("Review deleted successfully!");

      } catch (error) {
        toast.error(error.message)
      }
    }
  
  useEffect(()=> {
    const fetchReview = async()=>{
      try {
        const response = await axios.get(
          `${BASE_URL}/user/${listingId}/show-review`);
          setReview(response.data.review.reviews)
      } catch (error) {
        toast.error(error.message)
      }
    }
    fetchReview();
  }, [item])

  
  return (
    <div className=" my-3 mx-3 p-2 md:max-w-7xl md:mx-auto 
      md:p-5 md:py-5 items-center border bg-slate-50 border-gray-300 md:m-5 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-5 text-center">All comments!</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      
      {review.map((item)=>(
        <div key={item._id} className="border border-gray-200 bg-white shodow-lg rounded-lg p-3"> 
        <div className="flex justify-between items-center cursor-pointer">
        <h2>{item.name}</h2>
        <FontAwesomeIcon onClick={()=> handleRemove(item._id)} icon={faTrash} className="text-slate-500"/></div>
        <div className="flex text-yellow-500 text-xl">
        {[...Array(maxStars)].map((_, index) => (
        <span key={index}>
          {index < item.rating ? "★" : "☆"} {/* Filled or empty star */}
        </span>
      ))}
    </div>
     <p className="text-gray-500">{item.review}</p>
     <p className="text-blue-500 text-[12px] md:text-[13px] ">Created At: {new Date(item.createdAt).toLocaleString("en-IN", {
       year: "numeric",
       month: "short",
       day: "numeric",
       hour: "2-digit",
       minute: "2-digit",
       second: "2-digit",
       hour12: true,
     })}</p>
        </div>
      ))}
        
      </div>
      </div>
  )
}

export default Review