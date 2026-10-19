import { z } from "zod";
import { Gender } from "../commen/enums";

const baseLoginSchema = z.strictObject({
  email: z.email({ error: "invalid email" }),
  password: z.string(),
  confirmPassword: z.string(),
});

export const loginSchema = baseLoginSchema.superRefine((val, ctx) => {
  if (val.password !== val.confirmPassword) {
    ctx.addIssue({
      path: ["confirmPassword"],
      code: "custom",
      message: "confirm password must be equal password",
    });
  }
  if (val.email.length >= 50) {
    ctx.addIssue({
      path: ["email"],
      code: "custom",
      message: "Too many chars",
    });
  }
});

export const emailVal = baseLoginSchema.omit({ password: true });

export const emailPartialVal = baseLoginSchema.partial({ password: true });

export const signUpSchema = baseLoginSchema
  .safeExtend({
    fName: z.string().min(3).max(20),
    lName: z.string().min(3).max(20),
    phone: z.string().optional(),
    gender: z.enum(Gender).optional(),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        code: "custom",
        message: "confirm password must be equal password",
      });
    }
  });