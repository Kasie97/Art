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
exports.getAllUserOrders = exports.getOneUserOrder = exports.uploadImage = exports.changePassword = exports.updateUser = exports.deleteUser = exports.getAllArtist = exports.getAllUsers = exports.resetPassword = exports.forgetPassword = exports.VerifyEmail = exports.resendOTP = exports.Register = void 0;
const UserValidation_1 = require("../utils/validation/UserValidation");
const userModel_1 = require("../model/userModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateVerificationToken_1 = __importDefault(require("../utils/services/generateVerificationToken"));
const sendVerificationEmail_1 = require("../utils/services/sendVerificationEmail");
const otp_1 = require("../utils/services/otp");
const artistModel_1 = require("../model/artistModel");
const cloudinary_1 = __importDefault(require("../lib/helper/cloudinary"));
const artworkModel_1 = __importDefault(require("../model/artworkModel"));
const orderModel_1 = require("../model/orderModel");
const jwtSecret = process.env.JWT_SECRET;
// Register a user
const Register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, role } = req.body;
        const id = (0, uuid_1.v4)();
        // Validate with joi
        const validatedInput = UserValidation_1.registerUserSchema.validate(req.body, UserValidation_1.option);
        if (validatedInput.error) {
            return res.status(400).json({ error: validatedInput.error.details[0].message });
        }
        // check if role is artist
        if (role == "Artist") {
            // check if artist
            const artist = yield artistModel_1.ArtistInstance.findOne({ where: { email: email } });
            if (artist) {
                return res.status(401).json({ error: "Email already exists" });
            }
            // Hash the password
            const passwordHashed = yield bcrypt_1.default.hash(password, yield bcrypt_1.default.genSalt());
            req.body.password = passwordHashed;
            // Generate verification token
            const verificationToken = (0, generateVerificationToken_1.default)(id);
            // Generate OTP
            const { otp, expiry } = (0, otp_1.generateOTP)();
            // save to database
            const newArtist = yield artistModel_1.ArtistInstance.create(Object.assign({ id: id, verificationToken: verificationToken, otp: otp, otp_expiry: expiry }, req.body));
            // Send the verification email
            yield (0, sendVerificationEmail_1.sendVerificationEmail)(email, otp);
            return res.status(201).json({
                message: "Registration successfully, Check your email to activate your account",
                artist: newArtist,
                token: verificationToken,
            });
        }
        // check if the user already exist
        const user = yield userModel_1.UserInstance.findOne({ where: { email: email } });
        if (user) {
            return res.status(401).json({ error: "Email already exist" });
        }
        // Hash the password
        const passwordHashed = yield bcrypt_1.default.hash(password, yield bcrypt_1.default.genSalt());
        req.body.password = passwordHashed;
        // // Generate verification token
        // const verificationToken = generateVerificationToken(id);
        // Generate OTP
        const { otp, expiry } = (0, otp_1.generateOTP)();
        // save to database
        const newUser = yield userModel_1.UserInstance.create(Object.assign({ id: id, otp: otp, otp_expiry: expiry }, req.body));
        // Send the verification email
        yield (0, sendVerificationEmail_1.sendVerificationEmail)(email, otp);
        return res.status(201).json({
            message: "Registration successfully, Check your email to activate your account",
            user: newUser,
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ error: "User registration failed" });
    }
});
exports.Register = Register;
const resendOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = (yield userModel_1.UserInstance.findOne({
            where: { email },
        }));
        console.log(user);
        const { id } = user.dataValues;
        if (!user) {
            const artist = (yield artistModel_1.ArtistInstance.findOne({
                where: { email },
            }));
            if (!artist) {
                return res.status(404).json({ error: "Email not found" });
            }
            else {
                if (artist.dataValues.active) {
                    return res.status(400).json({ error: "Artist already verified" });
                }
                const { otp, expiry } = (0, otp_1.generateOTP)();
                const newArtist = yield artistModel_1.ArtistInstance.update({
                    otp_expiry: expiry,
                    otp,
                }, {
                    where: { email },
                });
                (0, sendVerificationEmail_1.sendVerificationEmail)(email, otp);
                return res.status(201).json({
                    message: "A new OTP has been sent to your mail",
                });
            }
        }
        if (user.dataValues.active) {
            return res.status(400).json({ error: "User already verified" });
        }
        const { otp, expiry } = (0, otp_1.generateOTP)();
        const verificationToken = (0, generateVerificationToken_1.default)(id);
        const newUser = yield userModel_1.UserInstance.update({
            otp_expiry: expiry,
            otp,
            verificationToken,
        }, {
            where: { email },
        });
        (0, sendVerificationEmail_1.sendVerificationEmail)(email, otp);
        return res.status(201).json({
            message: "A new OTP has been sent to your mail",
        });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
