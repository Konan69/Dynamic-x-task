import { CustomError } from "./custom.error";
import httpStatus from "http-status";

export class ForbiddenError extends CustomError {
  constructor(message: string, reasonCode?) {
    super(message);
    this.errorCode = httpStatus.FORBIDDEN;
  }
}
