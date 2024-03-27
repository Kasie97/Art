import dotenv from "dotenv";
import { createServer } from "node:http";
dotenv.config();

import app from "../app";
import sequelize from "../db";

const server = createServer(app);
const port = process.env.PORT ?? 5000;

sequelize.sync().then(() => {
	console.log("Connected to MySql");
});

server.listen(port, () => {
	console.log(`Server running on port: ${port} `);
});