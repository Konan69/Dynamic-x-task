import { CustomError } from "./custom.error";
import httpStatus from "http-status";

export class InternalServerError extends CustomError {
  constructor(message: string, reasonCode?) {
    super(message);
    this.errorCode = httpStatus.INTERNAL_SERVER_ERROR;
  }
}
