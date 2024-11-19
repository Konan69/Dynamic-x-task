import { Router } from "express";
import { TaskValidator } from "../validators";
import { TaskController } from "../controllers";
import { checkAuth } from "../utils";

export const taskRouter = Router();

taskRouter.get("/", checkAuth, TaskController.getTasksController);

taskRouter.post(
  "/create",
  checkAuth,
  TaskValidator.createTaskValidator(),
  TaskController.createTaskController,
);

taskRouter.patch(
  "/",
  checkAuth,
  TaskValidator.updateTaskValidator(),
  TaskController.updateTaskController,
);

taskRouter.delete(
  "/:taskId",
  checkAuth,
  TaskValidator.deleteTaskValidator(),
  TaskController.deleteTaskController,
);
