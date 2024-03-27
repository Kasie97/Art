"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const file = path_1.default.join(__dirname, "../..", "certificate.pem");
const file2 = path_1.default.join(__dirname, "../../", "private-key.pem");
const sequelize = new sequelize_1.Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    ssl: true,
    dialectOptions: {
        ssl: {
            key: fs_1.default.readFileSync(file2),
            cert: fs_1.default.readFileSync(file),
        },
    },
});
exports.default = sequelize;
