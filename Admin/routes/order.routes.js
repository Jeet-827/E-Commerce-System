import express from "express";
import { showorder, updateOrderStatus, singleOrder } from "../controller/showorder.controller.js";

const Showorder = express.Router();

Showorder.get("/showorder", showorder);
Showorder.get("/singleorder/:id", singleOrder);
Showorder.get("/orderget/:id", singleOrder);
Showorder.put("/update-status/:id", updateOrderStatus);
Showorder.put("/updatestatus/:id", updateOrderStatus);

export default Showorder;
