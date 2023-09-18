
import {Request,Response} from "express"
import S3Service from "../../services/chunkService/s3service";
import { userInterface } from "../../models/user";



export type ChunkServiceType =  S3Service;

// export type userAccessType = {
//     _id: string,
//     emailVerified: boolean,
//     email: string,
//     s3Enabled: boolean,
// }

export interface IRequestType extends Request{
    user?:userInterface,
    encryptedToken?:string

}


//type ChunkServiceType = MongoService | FileSystemService | S3Service;