import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ZodError) {
    return res.status(409).json({
      success: false,
      message: "Validation failed",
      errors: err.issues.map(issue => ({
        field: issue.path.join("."),
        message: issue.message
      }))
    });
  }

  if (err instanceof Error) {
  const statusCode = (err as any).statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: err.message
    });
  }

  return res.status(res.statusCode).json({
    success: false,
    message: "Internal server error"
  });
}
