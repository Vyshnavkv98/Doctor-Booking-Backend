import mongoose from "mongoose";
import env from "../environment/env";



const connectDb = async () => {
  mongoose.set("strictQuery", false);
  
  try {
    console.log(env.MONGOURL)
    await mongoose.connect(`${env.MONGOURL}`);
    console.log("connected successfully..");
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectDb;

export default connectDb
