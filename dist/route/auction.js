"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const artistAuth_1 = require("../middlewares/artistAuth");
const auctionController_1 = require("../controller/auctionController");
const router = express_1.default.Router();
router.post("/create-auction/:artworkId", artistAuth_1.artistAuth, auctionController_1.createAuction);
router.get("/get-auctions", auctionController_1.getAuctions);
exports.default = router;
