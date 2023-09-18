import mongoose,{Document} from "mongoose";
import { boolean, string } from "zod";

const folderScema=new mongoose.Schema({
    name:{
        type:string,
        required:true
    },
    parent:{
        type:string,
        required:true
    },
    owner:{
        type:string,
        required:true
    },
    parentList:{
        type:Array,
        required:true
    },
},{timestamps:true})

export interface FolderInterface extends Document{
    name:string,
    parent:string,
    owner:string,
    createdAt:Date,
    updatedAt:Date,
    parentList:string[],
    _doc?:any,
}

const Folder =mongoose.model<FolderInterface>("folder",folderScema)
export default Folder