/**
 * Firestore repository for user documents.
 *
 * Encapsulates direct interactions with the Firestore `users` collection.
 * The functions return domain `User` objects or `null` when no document is
 * found. Keep data access patterns here; higher-level logic belongs in services.
 */
import * as admin from "firebase-admin";
import { adminDb } from "../config/firebaseAdmin";
import { User } from "../models/user.model";

/**
 * Firestore Users Collection Reference.
 */
const usersCollection = adminDb.collection("users");

/**
 * Creates a new user document in Firestore.
 */
/**
 * Create a user document in Firestore.
 *
 * @async
 * @function createUserInDb
 * @param {User} user - User object to persist.
 * @returns {Promise<string>} Firestore document id for the created user.
 */
export async function createUserInDb(user: User): Promise<string> {
  const docRef = await usersCollection.add(user);
  return docRef.id;
}

/**
 * Finds a user in Firestore by ID.
 */
/**
 * Find a user document by its Firestore id.
 *
 * @async
 * @function findUserByIdInDb
 * @param {string} id - Firestore document id.
 * @returns {Promise<User|null>} User object or null when not found.
 */
export async function findUserByIdInDb(id: string): Promise<User | null> {
  const doc = await usersCollection.doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...(doc.data() as User) };
}

/**
 * Updates a user document in Firestore by ID.
 */
/**
 * Update fields of a user document.
 *
 * @async
 * @function updateUserInDb
 * @param {string} id - Firestore document id.
 * @param {Partial<User>} data - Partial user data to update.
 * @returns {Promise<void>}
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
/**
 * Delete a user document by id.
 *
 * @async
 * @function deleteUserInDb
 * @param {string} id - Firestore document id.
 * @returns {Promise<void>}
 */
export async function deleteUserInDb(id: string): Promise<void> {
  await usersCollection.doc(id).delete();
}

/**
 * Finds a user in Firestore by email.
 */
/**
 * Find a user by email.
 *
 * @async
 * @function findUserByEmailInDb
 * @param {string} email - Email to search.
 * @returns {Promise<User|null>} User object or null when not found.
 */
export async function findUserByEmailInDb(
  email: string
): Promise<User | null> {
  const query = await usersCollection.where("email", "==", email).get();
  if (query.empty) return null;

  return { id: query.docs[0].id, ...(query.docs[0].data() as User) };
}

/**
 * Find a user by reset token.
 *
 * @async
 * @function findUserByResetToken
 * @param {string} token - Reset token to search.
 * @returns {Promise<User|null>} User object or null when not found.
 */
export async function findUserByResetToken(token: string): Promise<User | null> {
  const query = await usersCollection.where("resetPasswordToken", "==", token).get();

  if (query.empty) return null;

  return { id: query.docs[0].id, ...(query.docs[0].data() as User) };
}

/**
 * Finds multiple users in Firestore by a list of IDs.
 *
 * @async
 * @function findUsersByIdsInDb
 * @param {string[]} ids - Array of Firestore document ids (User IDs).
 * @returns {Promise<User[]>} Array of User objects found.
 */
export async function findUsersByIdsInDb(ids: string[]): Promise<User[]> {
  if (ids.length === 0) {
    return [];
  }
  
  //Acceder a FieldPath a través de admin.firestore
  const snapshot = await usersCollection
    .where(admin.firestore.FieldPath.documentId(), 'in', ids)
    .get();

  const users = snapshot.docs.map(doc => ({ 
    id: doc.id, 
    ...(doc.data() as User) 
  }));

  return users;
}