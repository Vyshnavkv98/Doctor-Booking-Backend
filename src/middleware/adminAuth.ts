import jwt from "jsonwebtoken"
import env from "../environment/env"
import { Request,Response,NextFunction } from "express";
import { userInterface } from "../models/user";

interface RequestType extends Request{
    admin?:userInterface,
    token?:string,
    encryptedToken?:string

}

type jwtType ={
    iv?:Buffer,
    admin?:userInterface
}
const authAdmin=async(req:RequestType,res:Response,next:NextFunction)=>{
try {
    const accessToken=req.cookies["access-token"]
    console.log(accessToken,'accesstoken from auth');
    
    if(!accessToken) throw new Error("No Access Token")
    
    const decoded = jwt.verify(accessToken, env.passwordAccess!) as jwtType;

    const {admin}=jwt.verify(accessToken, env.passwordAccess!) as jwtType;

    // const user=decoded.user

    
    if (!admin) throw new Error("No User");
    req.admin=admin;
    
    next()  
 

} catch (e:any) {
    if (e.message !== "No Access Token" && 
    e.message !== "No admin" &&
    e.message !== "Email Not Verified") console.log("\nAuthorization Middleware Error:", e.message);
    res.status(401).send("Error Authenticating");
}

}

export default authAdmin