import { userInterface } from "../models/user"
import env from "../environment/env";
console.log(env.brevoEmail,'brevoemailsss');
import nodemailer from "nodemailer"
import { string } from "zod";



const sendMailVerification = async (userName: string, email: string): Promise<string> => {
  try {
    const otp = ("" + Math.random()).substring(2, 8)
    console.log( env.EMAIL,env.PASSWORD,'from sentmailverification');
    

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: env.EMAIL,
        pass: env.PASSWORD,
      },
    });

    const mailOption = {
      from: 'vyshnavkv12345@gmail.com',
      to: email,
      cc: 'vyshnavkvpanalad@gmail.com',
      subject: 'OTP Verification mail',
      text: `hello ${userName} your otp ${otp}`,
    };

    transporter.sendMail(mailOption, function (error, info) {
      if (error) {
          console.log(error);
      } else {
          console.log('email has been set' + info.response);
      }
      return otp
  })

    return otp;
  } catch (error: any) {
    console.log(error.message);
    throw error; // Rethrow the error to be handled by the calling function if needed
  }
};



export default sendMailVerification;
