import {Response} from "express"
const maxAgeAccess =  60 * 1000 * 20;
const maxAgeRefresh = 60 * 1000 * 60 * 24 * 30;
import { date } from "zod";
import { serialize } from "v8";

export const createLoginCookie = (res: Response, accessToken: string, refreshToken: string) => {

    res.cookie("access-token",accessToken, {
        httpOnly: true,
         secure: true,
         sameSite: "strict",
         maxAge: maxAgeAccess,
    })
  
    res.cookie("refresh-token",refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: maxAgeRefresh,
    })
  
  
}


export const createLogoutCookie = (res: Response) => {

    function cookieOptionsString(options:any) {
        return Object.entries(options)
          .map(([key, value]) => `${key}=${value}`)
          .join('; ');
      }

    res.cookie("access-token", {}, {
        httpOnly: true,
        maxAge: 0,
        sameSite: "strict",
        // secure: true
    })

    res.cookie("refresh-token", {}, {
        httpOnly: true,
        maxAge: 0,
        sameSite: "strict",
        // secure: true
    })


}

