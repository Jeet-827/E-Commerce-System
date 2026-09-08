import jwt from 'jsonwebtoken'
import User from "../model/user.model.js";

export const GetUserauth = async (req,res)=>{
    try {
        const userId = req.UserId;
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({message:"user not find"})
        }
        const id = user._id
        const token = jwt.sign({id},process.env.SECRET_ONE,{expiresIn:"15m"})
        return res.status(200).json({token,user})

    } catch (error) {
        return res.status(404).json({message:error.message})
    }
}