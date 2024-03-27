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
exports.creatingBids = exports.artworkBids = exports.artworkDetails = exports.ongoingAuctions = void 0;
const artistModel_1 = require("../model/artistModel");
const artworkModel_1 = require("../model/artworkModel");
const bidModel_1 = require("../model/bidModel");
const userModel_1 = require("../model/userModel");
const uuid_1 = require("uuid");
const auctionModel_1 = require("../model/auctionModel");
// Endpoint to list all artworks in a category
// List all on going auctions
const ongoingAuctions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ongoingAuct = yield auctionModel_1.AuctionInstance.findAll({
            where: { status: "Live" },
            include: [
                {
                    model: artworkModel_1.ArtworkInstance,
                    as: "artwork",
                    include: [
                        {
                            model: artistModel_1.ArtistInstance,
                            as: "artist",
                            // attributes: ["id", "firstName", "lastName"],
                        },
                        {
                            model: bidModel_1.BidInstance,
                            as: "bid",
                            include: [
                                {
                                    model: userModel_1.UserInstance,
                                    as: "user",
                                    order: [["bidTime", "DESC"]],
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        if (ongoingAuct.length > 0) {
            return res.status(201).json({ msg: "Live Auction fetched successfully", data: ongoingAuct });
        }
        else {
            return res.status(404).json({ msg: "No ongoing auctions found" });
        }
    }
    catch (err) {
        console.log(err);
        throw new Error("Internal Server Error");
    }
});
exports.ongoingAuctions = ongoingAuctions;
// End point to get artwork details
//this code return artwork details from the database using the id
const artworkDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const artwork = yield artworkModel_1.ArtworkInstance.findAll({ where: { id: id } });
        return res.status(201).json({ msg: "Artwork details fetched successfully", artwork });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.artworkDetails = artworkDetails;
//Endpoint to list all bids for a specific artwork
const artworkBids = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const artworkId = req.params.id;
    try {
        console.log("Fine", artworkId);
        //Find the artwork with associated bids
        const artworkWithBids = yield artworkModel_1.ArtworkInstance.findByPk(artworkId, {
            include: [{ model: bidModel_1.BidInstance, as: "bid" }]
        });
        const user = yield bidModel_1.BidInstance.findAndCountAll({
            where: { artworkID: artworkId },
            include: [
                {
                    model: userModel_1.UserInstance,
                    as: "user",
                    // attributes: ["id", "firstName", "lastName"],
                },
            ],
            order: [['bidTime', 'DESC']],
        });
        return res.status(200).json({
            msg: "All bids for a specific artwork fetched successfully",
            data: artworkWithBids,
            bids: user.rows
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal Server Error",
        });
    }
});
exports.artworkBids = artworkBids;
// End point to Create bids
const creatingBids = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const uuid = (0, uuid_1.v4)();
    const auctionId = req.params.auctionId;
    const { price } = req.body;
    const { id } = req.user;
    console.log("bid controller", auctionId, price, id);
    try {
        // Check if the user exists
        console.log("bid controller", auctionId, price, id);
        const user = yield userModel_1.UserInstance.findOne({ where: { id: id } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Check if the auction exists
        const auction = yield auctionModel_1.AuctionInstance.findOne({ where: { id: auctionId } });
        if (!auction) {
            return res.status(404).json({ error: "Auction not found" });
        }
        const isAuctionLive = auction.dataValues.status === "Live";
        // Check if the auction is live
        if (!isAuctionLive) {
            return res.status(404).json({ error: "Auction is not live" });
        }
        // Check if the bid amount is greater than the current price
        if (price <= ((_a = auction === null || auction === void 0 ? void 0 : auction.dataValues) === null || _a === void 0 ? void 0 : _a.currentPrice)) {
            return res.status(400).json({ error: "Bid amount is less than the current price" });
        }
        // Check if the bidder exists, then update the bidding amount
        let bidder = yield bidModel_1.BidInstance.findOne({ where: { bidderID: id, artworkID: auctionId } });
        if (bidder) {
            // Update bidding amount of the existing bidder
            const updatedBidder = yield bidModel_1.BidInstance.update({ price: price }, { where: { bidderID: id, artworkID: auctionId } });
            if (!updatedBidder) {
                return res.status(500).json({ error: "Failed to update bidder" });
            }
            const updateAuctionCurrentPrice = yield auctionModel_1.AuctionInstance.update({ currentPrice: price }, { where: { id: auctionId } });
            if (!updateAuctionCurrentPrice) {
                return res.status(500).json({ error: "Failed to update Auction current price" });
            }
            const theId = auction.dataValues.artworkId;
            const update = yield artworkModel_1.ArtworkInstance.findOne({
                where: { id: theId }
            });
            const bids = yield bidModel_1.BidInstance.findAndCountAll({
                where: { artworkID: auction.dataValues.artworkId },
                include: [
                    {
                        model: userModel_1.UserInstance,
                        as: "user",
                    },
                ],
                order: [['bidTime', 'DESC']],
            });
            return res.status(201).json({
                msg: "Bid created successfully",
                bids: bids.rows,
                user: user.dataValues
            });
        }
        // Check if the bid amount is greater than the current price
        if (price > ((_b = auction === null || auction === void 0 ? void 0 : auction.dataValues) === null || _b === void 0 ? void 0 : _b.currentPrice)) {
            // Create a new bidder
            console.log("Done...", auction.dataValues.artworkId);
            const bidder = yield bidModel_1.BidInstance.create(Object.assign({ id: uuid, bidderID: id, artworkID: auction.dataValues.artworkId, bidTime: new Date() }, req.body));
            if (!bidder) {
                return res.status(500).json({ error: "Failed to create bidder" });
            }
            const updateAuctionCurrentPrice = yield auctionModel_1.AuctionInstance.update({ currentPrice: price }, { where: { id: auctionId } });
            if (!updateAuctionCurrentPrice) {
                return res.status(500).json({ error: "Failed to update Auction current price" });
            }
            console.log("Hello...");
            const bids = yield bidModel_1.BidInstance.findAndCountAll({
                where: { artworkID: auction.dataValues.artworkId },
                include: [
                    {
                        model: userModel_1.UserInstance,
                        as: "user",
                    },
                ],
                order: [['bidTime', 'DESC']],
            });
            console.log(user.dataValues, bids.count);
            return res.status(201).json({
                msg: "Bid created successfully",
                count: bids.count,
                bids: bids.rows,
                user: user.dataValues
            });
        }
        return res.status(500).json({ error: "Failed to create bidder" });
    }
    catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.creatingBids = creatingBids;
