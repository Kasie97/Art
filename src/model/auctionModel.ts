import { DataTypes, Model } from "sequelize";
import db from "../db";
import ArtworkInstance from "./artworkModel";

export enum Status {
	UPCOMING = "Upcoming",
	LIVE = "Live",
	ENDED = "Ended",
}

export interface Bidder {
	id: string;
	bidPrice: number;
	winner: boolean;
}

export interface AuctionAttributes {
	id: string;
	artworkId: string;
	startingPrice: number;
	currentPrice: number;
	status: Status;
	startDate: Date;
	endDate: Date;
	bidders: Bidder[];
}

export class AuctionInstance extends Model<AuctionAttributes> {}

AuctionInstance.init(
	{
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			primaryKey: true,
		},
		artworkId: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		startingPrice: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		currentPrice: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		status: {
			type: DataTypes.ENUM(...Object.values(Status)),
			allowNull: false,
		},
		startDate: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		endDate: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		bidders: {
			type: DataTypes.JSON,
			allowNull: true,
			defaultValue: [],
		},
	},
	{
		sequelize: db,
		tableName: "auction",
	}
);

export default AuctionInstance;