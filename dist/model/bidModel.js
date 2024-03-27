"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidInstance = void 0;
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("../db/index"));
class BidInstance extends sequelize_1.Model {
}
exports.BidInstance = BidInstance;
BidInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    artworkID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    bidderID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    bidTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    price: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, { sequelize: index_1.default, tableName: "bid" });
