import jwt from "jsonwebtoken";
import env from "../environment/env";
import { Request,Response,NextFunction, response } from "express";
import { createLoginCookie } from "../cookies/cookies";
import { userInterface } from "../models/user";
import { type } from "os";
import { createLogoutCookie } from "../cookies/cookies";


interface RequestType extends Request{
    user?:userInterface,
    token?:string,  
}

type userAccessType = {
    _id: string,
    emailVerified: boolean,
    email: string,
    botChecked: boolean,
}

type jwtType={
    iv:Buffer,
    user:userInterface
}

const authLogout=async(req:RequestType,res:Response,next:NextFunction)=>{
   
    try {
        // const authHeader=req.headers.authorization
        // let accessToken
        // if (authHeader && authHeader.startsWith('Bearer ')) {
        //     // Extract the access token by removing "Bearer " from the header value
        //     accessToken = authHeader.slice(7);
        // }
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const accessToken = authHeader.slice(7);
                    
        if(!accessToken) throw new Error("Access token not found")


        const decoded=jwt.verify(accessToken,env.passwordAccess!)as jwtType
        console.log(decoded);
        

        const user=decoded.user
        console.log(user);
        
        if (!user) throw new Error("No User");
        req.user=user

        console.log(req.user,"logoutauth");
        }
        next()
        
        
        
    } catch (e:any) {
        if (e.message !== "No Access Token" && 
        e.message !== "No User") console.log("\nAuthorization Logout Middleware Error:", e.message);

        createLogoutCookie(res);
        return res.status(401).send("Error Authenticating");
        
    }
}
export default authLogout;