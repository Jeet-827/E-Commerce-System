import express from "express";
import { GetAllProduct, GetAllUpdate, DeleteProduct } from "../controller/editproduct.controller.js";
import upload from "../middleware/multer.middlware.js";

const EditRouter = express.Router();

EditRouter.get("/editallproduct", GetAllProduct);
EditRouter.put("/updateproduct/:id", upload.single("file"), GetAllUpdate);
EditRouter.put("/updateproduct", upload.array("files"), GetAllUpdate);
EditRouter.delete("/deleteproduct/:id", DeleteProduct);

export default EditRouter;
