import mongoose from "mongoose";

const OrderSchema = mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },

    productid: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "products",
        required: true,
      },
    ],

    address: [
      {
        houseNo: {
          type: String,
          required: true,
        },
        street: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
        country: {
          type: String,
          required: true,
        },
        pincode: {
          type: String,
          required: true,
          minlength: 6,
          maxlength: 6,
        },
      },
    ],

    phonenumber: {
      type: Number,
      required: true,
      minlength: 10,
      maxlength: 10,
    },

    status: {
      type: String,
      default: "pending",
    },

    payment: {
      type: String,
      default: "unpaid",
    },
  },
  { timestamps: true },
);

const Order = mongoose.model("oder", OrderSchema);

export default Order;
