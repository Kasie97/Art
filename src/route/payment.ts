import express from "express";
import {PaystackController} from "../controller/paymentControl"

const router = express.Router();

router.post('/verify',  PaystackController.verifyPayment)

export default router;