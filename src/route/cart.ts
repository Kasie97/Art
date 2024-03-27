import express, { Request, Response } from 'express';
import { addToCart, getCart, deleteCart, getSingleCart, updateSingleCart, cartHistory } from '../controller/CartList'
import { auth } from '../middlewares/auth'

const router = express.Router();


router.post('/:id', addToCart);
router.get('/:id',  getCart); 
router.delete('/:id',  deleteCart);
router.get('/:id',  getSingleCart)
router.put('/:id', updateSingleCart );
router.get('/cart-history/:id', cartHistory);
 


export default router;