import express from 'express';
import { userAuth } from "../middlewares/userAuth";
import { Auction } from '../controller/auction';

const router = express.Router()

router.post("/winner",  Auction)

export default router