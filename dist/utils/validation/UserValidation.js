"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.updateProfileSchema = exports.updateUserSchema = exports.verifyCode = exports.sendVerification = exports.resetPasswordSchema = exports.loginSchema = exports.registerUserSchema = exports.option = void 0;
const joi_1 = __importDefault(require("joi"));
exports.option = {
    abortEarly: false,
    errors: {
        wrap: {
            label: "",
        },
    },
};
const passwordComplexityOptions = {
    min: 8,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1, // Require at least 1 special character
};
const passwordSchema = joi_1.default.string()
    .min(passwordComplexityOptions.min)
    .max(passwordComplexityOptions.max)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};:'",.<>/?]).{8,30}$/)
    .message("Password must be between 8 and 30 characters, contain at least one lowercase letter, one uppercase letter, one digit, and one special character.")
    .required();
exports.registerUserSchema = joi_1.default.object({
    firstname: joi_1.default.string().min(4).max(30).required().messages({
        "string.empty": "First name is required",
        "string.min": "First name should have a minimum length of {#limit}",
        "string.max": "First name should have a maximum length of {#limit}",
    }),
    surname: joi_1.default.string().min(4).max(30).required().messages({
        "string.empty": "Surname is required",
        "string.min": "Surname should have a minimum length of {#limit}",
        "string.max": "Surname should have a maximum length of {#limit}",
    }),
    email: joi_1.default.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Invalid email format",
    }),
    phone: joi_1.default.string()
        .length(11)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
        "string.empty": "Phone number is required",
        "string.length": "Phone number should have a length of {#limit}",
    }),
    role: joi_1.default.string().valid("User", "Artist").required().messages({
        "string.empty": "Role is required",
        "any.only": "Invalid role",
    }),
    password: passwordSchema,
    confirmPassword: joi_1.default.any().equal(joi_1.default.ref("password")).required().label("Confirm password").messages({
        "any.only": "Passwords do not match",
        "any.required": "Password confirmation is required",
    }),
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Invalid email format",
    }),
    password: passwordSchema,
});
exports.resetPasswordSchema = joi_1.default.object({
    password: passwordSchema,
    confirmPassword: joi_1.default.any().equal(joi_1.default.ref("password")).required().label("Confirm password").messages({
        "any.only": "Passwords do not match",
        "any.required": "Password confirmation is required",
    }),
});
exports.sendVerification = joi_1.default.object().keys({
    email: joi_1.default.string().trim().lowercase().email().required(),
    id: joi_1.default.string().required(),
});
exports.verifyCode = joi_1.default.object().keys({
    email: joi_1.default.string().trim().lowercase().email().required(),
    otp: joi_1.default.number().required(),
});
exports.updateUserSchema = joi_1.default.object({
    firstname: joi_1.default.string().min(3).max(30).messages({
        "string.min": "firstname should have a minimum length of {#limit}",
        "string.max": "firstname should have a maximum length of {#limit}",
    }),
    surname: joi_1.default.string().min(3).max(30).messages({
        "string.min": "surname should have a minimum length of {#limit}",
        "string.max": "surname should have a maximum length of {#limit}"
    }),
    email: joi_1.default.string().email().messages({
        "string.email": "invalid email format"
    }),
    phone: joi_1.default.string().length(11).pattern(/^[0-9]+$/).messages({
        "string.length": "phone number should have the length of {#limit}"
    }),
    oldPassword: joi_1.default.string().min(passwordComplexityOptions.min)
        .max(passwordComplexityOptions.max)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};:'",.<>/?]).{8,30}$/)
        .message("Password must be between 8 and 30 characters, contain at least one lowercase letter, one uppercase letter, one digit, and one special character."),
    newPassword: joi_1.default.string().min(passwordComplexityOptions.min)
        .max(passwordComplexityOptions.max)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};:'",.<>/?]).{8,30}$/)
        .message("Password must be between 8 and 30 characters, contain at least one lowercase letter, one uppercase letter, one digit, and one special character."),
    password: joi_1.default.string().min(passwordComplexityOptions.min)
        .max(passwordComplexityOptions.max)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};:'",.<>/?]).{8,30}$/)
        .message("Password must be between 8 and 30 characters, contain at least one lowercase letter, one uppercase letter, one digit, and one special character."),
    confirmPassword: joi_1.default.any().equal(joi_1.default.ref("password")).required().label("Confirm password").messages({
        "any.only": "Passwords do not match",
        "any.required": "Password confirmation is required",
    }),
});
exports.updateProfileSchema = joi_1.default.object({
    firstname: joi_1.default.string().min(3).max(30).messages({
        "string.min": "firstname should have a minimum length of {#limit}",
        "string.max": "firstname should have a maximum length of {#limit}",
    }),
    surname: joi_1.default.string().min(3).max(30).messages({
        "string.min": "surname should have a minimum length of {#limit}",
        "string.max": "surname should have a maximum length of {#limit}"
    }),
    phone: joi_1.default.string().length(11).pattern(/^[0-9]+$/).messages({
        "string.length": "phone number should have the length of {#limit}"
    }),
    email: joi_1.default.string().email().messages({
        "string.email": "invalid email format"
    }),
    birthday: joi_1.default.date(),
    address: joi_1.default.string(),
    state: joi_1.default.string(),
    zipcode: joi_1.default.number(),
    profilePic: joi_1.default.string(),
});
exports.changePasswordSchema = joi_1.default.object({
    password: passwordSchema,
    newPassword: passwordSchema,
    confirmPassword: joi_1.default.any().equal(joi_1.default.ref("newPassword")).required().label("Confirm password").messages({
        "any.only": "Passwords do not match",
        "any.required": "Password confirmation is required",
    }),
});
