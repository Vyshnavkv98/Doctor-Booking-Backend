import mongoose from "mongoose";
import env from "../environment/env";



const connectDb = async () => {
  mongoose.set("strictQuery", false);
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/myDrive1");
    console.log("connected successfully..");
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectDb;

export default connectDb
