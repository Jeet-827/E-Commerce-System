import rzp from "../config/razor.config.js";

export const MakePayment = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await rzp.orders.create(options);
    return res.status(201).json({ message: "Order created", order });
  } catch (error) {
    console.error("MakePayment:", error.message);
    return res.status(500).json({ message: "Payment failed", error: error.message });
  }
};
