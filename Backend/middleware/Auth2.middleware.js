import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export const Auth2Middleware = async (req, res, next) => {
  try {
    // Check token from cookie, Authorization header, or request body
    const Token =
      req.cookies?.token ||
      (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null) ||
      req.body?.token;

    if (!Token) {
      return res.status(401).json({ message: "No token provided" });
    }

    let decode;
    try {
      decode = jwt.verify(Token, process.env.SECRET_TWO);
    } catch {
      decode = jwt.verify(Token, process.env.SECRET_ONE);
    }

    if (!decode || !decode.id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(decode.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.UserId = user._id;
    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};