import User from "../model/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const Signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const cheackemail = await User.findOne({ email });
    if (cheackemail) {
      return res.status(401).json({
        message: "User already exits",
      });
    }

    const Hashpassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: Hashpassword,
    });

    const Accesstoken = jwt.sign({ id: user._id }, process.env.SECRET_ONE, {
      expiresIn: "15m",
    });
    const Refreshtoken = jwt.sign({ id: user._id }, process.env.SECRET_TWO, {
      expiresIn: "7d",
    });

    res.cookie("token", Refreshtoken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User created",
      user,
      AccessToken: Accesstoken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const Signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Email does not exist",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Password does not match",
      });
    }

    const AccessToken = jwt.sign(
      { id: user._id },
      process.env.SECRET_ONE,
      {
        expiresIn: "15m",
      }
    );

    const RefreshToken = jwt.sign(
      { id: user._id },
      process.env.SECRET_TWO,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", RefreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Signin Successfully",
      user,
      AccessToken,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// Verify cookie on page reload — returns the logged-in user
export const getMe = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }
    const decode = jwt.verify(token, process.env.SECRET_TWO);
    const user = await User.findById(decode.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect old password" });
    }

    const Hashpassword = await bcrypt.hash(newPassword, 10);
    user.password = Hashpassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const editUser = async (req, res) => {
  try {
    const { userId, name, email } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    if (name) {
      user.name = name;
    }

    await user.save();

    return res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const AllUser = await User.find({}).select("-password");
    return res.status(200).json({
      message: "Users fetched successfully",
      AllUser,
    });
  } catch (error) {
    console.error("Error fetching all users:", error);
    return res.status(500).json({ message: error.message });
  }
};