import { TaskEntity, UserEntity } from "../entities";
import { AppDataSource } from "../db";
import { NotFoundError } from "../errors";

export const createTask = async (
  user: UserEntity,
  title: string,
  status: string,
) => {
  const taskRepository = AppDataSource.getRepository(TaskEntity);
  const task = taskRepository.create({ user, title, status });
  await taskRepository.save(task);
  return task;
};

export const getTasks = async (user: UserEntity) => {
  const taskRepository = AppDataSource.getRepository(TaskEntity);
  const tasks = await taskRepository.find({
    where: { user: { uuid: user.uuid } },
    relations: {
      user: true,
    },
  });
  return tasks;
};

export const updateTask = async (
  taskId: string,
  title?: string,
  status?: string,
) => {
  const taskRepository = AppDataSource.getRepository(TaskEntity);

  // Build update object with only provided fields
  const updateFields = {};
  if (title) {
    updateFields["title"] = title;
  }
  if (status) {
    updateFields["status"] = status;
  }

  const updateResult = await taskRepository.update(
    { uuid: taskId },
    updateFields,
  );

  // Return true if a task was updated, false if no task found
  return updateResult.affected > 0;
};

export const deleteTask = async (taskId: string) => {
  const taskRepository = AppDataSource.getRepository(TaskEntity);
  const result = await taskRepository.delete({ uuid: taskId });
  return result.affected > 0;
};
