import {UserModel} from "../Model/AuthModel.js";

export const checkOwner = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.userId);
       
        if (!user) {
            return res.json({ message: "User not found" });
        }
        if (user.role !== "owner"){
            return res.json({ message: "Please login owner id to add listing" });
        }
        next();
    } catch (error) {
       return res.json({ message:error.message });
    }
};
