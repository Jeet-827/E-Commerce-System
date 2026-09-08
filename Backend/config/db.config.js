import mongoose from "mongoose";

const DBConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, { bufferCommands: false });
    if (process.env.NODE_ENV !== "production") {
      console.log("MongoDB connected");
    }
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default DBConnect;
