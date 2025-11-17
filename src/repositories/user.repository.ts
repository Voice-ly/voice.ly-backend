import { adminDb } from "../config/firebaseAdmin";
import { User } from "../models/user.model";

const usersCollection = adminDb.collection("users");

//CREATE
export async function createUserInDb(user: User) {
  const docRef = await usersCollection.add(user);
  return docRef.id;
}

//READ ALL
export async function getAllUsersFromDb() {
  const snapshot = await usersCollection.get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

//UPDATE
export async function updateUserInDb(id: string, data: Partial<User>) {
  await usersCollection.doc(id).update(data);
}

//DELETE
export async function deleteUserInDb(id: string) {
  await usersCollection.doc(id).delete();
}

//FIND BY EMAIL
export async function findUserByEmailInDb(email: string) {
  const query = await usersCollection.where("email", "==", email).get();
  if (query.empty) return null;
  return { id: query.docs[0].id, ...query.docs[0].data() };
}
