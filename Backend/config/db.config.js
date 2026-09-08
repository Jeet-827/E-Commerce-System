import mongoose from "mongoose";

const DBConnect = async () => {
  try {
    const options = {
      maxPoolSize: 50,       // Maintain up to 50 socket connections
      minPoolSize: 10,       // Keep minimum 10 socket connections open
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,             // Use IPv4, skip IPv6 resolution
    };

    await mongoose.connect(process.env.MONGO_URL, options);
    console.log("✅ MongoDB Connected with optimized connection pool");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
  }
};

export default DBConnect;
