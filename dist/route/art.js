"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const artController_1 = require("../controller/artController");
const artistAuth_1 = require("../middlewares/artistAuth");
const router = express_1.default.Router();
router.post("/create-art", artistAuth_1.artistAuth, artController_1.CreateArt);
router.get("/getAll", artController_1.getAllArtworks);
router.get("/getOne/:id", artController_1.getOneArt);
// Get all sales
router.get("/sales", artController_1.artworksOnSale);
router.get("/auction", artController_1.artworksOnAuction);
// Get all artworks by a particular artist
router.get("/artist-artworks", artistAuth_1.artistAuth, artController_1.getArtByArtist);
exports.default = router;
