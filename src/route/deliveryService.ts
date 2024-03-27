import express from 'express';
import { auth } from "../middlewares/auth";
import { getUserAddresses, addAddressToUser, addAddressToArtist, getArtistAddresses } from "../controller/deliveryServices";

const router = express.Router();

router.get('/:userId/address', getUserAddresses);
router.post('/:userId/add-address', addAddressToUser);

router.get('/:artistId/artist-address', getArtistAddresses);
router.post('/:artistId/add-artist-address', addAddressToArtist);

export default router;