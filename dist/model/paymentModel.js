"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentInstance = void 0;
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("../db/index"));
const cartModel_1 = require("./cartModel");
class PaymentInstance extends sequelize_1.Model {
    static find() {
        throw new Error("Method not implemented.");
    }
}
exports.PaymentInstance = PaymentInstance;
PaymentInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    artworks: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        get() {
            const artworksValue = this.getDataValue('artworks');
            return artworksValue ? artworksValue.split(',') : [];
        },
        set(value) {
            this.setDataValue('artworks', value.join(','));
        },
    },
    userID: {
        type: sequelize_1.DataTypes.STRING,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(cartModel_1.PaymentStatus)),
        allowNull: true
    },
    reference: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
}, { sequelize: index_1.default, tableName: "payment" });
