import { useState, useEffect, useContext, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faVideo, faPhone, faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";
import BGChat from '../assets/black-felt.png';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { initializeSocket } from '../Config/socket.js';

const ChatUI = () => {
  const { id } = useParams();    
  const navigate = useNavigate();
  const { loginId } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [input, setInput] = useState("");

 
  const socket = initializeSocket();

  useEffect(() => {
    const fetchResponse = async () => {
      let response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/all-chats`, {}, { withCredentials: true });
      setChats(response.data.allChats);
    };
    fetchResponse();
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchChatMessages = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/show-chats/${id}`, { withCredentials: true });
        setSelectedChat(response.data);

        if (socket) {
          socket.emit("joinChat", id);
          console.log("Join request sent for chat:", id);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchChatMessages();

    socket.on("newMessage", (message) => {
      console.log("New message received:", message);
      setSelectedChat((prev) => ({
        ...prev,
        message: [...(prev?.message || []), message]
      }));
    });

    return () => {
      socket.off("newMessage");
    };
  }, [id, socket]); 

  const handleShow = (chatId) => {
    navigate(`/my-chats/${chatId}`);
  };
   const chatContainerRef = useRef(null);

  useEffect(() => {
   
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [selectedChat?.message]);


  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = {
      chatId: id,
      senderId: loginId,
      message: input
    };

    console.log("Sending Message:", newMessage);
    socket.emit("newMessage", newMessage);

   
    setSelectedChat((prev) => ({
      ...prev,
      message: [...(prev?.message || []), { sender: { _id: loginId }, message: input }]
    }));

    setInput("");
  };

  return (
    <div className="dark:bg-slate-800 dark:text-pink-600">
      <div className="flex flex-col lg:flex-row w-full ">
        <div className={`lg:w-1/3  border h-[90vh] ${selectedChat ? "hidden" : ""} lg:block`}>
          <h1 className="text-2xl py-2 px-2">My chats</h1>
          <div className="flex flex-col">
            {chats.map((chat, idx) => (
              <div onClick={() => handleShow(chat._id)} key={idx} className="flex cursor-pointer justify-between items-center px-5 hover:bg-pink-300 p-2">
                <div className="flex items-center gap-6">
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
            ) : ""}

            {selectedChat ? (
              <div className="flex px-5 gap-6">
                <button onClick={() => alert("Currently only chats available")}><FontAwesomeIcon icon={faPhone} className="lg:text-2xl text-pink-600" /></button>
                <button onClick={() => alert("Currently only chats available")}><FontAwesomeIcon icon={faVideo} className="lg:text-2xl text-pink-600" /></button>
              </div>
            ) : ""}
          </div>

          <div ref={chatContainerRef}   className=" chat-bubble relative chats lg:h-[73vh] flex-grow overflow-y-auto p-4 space-y-3" style={{ backgroundImage: `url(${BGChat})` }}>
            {selectedChat?.message?.map((msg, index) => (
              <div key={index} className={`p-2 rounded-lg w-max max-w-[75%] ${msg.sender?._id === loginId ? 'bg-pink-400 text-white self-end ml-auto' : 'bg-white shadow-lg'}`}>
                <p>{msg.message}</p>
              </div>
              
            ))}
            
          </div>

          <div className="flex items-center w-full px-3 gap-2 shadow-md">
            <input value={input} onChange={(e) => setInput(e.target.value)} type="text" className="flex-grow outline-none px-3 py-2" placeholder="Message.." />
            <button onClick={sendMessage} className="ml-2"><FontAwesomeIcon icon={faCircleArrowRight} className="text-pink-600 text-2xl" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
