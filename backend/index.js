import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import "dotenv/config";
import cookieParser from 'cookie-parser';
import connectDB from './Config/DbConnection.js';
import { authRouter } from './Route/AuthRoute.js';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';
import { ChatModel } from './Model/AuthModel.js';

const app = express();
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN;
const server = createServer(app);

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true
}));
console.log("CORS_ORIGIN", CORS_ORIGIN)

const io = new Server(server, {
    cors: {
        origin: CORS_ORIGIN,
        credentials: true,
        methods: ["GET", "POST"]
    }
});


io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
        console.log("No Token Provided! Connection Rejected.");
        return next(new Error("Authentication error"));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded;
        console.log("User Authenticated:", decoded);
        next();
    } catch (error) {
        console.log("Invalid Token! Connection Rejected.");
        return next(new Error("Invalid token"));
    }
});

io.on("connection", (socket) => {
    console.log("🔗 New user connected:", socket.id);

    socket.on("joinChat", (chatId) => {
        if (!chatId || !mongoose.Types.ObjectId.isValid(chatId)) {
            console.log(" Invalid chat ID received from frontend");
            return;
        }
        socket.join(chatId);
        console.log(`User joined chat room: ${chatId}`);

        socket.emit("chatJoined", { chatId });
    });

    
    socket.on("newMessage", async ({ chatId, senderId, message }) => {
   
        if (!chatId || !mongoose.Types.ObjectId.isValid(chatId) || !senderId || !message) {
            console.log("Invalid data received! Check frontend payload.");
            return;
        }

        const chat = await ChatModel.findById(chatId);
        if (!chat) {
            console.log("Chat not found in DB!");
            return;
        }

        const newMessage = { sender: senderId, message: message, createdAt: new Date() };
        console.log(" NEW MESSAGE TO SAVE:", newMessage);

        const updatedChat = await ChatModel.findByIdAndUpdate(
            chatId,
            { $push: { message: newMessage } },
            { new: true }
        );

        if (!updatedChat) {
            console.log(" Chat not found or update failed!");
            return;
        }

        socket.to(chatId).emit("newMessage", newMessage);
        console.log("Message sent to chat room:", chatId);
    });

   
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// ✅ Express API Routes
app.get("/", (req, res) => {
    res.send("Done!!");
});
app.use("/user", authRouter);

// ✅ Start Server
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});