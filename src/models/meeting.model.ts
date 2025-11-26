export interface Meeting {
  id?: string;
  title: string;
  description?: string;

  ownerId: string;
  participants: string[];

  meetLink: string;  
  status: "scheduled" | "ongoing" | "cancelled" | "finished";

  createdAt: number;
  updatedAt: number;
}
