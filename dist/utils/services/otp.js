"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = exports.sendMail = void 0;
const nodemailer_1 = require("nodemailer");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sendMail = (mailObj) => __awaiter(void 0, void 0, void 0, function* () {
    const { from, to, subject, text } = mailObj;
    try {
        let transporter = (0, nodemailer_1.createTransport)({
            host: process.env.MAIL_HOST,
            port: 2525,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });
        let info = yield transporter.sendMail({
            from,
            to,
            subject,
            text,
        });
        console.log(`Message sent: ${info.messageId}`);
    }
    catch (error) {
        const err = error;
        throw new Error(`Something went wrong in the sendmail method.Error:${err.message}`);
    }
});
exports.sendMail = sendMail;
const generateOTP = () => {
    let otp = Math.floor(1000 + Math.random() * 9000);
    let expiry = new Date();
    expiry.setTime(new Date().getTime() + 90 * 60 * 1000);
    return { otp, expiry };
};
exports.generateOTP = generateOTP;
