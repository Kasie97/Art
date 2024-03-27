"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.loginSchema = joi_1.default.object().keys({
    email: joi_1.default.string().trim().lowercase().required(),
    password: joi_1.default.string()
        .min(3)
        .max(30)
        .regex(/^[a-zA-Z0-9@!#$%^&*]+$/)
        .required()
        .label("password")
        .messages({
        "string.base": "{{#label}} must have one uppercase and one lowercase",
        "string.pattern.base": "{{#label}} must have one special character",
        "any.required": "{{#label}} is required",
    }),
});
