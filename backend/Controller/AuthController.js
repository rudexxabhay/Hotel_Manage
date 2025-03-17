import { v2 as cloudinary } from "cloudinary";
import { UserModel, UserHotelModel, BookingModel, ChatModel } from '../Model/AuthModel.js'
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
      res.json({ success: true, message: "Login success" , token})
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

      return res.json({ success: true, message: "User verified successfully",token });
   } catch (error) {
      res.json({ success: false, message: error.message })
   }
}

export const logout = async (req, res) => {
   res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
   });


   res.json({ success: true, message: "Logout success" });
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
   const id = req.userId
   res.json({ success: true, isLogin: true, id })
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
   if (!name || !location || !facility || !priceday || !capacity || !availabeldates || !contact) {
      return res.json({ success: false, message: "All fields are required" })
   }

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

export const booking = async (req, res) => {
   const { listId } = req.body;
   if (!listId) {
      return res.json({ success: false, message: "Please reload page then try again" })
   }
   try {
      const user = await UserModel.findById(req.userId);
      if (!user) {
         return res.json({ success: false, message: "User not found" })
      }

      const hotel = await UserHotelModel.findById(listId);
      if (!hotel) {
         return res.json({ success: false, message: "Hotel not found" })
      }
     

      // const existingBooking = await BookingModel.findOne({ listing: listId, user: req.userId });

      // if (existingBooking) {
      //    return res.json({ success: false, message: "You have already booked this hotel" });
      // }

      const booking = new BookingModel({
         listing: listId,
         user: req.userId
      })
      await booking.save();
      res.json({ success: true, message: "Booking request sent" })
   } catch (error) {
      res.json({ success: false, message: error.message })
   }
}

export const Showbooking = async (req, res) => {
   try {
      const booking = await BookingModel.find({ user: req.userId }).populate("listing");
      if (!booking) {
         return res.json({ success: false, message: "No booking found" })
      }
      
      res.json({ success: true, message: "Booking found", booking })
   } catch (error) {
      res.json({ success: false, message: error.message })
   }
}

export const myRequest = async (req, res) => {
   try {
      const ownerId = req.userId;
      const listing = await UserHotelModel.find({ userId: ownerId });
      const listId = listing.map((list) => list._id);
      const requests = await BookingModel.find({ listing: { $in: listId } }).populate({
         path: "listing", 
         select: "name location", 
      })
         .populate({
            path: "user", 
            select: "name email", 
         });
      
      res.json({ success: true, message: "Request found", requests })
   } catch (error) {
      res.json({ success: false, message: error.message })
   }
}


export const myListing = async (req, res) => {
   try {
      const listing = await UserHotelModel.find({ userId: req.userId });
      if (!listing) {
         return res.json({ success: false, message: "No listing found" })
      }
      res.json({ success: true, message: "Listing found", listing })
   } catch (error) {
      res.json({ success: false, message: error.message })
   }
}


export const delListing = async (req, res) => {
   const { id } = req.params
   if (!id) {
      return res.json({ success: false, message: "Please reload page then try again" })
   }
   try {
      const listing = await UserHotelModel
         .findByIdAndDelete(id);
      if (!listing) {
         return res.json({ success: false, message: "No listing found" })
      }
      res.json({ success: true, message: "Listing deleted" })
   } catch (error) {
      res.json({ success: false, message: error.message })
   }
}

export const approveReject = async (req, res) => {
   const { approve, listingID } = req.body;

   try {
      const booking = await BookingModel.findById(listingID);
      if (!booking) {
         return res.status(404).json({ success: false, message: "Booking not found" });
      }

      booking.status = approve === "accept" ? "approved" : "rejected";
      await booking.save();

      res.json({
         success: true,
         message: `Booking ${booking.status}`,
      });
   } catch (error) {
      res.json({ success: false, message: error.message });
   }
};

export const chatStart = async (req, res) => {
   try {
      const { ownerId } = req.body;
      const userId = req.userId;

      if (!ownerId) {
         return res.status(400).json({ success: false, message: "Owner ID is required" });
      }

      // पहले से मौजूद चैट खोजो
      let chat = await ChatModel.findOne({
         users: { $all: [userId, ownerId] }
      });

      if (!chat) {
         // नई चैट बनाओ अगर नहीं मिली
         chat = new ChatModel({
            users: [userId, ownerId],
            messages: []
         });
         await chat.save();
      }

      // ✅ Proper Response भेजो
      return res.json({ success: true, message: "Chat found or created", chatId: chat._id });

   } catch (error) {
      console.error("Chat Start Error:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
   }
};

export const sendChat = async (req,res)=>{

   try {
      const { chatId, message } = req.body
      const senderId = req.userId; // Logged-in User ID

      if (!chatId || !message) {
         return res.json({ error: "Chat ID and message are required" });
     }
     let chat = await ChatModel.findById(chatId);
        if (!chat) {
            return res.json({ error: "Chat not found" });
        }

        chat.message.push({
         sender: senderId,
         message: message,
         timestamp: new Date()
     });
     await chat.save();
     res.json({ success: true, message: "Message sent successfully" });

   } catch (error) {
      res.json({success: false, message: error.message})
   }
}

export const chatHistory = async (req,res)=>{
   try {
      const userId = req.user.id; // Logged-in User ID

      // 🔍 Find all chats where the user is involved
      const chats = await ChatModel.find({ users: userId })
          .populate("users", "name email") // Populate users' names & emails
          .sort({ updatedAt: -1 }); // Latest chats first

      res.json(chats);

  } catch (error) {
      console.error(error);
      res.json({ error: "Internal Server Error" });
  }
}

export const allChats = async(req,res)=>{
   try {
      const allChats = await ChatModel.find({users: req.userId}).populate("users", "name email")
   
      res.json({success:true, allChats})
   } catch (error) {
      res.json({ error: "Internal Server Error" });
   }
}

export const showChats = async (req, res) => {
   const { id } = req.params;
   try {
      const chats = await ChatModel.findById(id)
         .populate("users", "name email")  // ✅ Users के नाम और email लाने के लिए
         .populate({
            path: "message",
            populate: {
               path: "sender", // ✅ Messages के sender को भी populate करो
               select: "name email"
            }
         });

      // अगर कोई chat नहीं मिली, तो 404 error return करो
      if (!chats) {
         return res.status(404).json({ error: "Chat not found" });
      }

     

      // ✅ Proper response send करो
      res.json(chats);
   } catch (error) {
      console.error("Error fetching chat:", error);
      res.status(500).json({ error: "Internal Server Error" });
   }
};

