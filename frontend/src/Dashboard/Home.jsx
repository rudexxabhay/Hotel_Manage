/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  faUpload
} from "@fortawesome/free-solid-svg-icons";


export default function Home({ handleClick, loding }) {

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
              className="w-full border px-9 py-1  focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Search here..."
            />
            <button className="border border-gray-200 px-4 py-1
             bg-slate-50 hover:bg-slate-100 shadow-lg">Search</button>
            </div>
            </div>




        <div className="cursor-pointer flex justify-center px-2 mt-2 md:justify-end" >
          {loding ? (
            <svg className="inline w-4 h-4 animate-spin fill-pink-300" viewBox="0 0 100 101" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
          ) : (
            <FontAwesomeIcon onClick={handleClick} icon={faUpload} className="text-2xl lg:text-2xl w-full md:w-auto  p-2 text-gray-600 border border-gray-500" />
          )}
        </div>

      </div>
      <div className="h-[1px] w-7xl m-auto mb-5 border border-gray-700 mt-2"></div>

    </div>
  );
}
