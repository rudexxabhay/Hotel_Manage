import express from 'express'
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    password: { type: String, required: true },
    otp: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otpExpires: { type: Date, default: () => new Date(Date.now() + 5 * 60 * 1000) }
});
const UserModel = mongoose.model("User", userSchema);

const reviewSchema = new mongoose.Schema({
   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User ID
   name: { type: String, required: true }, // User name
   rating: { type: Number, min: 1, max: 5 }, // Rating (1 to 5 stars)
   review: { type: String, }, // Review text
   createdAt: { type: Date, default: Date.now }, // Review date
})

const userHotelSchema = new mongoose.Schema({
   name: { type: String, required: true },
   location: { type: String, required: true },
   facility: { type: String, required: true },
   priceday: { type: String, required: true },
   capacity: { type: String, required: true },
   availabeldates: { type: String, required: true },
   image: { type: String, required: true },
   contact: { type: String, required: true },
   reviews: { type: [reviewSchema], default: [] },
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to User model
      required: true,
   }
});

const UserHotelModel = mongoose.model("UserHotel", userHotelSchema);

export { UserModel, UserHotelModel };
