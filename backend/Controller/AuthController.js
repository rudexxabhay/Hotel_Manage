import { v2 as cloudinary } from "cloudinary";
import { UserModel, UserHotelModel } from '../Model/AuthModel.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sendOtp from '../Config/Nodemailer.js'
import fs from 'fs'

export const register = async (req, res) => {
   const { name, email, password, role } = req.body;
   if (!name || !email || !password || !role) {
      return res.json({ success: false, message: "Please enter all fields" })
   }
   try {
      const user = await UserModel.findOne({ email });
      if (user) {
         if (!user.isVerified) {
            await UserModel.deleteOne({ email });
         } else {
            return res.json({ success: false, message: "User already exists" })
         }
      }
      const hashPass = await bcrypt.hash(password, 10);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpire = new Date(Date.now() + 5 * 60 * 1000);
      const newUser = new UserModel({
         name,
         email,
         password: hashPass,
         role,
         otp,
         otpExpire
      })
      await newUser.save();
      await sendOtp(email, otp, name)
      return res.json({ success: true, message: `OTP sent to ${email}` })
   } catch (error) {
      res.json({ success: false, message: error.message });
   }
}
export const login = async (req, res) => {
   const { email, password } = req.body;
   if (!email || !password) {
      return res.json({ success: false, message: "Please enter all fields" })
   }
   try {
      const user = await UserModel.findOne({ email });
      if (!user) {
         return res.json({ success: false, message: "User not found" })
      }
      if (user) {
         if (!user.isVerified) {
            await UserModel.deleteOne({ email });
            return res.json({ success: false, message: "User not found" })
         }
      }
      const comparePass = await bcrypt.compare(password, user.password);

      if (!comparePass) {
         return res.json({ success: false, message: "Wrong password" })
      }

      const token = jwt.sign(
   { userId: user._id, email: user.email },
   process.env.JWT_SECRET,
   { expiresIn: "7d" }
);

res.cookie("token", token, {
   httpOnly: true, // Security: Prevent JS Access
   secure: true, // Ensure it's always secure (Required for `sameSite: "none"`)
   sameSite: "none", // Required for cross-origin cookies
   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
});
      res.json({ success: true, message: "Login success" })
   } catch (error) {
      res.json({ success: false, message: error.message });
   }
}

export const verifyOtp = async (req, res) => {
   const { email, otp } = req.body;
   if (!email || !otp) {
      return res.json({ success: false, message: "Please enter OTP" })
   }
   try {
      const user = await UserModel.findOne({ email });

      if (!user) {
         return res.json({ success: false, message: "User not found" });
      }

      if (user.isVerified) {
         return res.json({ success: false, message: "User already verified, please login" });
      }

      // Check OTP
      if (user.otp !== otp) {
         return res.json({ success: false, message: "Wrong OTP" });
      }

      // Check if OTP has expired
      if (!user.otpExpires || new Date(user.otpExpires).getTime() < Date.now()) {
         return res.json({ success: false, message: "OTP Expired" });
      }

      // Update user as verified and clear OTP
      await user.updateOne({
         isVerified: true,
         otp: null,
         otpExpires: null
      });

      //Creating token

      const token = jwt.sign(
   { userId: user._id, email: user.email },
   process.env.JWT_SECRET,
   { expiresIn: "7d" }
);

res.cookie("token", token, {
   httpOnly: true, // Security: Prevent JS Access
   secure: true, // Ensure it's always secure (Required for `sameSite: "none"`)
   sameSite: "none", // Required for cross-origin cookies
   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
});

      return res.json({ success: true, message: "User verified successfully" });
   } catch (error) {
      res.json({ success: false, message: error.message })
   }
}

export const logout = async (req, res) => {
   res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS in production
      sameSite: "None", // Required for cross-site cookies
      path: "/", // Must match the path where cookie was set
      domain: "hotel-management-iva4.onrender.com", // Ensure correct domain
   });
   res.json({ success: true, message: "Logged out successfully" });
};



