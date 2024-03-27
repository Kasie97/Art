"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WinnersInstance = void 0;
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("../db/index"));
class WinnersInstance extends sequelize_1.Model {
}
exports.WinnersInstance = WinnersInstance;
WinnersInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true
    },
    artworkId: {
        type: sequelize_1.DataTypes.STRING
    },
    bidderID: {
        type: sequelize_1.DataTypes.STRING
    },
    price: {
        type: sequelize_1.DataTypes.BIGINT
    },
    bidTime: {
        type: sequelize_1.DataTypes.DATE
    }
}, { sequelize: index_1.default, tableName: "winners" });
// WinnersInstance.belongsTo(ArtworkInstance, {
//       foreignKey: "artworkID"
//     });
