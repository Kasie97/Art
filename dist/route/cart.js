"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CartList_1 = require("../controller/CartList");
const router = express_1.default.Router();
router.post('/:id', CartList_1.addToCart);
router.get('/:id', CartList_1.getCart);
router.delete('/:id', CartList_1.deleteCart);
router.get('/:id', CartList_1.getSingleCart);
router.put('/:id', CartList_1.updateSingleCart);
router.get('/cart-history/:id', CartList_1.cartHistory);
exports.default = router;
