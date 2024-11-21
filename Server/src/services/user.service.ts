import { UserEntity } from "../entities";
import { AppDataSource } from "../db";
import { ForbiddenError, NotFoundError } from "../errors";

export const createUser = async (data) => {
  const { username, email, password } = data;
  const userRepository = AppDataSource.getRepository(UserEntity);
  const existingUser = await userRepository.findOne({
    where: { email },
  });
  if (existingUser)
    return new ForbiddenError("User with this email already exists");
  const user = userRepository.create({ username, email, password });
  await userRepository.save(user);
  return user;
};

export const getOneUser = async (data) => {
  const userRepository = AppDataSource.getRepository(UserEntity);
  const findUser = await userRepository.findOne({ where: { ...data } });
  if (!findUser) return new NotFoundError("User not found");
  return findUser;
};
