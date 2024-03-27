import { DataTypes, Model } from "sequelize";
import db from "../db/index";
import { UUID } from "crypto";
import { ArtworkInstance } from "./artworkModel";
import { UserInstance } from "./userModel";


export interface BidAtributes {
	id: string;
	artworkID: string;
	bidderID: string;
	bidTime: string;
	price: number;
}

export class BidInstance extends Model<BidAtributes> {}

BidInstance.init(
	{
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
			allowNull: false,
		},

		artworkID: {
			type: DataTypes.STRING,
			allowNull: false,

		},

		bidderID: {
			type: DataTypes.STRING,
			allowNull: false,

		},

		bidTime: {
			type: DataTypes.DATE,
			allowNull: false,

		},

		price: {
			type: DataTypes.INTEGER,
			allowNull: false,

		},
	},
	{ sequelize: db, tableName: "bid" }
);