// src/services/user.service.ts
import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import * as userRepo from "../repositories/user.repository";

/**
 * Creates a new user using the repository layer.
 *
 * The password is hashed before storing the user data in the database.
 *
 * @param {User} data - The user data received from the controller.
 * @returns {Promise<string>} The ID of the newly created user in Firestore.
 */
export async function createUserService(data: User): Promise<string> {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const userToSave: User = { ...data, password: hashedPassword };

  return await userRepo.createUserInDb(userToSave);
}

/**
 * Encuentra un usuario por su ID (UID).
 * Este método se usará para que un usuario solo pueda ver su propio perfil.
 *
 * @param {string} id - ID del usuario (UID)
 * @returns {Promise<User | null>} El usuario encontrado o null si no existe
 */
export async function findUserByIdService(id: string): Promise<User | null> {
  return await userRepo.findUserByIdInDb(id);
}

/**
 * Updates an existing user.
 *
 * If the updated data contains a password, it is hashed before saving.
 *
 * @param {string} id - The ID of the user to update.
 * @param {Partial<User>} data - The fields that should be updated.
 * @returns {Promise<void>}
 */
export async function updateUserService(
  id: string,
  data: Partial<User>
): Promise<void> {
    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    }

    await userRepo.updateUserInDb(id, data);
}

/**
 * Deletes a user from the database.
 *
 * @param {string} id - The ID of the user to delete.
 * @returns {Promise<void>}
 */
export async function deleteUserService(id: string): Promise<void> {
  await userRepo.deleteUserInDb(id);
}

/**
 * Finds a user by their email address.
 *
 * @param {string} email - The email to search for.
 * @returns {Promise<object | null>} The found user or null if not found.
 */
export async function findUserByEmailService(
  email: string
): Promise<User | null> {
  return await userRepo.findUserByEmailInDb(email);
}


export async function findUserByTokenService(
  token: string
): Promise<User | null> {
  return await userRepo.findUserByResetToken(token);
}
