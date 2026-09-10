import Product from "../model/product.model.js";
import Order from "../model/order.model.js";

export const Search = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const products = await Product.find({
      $or: [
        { title: { $regex: q.trim(), $options: "i" } },
        { description: { $regex: q.trim(), $options: "i" } },
        { category: { $regex: q.trim(), $options: "i" } },
      ],
    })
      .limit(20)
      .lean();

    return res.status(200).json({ message: "Products found", products });
  } catch (error) {
    console.error("Search:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const showorder = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await Order.find({ userid: userId })
      .populate("userid")
      .populate("productid")
      .lean();

    return res.status(200).json({ message: "Orders fetched", orders });
  } catch (error) {
    console.error("showorder:", error.message);
    return res.status(500).json({ message: error.message });
  }
};