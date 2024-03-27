import { Request, Response, NextFunction } from "express";
import {
  changePasswordSchema,
  // changePasswordSchema,
  option,
  registerUserSchema,
  resetPasswordSchema,
  updateProfileSchema,
  updateUserSchema,
} from "../utils/validation/UserValidation";
import { User, UserInstance } from "../model/userModel";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt, { JwtPayload } from "jsonwebtoken";
import generateVerificationToken from "../utils/services/generateVerificationToken";
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "../utils/services/sendVerificationEmail";
import { generateOTP } from "../utils/services/otp";
import { ArtistInstance } from "../model/artistModel";
import cloudinary from "../lib/helper/cloudinary";
import ArtworkInstance from "../model/artworkModel";
import { OrderInstance } from "../model/orderModel";

const jwtSecret = process.env.JWT_SECRET as string;
interface Custom extends Error {
  error: string;
  code: number;
}

// Register a user
export const Register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, role } = req.body;
    const id = uuidv4();

    // Validate with joi
    const validatedInput = registerUserSchema.validate(req.body, option);
    if (validatedInput.error) {
      return res
        .status(400)
        .json({ error: validatedInput.error.details[0].message });
    }
    // check if role is artist
    if (role == "Artist") {
      // check if artist
      const artist = await ArtistInstance.findOne({ where: { email: email } });
      console.log("myyyyyyy",ArtistInstance)
      if (artist) {
        return res.status(401).json({ error: "Email already exists" });
      }

      // Hash the password
      const passwordHashed = await bcrypt.hash(
        password,
        await bcrypt.genSalt()
      );
      req.body.password = passwordHashed;

      // Generate verification token
      const verificationToken = generateVerificationToken(id);
      // Generate OTP
      const { otp, expiry } = generateOTP();

      // save to database
      const newArtist = await ArtistInstance.create({
        id: id,
        verificationToken: verificationToken,
        otp: otp,
        otp_expiry: expiry,
        ...req.body,
      });

      // Send the verification email
      await sendVerificationEmail(email, otp);

      return res.status(201).json({
        message:
          "Registration successfully, Check your email to activate your account",
        artist: newArtist,
        token: verificationToken,
      });
    }

    // check if the user already exist
    const user = await UserInstance.findOne({ where: { email: email } });
    if (user) {
      return res.status(401).json({ error: "Email already exist" });
    }

    // Hash the password
    const passwordHashed = await bcrypt.hash(password, await bcrypt.genSalt());
    req.body.password = passwordHashed;

    // // Generate verification token
    // const verificationToken = generateVerificationToken(id);
    // Generate OTP
    const { otp, expiry } = generateOTP();

    // save to database
    const newUser = await UserInstance.create({
      id: id,
      otp: otp,
      otp_expiry: expiry,
      ...req.body,
    });

    // Send the verification email
    await sendVerificationEmail(email, otp);

    return res.status(201).json({
      message:
        "Registration successfully, Check your email to activate your account",
      user: newUser,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "User registration failed" });
  }
};

