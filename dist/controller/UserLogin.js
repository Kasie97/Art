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
exports.logoutUser = exports.googleLog = exports.loginUser = void 0;
const userModel_1 = require("../model/userModel");
const UserValidation_1 = require("../utils/validation/UserValidation");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sequelize_1 = require("sequelize");
const artistModel_1 = __importDefault(require("../model/artistModel"));
// Get the JWT string from the .env file
const jwtsecret = process.env.JWT_SECRET;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        //console.log(req.body)
        const iduuid = (0, sequelize_1.UUIDV4)();
        const valid = UserValidation_1.loginSchema.validate(req.body, UserValidation_1.option);
        if (valid.error) {
            res.status(400).json({ error: valid.error.details[0].message });
        }
        const user = (yield userModel_1.UserInstance.findOne({
            where: { email: email },
        }));
        //console.log(existingUser)
        if (!user) {
            const artist = (yield artistModel_1.default.findOne({
                where: { email: email },
            }));
            if (!artist) {
                return res.status(400).json({
                    error: "Invalid email/password",
                });
            }
            else {
                const validPassword = yield bcryptjs_1.default.compare(password, artist.password);
                if (!validPassword) {
                    res.status(404).json({ error: "Invalid email/password" });
                }
                if (artist.active) {
                    const { id } = artist;
                    const token = jsonwebtoken_1.default.sign({ id }, jwtsecret, { expiresIn: "2d" });
                    console.log(token);
                    res.cookie("token", token, {
                        httpOnly: true,
                        maxAge: 2 * 24 * 60 * 1000,
                    });
                    console.log("success");
                    return res.status(200).json({
                        message: `Artist login successful`,
                        role: "Artist",
                        token,
                        user: artist,
                    });
                }
                else {
                    return res.status(401).json({
                        error: "Please verify your email",
                    });
                }
            }
        }
        const validPassword = yield bcryptjs_1.default.compare(password, user.password);
        if (!validPassword) {
            return res.status(404).json({ error: "Invalid email/password" });
        }
        console.log(user.active);
        if (user.active) {
            const { id } = user;
            const token = jsonwebtoken_1.default.sign({ id }, jwtsecret, { expiresIn: "2d" });
            // res.cookie("token", token, {
            // 	httpOnly: true,
            // 	maxAge: 2 * 24 * 60 * 1000,
            // });
            console.log("success");
            return res.status(200).json({
                message: `${user.role} login successful`,
                token,
                user,
                role: "User"
            });
        }
        else {
            return res.status(401).json({
                error: "Please verify your email",
            });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.loginUser = loginUser;
const googleLog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    const id = user.id;
    let name = (user === null || user === void 0 ? void 0 : user.displayName) || user.firstname;
    const token = jsonwebtoken_1.default.sign({ id }, jwtsecret, { expiresIn: "2d" });
    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 2 * 24 * 60 * 1000,
    });
    console.log("success");
    // res.send(`Welcome ${name}`)
    return res.status(200).json({
        message: `${user.role} login successful`,
        token,
        user,
    });
    next();
});
exports.googleLog = googleLog;
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("token");
    return;
});
exports.logoutUser = logoutUser;
