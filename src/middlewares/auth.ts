import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserInstance } from "../model/userModel";

const jwtsecret = process.env.JWT_SECRET as string;

export async function auth(req: Request | any, res: Response, next: NextFunction) {
	const authorization = req.headers.authorization;
	console.log(authorization);

	if (!authorization) {
		return res.render("Login", { error: "Kindly login or sign up" });
	}

	const token = authorization.slice(7, authorization.length);
	if (!token) {
		return res.status(401).json({ error: "Kindly login or sign up" });
	}

	let verified = jwt.verify(token, jwtsecret);

	if (!verified) {
		return res.status(401).json({ error: "Invalid token. You cannot access this route" });
	}

	const { id } = verified as { [key: string]: string };

	//Check if the artist exist
	
	const artist = await UserInstance.findOne({ where: { id: id } });
	console.log("hello")
	if (!artist) {
		return res.status(401).json({ error: "Kindly sign-up as a user" });
	}

	req.user = verified;
	next();
}