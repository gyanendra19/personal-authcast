import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import Database from "./postgres-utils/db";
import { generatemeetcodeController } from "./controllers/generatemeetcodeController";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const database = new Database({
  host: process.env.POSTGRES_HOST!,
  user: process.env.POSTGRES_USER!,
  password: process.env.POSTGRES_PASSWORD!,
  port: Number(process.env.POSTGRES_PORT!),
  database: process.env.POSTGRES_DATABASE!,
});

console.log(`database connection: ${database}`);


app.get("/", (req: Request, res: Response) => {
  res.send("Hello Authcast");
});


app.get("/generatemeetcode", (req: Request, res: Response) => {
   const code = generatemeetcodeController( database);
   res.send({code: code})
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
