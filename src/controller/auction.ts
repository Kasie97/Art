import {Request, Response, NextFunction} from 'express';
import { WinnersInstance } from '../model/winnersModel';
import { any } from 'joi';
import { v4 as uuidv4 } from "uuid";
import jwt, { JwtPayload } from "jsonwebtoken";
// import db from "../db/index";


export const Auction = async (req: Request, res: Response, next: NextFunction) => {
    try{

        const userId:any = req.user
        const { artworkID,price, bidTime } = req.body;
        const id = uuidv4();
        const bidWinner = await WinnersInstance.create({ id:id, artworkId:artworkID, bidderID:userId.id, price, bidTime });
        if (bidWinner){
            res.status(200).json({
                message: 'Bid Winner details',
               bidWinner
            })
        }else {
            return res.status(400).json({ error: "No Bid Winner found" });
        };

    }catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
};

 
