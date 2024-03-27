import { DataTypes, Model } from "sequelize";
import db from "../db";
import { PaymentInstance } from "./paymentModel";
import { UserInstance } from "./userModel";
import ArtworkInstance from "./artworkModel";

export interface Order{
    id:string;
    userId:string;
    artworkId:string;
    artistId:string;
    quantity:number;
    status:string;
    paymentReference:string;
    price:number;
    checkoutUrl:string;
    isPaid:boolean
}

export enum ORDER_STATUS{
    PENDING = "pending",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}

export class OrderInstance extends Model<Order>{}


OrderInstance.init({
    id:{
        type:DataTypes.STRING,
        primaryKey:true,
        allowNull:false
    },
    userId:{
        type:DataTypes.STRING,
        allowNull:false
    },
    artworkId:{
        type:DataTypes.STRING,
        allowNull:false
    },
    artistId:{
        type:DataTypes.STRING,
        allowNull:false
    },
    quantity:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    status:{
        type:DataTypes.ENUM(...Object.values(ORDER_STATUS)),
        allowNull:false
    },
    paymentReference:{
        type:DataTypes.STRING,
        allowNull:false
    },
    price:{
        type:DataTypes.STRING,
        allowNull:false
    },
    checkoutUrl:{
        type:DataTypes.STRING,
        allowNull:false
    },
    isPaid:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:false
    }
}, {
    sequelize:db,
    tableName:"order"
})



OrderInstance.belongsTo(UserInstance, {foreignKey:"userId", as:"user", constraints:false})

OrderInstance.belongsTo(ArtworkInstance, {foreignKey:"artworkId", as:"artwork", constraints:false})