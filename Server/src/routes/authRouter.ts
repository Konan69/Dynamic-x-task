import { Router } from "express";
import { AuthValidator } from "../validators";
import { AuthController } from "../controllers";
import { loginValidator } from "../validators/auth/login.validator";

export const authRouter = Router();

authRouter.post(
  "/register",
  AuthValidator.registerValidator(),
  AuthController.registerController,
);

authRouter.post(
  "/login",
  AuthValidator.loginValidator(),
  AuthController.loginController,
);
