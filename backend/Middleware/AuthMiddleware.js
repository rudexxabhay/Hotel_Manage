import jwt from "jsonwebtoken";

export const AuthUser = (req, res, next) => {
  try {
    const token = req.cookies.token; 
    if (!token) {
      return res.json({ success: false, message: "You'r are already logout" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next(); 
  } catch (error) {
    return res.json({ success: false, message: "Something wrong." });
  }
};
