import mongoose from "mongoose";

const ProductSchema = mongoose.Schema({
  productimage: [{ type: String }],

  title: {
    type: String,
    
  },

  price: {
    type: String,
   
  },

  category: {
    type: String,
  
  },

  description: {
    type: String,
    
  },
});

const Product = mongoose.model("products", ProductSchema);

export default Product;
