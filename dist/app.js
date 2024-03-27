"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
require("./controller/googleAuth");
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const googleAuth_1 = __importDefault(require("./route/googleAuth"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const morgan_1 = __importDefault(require("morgan"));
const artwork_1 = __importDefault(require("./route/artwork"));
const bidWinner_1 = __importDefault(require("./route/bidWinner"));
const users_1 = __importDefault(require("./route/users"));
const cart_1 = __importDefault(require("./route/cart"));
const art_1 = __importDefault(require("./route/art"));
const auction_1 = __importDefault(require("./route/auction"));
const auctionController_1 = require("./controller/auctionController");
const node_cron_1 = __importDefault(require("node-cron"));
const deliveryService_1 = __importDefault(require("./route/deliveryService"));
const artist_1 = __importDefault(require("./route/artist"));
const payment_1 = __importDefault(require("./route/payment"));
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use("/google", googleAuth_1.default);
app.use("/users", users_1.default);
app.use("/artwork", artwork_1.default);
app.use("/cart", cart_1.default);
app.use("/art", art_1.default);
app.use("/bid", bidWinner_1.default);
app.use("/art", art_1.default);
app.use("/delivery", deliveryService_1.default);
app.use("/auction", auction_1.default);
app.use("/artist", artist_1.default);
app.use("/payment", payment_1.default);
node_cron_1.default.schedule("* * * * *", auctionController_1.updateAuctionStatus);
exports.default = app;
