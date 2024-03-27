"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auction = void 0;
const winnersModel_1 = require("../model/winnersModel");
const uuid_1 = require("uuid");
// import db from "../db/index";
const Auction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        const { artworkID, price, bidTime } = req.body;
        const id = (0, uuid_1.v4)();
        const bidWinner = yield winnersModel_1.WinnersInstance.create({ id: id, artworkId: artworkID, bidderID: userId.id, price, bidTime });
        if (bidWinner) {
            res.status(200).json({
                message: 'Bid Winner details',
                bidWinner
            });
        }
        else {
            return res.status(400).json({ error: "No Bid Winner found" });
        }
        ;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.Auction = Auction;
