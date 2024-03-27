import express, { Request, Response } from "express";
import {  ArtistInstance } from "../model/artistModel";
import { OrderInstance } from "../model/orderModel";
import { UserInstance } from "../model/userModel";
import ArtworkInstance from "../model/artworkModel";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { changePasswordSchema, option, updateProfileSchema } from "../utils/validation/UserValidation";
import cloudinary from "../lib/helper/cloudinary";

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET as string;

export const getAllArtists = async (req: Request, res: Response) => {
    try {
      // Fetch all artists
      const artists = await ArtistInstance.findAll();
  
      // Send the response
      res.json({
        message: "All artists retrieved successfully",
        artists,
      });
    } catch (error: any) {
      console.error(error);
  
      // Handle other errors
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  };

  export const getArtist = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const artist = await ArtistInstance.findOne({
        where: { id },
      });
  
      if (!artist) {
        return res.status(404).json({ message: "Artist not found" });
      }
      return res
        .status(200)
        .json({ message: "Artist retrived successfully", artist });
    } catch (err) {
      console.log(err);
    }
  };



  export const getOneOrder = async (req: Request, res: Response) => {
    try {
      const {id} = req.params as { [key: string]: string };
  
      const values = await OrderInstance.findAndCountAll({
        where:{artworkId:id},
        include: [
                  {
                      model: UserInstance,
                      as: "user",
                  },
                  {
                    model: ArtworkInstance,
                    as: "artwork",
                  },
              ],
      })
      if(!values){
        return res.status(404).json({error: "No Order Found  "})
      }
      console.log(values)
      const uid = values.rows[0].dataValues.userId
      const artId = values.rows[0].dataValues.artworkId
      const user = await UserInstance.findByPk(uid)
      const art = await ArtworkInstance.findByPk(artId)
      const order = values
      console.log(art)
      return res.status(200).json({
        message:"Order retrieved successfully",
        order:values.rows[0],
        user:user,
        art:art
      })
  
    } catch (error) {
      console.log(error)
    }
  }
  
  export const getAllOrders = async (req: Request, res: Response) => {
    try {
      const {id} = req.user as { [key: string]: string };
  
      const orderList = await OrderInstance.findAndCountAll({
        where:{artistId:id},
        include: [
                  {
                      model: UserInstance,
                      as: "user",
                  },
                  {
                    model: ArtworkInstance,
                    as: "artwork",
                  },
              ],
        order: [['createdAt', 'DESC']]
      })
      if(!orderList){
        return res.status(404).json({error: " No orders yet "})
      }
  
      return res.status(200).json({
        message:"Orders fetched successfully",
        count:orderList.count,
        list:orderList.rows
      })
  
    } catch (error) {
      console.log(error)
    }
  }
  



export const updateArtist = async (req : Request, res : Response) => {
  try {
    
    const { token } = req.params;
    const validateArtist = updateProfileSchema.validate(req.body, option);

    if (validateArtist.error) {
      return res.status(400).json({ Error: validateArtist.error.details[0].message });
    }

    const decodedToken = jwt.verify(token, jwtSecret);

    if (!decodedToken) {
      return res.status(401).json({
        error: "Invalid or expired token",
      });
    }

    const artistId = decodedToken as unknown as { [key: string]: string };
    const artistInfo = await ArtistInstance.findOne({ where: { id: artistId.id } });

    if (!artistInfo) {
      return res.status(404).json({ Error: "Artist profile not found" });
    } else {
      const artistUpdate = await artistInfo.update(req.body);
      return res.status(200).json({ msg: "Artist updated successfully", artistUpdate });
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const changeArtistPassword = async (req : Request, res : Response) => {
    try {
      const { token } = req.params;
      const validateUser = changePasswordSchema.validate(req.body, option);
  
      if (validateUser.error) {
        return res.status(400).json({ Error: validateUser.error.details[0].message });
      }
  
      const decodedToken = jwt.verify(token, jwtSecret);
  
      if (!decodedToken) {
        return res.status(401).json({
          error: "Invalid or expired token",
        });
      }
  
      const artistId = decodedToken as unknown as { [key: string]: string };
      const artistInfo = await ArtistInstance.findOne({ where: { id: artistId.id } });
  
      if (!artistInfo) {
        return res.status(404).json({ Error: "Artist profile not found" });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.newPassword, salt);
  
      const artistUpdate = await artistInfo.update({ password: hashed });
  
      return res.status(200).json({ msg: "Password Changed Successfully", artistUpdate });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
  
  export const uploadImage = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(500).json({ error: "no file uploaded" });
      }
      const imageUpload = await cloudinary.uploader.upload(req.file.path);
      res.status(200).json({ imageUrl: imageUpload.secure_url });
    } catch (error) {
      res.status(500).json({ error: "image upload failed" });
    }
  };
