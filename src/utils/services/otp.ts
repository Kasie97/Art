import {createTransport} from "nodemailer";
import Jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()


interface CustomError extends Error {
    message: string;
    code: number;
  }
  interface Mail {
    from: string;
    to: string;
    subject: string;
    text: string;
  }
  
  export const sendMail = async (mailObj: Mail) => {
    const { from, to, subject, text } = mailObj;
    try {
      let transporter = createTransport({
        host: process.env.MAIL_HOST,
        port: 2525,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      });
      let info = await transporter.sendMail({
        from,
        to,
        subject,
        text,
      });
      console.log(`Message sent: ${info.messageId}`);
    } catch (error) {
      const err = error as CustomError;
      throw new Error(
        `Something went wrong in the sendmail method.Error:${err.message}`
      );
    }
  };

  export const generateOTP =  ()=>{
   let otp =  Math.floor(1000+ Math.random()*9000);
   let expiry = new Date();

   expiry.setTime(new Date().getTime() + 90 * 60 * 1000);

   return {otp, expiry}

};

