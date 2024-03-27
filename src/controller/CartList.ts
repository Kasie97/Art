import express, { Request, Response } from 'express';
import { Op, Optional } from 'sequelize';
import {CartAttributes, CartInstance} from '../model/cartModel';
import { v4 as uuidv4 } from "uuid";
import { ArtworkInstance } from '../model/artworkModel';
import { UserInstance } from '../model/userModel';


export const addToCart =  async (req: Request, res: Response) => {
  const id = req.params.id
  try {

    const uid = uuidv4();
    const userID = await UserInstance.findOne({where: { id: id }})
    const artworks = await ArtworkInstance.findOne ( {where: { id: id} }) //req.params.artworks;



    // CREATING A NEW CART USING SEQUELIZE
    const newCart = await CartInstance.create({
      userID: req.body.userID,
      artworks: req.body.artworks,
      status: req.body.status,
    } as Optional<CartAttributes, never>);

    if (newCart) {
      res.send({ success: 'Cart saved Successfully' });
    } else {
      res.send({ error: 'Error Saving Cart' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};




// FINDING ALL CARTS 
export const getCart =  async (req: Request, res: Response) => {
  try {
    const carts = await CartInstance.findAll();
    res.send(carts);
    res.status(200)
    console.log(carts)
    if(!carts){
    res.status(400).send({ error: 'Carts not yet created' });

    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};





// DELETING A NEW CART FROM THE ADMIN-CART-PAGE
export const deleteCart = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const deleteCart = await CartInstance.destroy({ where: { id: id } });

    if (deleteCart) {
      res.send({ success: 'Cart Deleted Successfully' });
    } else {
      res.send({ error: 'Error Deleting Cart' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};




// FINDING A SINGLE CART AND POPULATING INFORMATION ON THE CART-DETAIL-PAGE
export const getSingleCart =  async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const cart = await CartInstance.findByPk(id);

    if (!cart) {
      res.send({ error: 'The Cart was not found' });
      return;
    }

    res.send(cart);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};



// UPDATE A SINGLE CART STATUS
export const updateSingleCart = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const cart = await CartInstance.findByPk(id);

    if (!cart) {
      res.send({ error: 'The Cart was not found' });
      return;
    }

    cart.dataValues.status = req.body.status || cart.dataValues.status;

    const updatedCart = await cart.save();

    if (updatedCart) {
      res.send({ success: 'Cart updated Successfully' });
    } else {
      res.send({ error: 'Error updating Cart.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};




// UPDATING THE CART HISTORY PAGE
export const cartHistory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const carts = await CartInstance.findAll({ where: { userID: id } });

    res.send(carts);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
