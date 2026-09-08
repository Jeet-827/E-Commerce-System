import rzp from "../config/razor.config.js";

export const MakePayment=async(req,res)=>{
    try{
            const {amount}=req.body

            const options={
                amount:amount*100,

                currency:"INR",
                receipt:`recepit_${Date.now()}`
            }
            const order=await rzp.orders.create(options)
            return res.status(201).json({
                message:"Oder Succesfully",
                order,
            })

    }   

    catch(error)
    {
            return res.status(500).json({
                 message:"Payment Fails",
                 error:error.message,
            })
    }
}

