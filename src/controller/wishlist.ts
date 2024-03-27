import express, { Response, Request, NextFunction } from "express";
import { ArtistInstance } from "../model/artistModel";
import { ArtworkInstance, ArtClass, ArtworkAtributes } from "../model/artworkModel";
import { BidInstance } from "../model/bidModel";
import { CategoryInstance } from "../model/categoryModel";
import { UserInstance } from "../model/userModel";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import { AuctionInstance } from "../model/auctionModel";
import { sendNotification } from "./auctionController";
import { RecipientType } from "../model/notify";

// Endpoint to list all artworks in a category

// List all on going auctions
export const liveAuctions = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const ongoingAuct = await AuctionInstance.findAll({
			where: { status: "Live" },
			include: [
				{
					model: ArtworkInstance,
					as: "artwork",
					include: [
						{
							model: ArtistInstance,
							as: "artist",
							// attributes: ["id", "firstName", "lastName"],
						},
						{
							model: BidInstance,
							as: "bid",
							order: [[ "bidTime", "DESC" ]],
							include: [
								{
									model: UserInstance,
									as: "user",
								},
							],
							
						},
					],
				},
			],
		});
		if (ongoingAuct.length > 0) {
			return res.status(201).json({ msg: "Live Auction fetched successfully", data: ongoingAuct});
		} else {
			return res.status(404).json({ msg: "No ongoing auctions found"});
		}
	} catch (err) {
		console.log(err);
		throw new Error("Internal Server Error");
	}
};

// List all on going auctions
export const upcomingAuctions = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const upcomingAuct = await AuctionInstance.findAll({
			where: { status: "Upcoming" },
			include: [
				{
					model: ArtworkInstance,
					as: "artwork",
					include: [
						{
							model: ArtistInstance,
							as: "artist",
							// attributes: ["id", "firstName", "lastName"],
						},
						{
							model: BidInstance,
							as: "bid",
							include: [
								{
									model: UserInstance,
									as: "user",
								},
							],
							
						},
					],
				},
			],
		});
		if (upcomingAuct.length > 0) {
			return res.status(201).json({ msg: "Live Auction fetched successfully", data: upcomingAuct});
		} else {
			return res.status(404).json({ msg: "No ongoing auctions found"});
		}
	} catch (err) {
		console.log(err);
		throw new Error("Internal Server Error");
	}
};



// End point to get artwork details

