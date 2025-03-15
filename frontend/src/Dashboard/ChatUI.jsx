import { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faVideo, faPhone, faFaceSmile, faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";
import BGChat from '../assets/black-felt.png'
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../AuthContext";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const ChatUI = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loginId } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  console.log(selectedChat);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchResponse = async () => {
      let response = await axios.post(`${BASE_URL}/user/all-chats`, {}, { withCredentials: true })
      setChats(response.data.allChats)
      console.log("HISTORY", response.data.allChats)
    }
    fetchResponse()
  }, [])


  useEffect(() => {
    const fetchResponse = async () => {
      try {
        const response = await axios.post(`${BASE_URL}/user/show-chats/${id}`, {withCredentials:true})
        console.log("THis", response.data)
        
        setSelectedChat(response.data)
        
      } catch (error) {
        console.log(error.message)
      }
    }
    fetchResponse()
  }, [id])

  const handleShow = async (chatId) => {
    console.log(chatId)
    console.log(id)
    navigate(`/my-chats/${chatId}`)
    try {

      const response = await axios.post(`${BASE_URL}/user/show-chats/${id}`)
      console.log("THis", response.data)
      setSelectedChat(response.data)
    } catch (error) {
      console.log(error.message)
    }
  }

  const sendMessage = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/send`,
        { message: input, chatId: id },
        { withCredentials: true }
      );


      console.log(response.data);
    } catch (error) {
      console.log(error.message);
    }
};

  return (
    <div className="dark:bg-slate-800 dark:text-pink-600">
      <div className="flex flex-col lg:flex-row w-full ">
        <div className={`lg:w-1/3  border h-[90vh] ${selectedChat ? "hidden" : ""} lg:block`}>
          <h1 className="text-2xl py-2 px-2">My chats</h1>
          <div className="flex flex-col">
            {chats.map((chat, idx) => (
              <div onClick={() => handleShow(chat._id)} key={idx} className={`flex cursor-pointer justify-between 
              items-center px-5 hover:bg-pink-300 p-2 `}>
                <div className="flex items-center gap-6 ">
                  <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="dp" className="w-12 h-12" />
                  <div>
                    <h1>{chat.users[1].name}</h1>
                    <p className="text-sm">Tap to chat</p>
                  </div>
                </div>
                <div>
                  <p><FontAwesomeIcon icon={faCircle} className="text-green-400 text-sm" /></p>
                </div>
              </div>
            ))}


          </div>
        </div>
        <div className={`w-full border h-[90vh] flex flex-col ${selectedChat ? "block" : "hidden"} lg:block`}>
          <div className="flex transition-all justify-between items-center lg:px-5 py-1 px-2 bg-pink-50  lg:p-2">
            {selectedChat ? (
              <div className="flex lg:gap-6 gap-2 items-center">
                <button onClick={() => setSelectedChat(null)} className="text-[15px] text-gray-500">Back</button>
                <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="" className="w-10 h-10 lg:w-12 lg:h-12" />
                <div>
                  <h1 className="text-[17px] lg:text-[20px] truncate w-3/4">{selectedChat.users[1].name}</h1>
                  <p className="text-[10px] lg:text-[15px]">Last seen today <span>
                    <FontAwesomeIcon icon={faCircle} className="text-green-700 text-[6px]" /></span></p>
                </div>
              </div>
            ) : (
              ""
            )}

            {selectedChat ? (
              <div className="flex px-5 gap-6">
                <button onClick={() => alert("Currently only chats available")}><FontAwesomeIcon icon={faPhone} className="lg:text-2xl text-pink-600" /></button>
                <button onClick={() => alert("Currently only chats available")}><FontAwesomeIcon icon={faVideo} className="lg:text-2xl text-pink-600" /></button>
              </div>
            ) : ("")}
          </div>

          <div className="relative chats lg:h-[73vh] flex-grow 
          overflow-y-auto p-4 space-y-3"
            style={{ backgroundImage: `url(${BGChat})` }}>

            {id ? (
              selectedChat?.message?.length > 0 ? (
                selectedChat.message.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-lg w-max max-w-[75%] sm:max-w-[60%] md:max-w-[50%] lg:max-w-[40%] break-words
          ${msg.sender?._id === loginId ? 'bg-pink-400 text-white self-end ml-auto' : 'bg-white shadow-lg'}`}
                  >
                    <p>{msg.message}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No messages yet</p>
              )
            ) : (
              <p className="text-center text-gray-500">Select a chat to start messaging</p>
            )}
          </div>





          {selectedChat ? (
            <div className="flex items-center w-full px-3 gap-2 relative z-10 shadow-md">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <FontAwesomeIcon icon={faFaceSmile} className="text-2xl text-black" />
              </div>

              <input value={input} onChange={(e) => setInput(e.target.value)}
                type="text"
                className="flex-grow pl-10 outline-none bg-transparent text-pink-500 px-3 py-2 shadow"
                placeholder="Message.."
              />
              <button onClick={sendMessage} className="ml-2 text-white px-3 py-2 rounded-full">
                <FontAwesomeIcon icon={faCircleArrowRight} className="text-pink-600 text-2xl" />
              </button>
            </div>
          ) : ("")}

        </div>
      </div>
    </div>
  )
};

export default ChatUI;