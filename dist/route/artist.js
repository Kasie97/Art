"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const artistController_1 = require("../controller/artistController");
const multer_1 = __importDefault(require("../lib/helper/multer"));
const artistController_2 = require("../controller/artistController");
const orderAuth_1 = require("../middlewares/orderAuth");
const router = express_1.default.Router();
router.get("/get-artists", artistController_1.getAllArtists);
router.patch("/update/:token", artistController_1.updateArtist);
// Change Password
router.patch("/change-password/:token", artistController_1.changeArtistPassword);
// upload image
router.post("/image", multer_1.default.single('image'), artistController_1.uploadImage);
// router.get('/get-one-order/:id', getOneOrder)
// router.get('/get-orders/:token', artistAuth, getAllOrders)
router.get('/get-one-order/:id', artistController_2.getOneOrder);
router.get('/get-orders/:token', orderAuth_1.orderAuth, artistController_2.getAllOrders);
exports.default = router;
