import { CustomError } from "./custom.error";
import httpStatus from "http-status";

export class NotFoundError extends CustomError {
  constructor(message: string, reasonCode?) {
    super(message);
    this.errorCode = httpStatus.NOT_FOUND;
  }
}
