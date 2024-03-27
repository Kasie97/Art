"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuctionSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.AuctionSchema = joi_1.default.object({
    startingPrice: joi_1.default.number().required().messages({
        "number.empty": "Staring Price is required"
    }),
    currentPrice: joi_1.default.number().required().messages({
        "number.empty": "Current Price is required"
    }),
    startDate: joi_1.default.date().required().messages({
        "date.empty": "startDate is required"
    }),
    endDate: joi_1.default.date().required().messages({
        "date.empty": "endDate is required"
    }),
});
