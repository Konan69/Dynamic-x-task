import { UserEntity } from "../entities";

declare global {
  namespace Express {
    interface Request {
      user?: UserEntity;
    }
  }
}

export type PayloadType = {
  id: string;
};
