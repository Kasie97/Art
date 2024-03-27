"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const node_http_1 = require("node:http");
dotenv_1.default.config();
const app_1 = __importDefault(require("../app"));
const db_1 = __importDefault(require("../db"));
const server = (0, node_http_1.createServer)(app_1.default);
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 5000;
db_1.default.sync().then(() => {
    console.log("Connected to MySql");
});
server.listen(port, () => {
    console.log(`Server running on port: ${port} `);
});
