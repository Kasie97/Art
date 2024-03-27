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
exports.cartHistory = exports.updateSingleCart = exports.getSingleCart = exports.deleteCart = exports.getCart = exports.addToCart = void 0;
const cartModel_1 = require("../model/cartModel");
const uuid_1 = require("uuid");
const artworkModel_1 = require("../model/artworkModel");
const userModel_1 = require("../model/userModel");
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const uid = (0, uuid_1.v4)();
        const userID = yield userModel_1.UserInstance.findOne({ where: { id: id } });
        const artworks = yield artworkModel_1.ArtworkInstance.findOne({ where: { id: id } }); //req.params.artworks;
        // CREATING A NEW CART USING SEQUELIZE
        const newCart = yield cartModel_1.CartInstance.create({
            userID: req.body.userID,
            artworks: req.body.artworks,
            status: req.body.status,
        });
        if (newCart) {
            res.send({ success: 'Cart saved Successfully' });
        }
        else {
            res.send({ error: 'Error Saving Cart' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});
exports.addToCart = addToCart;
// FINDING ALL CARTS 
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const carts = yield cartModel_1.CartInstance.findAll();
        res.send(carts);
        res.status(200);
        console.log(carts);
        if (!carts) {
            res.status(400).send({ error: 'Carts not yet created' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});
exports.getCart = getCart;
// DELETING A NEW CART FROM THE ADMIN-CART-PAGE
const deleteCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const deleteCart = yield cartModel_1.CartInstance.destroy({ where: { id: id } });
        if (deleteCart) {
            res.send({ success: 'Cart Deleted Successfully' });
        }
        else {
            res.send({ error: 'Error Deleting Cart' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});
exports.deleteCart = deleteCart;
// FINDING A SINGLE CART AND POPULATING INFORMATION ON THE CART-DETAIL-PAGE
const getSingleCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const cart = yield cartModel_1.CartInstance.findByPk(id);
        if (!cart) {
            res.send({ error: 'The Cart was not found' });
            return;
        }
        res.send(cart);
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});
exports.getSingleCart = getSingleCart;
// UPDATE A SINGLE CART STATUS
const updateSingleCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const cart = yield cartModel_1.CartInstance.findByPk(id);
        if (!cart) {
            res.send({ error: 'The Cart was not found' });
            return;
        }
        cart.dataValues.status = req.body.status || cart.dataValues.status;
        const updatedCart = yield cart.save();
        if (updatedCart) {
            res.send({ success: 'Cart updated Successfully' });
        }
        else {
            res.send({ error: 'Error updating Cart.' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});
exports.updateSingleCart = updateSingleCart;
// UPDATING THE CART HISTORY PAGE
const cartHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const carts = yield cartModel_1.CartInstance.findAll({ where: { userID: id } });
        res.send(carts);
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});
exports.cartHistory = cartHistory;
