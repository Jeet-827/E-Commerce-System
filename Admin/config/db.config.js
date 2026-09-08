import mongoose from "mongoose";
const DBConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Mongodb Connected");
  } catch (error) {
    console.log(error);
  }
};

export default DBConnect;