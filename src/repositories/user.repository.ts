import { adminDb } from "../config/firebaseAdmin";
import { User } from "../models/user.model";

/**
 * Firestore Users Collection Reference.
 */
const usersCollection = adminDb.collection("users");

/**
 * Creates a new user document in Firestore.
 */
export async function createUserInDb(user: User): Promise<string> {
  const docRef = await usersCollection.add(user);
  return docRef.id;
}

/**
 * Finds a user in Firestore by ID.
 */
export async function findUserByIdInDb(id: string): Promise<User | null> {
  const doc = await usersCollection.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...(doc.data() as User) };
}

/**
 * Updates a user document in Firestore by ID.
 */
export async function updateUserInDb(
  id: string,
  data: Partial<User>
): Promise<void> {
  await usersCollection.doc(id).update(data);
}

/**
 * Deletes a user document from Firestore by ID.
 */
export async function deleteUserInDb(id: string): Promise<void> {
  await usersCollection.doc(id).delete();
}

/**
 * Finds a user in Firestore by email.
 */
export async function findUserByEmailInDb(
  email: string
): Promise<User | null> {
  const query = await usersCollection.where("email", "==", email).get();
  if (query.empty) return null;

  return { id: query.docs[0].id, ...(query.docs[0].data() as User) };
}

export async function findUserByResetToken(token: string): Promise<User | null> {
  const query = await usersCollection.where("resetPasswordToken", "==", token).get();

  if (query.empty) return null;

  return { id: query.docs[0].id, ...(query.docs[0].data() as User) };
}
