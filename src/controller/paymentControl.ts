// import { PaymentAttributes, PaymentInstance } from "../model/paymentModel";
// import { Request, Response } from "express";
// import axios from "axios";
// import { UserInstance } from "../model/userModel";
// import { User } from "../model/userModel";


// export const createPayment = async (args: PaymentAttributes) => {
//     const paystackVerifyUrl = `https://api.paystack.co/transaction/verify/${args.reference}`;
//     const headers = {
//       Authorization: `Bearer ${process.env.API_KEY}`,
//     };
  
//     try {
//       const verify = await axios.get(paystackVerifyUrl, { headers });
//       return verify.data;
//     } catch (error) {
//       return error;
//     }
//   };


// export const getAllPayments = async (req: Request, res: Response) => {
//     try {
//         const all = await PaymentInstance.findAll({
//             //include: [{model: User, as: "user"}]
//           });

//         return res.status(200).json({
//             message: "You have all your payments",
//             all,
//         });
//     } catch (error) {
//         res.status(500).json(error);
//     }
// };


// export const getOneUserPayment = async (req: Request, res: Response) => {
//     try {
//       const one = await PaymentInstance.findByPk(req.params.id);
//       return res.status(200).json({
//         message: "You have your payment",
//         one,
//       });
//     } catch (error) {
//       res.status(500).json(error);
//     }
//   };

  

import { Request, Response } from "express";
import dotenv from 'dotenv'
import { OrderInstance } from "../model/orderModel";
import {v4 as uuidV4} from 'uuid'
import { UserInstance } from "../model/userModel";
import ArtworkInstance from "../model/artworkModel";
import ArtistInstance from "../model/artistModel";
import { v4 as uuidv4 } from "uuid";
import { PaymentInstance } from "../model/paymentModel";
import { PaymentStatus } from "../model/cartModel";
import { sendNotification } from "./auctionController";
import { RecipientType } from "../model/notify";
dotenv.config()

export class PaystackController {

    static async initializePayment(paymentData:any) {
      let errorMessage;
        try{
            const { amount, email, callbackUrl, name } = paymentData;

            const paymentDetails: any = {
                amount,
                email,
                callback_url: callbackUrl,
                metadata: {
                  amount,
                  email,
                  name,
                },
              };

              
            let url = process.env.PAYSTACK_BASE_URL + '/transaction/initialize'

            let requestInit = {
                body: JSON.stringify(paymentDetails),
                headers: {
                  'Content-Type': 'Application/json',
                  authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
                method:"POST"
              };

            let response = await fetch(url, requestInit)
            console.log('res', response)

            if (!response.ok) {
                errorMessage = await response.text();
              }
        // Get the data returned by paystack
        const responseData = await response.json() as unknown as any

        console.log(responseData.data.authorization_url)

        return {errorMessage, checkout_url: responseData.data.authorization_url}
        
        }catch(err){
            console.log(err)
            return err
        }
    }

    static async verifyPayment(req: Request, res: Response) {
      try{

        const id = uuidv4();
        const userId = req.body.userId as unknown as string
        
        const reference = req.body.reference as unknown as string
         
        const artId = req.body.artworkId as unknown as string

        const price = req.body.price as unknown as number
        
        if (!reference) {
          return res.status(400).json({
            message: 'Missing reference',
          })
        }

        const artwork = await ArtworkInstance.findOne({ where: { id:artId}})

        let url = process.env.PAYSTACK_BASE_URL + `/transaction/verify/${reference}`
        // console.log(req.body)
        let requestInit = {
          headers: {
            'Content-Type': 'Application/json',
            authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
          method:"GET"
        };

        let response = await fetch(url, requestInit)

        const responseData = await response.json() as unknown as any
        
        
        const user = await UserInstance.findOne({ where:{id:userId}})
        const artistId = artwork?.dataValues.artistID as string
        const art = [artId]
        const username = user?.firstname+ " "+ user?.surname
       await OrderInstance.create({
        id:id,
        paymentReference:reference,
        isPaid:true,
        userId,
        artistId,
        price,
        quantity:1,
        status:"completed",
        artworkId:artId,
        checkoutUrl:req.body.redirecturl
       })
       await sendNotification(`The ${artwork?.dataValues.artName} art has been sold to ${username}`, RecipientType.ARTIST)
      //  await PaymentInstance.create({
      //   id:pid,
      //   reference,
      //   userID:userId,
      //   artworks:artId,
      //   status:PaymentStatus.PAID,

      //  })

        // await ArtworkInstance.update({
        //   soldOut:true
        // },{where:{id:artId}})
        return res.status(200).json({
          message: 'Payment verified successfully',
          data: responseData.data
        })

      }catch(err){
        console.log(err)
        return res.status(500).json({
          err
        })
       }
    }

  }