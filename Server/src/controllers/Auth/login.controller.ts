import { Request } from "express";
import { Response, NextFunction } from "express";
import { userService } from "../../services";
import { errorHandlerWrapper } from "../../utils";
import { generateToken } from "../../utils/generate";
import { comparePassword } from "../../utils/password";
import httpStatus from "http-status";
import { NotFoundError } from "../../errors/notFound.error";
import { UnauthorizedError } from "../../errors/unauthorized.error";

const loginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  const findUser = await userService.getOneUser({ email });
  if (!findUser) {
    throw new NotFoundError("Invalid credentials");
  }

  const compare = await comparePassword(password, findUser.password);
  if (!compare) {
    throw new UnauthorizedError("Invalid credentials");
  }
  const token = generateToken(findUser.uuid);
  return res.status(httpStatus.ACCEPTED).json({ token });
};

export const loginController = errorHandlerWrapper(loginHandler);
