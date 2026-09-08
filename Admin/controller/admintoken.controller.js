import Admin from "../models/admin.model.js";
import jwt from "jsonwebtoken";

export const Protected = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({
        message: "something wrong",
        success: false,
      });
    }

    const varify = jwt.verify(token, process.env.ADMINKEY);
    const admin = await Admin.findById(varify.id).select("-password");
    if (!admin) {
      return res.status(401).json({
        message: "Admin not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Login",
      success: true,
      email: admin.email,
    });
  } catch (error) {
    return res.status(501).json({
      message: error.message,
    });
  }
};
