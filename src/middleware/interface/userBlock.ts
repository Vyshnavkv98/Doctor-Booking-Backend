import jwt from "jsonwebtoken"
import env from "../environment/env"
import { Request,Response,NextFunction } from "express";
import { userInterface } from "../models/user";
import UserRepository from "../repositories/userRepository";

const userRepository = new UserRepository()

interface RequestType extends Request{
    user?:userInterface,
    token?:string,
    encryptedToken?:string,
    userId?:string

}

type jwtType ={
    iv?:Buffer,
    user?:userInterface
}

type userAccessType = {
    _id: string,
    emailVerified: boolean,
    email: string,
    admin: boolean,
    botChecked: boolean,
    username: string,
}

const userBlock=async(req:RequestType,res:Response,next:NextFunction)=>{
    try {
       
       const decoded= jwt.verify(token, 'your-jwt-secret-key') as jwtType
            req.user=decoded?.user
            const id=decoded?.user?._id as string
            const isBlocked=await userRepository.isBlocked(id)
    console.log(isBlocked,'isblocked');

    if(isBlocked){
        res.status(403).send({message:' Something wrong please contact to admin'});
    }
    

            next();
    } catch (e:any) {
        if (e.message !== "No Access Token" && 
        e.message !== "No User" &&
        e.message !== "Email Not Verified") console.log("\nAuthorization Middleware Error:", e.message);
        res.status(401).send("Error Authenticating");
    }
}

export default userBlock