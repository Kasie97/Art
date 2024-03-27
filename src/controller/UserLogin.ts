import { NextFunction, Request, Response } from "express";
import { UserInstance } from "../model/userModel";
import { loginSchema, option } from "../utils/validation/UserValidation";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UUIDV4 } from "sequelize";
import ArtistInstance from "../model/artistModel";

// Get the JWT string from the .env file
const jwtsecret = process.env.JWT_SECRET as string;

export const loginUser = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;
		//console.log(req.body)
		const iduuid = UUIDV4();
		const valid = loginSchema.validate(req.body, option);
		if (valid.error) {
			res.status(400).json({ error: valid.error.details[0].message });
		}
		const user = (await UserInstance.findOne({
			where: { email: email },
		})) as unknown as { [key: string]: string };
		//console.log(existingUser)
		if (!user) {
			const artist = (await ArtistInstance.findOne({
				where: { email: email },
			})) as unknown as { [key: string]: string };

			if (!artist) {
				return res.status(400).json({
					error: "Invalid email/password",
				});
			} else {
				const validPassword = await bcrypt.compare(password, artist.password);

				if (!validPassword) {
					res.status(404).json({ error: "Invalid email/password" });
				}
				if (artist.active) {
					const { id } = artist;

					const token = jwt.sign({ id }, jwtsecret, { expiresIn: "2d" });
					console.log(token);
					res.cookie("token", token, {
						httpOnly: true,
						maxAge: 2 * 24 * 60 * 1000,
					});
					console.log("success");
					return res.status(200).json({
						message: `Artist login successful`,
						role: "Artist",
						token,
						user: artist,
					});
				} else {
					return res.status(401).json({
						error: "Please verify your email",
					});
				}
			}
		}

		const validPassword = await bcrypt.compare(password, user.password);

		if (!validPassword) {
			return res.status(404).json({ error: "Invalid email/password" });
		}
		console.log(user.active);
		if (user.active) {
			const { id } = user;

			const token = jwt.sign({ id }, jwtsecret, { expiresIn: "2d" });

			// res.cookie("token", token, {
			// 	httpOnly: true,
			// 	maxAge: 2 * 24 * 60 * 1000,
			// });
			console.log("success");
			return res.status(200).json({
				message: `${user.role} login successful`,
				token,
				user,
				role:"User"
			});
		} else {
			return res.status(401).json({
				error: "Please verify your email",
			});
		}
	} catch (error) {
		console.log(error);
	}
};

export const googleLog = async (req: Request, res: Response, next: NextFunction) => {
	let user: any = req.user;
	const id = user.id;
	let name = user?.displayName || user.firstname;
	const token = jwt.sign({ id }, jwtsecret, { expiresIn: "2d" });

	res.cookie("token", token, {
		httpOnly: true,
		maxAge: 2 * 24 * 60 * 1000,
	});
	console.log("success");
	// res.send(`Welcome ${name}`)
	return res.status(200).json({
		message: `${user.role} login successful`,
		token,
		user,
	});
	next();
};

export const logoutUser = async (req: Request | any, res: Response) => {
	res.clearCookie("token");
	return;
};