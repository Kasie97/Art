import dotenv from "dotenv";
dotenv.config();
import { Response } from "express";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import { Role, UserInstance } from "../model/userModel";
import { v4 as uuid } from "uuid";

export interface Google {
	id: string;
	given_name: string;
	family_name: string;
	email: string;
	verified: boolean;
	picture: string;
}

const strategy = GoogleStrategy.Strategy;
passport.use(
	new strategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			callbackURL: "https://eag-vkis.onrender.com/google/callback",
			passReqToCallback: true,
		},

		async (request: any, accessToken: string, refreshToken: string, profile: Google, done: any) => {
			try {
				console.log("Helloouuuu")
				const user = await UserInstance.findOne({
					where: { email: profile.email },
				});
				console.log("User::",user);
				if(user){
					if (user?.dataValues.googleId == profile.id) {
						done(null, user);
						return;
					}else if(user?.dataValues.googleId != profile.id){
						done(null, "The email already exists, login with your password")
						return;
					}
				}
				

				const id = uuid();
				
				const savedUser = new UserInstance({
					id,
					email: profile.email,
					firstname: profile.given_name,
					surname: profile.family_name,
					googleId: profile.id,
					role: Role.User,
					phone: "",
					active: profile.verified,
					password: "",
					verificationToken: "",
					resetPasswordToken: "",
					profilePic: profile.picture,
					otp:0,
					address: "",
					state: "",
					zipcode: 0
				});

				await savedUser.save();
				console.log(profile);
				done(null, savedUser);
				return;
			} catch (error) {
				console.log(error);
				throw new Error(`${error}`);
			}
		}
	)
);

passport.deserializeUser((user: Express.User, done) => {
	done(null, user);
});

passport.serializeUser((user, done) => {
	done(null, user);
});