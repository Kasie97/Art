"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserLogin_1 = require("../controller/UserLogin");
const UserController_1 = require("../controller/UserController");
const multer_1 = __importDefault(require("../lib/helper/multer"));
const auctionController_1 = require("../controller/auctionController");
const userOrderAuth_1 = require("../middlewares/userOrderAuth");
const router = express_1.default.Router();
// Login User
router.post('/login', UserLogin_1.loginUser);
/* User's endpoint */
router.post("/register", UserController_1.Register);
router.post("/verify", UserController_1.VerifyEmail);
router.post("/resendOTP", UserController_1.resendOTP);
// Password reset
router.post("/forget-password", UserController_1.forgetPassword);
router.patch("/reset-password/:token", UserController_1.resetPassword);
// Get aLL registered users
router.get("/all", UserController_1.getAllUsers);
router.patch("/update/:token", UserController_1.updateUser);
router.delete("/delete/:id", UserController_1.deleteUser);
// Change Password
// router.patch("/change-password/:token", resetPassword)
router.patch("/change-password/:token", UserController_1.changePassword);
// upload image
router.post("/image", multer_1.default.single('image'), UserController_1.uploadImage);
//get notification
router.get("/get-notifications", auctionController_1.getNotificationForUser);
// get all user orders
router.get('/get-all-user-orders/:token', userOrderAuth_1.userOrderAuth, UserController_1.getAllUserOrders);
router.get('/get-one-user-order/:id', UserController_1.getOneUserOrder);
exports.default = router;
