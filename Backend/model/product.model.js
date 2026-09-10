import mongoose from "mongoose";

const ProductSchema = mongoose.Schema({
  productimage: [{ type: String }],

  title: {
    type: String,
    required: true,
  },

  price: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },
});
ProductSchema.index({ category: 1 });
ProductSchema.index({ title: "text" });

const Product = mongoose.model("products", ProductSchema);

export default Product;
