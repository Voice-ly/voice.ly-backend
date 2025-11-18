import { adminDb } from "../config/firebaseAdmin";
import { User } from "../models/user.model";

/**
 * Firestore Users Collection Reference.
 *
 * This collection stores user documents containing user information such as
 * first name, last name, email, age, and creation date.
 */
const usersCollection = adminDb.collection("users");

/**
 * Creates a new user document in Firestore.
 *
 * @param {User} user - The user object to be stored in Firestore.
 * @returns {Promise<string>} The generated Firestore document ID.
 */
export async function createUserInDb(user: User): Promise<string> {
  const docRef = await usersCollection.add(user);
  return docRef.id;
}

/**
 * Retrieves all users from the Firestore collection.
 *
 * @returns {Promise<Array<object>>} An array of user objects with their IDs included.
 */
export async function getAllUsersFromDb(): Promise<Array<object>> {
  const snapshot = await usersCollection.get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/**
 * Updates a user document in Firestore.
 *
 * @param {string} id - The ID of the user document to update.
 * @param {Partial<User>} data - The fields to update in the user document.
 * @returns {Promise<void>}
 */
export async function updateUserInDb(
  id: string,
  data: Partial<User>
): Promise<void> {
  await usersCollection.doc(id).update(data);
}

/**
 * Deletes a user document from Firestore.
 *
 * @param {string} id - The ID of the user document to delete.
 * @returns {Promise<void>}
 */
export async function deleteUserInDb(id: string): Promise<void> {
  await usersCollection.doc(id).delete();
}

/**
 * Finds a user in Firestore by email.
 *
 * @param {string} email - The email address to search for.
 * @returns {Promise<object | null>} The found user object with ID included, or null if not found.
 */
export async function findUserByEmailInDb(
  email: string
): Promise<object | null> {
  const query = await usersCollection.where("email", "==", email).get();
  if (query.empty) return null;

  return { id: query.docs[0].id, ...query.docs[0].data() };
}


export async function findUserByResetToken(token: string) {
  const query = await usersCollection.where("resetPasswordToken", "==", token).get();

  if (query.empty) return null;

  return { id: query.docs[0].id, ...query.docs[0].data() };
}
