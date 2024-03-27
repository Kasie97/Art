"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wishlist_1 = require("../controller/wishlist");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.get('/ongoing-auctions', wishlist_1.ongoingAuctions);
router.get('/list-bids/:id', wishlist_1.artworkBids);
router.get('/:id', wishlist_1.artworkDetails);
router.post('/create-bids/:auctionId', auth_1.auth, wishlist_1.creatingBids);
exports.default = router;
