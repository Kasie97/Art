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
exports.userAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("../model/userModel");
const jwtsecret = process.env.JWT_SECRET;
function userAuth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // const authorization = req.headers.authorization
        // if (!authorization){
        //     return res.render('Login',{error: 'Kindly login or sign up'})
        // }
        // const token = authorization.slice(7, authorization.length);
        const { token } = req.cookies;
        if (!token) {
            return res.redirect('/login');
        }
        let verified = jsonwebtoken_1.default.verify(token, jwtsecret);
        if (!verified) {
            return res.status(401).json({ error: 'Invalid token. You cannot access this route' });
        }
        const { id } = verified;
        //Check if the user exist
        const user = yield userModel_1.UserInstance.findOne({ where: { id } });
        if (!user) {
            return res.status(401).json({ error: 'Kindly sign-up as a user' });
        }
        console.log(req.user);
        req.user = verified;
        next();
    });
}
exports.userAuth = userAuth;
