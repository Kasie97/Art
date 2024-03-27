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
exports.sendResetPasswordEmail = exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// email setting
const MAIL_SETTINGS = {
    service: "gmail",
    auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD,
    },
};
function sendVerificationEmail(email, otp) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create a Nodemailer transporter
        const transporter = nodemailer_1.default.createTransport(MAIL_SETTINGS);
        // Construct the email
        const mailOptions = {
            from: MAIL_SETTINGS.auth.user,
            to: email,
            subject: "Email Verification",
            html: `
		<!DOCTYPE html>
			<html>
				<head>
					<title>Email Verification</title>
					<style>
						body {
							font-family: "Arial", sans-serif;
							margin: 0;
							padding: 0;
							background-color: #f4f4f4;
						}
						.container {
							max-width: 600px;
							margin: 20px auto;
							background-color: #fff;
							border-radius: 5px;
							box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
							padding: 40px;
						}
						h1 {
							color: #333;
							margin-bottom: 30px;
						}
						p {
							color: #666;
							font-size: 16px;
							line-height: 1.6;
						}
						.btn {
							display: inline-block;
							text-decoration: none;
							padding: 12px 24px;
							margin: 20px 0;
							background-color: #007bff;
							color: #fff;
							border-radius: 3px;
							transition: background-color 0.3s;
						}
						.btn:hover {
							background-color: #0056b3;
						}
					</style>
				</head>
				<body>
					<div class="container">
						<h1>Congratulations!! You are in</h1>
						<p>Please verify your email address with this OTP: ${otp}</p>
						
					</div>
				</body>
			</html>
		`,
        };
        // Send the email
        try {
            const info = yield transporter.sendMail(mailOptions);
            console.log("Email sent: ", info.response);
        }
        catch (error) {
            console.error("Error sending email: ", error);
        }
    });
}
exports.sendVerificationEmail = sendVerificationEmail;
const sendResetPasswordEmail = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport(MAIL_SETTINGS);
    // Construct the email
    const mailOptions = {
        from: MAIL_SETTINGS.auth.user,
        to: email,
        subject: "Reset Password",
        html: `
		<!DOCTYPE html>
			<html>
				<head>
					<title>Password Reset</title>
					<style>
						body {
							font-family: "Arial", sans-serif;
							margin: 0;
							padding: 0;
							background-color: #f4f4f4;
						}
						.container {
							max-width: 600px;
							margin: 20px auto;
							background-color: #fff;
							border-radius: 5px;
							box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
							padding: 40px;
						}
			
						p {
							color: #666;
							font-size: 16px;
							line-height: 1.6;
						}
						.btn {
							display: inline-block;
							text-decoration: none;
							padding: 12px 24px;
							margin: 20px 0;
							background-color: #007bff;
							color: #fff;
							border-radius: 3px;
							transition: background-color 0.3s;
						}
						.btn:hover {
							background-color: #0056b3;
						}
					</style>
				</head>
				<body>
					<div class="container">
						<p>Rest your password by clicking the button below:</p>
						<a class="btn" href="http://localhost:5173/reset-password/${token}">Reset password</a>
					</div>
				</body>
			</html>
		`,
    };
    // Send the email
    try {
        const info = yield transporter.sendMail(mailOptions);
        console.log("Email sent: ", info.response);
    }
    catch (error) {
        console.error("Error sending email: ", error);
    }
});
exports.sendResetPasswordEmail = sendResetPasswordEmail;
