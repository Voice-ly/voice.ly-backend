import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

/**
 * Middleware to verify a Firebase ID token.
 *
 * This middleware checks the Authorization header for a Bearer token,
 * validates it using Firebase Admin, and attaches the decoded user data
 * to the request object. If the token is missing, invalid, or expired,
 * it returns a 401 Unauthorized error.
 *
 * @param {Request} req - Express request object containing the authorization header.
 * @param {Response} res - Express response object used to send error responses.
 * @param {NextFunction} next - Express next middleware function.
 * @returns {Promise<Response | void>} Proceeds to the next middleware if valid, or returns an error response.
 *
 * @throws Returns 401 if the token is missing, invalid, or expired.
 */

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "No token provided" });

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET no definido");

    // Verificar token propio
    const decoded = jwt.verify(token, secret) as { uid: string; email?: string; [key: string]: any };

    req.user = decoded; // Esto funciona porque extendimos Request en index.d.ts

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};