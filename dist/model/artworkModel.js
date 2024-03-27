"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtworkInstance = exports.Status = exports.Category = exports.ArtClass = void 0;
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("../db/index"));
const auctionModel_1 = __importDefault(require("./auctionModel"));
const bidModel_1 = require("./bidModel");
var ArtClass;
(function (ArtClass) {
    ArtClass["AUCTION"] = "Auction";
    ArtClass["SALE"] = "Sale";
})(ArtClass || (exports.ArtClass = ArtClass = {}));
var Category;
(function (Category) {
    Category["LANDSCAPE"] = "Landscape";
    Category["PORTRAIT"] = "Portrait";
    Category["ANCIENCT"] = "Ancient";
    Category["MODERN"] = "Modern";
    Category["OIL_ON_CANVAS"] = "Oil on Canvas";
    Category["PEN_AND_INK"] = "Pen and Ink";
    Category["NATURE"] = "Nature";
    Category["DIGITAL_PAINT"] = "Digital Paint";
})(Category || (exports.Category = Category = {}));
var Status;
(function (Status) {
    Status["UPCOMING"] = "Upcoming";
    Status["LIVE"] = "Live";
    Status["ENDED"] = "Ended";
})(Status || (exports.Status = Status = {}));
class ArtworkInstance extends sequelize_1.Model {
}
exports.ArtworkInstance = ArtworkInstance;
ArtworkInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    artName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    artistID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    // artistID: {
    // 	type: DataTypes.UUID,
    // 	references: {
    // 		model: "ArtistInstance",
    // 		key: "id",
    // 	},
    // },
    soldOut: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    artClass: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(ArtClass)),
        allowNull: false,
    },
    imageUrl: {
        type: sequelize_1.DataTypes.STRING,
    },
    category: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(Category)),
        allowNull: false,
    },
    price: {
        type: sequelize_1.DataTypes.INTEGER,
    },
}, { sequelize: index_1.default, tableName: "artwork" });
auctionModel_1.default.belongsTo(ArtworkInstance, { foreignKey: "artworkId", as: "artwork", constraints: false });
ArtworkInstance.hasMany(bidModel_1.BidInstance, { foreignKey: "artworkID", as: "bid", constraints: false });
bidModel_1.BidInstance.belongsTo(ArtworkInstance, { foreignKey: "artworkID", as: "artwork", constraints: false });
exports.default = ArtworkInstance;
