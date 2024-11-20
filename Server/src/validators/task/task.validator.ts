import { body, param, query } from "express-validator";

export const createTaskValidator = () => {
  return [
    body("title").notEmpty().withMessage("title is required."),
    body("status").notEmpty().withMessage("status is required."),
  ];
};

export const updateTaskValidator = () => {
  return [
    body("taskId").notEmpty().withMessage("taskId is required."),
    body("title").optional(),
    body("status").optional(),
    body().custom((value) => {
      if (!value.title && !value.status) {
        throw new Error("At least one of title or status must be provided");
      }
      return true;
    }),
  ];
};

export const deleteTaskValidator = () => {
  return [
    param("taskId")
      .notEmpty()
      .isUUID()
      .withMessage("taskId is required and must be a valid UUID."),
  ];
};
