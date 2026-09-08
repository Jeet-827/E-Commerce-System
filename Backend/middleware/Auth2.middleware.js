import jwt from "jsonwebtoken"
import User from "../model/user.model.js"
export const Auth2Middleware= async(req,res,next)=>{
     try
     {
            const Token=req.cookies.token
            const decode = jwt.verify(Token,process.env.SECRET_TWO)
            if(!decode){
                return res.status(404).json({message:"the user is not valid"})
            }
            const id = decode.id
            const user = await User.findById(id)
            if (!user) {
                return res.status(404).json({message:"User not found"})
            }
            req.UserId = id
            req.user = user
          
            next()
     }

     catch(error)
     {
        res.status(401).json({message:"Unauthorized"})

     }
}