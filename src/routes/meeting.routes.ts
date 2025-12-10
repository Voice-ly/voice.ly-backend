import { Router } from "express";

import {
  createMeetingController,
  getMeetingByIdController,
  listMeetingsController,
  joinMeetingController,
  updateMeetingController,
  deleteMeetingController,
  endMeetingController,
} from "../controllers/meeting.controller";

import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

/** Crear reunión */
router.post("/", verifyToken, createMeetingController);

/** Obtener reunión por ID */
router.get("/:id", verifyToken, getMeetingByIdController);

/** Listar todas las reuniones */
router.get("/", verifyToken, listMeetingsController);

/** Unirse a una reunión */
router.post("/:id/join", verifyToken, joinMeetingController);

/** Actualizar reunión (solo el dueño) */
router.put("/:id", verifyToken, updateMeetingController);

/** Eliminar reunión (solo el dueño) */
router.delete("/:id", verifyToken, deleteMeetingController);

/** FINALIZAR REUNIÓN Y GENERAR RESUMEN (NUEVA RUTA) */
router.post("/:id/end", verifyToken, endMeetingController);

export default router;
