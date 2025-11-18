import { Router } from "express";
import { createUser,updateUser, deleteUser, getUsers, loginUser, logoutUser, forgotPassword, resetPassword } from "../controllers/user.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { verify } from "crypto";

/**
 * User Routes
 *
 * This router defines all routes related to user management.
 * It includes user creation, retrieval, updating, and deletion.
 *
 * Authentication middleware (`verifyToken`) is applied to protected routes
 * to ensure that only authenticated users can access or modify user data.
 */

const router = Router();

// Public routes
router.post("/", createUser);
router.post("/login", loginUser);
router.post("/logout", verifyToken, logoutUser);

// Protected routes
router.get("/", verifyToken, getUsers);
router.put("/profile", verifyToken, updateUser);
router.delete("/", verifyToken, deleteUser);

router.post("/forgotPassword", forgotPassword)
router.post("/reset-password", resetPassword);

export default router;