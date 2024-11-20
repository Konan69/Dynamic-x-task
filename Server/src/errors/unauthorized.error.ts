import { CustomError } from "./custom.error";
import httpStatus from "http-status";

export class UnauthorizedError extends CustomError {
  constructor(message: string, reasonCode?: string) {
    super(message, httpStatus.UNAUTHORIZED, reasonCode);
  }
}
