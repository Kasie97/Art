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
exports.addAddressToUser = exports.getUserAddresses = void 0;
const userModel_1 = require("../model/userModel");
// Endpoint to retrieve the address of a user by user ID
const getUserAddresses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        // Find the user by ID
        const user = yield userModel_1.UserInstance.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Extract and return the user's address
        const userAddress = {
            address: user.address,
            state: user.state,
            zipcode: user.zipcode,
        };
        res.json(userAddress);
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getUserAddresses = getUserAddresses;
const addAddressToUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        console.log(req.body);
        const { address, state, zipcode } = req.body;
        // Validate the required fields
        if (!address || !state || !zipcode) {
            return res.status(400).json({ error: 'Incomplete address information provided.' });
        }
        // Find the user by ID
        const user = yield userModel_1.UserInstance.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Update the user's address
        user.address = address;
        user.state = state;
        user.zipcode = zipcode;
        // Save the changes to the database
        yield user.save();
        // Return the updated user with the new address
        res.json({
            message: "User information added successfully",
            user: {
                id: user.id,
                firstname: user.firstname,
                surname: user.surname,
                address: user.address,
                state: user.state,
                zipcode: user.zipcode,
            }
        });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.addAddressToUser = addAddressToUser;
