import { Request, Response, NextFunction } from "express";

/**
 * Global Express error handler middleware.
 *
 * Captures errors thrown in route handlers or middleware and ensures a
 * consistent JSON error response is returned to the client. It also logs
 * the error to the server console for debugging purposes.
 *
 * Signature matches Express error middleware: (err, req, res, next).
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("ERROR:", err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Error interno del servidor",
  });
};
