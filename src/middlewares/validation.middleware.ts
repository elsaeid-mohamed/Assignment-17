import { NextFunction, Request, Response } from "express";
import { BadRequestException } from "../modules/commen/response/application-exception";
import { ZodError, ZodType } from "zod";

type KeyRequestType = keyof Request; // body | params | query
type schemaType = Partial<Record<KeyRequestType, ZodType>>;

type IssuesType = {
  key: KeyRequestType;
  issues: {
    path: (string | number | symbol | undefined | null)[];
    message: string;
  }[];
};

export const validation = (schema: schemaType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const issues: IssuesType[] = [];

    for (const key of Object.keys(schema) as KeyRequestType[]) {
      if (!schema[key]) continue;

      const result = schema[key]!.safeParse(req[key]);

      if (!result.success) {
        const errors = result.error as ZodError;
        issues.push({
          key,
          issues: errors.issues.map((err) => ({
            path: err.path,
            message: err.message,
          })),
        });
      }
    }

    if (issues.length) {
      throw new BadRequestException("validation error", { issues });
    }

    return next();
  };
};