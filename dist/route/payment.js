"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentControl_1 = require("../controller/paymentControl");
const router = express_1.default.Router();
router.post('/verify', paymentControl_1.PaystackController.verifyPayment);
exports.default = router;
