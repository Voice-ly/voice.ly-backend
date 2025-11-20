/**
 * User management routes.
 *
 * - `GET /profile` returns the current user's profile (protected)
 * - `PUT /profile` updates the current user's profile (protected)
 * - `DELETE /profile` deletes the current user's account (protected)
 * - `POST /` registers a new user (public)
 */
import { Router } from "express";
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser
} from "../controllers/user.controller";

import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

// Rutas protegidas
router.get("/profile", verifyToken, getUsers);
router.put("/profile", verifyToken, updateUser);
router.delete("/profile", verifyToken, deleteUser);

// Registro no requiere auth
router.post("/", createUser);

export default router;
