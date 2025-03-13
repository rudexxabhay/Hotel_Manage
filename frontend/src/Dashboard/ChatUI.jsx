import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faVideo, faPhone, faFaceSmile, faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";
import BGChat from '../assets/black-felt.png'
const ChatUI = () => {
  const [chats, setChats] = useState([
    {
      owner: "John's Banquet",
      messages: [
        { "sender": "owner", "text": "Hello! Welcome to our banquet hall. How can I assist you?" },
        { "sender": "user", "text": "Hi! I’m looking to book your hall for a wedding next month." },
        { "sender": "owner", "text": "That sounds great! May I know the date and number of guests?" },
        { "sender": "user", "text": "Sure! The wedding is on April 15th, and we are expecting around 200 guests." },
        { "sender": "owner", "text": "Got it! We have availability on that date. Would you like to visit for a tour?" },
        { "sender": "user", "text": "Yes, that would be great! What time would be suitable for a visit?" },
        { "sender": "owner", "text": "You can visit anytime between 10 AM and 6 PM. Let me know your preferred time." },
        { "sender": "user", "text": "How about 3 PM tomorrow?" },
        { "sender": "owner", "text": "Perfect! I’ll be available to show you around. Looking forward to meeting you!" },
        { "sender": "user", "text": "Thank you! See you tomorrow at 3 PM." }
      ],
    },
    {
      owner: "Royal Palace",
      messages: [
        { sender: "owner", text: "Hi! Looking for a venue?" },
        { sender: "user", text: "Yes, I need one for a birthday party." },
        { sender: "owner", text: "Hello! How can I help you?" },
        { sender: "user", text: "I want to book your hall for a wedding." },
      ],
    },
    {
      owner: "Sunset Garden",
      messages: [
        { sender: "owner", text: "Welcome! Need any help?" },
        { sender: "user", text: "Tell me about your pricing." },
        { sender: "owner", text: "Hello! How can I help you?" },
        { sender: "user", text: "I want to book your hall for a wedding." },
      ],
    },
  ]);

  const [selectedChat, setSelectedChat] = useState(null);
  console.log(selectedChat);
  // const [input, setInput] = useState("");
  return (
    <div className="dark:bg-slate-800 dark:text-pink-600">
      <div className="flex flex-col lg:flex-row w-full ">
        <div className={  `lg:w-1/3  border h-[90vh] ${selectedChat ? "hidden" : ""} lg:block`}>
          <h1 className="text-2xl py-2 px-2">My chats</h1>
          <div className="flex flex-col">
            {chats.map((chat, idx) => (
              <div onClick={() => setSelectedChat(chat)} key={idx} className={`flex cursor-pointer justify-between 
              items-center px-5 hover:bg-pink-300 p-2 `}>
                <div className="flex items-center gap-6 ">
                  <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="dp" className="w-12 h-12" />
                  <div>
                    <h1>{chat.owner}</h1>
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
                  <h1 className="text-[17px] lg:text-[20px] truncate w-3/4">{selectedChat.owner}</h1>
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

          <div className=" relative chats  lg:h-[73vh] flex-grow 
          overflow-y-auto p-4 space-y-3 " style={{ backgroundImage: `url(${BGChat})` }}>
            {selectedChat ? (
              selectedChat.messages.map((msg, index) => (
                <div key={index} className={`p-2 rounded-lg w-max ${msg.sender === 'user' ? 'bg-pink-400 text-white self-end' : 'bg-white shadow-lg'}
                 ${msg.sender === 'user' ? 'ml-auto' : ''} max-w-[75%] sm:max-w-[60%] md:max-w-[50%] lg:max-w-[40%] break-words
`}>
                  <p className="">{msg.text}</p>
                </div>
              ))
            ) : (
              <p className="text-center  text-gray-500">Select a chat to start messaging</p>
            )}
          </div>

          
          {selectedChat ? (
            <div className="flex items-center w-full px-3 gap-2 relative z-10 shadow-md">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <FontAwesomeIcon icon={faFaceSmile} className="text-2xl text-black" />
            </div>
          
            <input
              type="text"
              className="flex-grow pl-10 outline-none bg-transparent text-pink-500 px-3 py-2 shadow"
              placeholder="Message.."
            />
            <button className="ml-2   text-white px-3 py-2 rounded-full">
              <FontAwesomeIcon icon={faCircleArrowRight} className="text-pink-600 text-2xl"/>
            </button>
          </div>
          ) : ("")}

        </div>
      </div>
    </div>
  )
};

export default ChatUI;