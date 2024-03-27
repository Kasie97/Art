import express from "express";
import { getAllArtists, updateArtist, changeArtistPassword, uploadImage, getArtist} from "../controller/artistController";
import upload from "../lib/helper/multer";
import { getAllOrders, getOneOrder } from "../controller/artistController";
import { artistAuth } from "../middlewares/artistAuth";
import { orderAuth } from "../middlewares/orderAuth";


const router = express.Router();

router.get("/get-artists", getAllArtists);
router.get("/get-artist/:id", getArtist);
//router.patch("/update/:token",updateUser);

router.patch("/update/:token", updateArtist);

// Change Password
router.patch("/change-password/:token", changeArtistPassword);


// upload image
router.post("/image", upload.single('image'), uploadImage)



// router.get('/get-one-order/:id', getOneOrder)

// router.get('/get-orders/:token', artistAuth, getAllOrders)

router.get('/get-one-order/:id', getOneOrder)

router.get('/get-orders/:token', orderAuth, getAllOrders)


export default router;