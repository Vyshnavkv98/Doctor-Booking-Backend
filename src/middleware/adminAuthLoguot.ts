import jwt from "jsonwebtoken";
import env from "../environment/env";
import { Request,Response,NextFunction, response } from "express";
import { userInterface } from "../models/user";
import { createLogoutCookie } from "../cookies/cookies";


interface RequestType extends Request{
    admin?:userInterface,
    token?:string,  
}


type jwtType={
    iv:Buffer,
    admin:userInterface
}

const adminAuthLogout=async(req:RequestType,res:Response,next:NextFunction)=>{
   
    try {
        const accessToken=req.cookies["access-token"]
                    
        if(!accessToken) throw new Error("Access token not found")

        const decoded=jwt.verify(accessToken,env.passwordAccess!)as jwtType

        const user=decoded.admin
        if (!user) throw new Error("No User");
        req.admin=user
        next()
        console.log(req.admin,"logoutauth");
        
        
    } catch (e:any) {
        if (e.message !== "No Access Token" && 
        e.message !== "No admin") console.log("\nAuthorization Logout Middleware Error:", e.message);

        createLogoutCookie(res);
        return res.status(401).send("Error Authenticating");
        
    }
}
export default adminAuthLogout;