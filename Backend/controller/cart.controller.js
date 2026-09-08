import User from "../model/user.model.js";
export const CartAdd = async (req, res) => {
  try {
    const {
      itemimage,
      productid,
      producttitle,
      productprice,
      productdescription,
      quantity,
    } = req.body;

    const userId = req.UserId;
    const Cart = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          cartitem: {
            itemimage,
            productid,
            producttitle,
            productprice,
            productdescription,
            quantity: quantity || 1,
          },
        },
      },
      { returnDocument: 'after', runValidators: true },
    );

    if (!Cart) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    return res.status(201).json({
      message: "Product Added Successfully",
      Cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const CartData = async (req, res) => {
  try {
    const UserId = req.UserId
    const Data = await User.findById(UserId).lean();
    const cartList = Data?.cartitem || [];
    res.status(200).json({
      message: "All Product Found",
      cart: cartList,
      card: cartList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const CartRemove = async (req, res) => {
  try {
    const userId = req.UserId;
    const itemId = req.params.id;
    const Cart = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          cartitem: { _id: itemId },
        },
      },
      { returnDocument: 'after' }
    );
    if (!Cart) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }
    return res.status(200).json({
      message: "Product Removed Successfully",
      card: Cart.cartitem,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
