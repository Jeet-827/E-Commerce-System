import jwt from "jsonwebtoken";

export const Auth2Middleware = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
     
      return res.status(200).json({ user: null, token: null });
    }

    const decoded = jwt.verify(token, process.env.SECRET_TWO);
    req.UserId = decoded.id;
    next();
  } catch {
    return res.status(200).json({ user: null, token: null });
  }
};