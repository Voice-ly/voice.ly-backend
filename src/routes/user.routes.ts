import { Router } from "express";
import { createUser,updateUser, deleteUser, getUsers } from "../controllers/user.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", createUser);
router.get("/", verifyToken, getUsers);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);

export default router;