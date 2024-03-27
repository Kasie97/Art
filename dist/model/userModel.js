"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInstance = exports.Role = void 0;
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("../db/index"));
const bidModel_1 = require("./bidModel");
var Role;
(function (Role) {
    Role["User"] = "User";
    Role["Artist"] = "Artist";
})(Role || (exports.Role = Role = {}));
class UserInstance extends sequelize_1.Model {
}
exports.UserInstance = UserInstance;
UserInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    firstname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    surname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    profilePic: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    verificationToken: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    googleId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    resetPasswordToken: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    otp: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    otp_expiry: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    birthday: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    state: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    zipcode: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: true,
    },
}, { sequelize: index_1.default, tableName: "user" });
UserInstance.hasMany(bidModel_1.BidInstance, { foreignKey: 'bidderID', as: 'bid', constraints: false });
bidModel_1.BidInstance.belongsTo(UserInstance, { foreignKey: 'bidderID', as: 'user', constraints: false });
// UserInstance.hasMany( CartInstance, {foreignKey: 'userID', as: 'cart'});
// CartInstance.belongsTo( UserInstance, { foreignKey: 'userID', as: 'user'});
// UserInstance.hasMany( WinnersInstance, {foreignKey: 'bidderID', as: 'winners'});
// WinnersInstance.belongsTo( UserInstance, { foreignKey: 'bidderID', as: 'user'});
