import express from 'express';
import { register, addReview,delReview,showReview, allListing, listing, isOwner, AuthUsers, createListing, verifyOtp, logout, forgetPass, verifyForgetPass, resetPass, login } from '../Controller/AuthController.js';
import { AuthUser } from '../Middleware/AuthMiddleware.js';
import { UserIDMiddleware } from '../Middleware/UserIDMiddleware.js'
import { upload } from '../Config/Cloudnary.js';
import { checkOwner } from '../Middleware/UserOwner.js'
export const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/verify-otp", verifyOtp);
authRouter.get("/logout", logout);
authRouter.post("/forget-pass", forgetPass);
authRouter.post("/verify-pass", verifyForgetPass);
authRouter.post("/reset-pass", resetPass);
authRouter.post("/auth-user", AuthUser, AuthUsers);
authRouter.get("/isowner", UserIDMiddleware, checkOwner, isOwner);
authRouter.get("/all-listing", UserIDMiddleware, allListing);
authRouter.get("/listing/:id", listing);
authRouter.post("/new-listing", UserIDMiddleware, upload.single("image"), createListing);
authRouter.post("/:id/review", UserIDMiddleware, addReview); 
authRouter.get("/:id/show-review", showReview); 
authRouter.delete("/:hotelId/review/:reviewId", delReview); 
