/**
 * Authentication routes.
 *
 * Exposes endpoints for login, logout and password recovery flows.
 * These routes delegate to the user controller for implementation details.
 */
import { Router } from "express";
import { loginUser, logoutUser, forgotPassword, resetPassword } from "../controllers/user.controller";

const router = Router();

router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
