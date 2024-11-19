import { userService } from "../../services";
import { errorHandlerWrapper } from "../../utils";
import { ForbiddenError } from "../../errors";
import { encryptPassword } from "../../utils/encrypt";
import httpStatus from "http-status";

const registerHandler = async (req, res) => {
  const { username, email, password } = req.body;
  const findUser = await userService.getOneUser({ email });
  if (findUser) {
    throw new ForbiddenError("User already exists");
  }
  const hashPassword = await encryptPassword(password);
  const user = await userService.createUser({
    username,
    email,
    password: hashPassword,
  });
  res.json({ user }).status(httpStatus.CREATED);
};

export const registerController = errorHandlerWrapper(registerHandler);
