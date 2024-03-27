import { Request, Response } from 'express';
import { UserInstance } from '../model/userModel';
import ArtistInstance from '../model/artistModel';




// Endpoint to retrieve the address of a user by user ID
export const getUserAddresses = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID
    const user = await UserInstance.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract and return the user's address
    const userAddress = {
      address: user.address,
      state: user.state,
      zipcode: user.zipcode,
    };

    res.json(userAddress);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getArtistAddresses = async (req: Request, res: Response) => {
  try {
    const artistId = req.params.artistId;

    // Find the user by ID
    const artist = await ArtistInstance.findByPk(artistId) as unknown as { [key: string]: string };

    if (!artist) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract and return the user's address
    const artistAddress = {
      address: artist.address,
      state: artist.state,
      zipcode: artist.zipcode,
    };

    res.json(artistAddress);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const addAddressToUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    console.log(req.body)
    const { address, state, zipcode } = req.body;
    // Validate the required fields
    if (!address || !state || !zipcode) {
      return res.status(400).json({ error: 'Incomplete address information provided.' });
    }

    // Find the user by ID
    const user = await UserInstance.findByPk(userId);

    if (!user) {
        return res.status(404).json({ error: 'User record not found' });
  
      
    }

    // Update the user's address
    user.address = address;
    user.state = state;
    user.zipcode = zipcode;

    // Save the changes to the database
    await user.save();

    // Return the updated user with the new address
    res.json({
      message: "User information added successfully",
      user: {
        id: user.id,
        firstname: user.firstname,
        surname: user.surname,
        address: user.address,
        state: user.state,
        zipcode: user.zipcode,
      }
    });
    


  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const addAddressToArtist = async (req: Request, res: Response) => {
  try {
    const artistId = req.params.artistId;
    console.log(req.body)
    const { address, state, zipcode } = req.body;
    // Validate the required fields
    if (!address || !state || !zipcode) {
      return res.status(400).json({ error: 'Incomplete address information provided.' });
    }

    // Find the user by ID
    const artist = await ArtistInstance.findByPk(artistId)

    if (!artist) {
    
        return res.status(404).json({ error: 'No record found' });
      
    }

    // Update the artist's address
    artist.dataValues.address = address;
    artist.dataValues.state = state;
    artist.dataValues.zipcode = zipcode;

    // Save the changes to the database
    await artist.save();

    // Return the updated user with the new address
    res.json({
      message: "Artist information added successfully",
      user: {
        id: artist.dataValues.id,
        firstname: artist.dataValues.firstname,
        surname: artist.dataValues.surname,
        address: artist.dataValues.address,
        state: artist.dataValues.state,
        zipcode: artist.dataValues.zipcode,
      }
    });
    


  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};