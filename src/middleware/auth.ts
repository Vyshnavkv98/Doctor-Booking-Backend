import jwt from "jsonwebtoken"
import env from "../environment/env"
import { Request,Response,NextFunction } from "express";
import { userInterface } from "../models/user";

interface RequestType extends Request{
    user?:userInterface,
    token?:string,
    encryptedToken?:string

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
        const accessToken=req.cookies["access-token"]
        console.log(accessToken,'accesstoken from auth');
        
        if(!accessToken) throw new Error("No Access Token")
        
        const decoded = jwt.verify(accessToken, env.passwordAccess!) as jwtType;

        const {user}=jwt.verify(accessToken, env.passwordAccess!) as jwtType;

        // const user=decoded.user
        console.log(user,'auth');
        
        if (!user) throw new Error("No User");
        console.log('2');
        if (user.emailVerified ) throw new Error("Email Not Verified")
        req.user=user;
        console.log(req.user,'from auth');
        
        next()  
     

    } catch (e:any) {
        if (e.message !== "No Access Token" && 
        e.message !== "No User" &&
        e.message !== "Email Not Verified") console.log("\nAuthorization Middleware Error:", e.message);
        res.status(401).send("Error Authenticating");
    }

}

export default auth