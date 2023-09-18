import { IRequestType } from "./interface";
import { jwtType } from "./interface";
import { Response,NextFunction } from "express";
import  jwt  from "jsonwebtoken";
import env from "../environment/env";
import User from "../models/user";



const authFullUser = async(req: IRequestType, res: Response, next: NextFunction) => {

    try {

        const authHeader = req.headers.authorization;
        let accessToken
        if (authHeader && authHeader.startsWith('Bearer ')) {
           accessToken = authHeader.slice(7);
        }

      
       
       accessToken='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY0Y2U0YWZiODY4N2FiMjMwYTQ5NzY2ZCIsImVtYWlsVmVyaWZpZWQiOmZhbHNlLCJlbWFpbCI6InZ5c2huYXZrdjg5QGdtYWlsLmNvbSJ9LCJpYXQiOjE2OTIwMjc1MzMsImV4cCI6MTY5MjAyODc5M30.SK59DIBexrE_YOPJHlrRBPOWakPrMjuwmuWH0VCK5Eg'
      
        if (!accessToken) throw new Error("No Access Token");
        
        const decoded = jwt.verify(accessToken, env.passwordAccess!) as jwtType;

        const user = decoded.user;
        if (!user) throw new Error("No User");
        if (user.emailVerified ) throw new Error("Email Not Verified")

        const fullUser = await User.findById(user._id);

        if (!fullUser) throw new Error("No User");

        req.user = fullUser;

        next();

    } catch (e:any) {

        if (e.message !== "No Access Token" && 
        e.message !== "No User" &&
        e.message !== "Email Not Verified") console.log("\nAuthorization Full User Middleware Error:", e.message);

        return res.status(401).send("Error Authenticating")
       
    }
}

export default authFullUser;