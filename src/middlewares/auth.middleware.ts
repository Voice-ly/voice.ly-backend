import { Request, Response, NextFunction } from "express";
import { adminAuth } from "../config/firebaseAdmin";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verificar token con Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(token);

    // Guardamos los datos del usuario en la request
    req.user = decodedToken;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
