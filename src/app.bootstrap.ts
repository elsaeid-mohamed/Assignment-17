import express, { NextFunction, Request, Response } from "express";
import { type Express } from "express";
import { authRouter, userRouter } from "./modules";
import { globalError } from "./modules/commen/response";
import { config } from "dotenv";
import DBconnection from "./DB/connect";
import redisService from "./modules/commen/services/redis.service";

const bootstrap = async () => {
  config();
  const app: Express = express();
  app.use(express.json());

  await DBconnection();
  await redisService.connection();

  app.get("/", (req: Request, res: Response, next: NextFunction): void => {
    res.status(200).json({ message: "hello TS" });
  });

  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use(globalError);

  app.listen(8000, () => {
    console.log("server is running .....");
  });

  console.log("app is running");
};

export default bootstrap;