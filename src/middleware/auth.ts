import jwt from "jsonwebtoken"
import env from "../environment/env"
import { Request,Response,NextFunction } from "express";
import { userInterface } from "../models/user";

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

const auth=async(req:RequestType,res:Response,next:NextFunction)=>{
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
          return res.status(401).json({ message: 'Unauthorized' });
        }
       const decoded= jwt.verify(token, 'your-jwt-secret-key') as jwtType
            req.user=decoded?.user
            next();
    } catch (e:any) {
        if (e.message !== "No Access Token" && 
        e.message !== "No User" &&
        e.message !== "Email Not Verified") console.log("\nAuthorization Middleware Error:", e.message);
        res.status(401).send("Error Authenticating");
    }
}

export default auth