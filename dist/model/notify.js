"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotifyInstance = exports.RecipientType = void 0;
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("../db/index"));
var RecipientType;
(function (RecipientType) {
    RecipientType["ARTIST"] = "artist";
    RecipientType["USER"] = "user";
    RecipientType["ALL"] = "all";
})(RecipientType || (exports.RecipientType = RecipientType = {}));
class NotifyInstance extends sequelize_1.Model {
}
exports.NotifyInstance = NotifyInstance;
NotifyInstance.init({
    id: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    message: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    recipient: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(RecipientType)),
        allowNull: false,
    },
}, {
    sequelize: index_1.default,
    tableName: "Notifications",
});
