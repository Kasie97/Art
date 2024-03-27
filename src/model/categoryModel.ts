import { DataTypes, Model } from "sequelize";
import db from "../db/index";
import { ArtworkInstance } from "./artworkModel";
import { UUID } from "crypto";

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

export interface CategoryAtributes {
	id: string;
	name: Category;
	sub_categories: string[];
	artworkID: string;
}

export class CategoryInstance extends Model<CategoryAtributes> {}

CategoryInstance.init(
	{
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
		},

		name: {
			type: DataTypes.ENUM,
		},

		sub_categories: {
			type: DataTypes.ARRAY(DataTypes.STRING),
		},

		artworkID: {
			type: DataTypes.STRING,
		},
	},

	{ sequelize: db, tableName: "category" }
);

//Define Association
// CategoryInstance.hasMany( ArtworkInstance, {foreignKey: 'categoryID'});
// ArtworkInstance.belongsTo( CategoryInstance, { foreignKey: 'categoryID'});