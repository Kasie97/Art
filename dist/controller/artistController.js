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
exports.uploadImage = exports.changeArtistPassword = exports.updateArtist = exports.getAllOrders = exports.getOneOrder = exports.getAllArtists = void 0;
const express_1 = __importDefault(require("express"));
const artistModel_1 = require("../model/artistModel");
const orderModel_1 = require("../model/orderModel");
const userModel_1 = require("../model/userModel");
const artworkModel_1 = __importDefault(require("../model/artworkModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserValidation_1 = require("../utils/validation/UserValidation");
const cloudinary_1 = __importDefault(require("../lib/helper/cloudinary"));
const router = express_1.default.Router();
const jwtSecret = process.env.JWT_SECRET;
const getAllArtists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all artists
        const artists = yield artistModel_1.ArtistInstance.findAll();
        // Send the response
        res.json({
            message: "All artists retrieved successfully",
            artists,
        });
    }
    catch (error) {
        console.error(error);
        // Handle other errors
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});
exports.getAllArtists = getAllArtists;
const getOneOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const values = yield orderModel_1.OrderInstance.findAndCountAll({
            where: { id: id },
            include: [
                {
                    model: userModel_1.UserInstance,
                    as: "user",
                },
                {
                    model: artworkModel_1.default,
                    as: "artwork",
                },
            ],
        });
        if (!values) {
            return res.status(404).json({ error: "No Order Found  " });
        }
        const uid = values.rows[0].dataValues.userId;
        const artId = values.rows[0].dataValues.artworkId;
        const user = yield userModel_1.UserInstance.findByPk(uid);
        const art = yield artworkModel_1.default.findByPk(artId);
        const order = values;
        console.log(art);
        return res.status(200).json({
            message: "Order retrieved successfully",
            order: values.rows[0],
            user: user,
            art: art
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getOneOrder = getOneOrder;
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const orderList = yield orderModel_1.OrderInstance.findAndCountAll({
            where: { artistId: id },
            include: [
                {
                    model: userModel_1.UserInstance,
                    as: "user",
                },
                {
                    model: artworkModel_1.default,
                    as: "artwork",
                },
            ],
            order: [['createdAt', 'DESC']]
        });
        if (!orderList) {
            return res.status(404).json({ error: " No orders yet " });
        }
        return res.status(200).json({
            message: "Orders fetched successfully",
            count: orderList.count,
            list: orderList.rows
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getAllOrders = getAllOrders;
const updateArtist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const validateArtist = UserValidation_1.updateProfileSchema.validate(req.body, UserValidation_1.option);
        if (validateArtist.error) {
            return res.status(400).json({ Error: validateArtist.error.details[0].message });
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, jwtSecret);
        if (!decodedToken) {
            return res.status(401).json({
                error: "Invalid or expired token",
            });
        }
        const artistId = decodedToken;
        const artistInfo = yield artistModel_1.ArtistInstance.findOne({ where: { id: artistId.id } });
        if (!artistInfo) {
            return res.status(404).json({ Error: "Artist profile not found" });
        }
        else {
            const artistUpdate = yield artistInfo.update(req.body);
            return res.status(200).json({ msg: "Artist updated successfully", artistUpdate });
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.updateArtist = updateArtist;
const changeArtistPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const validateUser = UserValidation_1.changePasswordSchema.validate(req.body, UserValidation_1.option);
        if (validateUser.error) {
            return res.status(400).json({ Error: validateUser.error.details[0].message });
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, jwtSecret);
        if (!decodedToken) {
            return res.status(401).json({
                error: "Invalid or expired token",
            });
        }
        const artistId = decodedToken;
        const artistInfo = yield artistModel_1.ArtistInstance.findOne({ where: { id: artistId.id } });
        if (!artistInfo) {
            return res.status(404).json({ Error: "Artist profile not found" });
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashed = yield bcrypt_1.default.hash(req.body.newPassword, salt);
        const artistUpdate = yield artistInfo.update({ password: hashed });
        return res.status(200).json({ msg: "Password Changed Successfully", artistUpdate });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.changeArtistPassword = changeArtistPassword;
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(500).json({ error: "no file uploaded" });
        }
        const imageUpload = yield cloudinary_1.default.uploader.upload(req.file.path);
        res.status(200).json({ imageUrl: imageUpload.secure_url });
    }
    catch (error) {
        res.status(500).json({ error: "image upload failed" });
    }
});
exports.uploadImage = uploadImage;