export const resendOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = (await UserInstance.findOne({
      where: { email },
    })) as unknown as UserInstance;
    console.log(user);
    const { id } = user.dataValues;

    if (!user) {
      const artist = (await ArtistInstance.findOne({
        where: { email },
      })) as unknown as ArtistInstance;
      if (!artist) {
        return res.status(404).json({ error: "Email not found" });
      } else {
        if (artist.dataValues.active) {
          return res.status(400).json({ error: "Artist already verified" });
        }

        const { otp, expiry } = generateOTP();

        const newArtist = await ArtistInstance.update(
          {
            otp_expiry: expiry,
            otp,
          },
          {
            where: { email },
          }
        );

        sendVerificationEmail(email, otp);

        return res.status(201).json({
          message: "A new OTP has been sent to your mail",
        });
      }
    }
    if (user.dataValues.active) {
      return res.status(400).json({ error: "User already verified" });
    }

    const { otp, expiry } = generateOTP();

    const verificationToken = generateVerificationToken(id);

    const newUser = await UserInstance.update(
      {
        otp_expiry: expiry,
        otp,
        verificationToken,
      },
      {
        where: { email },
      }
    );

    sendVerificationEmail(email, otp);

    return res.status(201).json({
      message: "A new OTP has been sent to your mail",
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Email verification
export const VerifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { code } = req.body;
  console.log(code);

  try {
    const user = await UserInstance.findOne({
      where: { otp: code },
    });

    if (!user) {
      const artist = await ArtistInstance.findOne({
        where: { otp: code },
      });
      if (!artist) {
        return res.status(404).json({ error: "Email not found" });
      } else if (artist.dataValues.active) {
        return res
          .status(404)
          .json({ error: "Artist has already been verified" });
      }

      const { otp, otp_expiry } = artist.dataValues;
      if (
        otp == parseInt(code) &&
        new Date(otp_expiry).getTime() >= new Date().getTime()
      ) {
        const updated = await artist.update({
          active: true,
          // otp: 0,
          // otp_expiry: "",
        });
        return res.status(200).json({ message: "Email verified successfully" });
      }

      return res.status(200).json({ message: "OTP Expired" });
    } else if (user.dataValues.active) {
      return res.status(404).json({ error: "User has already been verified" });
    }

    const { otp, otp_expiry } = user.dataValues;
    if (
      otp == parseInt(code) &&
      new Date(otp_expiry).getTime() >= new Date().getTime()
    ) {
      const updated = await user.update({
        verificationToken: "",
        active: true,
        // otp: 0,
        // otp_expiry: "",
      });
      return res.status(200).json({ message: "Email verified successfully" });
    }

    return res.status(200).json({ message: "OTP Expired" });
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({ error: "Verification process failed" });
  }
};

export const forgetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await UserInstance.findOne({ where: { email: email } });
    if (!user) {
      const artist = await ArtistInstance.findOne({ where: { email: email } });
      if (!artist) {
        return res.status(404).json({ error: "Email not found" });
      } else {
        let { id, resetPasswordToken } = artist as unknown as {
          [key: string]: string;
        };

        // Generate reset password token (e.g., using JWT or unique random token)
        const resetToken = generateVerificationToken(id);

        // Save the reset token to the user in the database
        await artist.update({ ...req.body, resetPasswordToken: resetToken });

        // Send reset password email to the user
        await sendResetPasswordEmail(email, resetToken);

        return res
          .status(200)
          .json({ message: "Reset password link sent to your email" });
      }
    }

    let { id, resetPasswordToken } = user as unknown as {
      [key: string]: string;
    };

    // Generate reset password token (e.g., using JWT or unique random token)
    const resetToken = generateVerificationToken(id);

    // Save the reset token to the user in the database
    await user.update({ ...req.body, resetPasswordToken: resetToken });

    // Send reset password email to the user
    await sendResetPasswordEmail(email, resetToken);

    return res
      .status(200)
      .json({ message: "Reset password link sent to your email" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  console.log(req.body);
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Validate with joi
    const validatedInput = resetPasswordSchema.validate(req.body, option);
    if (validatedInput.error) {
      return res
        .status(400)
        .json({ error: validatedInput.error.details[0].message });
    }

    // Verify the token
    const decodedToken = jwt.verify(token, jwtSecret);

    if (!decodedToken) {
      return res.status(401).json({
        error: "Invalid or expired token",
      });
    }

    // Extract user ID from the token
    const { userId } = decodedToken as unknown as { [key: string]: string };

    // Find the user in the database based on the user ID
    const user = await UserInstance.findOne({ where: { id: userId } });

    if (!user) {
      const artist = await ArtistInstance.findOne({ where: { id: userId } });
      if (!artist) {
        return res.status(404).json({ error: "Email not found" });
      } else {
        const passwordHashed = await bcrypt.hash(
          password,
          await bcrypt.genSalt()
        );
        req.body.password = passwordHashed;

        // Set the new password and clear the reset token fields
        const updated = await artist.update({
          ...req.body,
          password: passwordHashed,
          resetPasswordToken: "",
        });

        return res
          .status(200)
          .json({ message: "Password reset successful", updated });
      }
    }

    // Hash the password
    const passwordHashed = await bcrypt.hash(password, await bcrypt.genSalt());
    req.body.password = passwordHashed;

    // Set the new password and clear the reset token fields
    const updated = await user.update({
      ...req.body,
      password: passwordHashed,
      resetPasswordToken: "",
    });

    return res
      .status(200)
      .json({ message: "Password reset successful", updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allUsers = await UserInstance.findAndCountAll();

  return res.status(200).json({
    message: "Users Retrieved Successfully",
    count: allUsers.count,
    data: allUsers.rows,
  });
};

export const getAllArtist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allArtist = await ArtistInstance.findAndCountAll({
    include: [
      {
        model: ArtworkInstance,
        as: "artworks",
      },
    ],
  });

  return res.status(200).json({
    message: "Users Retrieved Successfully",
    count: allArtist.count,
    data: allArtist.rows,
  });
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await UserInstance.findOne({ where: { id: id } });

    if (!user) {
      return res.status(400).json({
        msg: "user does not exist",
      });
    }
    const deleteuser = await user.destroy();
    return res.status(200).json({
      msg: "You have deleted a user",
      deleteuser,
    });
  } catch (error) {
    console.log(error);
  }
};

// export const updateUser = async (req: Request, res: Response) => {
// 	try {
// 		const {token} = req.params
// 		const validateUser = updateProfileSchema.validate(req.body, option);
// 		if (validateUser.error) {
// 			return res.status(400).json({ Error: validateUser.error.details[0].message });
// 		}

// 		if (req.body) {
// 			;
// 		  }
// 		  const decodedToken = jwt.verify(token, jwtSecret);

// 		  if (!decodedToken) {
// 		   return res.status(401).json({
// 			 error: "Invalid or expired token",
// 		   });
// 		 }
// 		 const userId = decodedToken as unknown as { [key: string]: string };
// 		const userInfo = await UserInstance.findOne({ where: { id: userId.id }}) as any;
// 		if (!userInfo) {
// 			const artistInfo = await ArtistInstance.findOne({ where: { id: userId.id}});
// 			if (!artistInfo) {
// 				return res.status(404).json({ Error: "Profile not found" });
// 			}
// 			else{
// 				const artistUpdate = await artistInfo.update(req.body);
// 			return res.status(200).json({ msg: "Profile Updated Successfully", artistUpdate });
// 			}
// 		}
// 		const userUpdate = await userInfo.update(req.body);
// 		return res.status(200).json({ msg: "Profile Updated Successfully", userUpdate });

// 	} catch (err) {
// 		return res.status(500).json({ error: "internal server error" });
// 	}
// };

export const updateUser = async (req: Request, res: Response) => {
  try {
    //const token = req.headers.authorization.split(" ")[1]
    //const {id} = req.user
    const { token } = req.params;
    const validateUser = updateProfileSchema.validate(req.body, option);

    if (validateUser.error) {
      return res
        .status(400)
        .json({ Error: validateUser.error.details[0].message });
    }

    const decodedToken = jwt.verify(token, jwtSecret);

    if (!decodedToken) {
      return res.status(401).json({
        error: "Invalid or expired token",
      });
    }

    const userId = decodedToken as unknown as { [key: string]: string };
    const userInfo = (await UserInstance.findOne({
      where: { id: userId.id },
    })) as any;

    if (!userInfo) {
      const artistInfo = await ArtistInstance.findOne({
        where: { id: userId.id },
      });

      if (!artistInfo) {
        return res.status(404).json({ Error: "Profile not found" });
      } else {
        const artistUpdate = await artistInfo.update(req.body);
        return res
          .status(200)
          .json({ msg: "Artist updated Successfully", artistUpdate });
      }
    }

    const userUpdate = await userInfo.update(req.body);
    return res
      .status(200)
      .json({ msg: "Profile Updated Successfully", userUpdate });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    //const token = req.headers.authorization.split(" ")[1]
    //const {id} = req.user
    const { token } = req.params;
    const validateUser = changePasswordSchema.validate(req.body, option);

    if (validateUser.error) {
      return res
        .status(400)
        .json({ Error: validateUser.error.details[0].message });
    }

    const decodedToken = jwt.verify(token, jwtSecret);

    if (!decodedToken) {
      return res.status(401).json({
        error: "Invalid or expired token",
      });
    }

    const userId = decodedToken as unknown as { [key: string]: string };
    const userInfo = (await UserInstance.findOne({
      where: { id: userId.id },
    })) as any;

    if (!userInfo) {
      const artistInfo = await ArtistInstance.findOne({
        where: { id: userId.id },
      });

      if (!artistInfo) {
        return res.status(404).json({ Error: "Profile not found" });
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.newPassword, salt);
        const artistUpdate = await artistInfo.update({ password: hashed });
        return res
          .status(200)
          .json({ msg: "Password Changed Successfully", artistUpdate });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.newPassword, salt);
    const userUpdate = await UserInstance.update(
      { password: hashed },
      { where: { id: userId.id } }
    );

    return res
      .status(200)
      .json({ msg: "Password Changed Successfully", userUpdate });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(500).json({ error: "no file uploaded" });
    }
    const imageUpload = await cloudinary.uploader.upload(req.file.path);
    res.status(200).json({ imageUrl: imageUpload.secure_url });
  } catch (error) {
    res.status(500).json({ error: "image upload failed" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await UserInstance.findOne({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "User retrived successfully", user });
  } catch (err) {
    console.log(err);
  }
};


export const getOneUserOrder = async (req: Request, res: Response) => {
    try {
      const {id} = req.params as { [key: string]: string };
		console.log(id)
      const values = await OrderInstance.findAndCountAll({
        where:{artworkId:id},
        include: [
                  {
                      model: UserInstance,
                      as: "user",
                  },
                  {
                    model: ArtworkInstance,
                    as: "artwork",
                  },
              ],
      })
      if(!values){
        return res.status(404).json({error: "No Order Found  "})
      }
      const uid = values.rows[0].dataValues.userId
      const artId = values.rows[0].dataValues.artworkId
	  const artistId = values.rows[0].dataValues.artistId
      const user = await UserInstance.findByPk(uid)
      const art = await ArtworkInstance.findByPk(artId)
	  const artist = await ArtistInstance.findByPk(artistId)
      const order = values
      console.log(art)
      return res.status(200).json({
        message:"Order retrieved successfully",
        order:values.rows[0],
        user:user,
        art:art,
		artist:artist
      })
  
    } catch (error) {
      console.log(error)
    }
  }
  
  export const getAllUserOrders = async (req: Request, res: Response) => {
    try {
      const {id} = req.user as { [key: string]: string };
  
      const orderList = await OrderInstance.findAndCountAll({
        where:{userId:id},
        include: [
                  {
                      model: UserInstance,
                      as: "user",
                  },
                  {
                    model: ArtworkInstance,
                    as: "artwork",
                  },
              ],
        order: [['createdAt', 'DESC']]
      })
      if(!orderList){
        return res.status(404).json({error: " No orders yet "})
      }
  
      return res.status(200).json({
        message:"Orders fetched successfully",
        count:orderList.count,
        list:orderList.rows
      })
  
    } catch (error) {
      console.log(error)
    }
  }