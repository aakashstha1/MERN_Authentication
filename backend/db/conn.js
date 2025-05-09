import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to db.");
  } catch (error) {
    console.log("Failed to connect db!", error.message);
    process.exit(1);
  }
};
