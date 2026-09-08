import jwt from "jsonwebtoken"

export const AuthMiddleware=(req,res,next)=>{
     try
     {
            const authHeader = req.headers.authorization
            if (!authHeader) {
                return res.status(401).json({message:"Authorization header missing"})
            }
            const Token2 = authHeader.split(" ")[1]
            const decode = jwt.verify(Token2,process.env.SECRET_ONE)
            if(!decode){
                return res.status(401).json({message:"the user is not valid"})
            }
            const id = decode.id
            req.UserId = id
            next()
     }

     catch(error)
     {
        res.status(500).json({message:"something wrong"})

     }
}