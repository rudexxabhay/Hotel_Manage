import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_BASE_URL;
let socketInstance = null;

export const initializeSocket = () => {
    if (socketInstance) {
        console.log("⚡ Socket already initialized.");
        return socketInstance;
    }

    const token = localStorage.getItem("token");
    if (!token) {
        console.warn("⚠️ No token found in localStorage!");
    }

    socketInstance = io(BASE_URL, {
        withCredentials: true,
        auth: { token: token || "" }
    });

    socketInstance.on("connect", () => {
        console.log("✅ Connected to socket server!", socketInstance.id);
    });

    socketInstance.on("disconnect", (reason) => {
        console.log("❌ Disconnected from socket server. Reason:", reason);
    });

    socketInstance.on("connect_error", (err) => {
        console.error("❌ Socket connection error:", err.message);
    });

    return socketInstance;
};


export default initializeSocket;
