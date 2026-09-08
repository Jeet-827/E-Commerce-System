import express from "express";
import { Search, showorder } from "../controller/search.controller.js";

const SearchRoute = express.Router();
SearchRoute.get("/search", Search);
SearchRoute.post("/showorder", showorder);

export default SearchRoute;
