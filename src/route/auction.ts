import express from "express";
import { artistAuth } from "../middlewares/artistAuth";
import { createAuction, deleteAuction, getAuctions } from "../controller/auctionController";

const router = express.Router();

router.post('/create-auction/:artworkId', artistAuth, createAuction)
router.get('/get-auctions', getAuctions);
router.delete("/delete-auction/:id", artistAuth, deleteAuction)

export default router;