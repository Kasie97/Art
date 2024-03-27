import { DataTypes, Model } from "sequelize";
import db from "../db/index";
import { UUID } from "crypto";
import { ArtworkInstance } from "./artworkModel";

export interface WinnersAtributes {
	id: string;
	artworkId: string;
	bidderID: string;
	price: number;
    bidTime: string;

}

export class WinnersInstance extends Model<WinnersAtributes> {}

WinnersInstance.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },

        artworkId: {
            type: DataTypes.STRING
        },

        bidderID: {
            type: DataTypes.STRING
        },

        price:{
            type: DataTypes.BIGINT
        },

        bidTime:{
            type: DataTypes.DATE
        }
    },
    {sequelize: db, tableName: "winners"}
)

// WinnersInstance.belongsTo(ArtworkInstance, {
//       foreignKey: "artworkID"
//     });