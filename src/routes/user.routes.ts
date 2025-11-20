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

/**
 * Ruta: GET /profile
 * Descripción: Retorna el perfil del usuario autenticado.
 * Acceso: Protegido
 */
router.get("/profile", verifyToken, getUsers);
/**
 * Ruta: PUT /profile
 * Descripción: Actualiza los datos del usuario autenticado.
 * Acceso: Protegido
 */
router.put("/profile", verifyToken, updateUser);
/**
 * Ruta: DELETE /profile
 * Descripción: Elimina la cuenta del usuario autenticado.
 * Acceso: Protegido
 */
router.delete("/profile", verifyToken, deleteUser);

// Registro no requiere auth
router.post("/", createUser);

export default router;
