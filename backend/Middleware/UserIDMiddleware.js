import jwt from "jsonwebtoken";

export const UserIDMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.json({ message: "Unauthorize" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
       console.log(decoded)
        req.userId = decoded.id || decoded.userId

        next();
    } catch (error) {
        res.json({ message: error.message});
    }
};