export interface Meeting {
  id?: string; // Firestore lo asigna
  title: string;
  description?: string;
  startTime: string; // ISO 8601
  endTime?: string; // opcional
  ownerId: string; // uid del usuario creador
  participants: string[]; // lista de uids
  status: "scheduled" | "ongoing" | "cancelled" | "finished";
  meetLink: string; // link personalizado
  createdAt: number;
  updatedAt: number;
}
