import { DataTypes, Model } from "sequelize";
import db from "../db/index";

export interface NotificationAttributes {
  id: string;
  message: string;
  recipient: string;
}

export enum RecipientType {
  ARTIST = "artist",
  USER = "user",
  ALL = "all"
}

export class NotifyInstance extends Model<NotificationAttributes> {}

NotifyInstance.init(
  {
    id: {
      type: DataTypes.STRING,

      primaryKey: true,

      allowNull: false,
    },

    message: {
      type: DataTypes.STRING,

      allowNull: false,
    },

    recipient: {
      type: DataTypes.ENUM(...Object.values(RecipientType)),

      allowNull: false,
    },
  },
  {
    sequelize: db,

    tableName: "Notifications",
  }
);