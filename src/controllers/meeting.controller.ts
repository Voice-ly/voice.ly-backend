import { Request, Response } from "express";
import { getUsersEmailsByIdsService } from "../services/user.service";
import { getHistoryByRoomId } from "../services/chatHistory.service";
import {
  createMeetingService,
  getMeetingByIdService,
  listMeetingsService,
  joinMeetingService,
  updateMeetingService,
  deleteMeetingService,
  endMeetingService,
} from "../services/meeting.service";

const CHAT_SERVICE_URL = process.env.CHAT_SERVICE_URL || 'http://localhost:3002'; 
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:3004';

export const createMeetingController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;

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
    const userId = req.user?.uid; // Asegúrate de tener el middleware que inserta esto

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
    const userId = req.user?.uid;
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
    const userId = req.user?.uid;

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

export const endMeetingController = async (req: Request, res: Response) => {
    const meetingId = req.params.id;
    const userId = req.user?.uid; 

    if (!userId) {
        return res.status(401).json({
            success: false,
            status: 401,
            message: "Usuario no autenticado",
        });
    }

    try {
        // Marcar la reunión como finalizada en la DB
        const endDbResult = await endMeetingService(meetingId, userId);
        if (!endDbResult.success) {
            return res.status(endDbResult.status).json(endDbResult);
        }
        
        // Responder INMEDIATAMENTE al cliente. El resto es proceso de fondo.
        res.status(200).json({
            success: true,
            status: 200,
            message: "Reunión finalizada. El resumen se está generando y se enviará por correo.",
        });
        
        const generateSummaryInBackground = async () => {
            let participantEmails: string[] = [];
            
            try {
                // Obtener IDs de participantes de la reunión finalizada
                const meetingResponse = await getMeetingByIdService(meetingId);
                const participantIds: string[] = meetingResponse.data?.participants || [];
                
                console.log(`[DEBUG ORQUESTACIÓN] IDs de participantes obtenidos:`, participantIds); 
                
                // CONVERTIR IDs a correos
                participantEmails = await getUsersEmailsByIdsService(participantIds);
                
                console.log(`[DEBUG ORQUESTACIÓN] Correos válidos para envío:`, participantEmails); 

                // ZONA CORREGIDA: Reemplazamos el fetch fallido por la llamada directa al servicio local
                const chatHistory = await getHistoryByRoomId(meetingId); // ⬅️ ¡Llamada directa a Firestore!
                console.log(`[DEBUG ORQUESTACIÓN] Historial de chat obtenido localmente. Longitud: ${chatHistory.length}`);
                
                // LLAMAR AL SERVICIO DE IA
                const aiResponse = await fetch(`${AI_SERVICE_URL}/process-meeting`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        meetingId,
                        // Enviamos array de objetos { email: '...' } al AI Service
                        participants: participantEmails.map(email => ({ email })), 
                        chatHistory,
                    }),
                });

                if (!aiResponse.ok) {
                    const errorDetails = await aiResponse.text();
                    console.error(`Error de AI Service (${aiResponse.status}):`, errorDetails);
                } else {
                    console.log(`[AI-Service] Petición enviada exitosamente a AI Service para ${meetingId}`);
                }

            } catch (err: any) {
                // Este log registrará cualquier fallo durante el proceso de fondo (red, chat service, gemini, etc.)
                console.error(`[ERROR ORQUESTACIÓN FONDO] Fallo al generar resumen para ${meetingId}:`, err.message);
            }
        };

        // Ejecutamos la promesa sin 'await' para que se ejecute en segundo plano
        generateSummaryInBackground(); 

    } catch (error: any) {
        // Este catch maneja los errores antes de la respuesta inicial (e.g., error en endMeetingService)
        console.error(`Error al finalizar reunión ${meetingId} antes de background:`, error.message);
        return res.status(500).json({
            success: false,
            status: 500,
            message: "Error del servidor al finalizar la reunión.",
            detail: error.message
        });
    }
};