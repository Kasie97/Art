import { DataTypes, Model } from "sequelize";
import db from "../db/index";
import AuctionInstance from "./auctionModel";
import ArtistInstance from "./artistModel";
import { BidInstance } from "./bidModel";

export enum ArtClass {
	AUCTION = "Auction",
	SALE = "Sale",
}

export enum Category {
	LANDSCAPE = "Landscape",
	PORTRAIT = "Portrait",
	ANCIENCT = "Ancient",
	MODERN = "Modern",
	OIL_ON_CANVAS = "Oil on Canvas",
	PEN_AND_INK = "Pen and Ink",
	NATURE = "Nature",
	DIGITAL_PAINT = "Digital Paint",
}

export enum Status {
	UPCOMING = "Upcoming",
	LIVE = "Live",
	ENDED = "Ended",
}

export interface ArtworkAtributes {
	id: string;
	artName: string;
	description: string;
	artistID: string;
	soldOut: boolean;
	artClass: ArtClass;
	imageUrl: string;
	category: Category;
	price: number;
}

export class ArtworkInstance extends Model<ArtworkAtributes> {}

ArtworkInstance.init(
	{
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
			allowNull: false,
		},

		artName: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		description: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		artistID: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		// artistID: {
		// 	type: DataTypes.UUID,
		// 	references: {
		// 		model: "ArtistInstance",
		// 		key: "id",
		// 	},
		// },

		soldOut: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},

		artClass: {
			type: DataTypes.ENUM(...Object.values(ArtClass)),
			allowNull: false,
		},

		imageUrl: {
			type: DataTypes.STRING,
		},

		category: {
			type: DataTypes.ENUM(...Object.values(Category)),
			allowNull: false,
		},

		price: {
			type: DataTypes.INTEGER,
		},
	},
	{ sequelize: db, tableName: "artwork" }
);

AuctionInstance.belongsTo(ArtworkInstance, { foreignKey: "artworkId", as: "artwork", constraints: false });

ArtworkInstance.hasMany(BidInstance, { foreignKey: "artworkID", as: "bid", constraints: false });

BidInstance.belongsTo(ArtworkInstance, { foreignKey: "artworkID", as: "artwork", constraints: false });

export default ArtworkInstance;