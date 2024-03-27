"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartInstance = exports.PaymentStatus = void 0;
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("../db/index"));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PAID"] = "Paid";
    PaymentStatus["PENDING"] = "Pending";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
class CartInstance extends sequelize_1.Model {
}
exports.CartInstance = CartInstance;
CartInstance.init({
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
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(PaymentStatus)),
        allowNull: true
    },
}, { sequelize: index_1.default, tableName: "cart" });
