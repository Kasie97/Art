import express, { Request, Response } from 'express';
import { upcomingAuctions, artworkDetails, artworkBids, creatingBids, liveAuctions } from '../controller/wishlist'
import { auth } from '../middlewares/auth';


const router = express.Router();

router.get('/live-auctions', liveAuctions);
router.get('/upcoming-auctions', upcomingAuctions);
router.get('/list-bids/:id', artworkBids); 
router.get('/:id', artworkDetails);
router.post('/create-bids/:auctionId' ,auth, creatingBids); 



export default router;