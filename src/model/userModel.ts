import { DataTypes, Model } from "sequelize";
import db from "../db/index";
import { UUID } from "crypto";
import { CartInstance } from "./cartModel";
import { BidInstance } from "./bidModel";
import { WinnersInstance } from "./winnersModel";

export enum Role {
	User = "User",
	Artist = "Artist",
}

export interface User {
	id: string;
	firstname: string;
	surname: string;
	profilePic: string,
	email: string;
	phone: string;
	password: string;
	role: Role;
	verificationToken: string;
	active: boolean;
	googleId: string;
	resetPasswordToken: string;
	otp: number;
	otp_expiry: any;
	birthday: any;
	address: string;
	state: string;
	zipcode: number;

}

export class UserInstance extends Model<User> {
    address: any;
    state: any;
    zipcode: any;
  id: any;
  firstname: any;
  surname: any;
}

UserInstance.init(
	{
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
			allowNull: false,
		},
		firstname: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		surname: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},

		profilePic: {
			type: DataTypes.STRING,
			allowNull: true
		},

		phone: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		role: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: true,
		},

		verificationToken: { 
			type: DataTypes.STRING, 
			allowNull: true 
		},

		active: { 
			type: DataTypes.BOOLEAN, 
			defaultValue: false 
		},

		googleId: {
			type: DataTypes.STRING,
			allowNull: true,
		},

		resetPasswordToken: {
			type: DataTypes.STRING,
			allowNull: true,
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
			type: DataTypes.BIGINT,
			allowNull: true,
		},
	},
	{ sequelize: db, tableName: "user" }
);
UserInstance.hasMany( BidInstance, {foreignKey: 'bidderID', as: 'bid', constraints: false});
BidInstance.belongsTo( UserInstance, { foreignKey: 'bidderID', as: 'user', constraints: false});

// UserInstance.hasMany( CartInstance, {foreignKey: 'userID', as: 'cart'});
// CartInstance.belongsTo( UserInstance, { foreignKey: 'userID', as: 'user'});


// UserInstance.hasMany( WinnersInstance, {foreignKey: 'bidderID', as: 'winners'});
// WinnersInstance.belongsTo( UserInstance, { foreignKey: 'bidderID', as: 'user'});