export const forgetPass = async (req, res) => {
   const { email } = req.body;
   if (!email) {
      return res.json({ success: false, message: "Please enter fields" })
   }
   try {
      const user = await UserModel.findOne({ email });
      if (!user) {
         return res.json({ success: false, message: "Please register first" })
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpire = new Date(Date.now() + 5 * 60 * 1000);
      user.otp = otp;
      user.otpExpires = otpExpire;

      await user.save();
      await sendOtp(email, otp)
      res.json({ success: true, message: "OTP sent to your mail" })
   } catch (error) {
      res.json({ success: false, message: error.message })
   }
}

export const verifyForgetPass = async (req, res) => {
   const { email, otp } = req.body;
   console.log("verify-pass", email, otp)
   if (!email || !otp) {
      return res.json({ success: false, message: "Please enter fields" })
   }
   try {
      const user = await UserModel.findOne({ email });
      if (!user) {
         return res.json({ success: false, message: "User not found" })
      }

      // Check OTP
      if (user.otp !== otp) {
         return res.json({ success: false, message: "Wrong OTP" });
      }


      if (!user.otpExpires || new Date(user.otpExpires).getTime() < Date.now()) {
         return res.json({ success: false, message: "OTP Expired" });
      }

      await user.updateOne({
         otp: null,
         otpExpires: null
      });

      const resetToken = jwt.sign(
         { email: user.email },
         process.env.JWT_SECRET,
         { expiresIn: "10m" });

      res.json({ success: true, message: "OTP verified successfully", resetToken });

   } catch (error) {
      res.json({ success: false, message: error.message })
   }
}

export const resetPass = async (req, res) => {
   const { resetToken, newPass } = req.body;
   console.log("TOKEN-", resetToken, newPass)
   if (!resetToken || !newPass) {
      return res.json({ success: false, message: "Please fill all fields" });
   }

   try {
      const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

      if (!user) {
         return res.json({ success: false, message: "User not found" });
      }

      const newPassword = await bcrypt.hash(newPass, 10);
      const updatedUser = await UserModel.findOneAndUpdate(
         { email: decoded.email }, // Find user by email
         { password: newPassword }, // Update password
         { new: true } // Return updated document
      );
      res.json({ success: true, message: "Password reset successfully. You can now login!" });

   } catch (error) {
      res.json({ success: false, message: "Invalid or expired token" });
   }
};

export const AuthUsers = async (req, res) => {
   res.json({ success: true, isLogin: true })
}

export const isOwner = async (req, res) => {
   res.json({ success: true, message: "Verification Success" })
}

export const createListing = async (req, res) => {
   const { name,
      location,
      facility,
      priceday,
      capacity,
      availabeldates,
      contact } = req.body;
   // if (!name || !location || !facility || !priceday || !capacity || !availabeldates || !contact) {
   //    return res.json({ success: false, message: "All fields areee required" })
   // }

   try {
      if (!req.file) return res.json({ error: "No file uploaded" });
      const result = await cloudinary.uploader.upload(req.file.path, {
         folder: "uploads",
      }); // Upload to Cloudinary
      try {
         fs.unlinkSync(req.file.path);
      } catch (err) {
         console.error("File deletion error:", err);
      }
      const imageUrl = result.secure_url

      const item = new UserHotelModel({
         userId: req.userId,
         name,
         location,
         facility,
         priceday,
         capacity,
         availabeldates,
         contact,
         image: imageUrl
      })
      await item.save();

      res.json({ success: true, message: "Upload success", item })

   } catch (error) {
      console.error(error);
      res.json({ error: error.message });
   }
}

export const allListing = async (req, res) => {
   try {
      const allListing = await UserHotelModel.find({})
      if (allListing) {
         res.json({ success: true, message: "All Listing", allListing })
      }


   } catch (error) {
      console.error(error);
      res.json({ error: error.message });
   }
}

export const listing = async (req, res) => {
   try {
      const list = await UserHotelModel.findById(req.params.id)
      if (!list) {
         return res.json({ success: false, message: "Not found" })
      }
      res.json({ success: true, message: "Fetched", list })
   } catch (error) {
      console.error(error);
      res.json({ error: error.message });
   }
}

export const addReview = async (req, res) => {
   const { rating, comment } = req.body;
   const { id } = req.params;
   // Check if fields are missing
   if (!rating || !comment) {
      return res.status(400).json({ success: false, message: "Fields required" });
   }
   try {
      const user = await UserModel.findById(req.userId);
      if (!user) {
         return res.status(404).json({ success: false, message: "User not found" });
      }
      const item = await UserHotelModel.findById(id);
      if (!item) {
         return res.status(404).json({ success: false, message: "Hotel not found" });
      }
      let newItem = {
         user: req.userId,
         name: user.name,
         rating: rating,
         review: comment
      };
      item.reviews.push(newItem);
      await item.save();
      res.json({ success: true, message: "Review added successfully!" });

   } catch (error) {
      res.json({ success: false, message: error.message })
   }
}

export const showReview = async (req, res) => {
   const { id } = req.params;
   try {
      const review = await UserHotelModel.findById(id);
      res.json({ success: true, message: "updated", review })
   } catch (error) {
      res.json({ success: false, message: error.message })
   }
}
export const delReview = async (req, res) => {
   const { hotelId, reviewId } = req.params;

   try {
      const hotel = await UserHotelModel.findById(hotelId);
      if (!hotel) {
         return res.status(404).json({ success: false, message: "Hotel not found" });
      }
      const reviewExists = hotel.reviews.some((review) => review._id.toString() === reviewId);
      if (!reviewExists) {
         return res.status(404).json({ success: false, message: "Review not found" });
      }

      await UserHotelModel.findByIdAndUpdate(
         hotelId,
         { $pull: { reviews: { _id: reviewId } } },
         { new: true }
      );

      res.json({ success: true, message: "Review deleted successfully" });

   } catch (error) {
      res.status(500).json({ success: false, message: error.message });
   }
 };
 
