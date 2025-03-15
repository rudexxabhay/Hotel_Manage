import express from 'express';
import {
    register, addReview, delReview,
    showReview, allListing, listing, isOwner,
    AuthUsers, createListing, verifyOtp, logout, forgetPass, 
    verifyForgetPass, resetPass, login, booking,Showbooking,
    myListing, delListing,myRequest, approveReject,
     chatStart,sendChat, chatHistory,allChats, showChats
} from '../Controller/AuthController.js';
import { AuthUser } from '../Middleware/AuthMiddleware.js';
import { UserIDMiddleware } from '../Middleware/UserIDMiddleware.js'
import { upload } from '../Config/Cloudnary.js';
import { checkOwner } from '../Middleware/UserOwner.js'
export const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/logout", logout);
authRouter.post("/forget-pass", forgetPass);
authRouter.post("/verify-pass", verifyForgetPass);
authRouter.post("/reset-pass", resetPass);
authRouter.post("/auth-user", UserIDMiddleware, AuthUsers);
authRouter.get("/isowner", UserIDMiddleware, checkOwner, isOwner);
authRouter.get("/all-listing", UserIDMiddleware, allListing);
authRouter.get("/listing/:id", listing);
authRouter.post("/new-listing", UserIDMiddleware, upload.single("image"), createListing);
authRouter.post("/:id/review", UserIDMiddleware, addReview);
authRouter.get("/:id/show-review", showReview);
authRouter.delete("/:hotelId/review/:reviewId", delReview); 
authRouter.post("/booking", UserIDMiddleware, booking);
authRouter.post("/show-booking", UserIDMiddleware, Showbooking);
authRouter.get("/my-listing", UserIDMiddleware, myListing);
authRouter.delete("/del-listing/:id", UserIDMiddleware, delListing);
authRouter.patch("/update-listing", UserIDMiddleware, myListing);
authRouter.get("/request", UserIDMiddleware, myRequest);
authRouter.post("/approve", UserIDMiddleware, approveReject);
authRouter.post("/start",UserIDMiddleware, chatStart);
authRouter.post("/all-chats",UserIDMiddleware, allChats);
authRouter.post("/show-chats/:id", showChats);
authRouter.post("/send",UserIDMiddleware, sendChat);
authRouter.post("/history", UserIDMiddleware, chatHistory);