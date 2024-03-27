"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderInstance = exports.ORDER_STATUS = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
const userModel_1 = require("./userModel");
const artworkModel_1 = __importDefault(require("./artworkModel"));
var ORDER_STATUS;
(function (ORDER_STATUS) {
    ORDER_STATUS["PENDING"] = "pending";
    ORDER_STATUS["COMPLETED"] = "completed";
    ORDER_STATUS["CANCELLED"] = "cancelled";
})(ORDER_STATUS || (exports.ORDER_STATUS = ORDER_STATUS = {}));
class OrderInstance extends sequelize_1.Model {
}
exports.OrderInstance = OrderInstance;
OrderInstance.init({
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    userId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    artworkId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    artistId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(ORDER_STATUS)),
        allowNull: false
    },
    paymentReference: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    checkoutUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    isPaid: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize: db_1.default,
    tableName: "order"
});
OrderInstance.belongsTo(userModel_1.UserInstance, { foreignKey: "userId", as: "user", constraints: false });
OrderInstance.belongsTo(artworkModel_1.default, { foreignKey: "artworkId", as: "artwork", constraints: false });
