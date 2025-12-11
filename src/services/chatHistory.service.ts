// El archivo debe importar el adminDb que ya tienes configurado en tu proyecto
import { adminDb } from "../config/firebaseAdmin";
interface ChatMessage {
    id: string;
    senderId: string;
    username: string;
    message: string;
    timestamp: number;
}

const meetingsCollection = adminDb.collection("meetings");

/**
 * Lee directamente el historial de chat de Firestore.
 * Esto es una delegación temporal para evitar el bloqueo del proxy de Render (404).
 */
export async function getHistoryByRoomId(roomId: string): Promise<ChatMessage[]> {
    try {
        const chatHistorySnapshot = await meetingsCollection
            .doc(roomId)
            .collection("chat_history")
            .orderBy("timestamp", "asc") // Usar el campo de ordenación correcto
            .get();

        // Mapear documentos para devolver un array limpio de mensajes
        const history: ChatMessage[] = chatHistorySnapshot.docs.map(doc => ({
            ...doc.data() as ChatMessage,
            id: doc.id,
        }));
        
        console.log(`[DEBUG LECTURA LOCAL] Historial de chat leído con éxito desde Firestore. Total: ${history.length}`);
        return history;
    } catch (error) {
        console.error("🔴 Error al obtener historial de chat directamente de Firestore:", error);
        // Devolver un array vacío para que el proceso de la IA pueda continuar
        return [];
    }
}