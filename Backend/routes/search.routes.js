import express from "express"
import {Serach, showorder} from "../controller/search.controller.js"


const SearchRoute=express.Router()
SearchRoute.get("/search",Serach)
SearchRoute.post("/showorder",showorder)

export default SearchRoute;
