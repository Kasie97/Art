"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const UserLogin_1 = require("../controller/UserLogin");
const router = express_1.default.Router();
router.get('/auth', (req, res) => {
    console.log("Hello");
    res.send('<a href="/google">Sign in with google</a>');
});
router.get('/', passport_1.default.authenticate('google', {
    scope: ['email', 'profile']
}));
router.get('/callback', passport_1.default.authenticate('google', {
    failureRedirect: '/google/failed',
    successRedirect: 'http://localhost:5173/dashboard'
}));
router.get("/failed", (req, res) => {
    res.send("Failed");
});
router.get("/success", UserLogin_1.googleLog);
exports.default = router;
