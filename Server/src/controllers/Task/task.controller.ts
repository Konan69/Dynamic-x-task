import { errorHandlerWrapper } from "../../utils";
import httpStatus from "http-status";
import { Request, Response } from "express";
import { taskService } from "../../services";
import { InternalServerError } from "../../errors";

const getTasks = async (req: Request, res: Response) => {
  const { user } = req;
  const tasks = await taskService.getTasks(user);
  res.json({ tasks }).status(httpStatus.OK);
};

const createTask = async (req: Request, res: Response) => {
  const user = req.user;
  const { title, status }: { title: string; status: string } = req.body;
  const task = await taskService.createTask(user, title, status);
  res.json({ task }).status(httpStatus.CREATED);
};

const updateTask = async (req: Request, res: Response) => {
  const { title, status, taskId } = req.body;
  const updatedTask = await taskService.updateTask(taskId, title, status);
  if (!updatedTask) {
    throw new InternalServerError("Failed to update task");
  }
  res.json({ message: "Task updated successfully" }).status(httpStatus.OK);
};
const deleteTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const deletedTask = await taskService.deleteTask(taskId);
  if (!deletedTask) {
    throw new InternalServerError("Failed to delete task");
  }
  res.json({ message: "Task deleted successfully" }).status(httpStatus.OK);
};

export const getTasksController = errorHandlerWrapper(getTasks);
export const updateTaskController = errorHandlerWrapper(updateTask);
export const createTaskController = errorHandlerWrapper(createTask);
export const deleteTaskController = errorHandlerWrapper(deleteTask);
