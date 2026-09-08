import mongoose from "mongoose";

const AdminSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    default: "Admin",
  },

  blacklist: [
    {
      type: String,
    },
  ],
});

const Admin = mongoose.model("admin", AdminSchema);

export default Admin;
