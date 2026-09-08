import express from "express";
import { GetAllUser } from "../controller/user.controller.js";

const Alluser = express.Router();

Alluser.get("/alluser", GetAllUser);

export default Alluser;
