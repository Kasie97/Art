import { DataTypes, Model } from "sequelize";
import db from "../db/index";
import ArtworkInstance from "./artworkModel";

export enum Role {
	User = "User",
	Artist = "Artist",
}

export interface ArtistAttributes {
	id: string;
	firstname: string;
	surname: string;
	email: string;
	phone: string;
	password: string;
	location: string;
	verificationToken: string;
	profilePic: string;
	active: boolean;
	role: Role;
	resetPasswordToken: string;
	otp: number;
	otp_expiry: any;
	birthday: any;
	address: string;
	state: string;
	zipcode: number;
	// likes: string;
}

export class ArtistInstance extends Model<ArtistAttributes> {}

ArtistInstance.init(
	{
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
			allowNull: false,
		},

		firstname: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		surname: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		phone: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		role: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		resetPasswordToken: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		verificationToken: {
			type: DataTypes.STRING,
			allowNull: true,
		},

		location: {
			type: DataTypes.STRING,
			allowNull: true,
		},

		profilePic: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		active: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},

		otp: {
			type: DataTypes.STRING,
			allowNull: true,
		},

		otp_expiry: {
			type: DataTypes.DATE,
			allowNull: true,
		},

		birthday: {
			type: DataTypes.DATE,
			allowNull: true,
		},

		address: {
			type: DataTypes.STRING,
			allowNull: true,
		},

		state: {
			type: DataTypes.STRING,
			allowNull: true,
		},

		zipcode: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
	},
	{ sequelize: db, tableName: "artist" }
);

ArtworkInstance.belongsTo(ArtistInstance, { foreignKey: "artistID", as: "artist", constraints: false });
ArtistInstance.hasMany(ArtworkInstance, { foreignKey: "artistID", as: "artworks", constraints: false });

export default ArtistInstance;

