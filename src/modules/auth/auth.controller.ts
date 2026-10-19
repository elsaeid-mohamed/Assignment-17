import { NextFunction, Request, Response, Router } from "express";
import authService from "./auth.service";
import { successResponse } from "../commen/response";
import { loginSchema, signUpSchema } from "./auth.validation";
import { validation } from "../../middlewares/validation.middleware";

const authRouter = Router();

authRouter.post(
  "/signup",
  validation({ body: signUpSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await authService.signUp(req.body);
    return successResponse({
      res,
      status: 201,
      message: "signup successfully",
      data,
    });
  },
);

authRouter.post(
  "/login",
  validation({ body: loginSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await authService.login(req.body);
    return successResponse({
      res,
      message: "login successfully",
      data,
    });
  },
);

export default authRouter;