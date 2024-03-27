"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const delveryServices_1 = require("../controller/delveryServices");
const router = express_1.default.Router();
router.get('/:userId/address', delveryServices_1.getUserAddresses);
router.post('/:userId/add-address', delveryServices_1.addAddressToUser);
exports.default = router;
