import { z } from "zod";

export const SignupSchema = z
  .object({
    username: z
      .string({
        message: "Please enter a username",
      })
      .min(2, { message: "Username must be at least 2 characters long" })
      .max(50, { message: "Username must be at most 50 characters long" }),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string(),
  })
  .refine(
    (val) => {
      return val.password === val.confirmPassword;
    },
    {
      message: "Passwords must match!",
      path: ["confirmPassword"],
    },
  );

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 8 characters" }),
});