//this code return artwork details from the database using the id
export const artworkDetails = async (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id;

	try {
		const artwork = await ArtworkInstance.findAll({ where: { id: id } });
		return res.status(201).json({ msg: "Artwork details fetched successfully", artwork });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};



// //Endpoint to list all bids for a specific artwork
// export const artworkBids = async (req: Request, res: Response, next: NextFunction) => {
// 	const artworkId = req.params.id;
// 	try {
// 		console.log("Fine", artworkId)
// 		//Find the artwork with associated bids
// 		const artworkWithBids = await ArtworkInstance.findByPk(artworkId
//       , {
//       include: [ { model: BidInstance, as: "bid" }]
//     })
// 		const user = await BidInstance.findAndCountAll({ 
// 			where:{artworkID:artworkId},
// 			include: [
// 				{
// 					model: UserInstance,
// 					as: "user",
// 					// attributes: ["id", "firstName", "lastName"],
// 				},
// 			],
// 			order: [['bidTime', 'DESC']], 

// 		})
//     return res.status(200).json({ 
// 		msg: "All bids for a specific artwork fetched successfully", 
// 		data: artworkWithBids,
// 		bids:user.rows
// 	});
  
  
// 	} catch (error) {
// 		console.error(error);
// 		return res.status(500).json({
// 			error: "Internal Server Error",
// 		});
// 	}
// };

export const artworkBids = async (req: Request, res: Response, next: NextFunction) => {
	const artworkId = req.params.id;
	try {
	  console.log("Fine", artworkId);
  
	  // Find the artwork with associated bids
	  const artworkWithBids = await ArtworkInstance.findByPk(artworkId, {
		include: [{ model: BidInstance, as: "bid", order: [['bidTime', 'DESC']] }],
	  });
  
	  if (!artworkWithBids) {
		return res.status(404).json({ error: 'Artwork not found' });
	  }
  
	  // Extract bids from the loaded associations
	  const bids = artworkWithBids?.get('bid') as BidInstance[];
  
	  return res.status(200).json({
		msg: 'All bids for a specific artwork fetched successfully',
		data: artworkWithBids,
		bids,
	  });
  
	} catch (error) {
	  console.error(error);
	  return res.status(500).json({
		error: 'Internal Server Error',
	  });
	}
  };
  



// End point to Create bids
export const creatingBids = async (req: Request, res: Response, next: NextFunction) => {
	const uuid = uuidv4();
	const auctionId = req.params.auctionId;
	const { price } = req.body;
	const { id } = req.user as { [key: string]: string };

	console.log("bid controller", auctionId, price, id);

	try {
		// Check if the user exists
		console.log("bid controller", auctionId, price, id);
		const user = await UserInstance.findOne({ where: { id: id } });
		
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Check if the auction exists
		const auction = await AuctionInstance.findOne({ where: { id: auctionId } });
		if (!auction) {
			return res.status(404).json({ error: "Auction not found" });
		}

		const isAuctionLive = auction.dataValues.status === "Live";

		// Check if the auction is live
		if (!isAuctionLive) {
			return res.status(404).json({ error: "Auction is not live" });
		}

		// Check if the bid amount is greater than the current price
		if (price <= auction?.dataValues?.currentPrice) {
			return res.status(400).json({ error: "Bid amount is less than the current price" });
		}

		// Check if the bidder exists, then update the bidding amount
		let bidder = await BidInstance.findOne({ where: { bidderID: id, artworkID: auctionId } });
		if (bidder) {
			// Update bidding amount of the existing bidder
			const updatedBidder = await BidInstance.update({ price: price }, { where: { bidderID: id, artworkID: auctionId } });

			if (!updatedBidder) {
				return res.status(500).json({ error: "Failed to update bidder" });
			}

			const updateAuctionCurrentPrice = await AuctionInstance.update({ currentPrice: price }, { where: { id: auctionId } });

			if (!updateAuctionCurrentPrice) {
				return res.status(500).json({ error: "Failed to update Auction current price" });
			}
			const theId = auction.dataValues.artworkId
			const update = await ArtworkInstance.findOne({
				where:{id:theId}
			}) 

			const bids = await BidInstance.findAndCountAll({
				where:{ artworkID:auction.dataValues.artworkId},
				include: [
					{
						model: UserInstance,
						as: "user",
					},
				],
				order: [['bidTime', 'DESC']],
			})

			return res.status(201).json({ 
				msg: "Bid created successfully", 
				bids: bids.rows,
				user:user.dataValues
			 });
		}

		// Check if the bid amount is greater than the current price
		if (price > auction?.dataValues?.currentPrice) {
			// Create a new bidder
			console.log("Done...",auction.dataValues.artworkId)
			const bidder = await BidInstance.create({
				id: uuid,
				bidderID: id,
				artworkID: auction.dataValues.artworkId,
				bidTime: new Date(),
				...req.body,
			});

			if (!bidder) {
				return res.status(500).json({ error: "Failed to create bidder" });
			}

			const updateAuctionCurrentPrice = await AuctionInstance.update({ currentPrice: price }, { where: { id: auctionId } });

			if (!updateAuctionCurrentPrice) {
				return res.status(500).json({ error: "Failed to update Auction current price" });
			}
			console.log("Hello...")
			const bids = await BidInstance.findAndCountAll({
				where:{ artworkID:auction.dataValues.artworkId},
				include: [
					{
						model: UserInstance,
						as: "user",
					},
				],
				order: [['bidTime', 'DESC']],
			})
			console.log(user.dataValues,bids.count)

			return res.status(201).json({ 
				msg: "Bid created successfully",
				count:bids.count,
				bids:bids.rows,
				user:user.dataValues
			});
		}
		return res.status(500).json({ error: "Failed to create bidder" });
	} catch (error) {
		console.error("Error:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};