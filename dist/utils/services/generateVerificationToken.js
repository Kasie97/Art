"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSecret = process.env.JWT_SECRET;
const generateVerificationToken = (userId) => {
    const token = jsonwebtoken_1.default.sign({ userId }, jwtSecret, { expiresIn: "1d" });
    return token;
};
exports.default = generateVerificationToken;
