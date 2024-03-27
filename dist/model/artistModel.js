"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtistInstance = exports.Role = void 0;
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("../db/index"));
const artworkModel_1 = __importDefault(require("./artworkModel"));
var Role;
(function (Role) {
    Role["User"] = "User";
    Role["Artist"] = "Artist";
})(Role || (exports.Role = Role = {}));
class ArtistInstance extends sequelize_1.Model {
}
exports.ArtistInstance = ArtistInstance;
ArtistInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    firstname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    surname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    resetPasswordToken: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    verificationToken: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    location: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    profilePic: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
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
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
}, { sequelize: index_1.default, tableName: "artist" });
artworkModel_1.default.belongsTo(ArtistInstance, { foreignKey: "artistID", as: "artist", constraints: false });
ArtistInstance.hasMany(artworkModel_1.default, { foreignKey: "artistID", as: "artworks", constraints: false });
exports.default = ArtistInstance;
