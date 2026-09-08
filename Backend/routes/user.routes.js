import { Signup, Signin, getMe, changePassword, editUser, getAllUsers } from "../controller/user.controller.js";
import express from "express";

const router = express.Router();

router.post("/signup", Signup);
router.post("/signin", Signin);
router.get("/me", getMe);
router.post("/changepassword", changePassword);
router.put("/edituser", editUser);

router.get("/alluser", getAllUsers);
router.get("/user/alluser", getAllUsers);

export default router;
