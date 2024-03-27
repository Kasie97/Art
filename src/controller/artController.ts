import { Request, Response } from "express";
import { ArtistInstance } from "../model/artistModel";
import { ArtworkAtributes, ArtworkInstance } from "../model/artworkModel";
import { v4 as uuidv4 } from "uuid";
import { sendNotification } from "./auctionController";
import { RecipientType } from "../model/notify";
import AuctionInstance from "../model/auctionModel";

interface User {
	id: string;
}
export const CreateArt = async (req: Request, res: Response) => {
	try {
		const uuid = uuidv4();

		const { id } = req.user as { [key: string]: string };

		const addArt = (await ArtworkInstance.create({ id: uuid, artistID: id, ...req.body })) as unknown as ArtworkAtributes;
		await sendNotification(`${addArt.artName} was just added`, RecipientType.ALL);
		return res.status(201).json({ msg: "Art created successfully" });
	} catch (err) {
		console.log(err);
		return res.status(400).json({ err: "internal server error" });
	}
};

export const getAllArtworks = async (req: Request, res: Response) => {
	try {
		const allArtworks = await ArtworkInstance.findAndCountAll({
			include: [
				{
					model: ArtistInstance,
					as: "artist",
				},
			],
		});

		return res.status(200).json({
			message: "Artworks Retrieved Successfully",
			count: allArtworks.count,
			data: allArtworks.rows,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

export const deleteArt = async (req: Request, res: Response) => {
	try {
	  const { id } = req.params;
	  const art = await ArtworkInstance.findOne({ where: { id: id } });
  
	  if (!art) {
		return res.status(400).json({
		  msg: "art does not exist",
		});
	  }
	  const deleteArt = await art.destroy();
	  return res.status(200).json({
		msg: "You have deleted an art",
		deleteArt,
	  });
	} catch (error) {
	  console.log(error);
	}
  };

export const getOneArt = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const art = await ArtworkInstance.findOne({
			where: { id },
			include: [
				{
					model: ArtistInstance,
					as: "artist",
				},
			],
		});

		if (art) {
			return res.status(200).json({ message: "Successfully", data: art });
		}
	} catch (err) {
		console.log(err);
	}
};

export const artworksOnSale = async (req: Request, res: Response) => {
	try {
		const allArtworks = await ArtworkInstance.findAndCountAll({
			include: [
				{
					model: ArtistInstance,
					as: "artist",
				},
			],
		});

		const sales = allArtworks.rows.filter((art) => art._model.dataValues.artClass === "Sale");

		return res.status(200).json({
			message: "Artworks Retrieved Successfully",
			count: sales.length,
			data: sales,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

export const artworksOnAuction = async (req: Request, res: Response) => {
	try {
		const allArtworks = await ArtworkInstance.findAndCountAll({
			include: [
				{
					model: ArtistInstance,
					as: "artist",
				},
				{
					model: AuctionInstance,
					as: "auction",
				},
			],
		});

		const auction = allArtworks.rows.filter((art) => art._model.dataValues.artClass === "Auction");

		return res.status(200).json({
			message: "Artworks Retrieved Successfully",
			count: auction.length,
			data: auction,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

// Get all artworks by a particular artist

export const getArtByArtist = async (req: Request, res: Response) => {
	try {
		const { id } = req.user as User;

		const art = await ArtworkInstance.findAll({
			where: { artistID: id },
			include: [
				{
					model: ArtistInstance,
					as: "artist",
				},
			],
		});

		if (art) {
			return res.status(200).json({ message: "Successfully", data: art });
		}
	} catch (err) {
		console.log(err);
	}
};