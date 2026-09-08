import Product from "../model/product.model.js";
import Order from "../model/order.model.js";

export const Serach = async (req,res)=>{
    try {
        const {q} = req.query
        const products = await Product.find({
          $or: [
            { title: { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } },
            { category: { $regex: q, $options: "i" } }
          ]
        }).lean();

        if(!products){
            return res.status(401).json({message:"not found"})
        }

        return res.status(201).json({message:"products",products})
    } catch (error) {
        return res.status(501).json({message:error.message})
    }
}

export const showorder = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await Order.find({ userid: userId })
          .populate("userid")
          .populate("productid")
          .lean();

        return res.status(200).json({ message: "orders", orders });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}