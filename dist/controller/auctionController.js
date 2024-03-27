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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAuctionStatus = exports.getNotificationForUser = exports.sendNotification = exports.getAuctions = exports.createAuction = void 0;
const auctionValidation_1 = require("../utils/validation/auctionValidation");
const auctionModel_1 = require("../model/auctionModel");
const uuid_1 = require("uuid");
const artistModel_1 = __importDefault(require("../model/artistModel"));
const sequelize_1 = require("sequelize");
const notify_1 = require("../model/notify");
const artworkModel_1 = __importDefault(require("../model/artworkModel"));
const createAuction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { artworkId } = req.params;
        const { error, value } = auctionValidation_1.AuctionSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: error.details[0].message,
            });
        }
        const artwork = yield artworkModel_1.default.findOne({ where: { id: artworkId } });
        if (!artwork) {
            return res.status(400).json({
                error: "Artwork does not exist",
            });
        }
        if ((artwork === null || artwork === void 0 ? void 0 : artwork.dataValues.artClass) === "Sale") {
            return res.status(400).json({
                error: "Cannot create auction for artwork on sale",
            });
        }
        const auction = yield auctionModel_1.AuctionInstance.findOne({
            where: {
                artworkId,
            },
        });
        if (auction) {
            return res.status(400).json({
                error: "Auction Already exist",
            });
        }
        yield auctionModel_1.AuctionInstance.create(Object.assign({ id: (0, uuid_1.v4)(), artworkId, status: auctionModel_1.Status.UPCOMING }, value));
        return res.status(201).json({
            message: "auction created successfully",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Error Creating Auction",
        });
    }
});
exports.createAuction = createAuction;
const getAuctions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allAuctions = yield auctionModel_1.AuctionInstance.findAndCountAll({
            include: [
                {
                    model: artworkModel_1.default,
                    as: "artwork",
                    include: [
                        {
                            model: artistModel_1.default,
                            as: "artist",
                        },
                    ],
                },
            ],
        });
        return res.status(200).json({
            message: "auction successfully fetched",
            count: allAuctions.count,
            data: allAuctions.rows,
        });
    }
    catch (error) {
        return res.status(500).json({
            error: "error fetching auctions",
        });
    }
});
exports.getAuctions = getAuctions;
const sendNotification = (message, recipient) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(message);
        return yield notify_1.NotifyInstance.create({ id: (0, uuid_1.v4)(), message, recipient });
    }
    catch (error) {
        console.error("Error sending notification:", error);
        throw error;
    }
});
exports.sendNotification = sendNotification;
const getNotificationForUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, pageSize = 10 } = req.query;
        const offset = (Number(page) - 1) * Number(pageSize);
        const notifications = yield notify_1.NotifyInstance.findAndCountAll({
            where: {
                recipient: { [sequelize_1.Op.in]: [notify_1.RecipientType.USER, notify_1.RecipientType.ALL] },
            },
            limit: Number(pageSize),
            offset: offset,
        });
        return res.status(200).json({
            message: "You have all sent notifications",
            currentPage: Number(page),
            totalPages: Math.ceil(notifications.count / Number(pageSize)),
            notifications: notifications.rows,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "an error occurred",
        });
    }
});
exports.getNotificationForUser = getNotificationForUser;
const updateAuctionStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const auctions = yield auctionModel_1.AuctionInstance.findAll();
        auctions.forEach((auction) => __awaiter(void 0, void 0, void 0, function* () {
            let status;
            if (new Date(auction.startDate).getTime() >= new Date().getTime()) {
                status = auctionModel_1.Status.UPCOMING;
            }
            else if (new Date(auction.startDate).getTime() <= new Date().getTime() && new Date(auction.endDate).getTime() >= new Date().getTime()) {
                status = auctionModel_1.Status.LIVE;
                yield (0, exports.sendNotification)(`The excitement is happening now! 🎉 Our live auction event is currently underway, and you're invited to join the bidding frenzy. Don't miss your chance to snag incredible artworks and immerse yourself in the thrill of the auction.`, notify_1.RecipientType.USER);
            }
            else {
                status = auctionModel_1.Status.ENDED;
                yield (0, exports.sendNotification)(`The curtains have closed on our spectacular auction event! 🎨✨ Thank you to everyone who participated and made it a success.`, notify_1.RecipientType.USER);
                // const winner = auction.bidders.reduce((prev:any, current:any) => (prev.bidPrice > current.bidPrice) ? prev : current)
                // console.log(winner)
            }
            (yield auctionModel_1.AuctionInstance.update({
                status,
            }, {
                where: {
                    id: auction.id,
                },
            }));
        }));
        console.log("Cron job is scheduled to run every minute");
    }
    catch (error) {
        return error;
    }
});
exports.updateAuctionStatus = updateAuctionStatus;
