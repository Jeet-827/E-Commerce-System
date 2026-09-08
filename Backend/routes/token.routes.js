import Model from "../controller/token.controller.js";
import express from "express";
import {GetUserauth} from "../controller/regen.controller.js"
import {Auth2Middleware} from "../middleware/Auth2.middleware.js"

const TokenModel = express.Router();

TokenModel.post("/token", Model);
TokenModel.post("/regen",Auth2Middleware, GetUserauth);
export default TokenModel;
