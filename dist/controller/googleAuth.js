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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth2_1 = __importDefault(require("passport-google-oauth2"));
const userModel_1 = require("../model/userModel");
const uuid_1 = require("uuid");
const strategy = passport_google_oauth2_1.default.Strategy;
passport_1.default.use(new strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/google/callback",
    passReqToCallback: true,
}, (request, accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Helloouuuu");
        const user = yield userModel_1.UserInstance.findOne({
            where: { email: profile.email },
        });
        console.log("User::", user);
        if (user) {
            if ((user === null || user === void 0 ? void 0 : user.dataValues.googleId) == profile.id) {
                done(null, user);
                return;
            }
            else if ((user === null || user === void 0 ? void 0 : user.dataValues.googleId) != profile.id) {
                done(null, "The email already exists, login with your password");
                return;
            }
        }
        const id = (0, uuid_1.v4)();
        const savedUser = new userModel_1.UserInstance({
            id,
            email: profile.email,
            firstname: profile.given_name,
            surname: profile.family_name,
            googleId: profile.id,
            role: userModel_1.Role.User,
            phone: "",
            active: profile.verified,
            password: "",
            verificationToken: "",
            resetPasswordToken: "",
            profilePic: profile.picture,
            otp: 0,
            address: "",
            state: "",
            zipcode: 0
        });
        yield savedUser.save();
        console.log(profile);
        done(null, savedUser);
        return;
    }
    catch (error) {
        console.log(error);
        throw new Error(`${error}`);
    }
})));
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
