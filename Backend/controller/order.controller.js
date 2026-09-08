import Order from "../model/order.model.js";

export const OrderCreate = async (req, res) => {
  try {
    const { userid, productid, address, phonenumber, payment } = req.body;

    const order = await Order.create({
      userid,
      productid,
      address,
      phonenumber,
      payment: payment || "unpaid",
      status: "pending",
    });

    res.status(201).json({
      message: "Order Created",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const showOrder = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("userid")
      .populate("productid")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      message: "orders",
      orders,
      data: orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.UserId || req.query.userId;
    const filter = userId ? { userid: userId } : {};

    const orders = await Order.find(filter)
      .populate("userid")
      .populate("productid")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      message: "User orders",
      orders,
      data: orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("userid")
      .populate("productid")
      .lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order Details",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: 'after' }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Status updated successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};


