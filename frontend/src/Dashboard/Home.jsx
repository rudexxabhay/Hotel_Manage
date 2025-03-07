/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import {
  faHouse,
  faCircleUser,
  faImage,
  faFile,
  faCamera,
  faCalendar,
  faCloud,
  faTruck,
  faThumbsUp,
  faHeadphones,
  faBell,
  faComment,
 
} from "@fortawesome/free-solid-svg-icons";


export default function Home({searchItems}) {
const [search, setSearch] = useState()
searchItems(search)

      return (
      <div className="relative w-full overflow-hidden">
      <div className=" bg-gray-900 p-4 md:max-w-7xl md:m-auto lg:rounded-lg lg:mt-[-4px] overflow-hidden">
        <div className=" relative flex gap-6 space-x-12 animate-scroll ">
          <a href="">
            <FontAwesomeIcon icon={faHouse} className="text-2xl text-pink-500" />
          </a>
          <a href="">
            <FontAwesomeIcon icon={faCircleUser} className="text-2xl text-pink-500" />
          </a>
          <a href="">
            <FontAwesomeIcon icon={faImage} className="text-2xl text-pink-500" />
          </a>
          <a href="">
            <FontAwesomeIcon icon={faFile} className="text-2xl text-pink-500" />
          </a>
          <a href="">
            <FontAwesomeIcon icon={faCamera} className="text-2xl text-pink-500" />
          </a>
          <a href="">
            <FontAwesomeIcon icon={faCalendar} className="text-2xl text-pink-500" />
          </a>
          <a href="">
            <FontAwesomeIcon icon={faCloud} className="text-2xl text-pink-500" />
          </a>
          <a href="">
            <FontAwesomeIcon icon={faTruck} className="text-2xl text-pink-500" />
          </a>
          <a href="">
            <FontAwesomeIcon icon={faThumbsUp} className="text-2xl text-pink-500" />
          </a>
          <a href="">
            <FontAwesomeIcon icon={faHeadphones} className="text-2xl text-pink-500" />
          </a>
          <a href="">
            <FontAwesomeIcon icon={faBell} className="text-2xl text-pink-500" />
          </a>
          <a href="">
            <FontAwesomeIcon icon={faComment} className="text-2xl text-pink-500" />
          </a>
        </div>
      </div>
      {/* Main page */}
      <div className="grid grid-cols-1 md:flex md:justify-between items-center lg:max-w-7xl m-auto">
        <div className="px-2 mt-2">
          <p className="text-center text-2xl md:text-[20px] font-semibold">Our popular sets</p>
        </div>

            <div className="flex justify-center mt-3 px-3">
            <div className="relative flex items-center gap-2">
            <input
              type="text"
              className="w-full border px-9 py-1 text-pink-700  focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="Search by city, name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="border border-gray-200 px-4 py-1
             bg-pink-300 hover:bg-pink-400 transition-all shadow-lg">Search</button>
            </div>
            </div>
      </div>
      <div className="h-[1px] w-7xl m-auto mb-5 border border-gray-700 mt-2"></div>

    </div>
  );
}
