import User from "../model/user.model.js";

export const CartAdd = async (req, res) => {
  try {
    const { itemimage, productid, producttitle, productprice, productdescription, quantity } = req.body;
    const userId = req.UserId;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          cartitem: { itemimage, productid, producttitle, productprice, productdescription, quantity: quantity || 1 },
        },
      },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(201).json({ message: "Product added to cart", cart: user.cartitem });
  } catch (error) {
    console.error("CartAdd:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const CartData = async (req, res) => {
  try {
    const data = await User.findById(req.UserId).select("cartitem").lean();
    const cart = data?.cartitem || [];
    res.status(200).json({ message: "Cart fetched", cart });
  } catch (error) {
    console.error("CartData:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const CartRemove = async (req, res) => {
  try {
    const userId = req.UserId;
    const itemId = req.params.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { cartitem: { _id: itemId } } },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "Product removed from cart", cart: user.cartitem });
  } catch (error) {
    console.error("CartRemove:", error.message);
    res.status(500).json({ message: error.message });
  }
};
