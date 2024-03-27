"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuctionInstance = exports.Status = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
var Status;
(function (Status) {
    Status["UPCOMING"] = "Upcoming";
    Status["LIVE"] = "Live";
    Status["ENDED"] = "Ended";
})(Status || (exports.Status = Status = {}));
class AuctionInstance extends sequelize_1.Model {
}
exports.AuctionInstance = AuctionInstance;
AuctionInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
    },
    artworkId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    startingPrice: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    currentPrice: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(Status)),
        allowNull: false,
    },
    startDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    bidders: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
    },
}, {
    sequelize: db_1.default,
    tableName: "auction",
});
exports.default = AuctionInstance;
