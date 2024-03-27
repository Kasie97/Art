import cookieParser from "cookie-parser";
import cors from "cors";
import "./controller/googleAuth";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import googleAuth from "./route/googleAuth";
import passport from "passport";
import cookieSession from "cookie-session";
import session from "express-session";
import logger from "morgan";
import artworkRouter from "./route/artwork";
import bidRouter from "./route/bidWinner";
import usersRouter from "./route/users";
import cartRouter from "./route/cart";
import artRouter from "./route/art";
import auctionRouter from "./route/auction";
import { updateAuctionStatus } from "./controller/auctionController";
import cron from "node-cron";
import deliveryServices from "./route/deliveryService";
import artistRouter from "./route/artist";
import paymentRouter from "./route/payment";

const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
	session({
		secret: process.env.PASSPORT_SECRET as string,
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false },
	})
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/google", googleAuth);

app.use("/users", usersRouter);
app.use("/artwork", artworkRouter);
app.use("/cart", cartRouter);

app.use("/art", artRouter);
app.use("/bid", bidRouter);

app.use("/art", artRouter);

app.use("/delivery", deliveryServices);

app.use("/auction", auctionRouter);
app.use("/artist", artistRouter);

app.use("/payment", paymentRouter);

cron.schedule("* * * * *", updateAuctionStatus);

export default app;