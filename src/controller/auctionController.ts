import { Request, Response } from "express";
import { AuctionSchema } from "../utils/validation/auctionValidation";
import { Auction } from "./auction";
import { AuctionAttributes, AuctionInstance, Status } from "../model/auctionModel";
import { v4 as UUIDV4 } from "uuid";
import ArtistInstance from "../model/artistModel";
import { Op, UUID } from "sequelize";
import { NotifyInstance, RecipientType } from "../model/notify";
import ArtworkInstance from "../model/artworkModel";

export const createAuction = async (req: Request, res: Response) => {
	try {
		const { artworkId } = req.params;

    const { error, value } = AuctionSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }
    console.log("myyy",artworkId)

		const artwork = await ArtworkInstance.findOne({ where: { id: artworkId } });
		if (!artwork) {
			return res.status(400).json({
				error: "Artwork does not exist",
			});
		}
		if (artwork?.dataValues.artClass === "Sale") {
			return res.status(400).json({
				error: "Cannot create auction for artwork on sale",
			});
		}

		const auction = await AuctionInstance.findOne({
			where: {
				artworkId,
			},
		});

		if (auction) {
			return res.status(400).json({
				error: "Auction Already exist",
			});
		}

		await AuctionInstance.create({
			id: UUIDV4(),
			artworkId,
			status: Status.UPCOMING,
			...value,
		});

		return res.status(201).json({
			message: "auction created successfully",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: "Error Creating Auction",
		});
	}
};

export const getAuctions = async (req: Request, res: Response) => {
	try {
		const allAuctions = await AuctionInstance.findAndCountAll({
			include: [
				{
					model: ArtworkInstance,
					as: "artwork",
					include: [
						{
							model: ArtistInstance,
							as: "artist",
						},
					],
				},
			],
		});

		return res.status(200).json({
			message: "auction successfully fetched",
			count: allAuctions.count,
			data: allAuctions.rows,
		});
	} catch (error) {
		return res.status(500).json({
			error: "error fetching auctions",
		});
	}
};

export const deleteAuction = async (req: Request, res: Response) => {
	try {
	  const { id } = req.params;
	  const auction = await AuctionInstance.findOne({ where: { id: id } });
  
	  if (!auction) {
		return res.status(400).json({
		  msg: "auction does not exist",
		});
	  }
	  const deletedAuction = await auction.destroy();
	  return res.status(200).json({
		msg: "You have deleted an auction",
		deletedAuction,
	  });
	} catch (error) {
	  console.log(error);
	}
  };

export const sendNotification = async (message: string, recipient: string) => {
	try {
		console.log(message);
		return await NotifyInstance.create({ id: UUIDV4(), message, recipient });
	} catch (error) {
		console.error("Error sending notification:", error);
		throw error;
	}
};

export const getNotificationForUser = async (req: Request, res: Response) => {
	try {
		const { page = 1, pageSize = 10 } = req.query;

		const offset = (Number(page) - 1) * Number(pageSize);

		const notifications = await NotifyInstance.findAndCountAll({
			where: {
				recipient: { [Op.in]: [RecipientType.USER, RecipientType.ALL] },
			},
			limit: Number(pageSize),
			offset: offset,
		});

		return res.status(200).json({
			message: "You have all sent notifications",
			currentPage: Number(page),
			totalPages: Math.ceil(notifications.count / Number(pageSize)),
			notifications: notifications.rows,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: "an error occurred",
		});
	}
};

export const updateAuctionStatus = async () => {
	try {
		const auctions = await AuctionInstance.findAll();

		auctions.forEach(async (auction: any) => {
			let status;

			if (new Date(auction.startDate).getTime() >= new Date().getTime()) {
				status = Status.UPCOMING;
			} else if (new Date(auction.startDate).getTime() <= new Date().getTime() && new Date(auction.endDate).getTime() >= new Date().getTime()) {
				status = Status.LIVE;
				await sendNotification(
					`The excitement is happening now! 🎉 Our live auction event is currently underway, and you're invited to join the bidding frenzy. Don't miss your chance to snag incredible artworks and immerse yourself in the thrill of the auction.`,
					RecipientType.USER
				);
			} else {
				status = Status.ENDED;
				await sendNotification(
					`The curtains have closed on our spectacular auction event! 🎨✨ Thank you to everyone who participated and made it a success.`,
					RecipientType.USER
				);

				// const winner = auction.bidders.reduce((prev:any, current:any) => (prev.bidPrice > current.bidPrice) ? prev : current)
				// console.log(winner)
			}

			(await AuctionInstance.update(
				{
					status,
				},
				{
					where: {
						id: auction.id,
					},
				}
			)) as unknown as AuctionInstance;
		});

		console.log("Cron job is scheduled to run every minute");
	} catch (error) {
		return error;
	}
};