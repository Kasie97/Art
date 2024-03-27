import { DataTypes, Model } from "sequelize";
import db from "../db/index";
import { UUID } from "crypto";

export enum PaymentStatus {
    PAID = 'Paid',
    PENDING = 'Pending',
  } 

export interface CartAttributes {
    id: string;
    artworks: string;
    userID: string;
    status: PaymentStatus;
  }
   
  export class CartInstance extends Model<CartAttributes> {}
   
  CartInstance.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
			allowNull: false,
        },

        artworks: {
            type: DataTypes.STRING,
            allowNull: true,
            get() {
                const artworksValue = this.getDataValue('artworks');
                return artworksValue ? artworksValue.split(',') : [];
            },
            set(value:string[]) {
              this.setDataValue('artworks', value.join(','));
            },
          },

          userID: {
            type: DataTypes.STRING,
            allowNull: false
          },
          status: {
            type: DataTypes.ENUM(...Object.values(PaymentStatus)),
            allowNull: true
          },
  },

  {sequelize: db, tableName: "cart"}
  );
