import { DataTypes, Model } from "sequelize";
import db from "../db/index";
import { PaymentStatus } from "./cartModel";


export interface PaymentAttributes {
  id: string;
  artworks: string;
  userID: string;
  status: PaymentStatus;
  reference: string;
}
 
export class PaymentInstance extends Model<PaymentAttributes> {
    static find() {
        throw new Error("Method not implemented.");
    }
}
 
PaymentInstance.init(
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
          
        },

        status: {
          type: DataTypes.ENUM(...Object.values(PaymentStatus)),
          allowNull: true
        },
        reference: {
          type: DataTypes.STRING,
          allowNull: true
        },
},
{sequelize: db, tableName: "payment"}
);
