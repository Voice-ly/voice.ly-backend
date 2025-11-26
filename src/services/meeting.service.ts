import { adminDb } from "../config/firebaseAdmin";
import { Meeting } from "../models/meeting.model";

const meetingsCollection = adminDb.collection("meetings");

export interface ServiceResponse<T = any> {
  success: boolean;
  status: number;
  message: string;
  data?: T;
}

/** Crear reunión */
export const createMeetingService = async (
  meeting: { title: string; description?: string },
  ownerId: string
): Promise<ServiceResponse<{ id: string; meetLink: string }>> => {

  const meetLink = `https://voicely-eight.vercel.app/dashboard/${crypto.randomUUID()}`;

  const newMeeting: Meeting = {
    title: meeting.title,
    description: meeting.description || "",
    
    ownerId,
    participants: [ownerId],

    meetLink,
    status: "scheduled",

    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const docRef = await meetingsCollection.add(newMeeting);

  return {
    success: true,
    status: 201,
    message: "Reunión creada correctamente",
    data: {
      id: docRef.id,
      meetLink: meetLink
    },
  };
};

/** Obtener reunión por ID */
export const getMeetingByIdService = async (
  id: string
): Promise<ServiceResponse<Meeting>> => {
  const doc = await meetingsCollection.doc(id).get();

  if (!doc.exists) {
    return {
      success: false,
      status: 404,
      message: "La reunión no existe",
    };
  }

  return {
    success: true,
    status: 200,
    message: "Reunión encontrada",
    data: { id: doc.id, ...(doc.data() as Meeting) },
  };
};

/** Listar reuniones */
export const listMeetingsService = async (): Promise<ServiceResponse<Meeting[]>> => {
  const snap = await meetingsCollection.get();
  const meetings = snap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Meeting),
  }));

  return {
    success: true,
    status: 200,
    message: "Lista de reuniones",
    data: meetings,
  };
};

/** Unirse a una reunión */
export const joinMeetingService = async (
  meetingId: string,
  userId: string
): Promise<ServiceResponse> => {
  const doc = await meetingsCollection.doc(meetingId).get();

  if (!doc.exists) {
    return {
      success: false,
      status: 404,
      message: "La reunión no existe",
    };
  }

  const meeting = doc.data() as Meeting;

  // Agregar participante si no está
  if (!meeting.participants.includes(userId)) {
    meeting.participants.push(userId);

    await meetingsCollection.doc(meetingId).update({
      participants: meeting.participants,
      updatedAt: Date.now(),
    });
  }

  return {
    success: true,
    status: 200,
    message: "Te uniste a la reunión",
    data: {
      id: doc.id,
      meetLink: meeting.meetLink, // <-- Se devuelve el link ya creado
      participants: meeting.participants,
    },
  };
};

/** Actualizar reunión */
export const updateMeetingService = async (
  meetingId: string,
  userId: string,
  data: Partial<Meeting>
): Promise<ServiceResponse> => {
  const doc = await meetingsCollection.doc(meetingId).get();

  if (!doc.exists) {
    return {
      success: false,
      status: 404,
      message: "La reunión no existe",
    };
  }

  const meeting = doc.data() as Meeting;

  if (meeting.ownerId !== userId) {
    return {
      success: false,
      status: 403,
      message: "No tienes permiso para editar la reunión",
    };
  }

  await meetingsCollection.doc(meetingId).update({
    ...data,
    updatedAt: Date.now(),
  });

  return {
    success: true,
    status: 200,
    message: "Reunión actualizada",
  };
};

/** Eliminar reunión */
export const deleteMeetingService = async (
  meetingId: string,
  userId: string
): Promise<ServiceResponse> => {
  const doc = await meetingsCollection.doc(meetingId).get();

  if (!doc.exists) {
    return {
      success: false,
      status: 404,
      message: "La reunión no existe",
    };
  }

  const meeting = doc.data() as Meeting;

  if (meeting.ownerId !== userId) {
    return {
      success: false,
      status: 403,
      message: "No tienes permiso para eliminar la reunión",
    };
  }

  await meetingsCollection.doc(meetingId).delete();

  return {
    success: true,
    status: 200,
    message: "Reunión eliminada",
  };
};