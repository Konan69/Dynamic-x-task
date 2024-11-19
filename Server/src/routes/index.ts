import { authRouter } from "./authRouter";
import { Router } from "express";
import { taskRouter } from "./taskRouter";

export const appRouter = Router();

appRouter.use("/auth", authRouter);
appRouter.use("/tasks", taskRouter);
