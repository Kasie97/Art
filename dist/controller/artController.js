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
exports.getArtByArtist = exports.artworksOnAuction = exports.artworksOnSale = exports.getOneArt = exports.getAllArtworks = exports.CreateArt = void 0;
const artistModel_1 = require("../model/artistModel");
const artworkModel_1 = require("../model/artworkModel");
const uuid_1 = require("uuid");
const auctionController_1 = require("./auctionController");
const notify_1 = require("../model/notify");
const auctionModel_1 = __importDefault(require("../model/auctionModel"));
const CreateArt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uuid = (0, uuid_1.v4)();
        const { id } = req.user;
        const addArt = (yield artworkModel_1.ArtworkInstance.create(Object.assign({ id: uuid, artistID: id }, req.body)));
        yield (0, auctionController_1.sendNotification)(`${addArt.artName} was just added`, notify_1.RecipientType.ALL);
        return res.status(201).json({ msg: "Art created successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ err: "internal server error" });
    }
});
exports.CreateArt = CreateArt;
const getAllArtworks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allArtworks = yield artworkModel_1.ArtworkInstance.findAndCountAll({
            include: [
                {
                    model: artistModel_1.ArtistInstance,
                    as: "artist",
                },
            ],
        });
        return res.status(200).json({
            message: "Artworks Retrieved Successfully",
            count: allArtworks.count,
            data: allArtworks.rows,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
});
exports.getAllArtworks = getAllArtworks;
const getOneArt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const art = yield artworkModel_1.ArtworkInstance.findOne({
            where: { id },
            include: [
                {
                    model: artistModel_1.ArtistInstance,
                    as: "artist",
                },
            ],
        });
        if (art) {
            return res.status(200).json({ message: "Successfully", data: art });
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.getOneArt = getOneArt;
const artworksOnSale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allArtworks = yield artworkModel_1.ArtworkInstance.findAndCountAll({
            include: [
                {
                    model: artistModel_1.ArtistInstance,
                    as: "artist",
                },
            ],
        });
        const sales = allArtworks.rows.filter((art) => art._model.dataValues.artClass === "Sale");
        return res.status(200).json({
            message: "Artworks Retrieved Successfully",
            count: sales.length,
            data: sales,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
});
exports.artworksOnSale = artworksOnSale;
const artworksOnAuction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allArtworks = yield artworkModel_1.ArtworkInstance.findAndCountAll({
            include: [
                {
                    model: artistModel_1.ArtistInstance,
                    as: "artist",
                },
                {
                    model: auctionModel_1.default,
                    as: "auction",
                },
            ],
        });
        const auction = allArtworks.rows.filter((art) => art._model.dataValues.artClass === "Auction");
        return res.status(200).json({
            message: "Artworks Retrieved Successfully",
            count: auction.length,
            data: auction,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
});
exports.artworksOnAuction = artworksOnAuction;
// Get all artworks by a particular artist
const getArtByArtist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const art = yield artworkModel_1.ArtworkInstance.findAll({
            where: { artistID: id },
            include: [
                {
                    model: artistModel_1.ArtistInstance,
                    as: "artist",
                },
            ],
        });
        if (art) {
            return res.status(200).json({ message: "Successfully", data: art });
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.getArtByArtist = getArtByArtist;
