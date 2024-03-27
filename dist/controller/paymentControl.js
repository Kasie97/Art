"use strict";
// import { PaymentAttributes, PaymentInstance } from "../model/paymentModel";
// import { Request, Response } from "express";
// import axios from "axios";
// import { UserInstance } from "../model/userModel";
// import { User } from "../model/userModel";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaystackController = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const orderModel_1 = require("../model/orderModel");
const userModel_1 = require("../model/userModel");
const artworkModel_1 = __importDefault(require("../model/artworkModel"));
const uuid_1 = require("uuid");
const auctionController_1 = require("./auctionController");
const notify_1 = require("../model/notify");
dotenv_1.default.config();
class PaystackController {
    static initializePayment(paymentData) {
        return __awaiter(this, void 0, void 0, function* () {
            let errorMessage;
            try {
                const { amount, email, callbackUrl, name } = paymentData;
                const paymentDetails = {
                    amount,
                    email,
                    callback_url: callbackUrl,
                    metadata: {
                        amount,
                        email,
                        name,
                    },
                };
                let url = process.env.PAYSTACK_BASE_URL + '/transaction/initialize';
                let requestInit = {
                    body: JSON.stringify(paymentDetails),
                    headers: {
                        'Content-Type': 'Application/json',
                        authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    },
                    method: "POST"
                };
                let response = yield fetch(url, requestInit);
                console.log('res', response);
                if (!response.ok) {
                    errorMessage = yield response.text();
                }
                // Get the data returned by paystack
                const responseData = yield response.json();
                console.log(responseData.data.authorization_url);
                return { errorMessage, checkout_url: responseData.data.authorization_url };
            }
            catch (err) {
                console.log(err);
                return err;
            }
        });
    }
    static verifyPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = (0, uuid_1.v4)();
                const userId = req.body.userId;
                const reference = req.body.reference;
                const artId = req.body.artworkId;
                const price = req.body.price;
                if (!reference) {
                    return res.status(400).json({
                        message: 'Missing reference',
                    });
                }
                const artwork = yield artworkModel_1.default.findOne({ where: { id: artId } });
                let url = process.env.PAYSTACK_BASE_URL + `/transaction/verify/${reference}`;
                // console.log(req.body)
                let requestInit = {
                    headers: {
                        'Content-Type': 'Application/json',
                        authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    },
                    method: "GET"
                };
                let response = yield fetch(url, requestInit);
                const responseData = yield response.json();
                const user = yield userModel_1.UserInstance.findOne({ where: { id: userId } });
                const artistId = artwork === null || artwork === void 0 ? void 0 : artwork.dataValues.artistID;
                const art = [artId];
                const username = (user === null || user === void 0 ? void 0 : user.firstname) + " " + (user === null || user === void 0 ? void 0 : user.surname);
                yield orderModel_1.OrderInstance.create({
                    id: id,
                    paymentReference: reference,
                    isPaid: true,
                    userId,
                    artistId,
                    price,
                    quantity: 1,
                    status: "completed",
                    artworkId: artId,
                    checkoutUrl: req.body.redirecturl
                });
                yield (0, auctionController_1.sendNotification)(`The ${artwork === null || artwork === void 0 ? void 0 : artwork.dataValues.artName} art has been sold to ${username}`, notify_1.RecipientType.ARTIST);
                //  await PaymentInstance.create({
                //   id:pid,
                //   reference,
                //   userID:userId,
                //   artworks:artId,
                //   status:PaymentStatus.PAID,
                //  })
                // await ArtworkInstance.update({
                //   soldOut:true
                // },{where:{id:artId}})
                return res.status(200).json({
                    message: 'Payment verified successfully',
                    data: responseData.data
                });
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({
                    err
                });
            }
        });
    }
}
exports.PaystackController = PaystackController;
