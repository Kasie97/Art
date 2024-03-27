import express from "express";
import { loginUser } from "../controller/UserLogin";
import {
  Register,
  forgetPassword,
  resetPassword,
  getAllUsers,
  deleteUser,
  VerifyEmail,
  resendOTP,
  updateUser,
  changePassword,
  uploadImage,
  getAllUserOrders,
  getOneUserOrder,
  getUser,
} from "../controller/UserController";
import upload from "../lib/helper/multer";
import { userAuth } from "../middlewares/userAuth";
import { auth } from "../middlewares/auth";
import { getNotificationForUser } from "../controller/auctionController";
import { userOrderAuth } from "../middlewares/userOrderAuth";

const router = express.Router();

// Login User

router.post('/login', loginUser)

/* User's endpoint */
router.post("/register", Register);
router.post("/verify", VerifyEmail);
router.post("/resendOTP", resendOTP);


// Password reset
router.post("/forget-password", forgetPassword);
router.patch("/reset-password/:token", resetPassword);

// Get aLL registered users
router.get("/all", getAllUsers);
router.get("/get-user/:id", getUser);
router.patch("/update/:token",updateUser);
router.delete("/delete/:id", deleteUser);

// Change Password
// router.patch("/change-password/:token", resetPassword)
router.patch("/change-password/:token", changePassword);

// upload image
router.post("/image", upload.single('image'), uploadImage)

//get notification
router.get("/get-notifications", getNotificationForUser)


// get all user orders
router.get('/get-all-user-orders/:token', userOrderAuth, getAllUserOrders )
router.get('/get-one-user-order/:id', getOneUserOrder)

export default router;