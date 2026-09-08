import express from "express"
import {MakePayment} from "../controller/razor.controller.js"

const RazorPay=express.Router()
RazorPay.post('/payment',MakePayment)

export default RazorPay 