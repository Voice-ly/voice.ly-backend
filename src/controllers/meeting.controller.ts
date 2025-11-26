import { Request, Response } from "express";
import {
  createMeetingService,
  getMeetingByIdService,
  listMeetingsService,
  joinMeetingService,
  updateMeetingService,
  deleteMeetingService,
} from "../services/meeting.service";

export const createMeetingController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: "Usuario no autenticado",
      });
    }

    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "El título es obligatorio",
      });
    }

    const result = await createMeetingService({ title, description }, userId);
    return res.status(result.status).json(result);

  } catch (error) {
    console.error("Error al crear reunión:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Error del servidor al crear la reunión",
    });
  }
};

export const getMeetingByIdController = async (req: Request, res: Response) => {
  try {
    const meetingId = req.params.id;
    const result = await getMeetingByIdService(meetingId);
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error al obtener reunión:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Error del servidor al obtener la reunión",
    });
  }
};

export const listMeetingsController = async (_req: Request, res: Response) => {
  try {
    const meetings = await listMeetingsService();

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Lista de reuniones",
      data: meetings,
    });
  } catch (error) {
    console.error("Error al listar reuniones:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Error del servidor al listar reuniones",
    });
  }
};

export const joinMeetingController = async (req: Request, res: Response) => {
  try {
    const meetingId = req.params.id;
    const userId = req.user?.id; // Asegúrate de tener el middleware que inserta esto

    if (!userId) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: "Usuario no autenticado",
      });
    }

    const result = await joinMeetingService(meetingId, userId);
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error al unirse a reunión:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Error del servidor al unirse a la reunión",
    });
  }
};

export const updateMeetingController = async (req: Request, res: Response) => {
  try {
    const meetingId = req.params.id;
    const userId = req.user?.id;
    const data = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: "Usuario no autenticado",
      });
    }

    const result = await updateMeetingService(meetingId, userId, data);
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error al actualizar reunión:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Error del servidor al actualizar la reunión",
    });
  }
};

export const deleteMeetingController = async (req: Request, res: Response) => {
  try {
    const meetingId = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: "Usuario no autenticado",
      });
    }

    const result = await deleteMeetingService(meetingId, userId);
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error al eliminar reunión:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Error del servidor al eliminar la reunión",
    });
  }
};