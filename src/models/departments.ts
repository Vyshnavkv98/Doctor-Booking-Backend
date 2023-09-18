import mongoose from "mongoose";
import { IDepartment } from "./interface";

const departmentSchema=new mongoose.Schema({
    departmentName:{
        type:String,
        required:true
    },
    departmentHead:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    departmentImg:{
        type:String
    }
},{timestamps:true})

export const Department=mongoose.model<IDepartment>("departments",departmentSchema)