import { useState } from "react";

const ChatUI = () => {
  const [chats, setChats] = useState([
    {
      owner: "John's Banquet",
      messages: [
        { sender: "owner", text: "Hello! How can I help you?" },
        { sender: "user", text: "I want to book your hall for a wedding." },
        { sender: "owner", text: "Hello! How can I help you?" },
        { sender: "user", text: "I want to book your hall for a wedding." },
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
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim() !== "" && selectedChat) {
      const updatedChats = chats.map((chat) =>
        chat.owner === selectedChat.owner
          ? { ...chat, messages: [...chat.messages, { sender: "user", text: input }] }
          : chat
      );
      setChats(updatedChats);
      setInput("");
    }
  };

  return (
    <div className="flex h-screen bg-white text-black">
      {/* Sidebar - Shows List of Chats */}
      <div className={`w-full sm:w-1/3 bg-gray-100 p-4 border-r border-gray-300 ${selectedChat ? 'hidden sm:block' : ''}`}>
        <h2 className="text-lg font-bold mb-3">My Chats</h2>
        <ul>
          {chats.map((chat, index) => (
            <li
              key={index}
              className={`p-3 cursor-pointer rounded-lg mb-2 ${
                selectedChat?.owner === chat.owner ? "bg-pink-500 text-white" : "bg-white"
              } hover:bg-pink-400`}
              onClick={() => setSelectedChat(chat)}
            >
              {chat.owner}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Chat Section */}
      <div className={`flex flex-col w-full sm:w-2/3 ${selectedChat ? '' : 'hidden sm:flex'}`}>
        {/* Header */}
        {selectedChat && (
          <div className="bg-pink-600 text-black p-4 flex justify-between items-center">
            <button
              className="sm:hidden text-sm md:text-lg text-black"
              onClick={() => setSelectedChat(null)}
            >
              Back
            </button>
            <span className="md:text-lg text-sm font-bold">Chat with {selectedChat.owner}</span>
          </div>
        )}
        
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {selectedChat?.messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-end pl-9" : "justify-start"}`}
            >
              <span className={`text-[12px] p-1  md:px-3 md:py-1 
                  rounded-lg text-gray-800 
                  max-w-xs  bg-slate-50 shadow-lg ${msg.sender === "user" ? "bg-green-500 text-white" : ""}`}>
                {msg.text}
              </span>
            </div>
          ))}
        </div>
        
        {/* Input Box */}
        {selectedChat && (
          <div className="p-4 bg-gray-100 flex">
            <input
              type="text"
              className="flex-1 p-2 border border-gray-300 rounded-lg"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              className="ml-2 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatUI;