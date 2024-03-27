"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtworkSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.ArtworkSchema = joi_1.default.object({
    artName: joi_1.default.string().min(4).max(20).required().messages({
        "any.required": "Art Name is required",
    }),
    description: joi_1.default.string().min(20).max(255).required().messages({
        "string.empty": "Description is required",
        "string.min": "Description should have a minimum length of {#limit}",
        "string.max": "Description should have a maximum length of {#limit}",
    }),
    category: joi_1.default.string()
        .valid("Nature", "Portrait", "Landscape", "Ancient", "Modern", "Oil on Canvas", "Pen and Ink", "Digital Paint")
        .required()
        .messages({
        "any.required": "Category is required",
        "any.only": "Invalid Category",
    }),
    artClass: joi_1.default.string().valid("Sale", "Auction").required().messages({
        "any.required": "Art Class is required",
        "any.only": "Invalid Art Class",
    }),
    price: joi_1.default.number().required().messages({
        "any.required": "Price is required",
        "number.base": "Price must be a number",
    }),
    imageUrl: joi_1.default.string().uri().required().messages({
        "any.required": "Image URL is required",
        "string.uri": "Invalid Image URL",
    }),
});
