"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auction_1 = require("../controller/auction");
const router = express_1.default.Router();
router.post("/winner", auction_1.Auction);
exports.default = router;