exports.resendOTP = resendOTP;
// Email verification
const VerifyEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.body;
    console.log(code);
    try {
        const user = yield userModel_1.UserInstance.findOne({
            where: { otp: code },
        });
        if (!user) {
            const artist = yield artistModel_1.ArtistInstance.findOne({
                where: { otp: code },
            });
            if (!artist) {
                return res.status(404).json({ error: "Email not found" });
            }
            else if (artist.dataValues.active) {
                return res.status(404).json({ error: "Artist has already been verified" });
            }
            const { otp, otp_expiry } = artist.dataValues;
            if (otp == parseInt(code) && new Date(otp_expiry).getTime() >= new Date().getTime()) {
                const updated = yield artist.update({
                    active: true,
                    // otp: 0,
                    // otp_expiry: "",
                });
                return res.status(200).json({ message: "Email verified successfully" });
            }
            return res.status(200).json({ message: "OTP Expired" });
        }
        else if (user.dataValues.active) {
            return res.status(404).json({ error: "User has already been verified" });
        }
        const { otp, otp_expiry } = user.dataValues;
        if (otp == parseInt(code) && new Date(otp_expiry).getTime() >= new Date().getTime()) {
            const updated = yield user.update({
                verificationToken: "",
                active: true,
                // otp: 0,
                // otp_expiry: "",
            });
            return res.status(200).json({ message: "Email verified successfully" });
        }
        return res.status(200).json({ message: "OTP Expired" });
    }
    catch (error) {
        console.error("Verification error:", error);
        return res.status(500).json({ error: "Verification process failed" });
    }
});
exports.VerifyEmail = VerifyEmail;
const forgetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield userModel_1.UserInstance.findOne({ where: { email: email } });
        if (!user) {
            const artist = yield artistModel_1.ArtistInstance.findOne({ where: { email: email } });
            if (!artist) {
                return res.status(404).json({ error: "Email not found" });
            }
            else {
                let { id, resetPasswordToken } = artist;
                // Generate reset password token (e.g., using JWT or unique random token)
                const resetToken = (0, generateVerificationToken_1.default)(id);
                // Save the reset token to the user in the database
                yield artist.update(Object.assign(Object.assign({}, req.body), { resetPasswordToken: resetToken }));
                // Send reset password email to the user
                yield (0, sendVerificationEmail_1.sendResetPasswordEmail)(email, resetToken);
                return res.status(200).json({ message: "Reset password link sent to your email" });
            }
        }
        let { id, resetPasswordToken } = user;
        // Generate reset password token (e.g., using JWT or unique random token)
        const resetToken = (0, generateVerificationToken_1.default)(id);
        // Save the reset token to the user in the database
        yield user.update(Object.assign(Object.assign({}, req.body), { resetPasswordToken: resetToken }));
        // Send reset password email to the user
        yield (0, sendVerificationEmail_1.sendResetPasswordEmail)(email, resetToken);
        return res.status(200).json({ message: "Reset password link sent to your email" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.forgetPassword = forgetPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { token } = req.params;
    const { password } = req.body;
    try {
        // Validate with joi
        const validatedInput = UserValidation_1.resetPasswordSchema.validate(req.body, UserValidation_1.option);
        if (validatedInput.error) {
            return res.status(400).json({ error: validatedInput.error.details[0].message });
        }
        // Verify the token
        const decodedToken = jsonwebtoken_1.default.verify(token, jwtSecret);
        if (!decodedToken) {
            return res.status(401).json({
                error: "Invalid or expired token",
            });
        }
        // Extract user ID from the token
        const { userId } = decodedToken;
        // Find the user in the database based on the user ID
        const user = yield userModel_1.UserInstance.findOne({ where: { id: userId } });
        if (!user) {
            const artist = yield artistModel_1.ArtistInstance.findOne({ where: { id: userId } });
            if (!artist) {
                return res.status(404).json({ error: "Email not found" });
            }
            else {
                const passwordHashed = yield bcrypt_1.default.hash(password, yield bcrypt_1.default.genSalt());
                req.body.password = passwordHashed;
                // Set the new password and clear the reset token fields
                const updated = yield artist.update(Object.assign(Object.assign({}, req.body), { password: passwordHashed, resetPasswordToken: "" }));
                return res.status(200).json({ message: "Password reset successful", updated });
            }
        }
        // Hash the password
        const passwordHashed = yield bcrypt_1.default.hash(password, yield bcrypt_1.default.genSalt());
        req.body.password = passwordHashed;
        // Set the new password and clear the reset token fields
        const updated = yield user.update(Object.assign(Object.assign({}, req.body), { password: passwordHashed, resetPasswordToken: "" }));
        return res.status(200).json({ message: "Password reset successful", updated });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.resetPassword = resetPassword;
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allUsers = yield userModel_1.UserInstance.findAndCountAll();
    return res.status(200).json({
        message: "Users Retrieved Successfully",
        count: allUsers.count,
        data: allUsers.rows,
    });
});
exports.getAllUsers = getAllUsers;
const getAllArtist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allArtist = yield artistModel_1.ArtistInstance.findAndCountAll({
        include: [
            {
                model: artworkModel_1.default,
                as: "artworks",
            },
        ],
    });
    return res.status(200).json({
        message: "Users Retrieved Successfully",
        count: allArtist.count,
        data: allArtist.rows,
    });
});
exports.getAllArtist = getAllArtist;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield userModel_1.UserInstance.findOne({ where: { id: id } });
        if (!user) {
            return res.status(400).json({
                msg: "user does not exist",
            });
        }
        const deleteuser = yield user.destroy();
        return res.status(200).json({
            msg: "You have deleted a user",
            deleteuser,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.deleteUser = deleteUser;
// export const updateUser = async (req: Request, res: Response) => {
// 	try {
// 		const {token} = req.params
// 		const validateUser = updateProfileSchema.validate(req.body, option);
// 		if (validateUser.error) {
// 			return res.status(400).json({ Error: validateUser.error.details[0].message });
// 		}
// 		if (req.body) {
// 			;
// 		  }
// 		  const decodedToken = jwt.verify(token, jwtSecret);
// 		  if (!decodedToken) {
// 		   return res.status(401).json({
// 			 error: "Invalid or expired token",
// 		   });
// 		 }
// 		 const userId = decodedToken as unknown as { [key: string]: string };
// 		const userInfo = await UserInstance.findOne({ where: { id: userId.id }}) as any;
// 		if (!userInfo) {
// 			const artistInfo = await ArtistInstance.findOne({ where: { id: userId.id}});
// 			if (!artistInfo) {
// 				return res.status(404).json({ Error: "Profile not found" });
// 			}
// 			else{
// 				const artistUpdate = await artistInfo.update(req.body);
// 			return res.status(200).json({ msg: "Profile Updated Successfully", artistUpdate });
// 			}
// 		} 
// 		const userUpdate = await userInfo.update(req.body);
// 		return res.status(200).json({ msg: "Profile Updated Successfully", userUpdate });
// 	} catch (err) {
// 		return res.status(500).json({ error: "internal server error" });
// 	}
// };
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const token = req.headers.authorization.split(" ")[1]
        //const {id} = req.user
        const { token } = req.params;
        const validateUser = UserValidation_1.updateProfileSchema.validate(req.body, UserValidation_1.option);
        if (validateUser.error) {
            return res.status(400).json({ Error: validateUser.error.details[0].message });
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, jwtSecret);
        if (!decodedToken) {
            return res.status(401).json({
                error: "Invalid or expired token",
            });
        }
        const userId = decodedToken;
        const userInfo = yield userModel_1.UserInstance.findOne({ where: { id: userId.id } });
        if (!userInfo) {
            const artistInfo = yield artistModel_1.ArtistInstance.findOne({ where: { id: userId.id } });
            if (!artistInfo) {
                return res.status(404).json({ Error: "Profile not found" });
            }
            else {
                const artistUpdate = yield artistInfo.update(req.body);
                return res.status(200).json({ msg: "Artist updated Successfully", artistUpdate });
            }
        }
        const userUpdate = yield userInfo.update(req.body);
        return res.status(200).json({ msg: "Profile Updated Successfully", userUpdate });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.updateUser = updateUser;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const token = req.headers.authorization.split(" ")[1]
        //const {id} = req.user
        const { token } = req.params;
        const validateUser = UserValidation_1.changePasswordSchema.validate(req.body, UserValidation_1.option);
        if (validateUser.error) {
            return res.status(400).json({ Error: validateUser.error.details[0].message });
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, jwtSecret);
        if (!decodedToken) {
            return res.status(401).json({
                error: "Invalid or expired token",
            });
        }
        const userId = decodedToken;
        const userInfo = yield userModel_1.UserInstance.findOne({ where: { id: userId.id } });
        if (!userInfo) {
            const artistInfo = yield artistModel_1.ArtistInstance.findOne({ where: { id: userId.id } });
            if (!artistInfo) {
                return res.status(404).json({ Error: "Profile not found" });
            }
            else {
                const salt = yield bcrypt_1.default.genSalt(10);
                const hashed = yield bcrypt_1.default.hash(req.body.newPassword, salt);
                const artistUpdate = yield artistInfo.update({ password: hashed });
                return res.status(200).json({ msg: "Password Changed Successfully", artistUpdate });
            }
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashed = yield bcrypt_1.default.hash(req.body.newPassword, salt);
        const userUpdate = yield userModel_1.UserInstance.update({ password: hashed }, { where: { id: userId.id } });
        return res.status(200).json({ msg: "Password Changed Successfully", userUpdate });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.changePassword = changePassword;
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(500).json({ error: "no file uploaded" });
        }
        const imageUpload = yield cloudinary_1.default.uploader.upload(req.file.path);
        res.status(200).json({ imageUrl: imageUpload.secure_url });
    }
    catch (error) {
        res.status(500).json({ error: "image upload failed" });
    }
});
exports.uploadImage = uploadImage;
const getOneUserOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(id);
        const values = yield orderModel_1.OrderInstance.findAndCountAll({
            where: { artworkId: id },
            include: [
                {
                    model: userModel_1.UserInstance,
                    as: "user",
                },
                {
                    model: artworkModel_1.default,
                    as: "artwork",
                },
            ],
        });
        if (!values) {
            return res.status(404).json({ error: "No Order Found  " });
        }
        const uid = values.rows[0].dataValues.userId;
        const artId = values.rows[0].dataValues.artworkId;
        const artistId = values.rows[0].dataValues.artistId;
        const user = yield userModel_1.UserInstance.findByPk(uid);
        const art = yield artworkModel_1.default.findByPk(artId);
        const artist = yield artistModel_1.ArtistInstance.findByPk(artistId);
        const order = values;
        console.log(art);
        return res.status(200).json({
            message: "Order retrieved successfully",
            order: values.rows[0],
            user: user,
            art: art,
            artist: artist
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getOneUserOrder = getOneUserOrder;
const getAllUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const orderList = yield orderModel_1.OrderInstance.findAndCountAll({
            where: { userId: id },
            include: [
                {
                    model: userModel_1.UserInstance,
                    as: "user",
                },
                {
                    model: artworkModel_1.default,
                    as: "artwork",
                },
            ],
            order: [['createdAt', 'DESC']]
        });
        if (!orderList) {
            return res.status(404).json({ error: " No orders yet " });
        }
        return res.status(200).json({
            message: "Orders fetched successfully",
            count: orderList.count,
            list: orderList.rows
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getAllUserOrders = getAllUserOrders;
