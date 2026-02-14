import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error: any) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors,
      });
    }
  };


  
  export const validateParams =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error: any) {
      return res.status(400).json({
        message: "Invalid parameters",
        errors: error.errors,
      });
    }
  };
