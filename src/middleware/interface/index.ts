import  jwt  from "jsonwebtoken";
import User,{userInterface} from "../../models/user";
import {Request,Response,NextFunction} from 'express'

export interface IRequestType extends Request{
    user?:userInterface,
    token?:string,
    encryptedtoken?:string,
}
export type jwtType={
    iv: Buffer,
    user: userInterface
}

