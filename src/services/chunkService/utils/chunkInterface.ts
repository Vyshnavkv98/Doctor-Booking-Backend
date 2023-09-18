import { userInterface } from "../../../models/user";
import { fileInterface } from "../../../models/files,";
import { Request,Response } from "express";

interface chunkInterface{
    uploadFile:(user:userInterface,busboy:any,req:Request)=>Promise<fileInterface>
    //  getThumbnail:(user:userInterface,id:string)=>Promise<Buffer>
    //  getFullThumbnail:(user:userInterface,fileId:string,res:Response)=>void
    //  getPublicDownload: (fileID: string, tempToken: any, res: Response) => void;
    //  streamVideo: (user: userInterface, fileID: string, headers: any, res: Response, req: Request) => void;
    //  getFileReadStream: (user: userInterface, fileID: string) => any
    //  downloadFile:(user:userInterface,fileId:string,res:Response)=>void
}

export default chunkInterface;