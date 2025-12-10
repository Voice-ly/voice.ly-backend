// src/services/user.service.ts
import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import * as userRepo from "../repositories/user.repository";

/**
 * Create a new user and persist it.
 *
 * @async
 * @function createUserService
 * @param {User} data - The user data received from the controller.
 * @returns {Promise<string>} The ID of the newly created user in Firestore.
 */
export async function createUserService(data: User): Promise<string> {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const userToSave: User = { ...data, password: hashedPassword };

  return await userRepo.createUserInDb(userToSave);
}

/**
 * Find a user by id.
 *
 * @async
 * @function findUserByIdService
 * @param {string} id - ID del usuario (UID)
 * @returns {Promise<User | null>} El usuario encontrado o null si no existe
 */
export async function findUserByIdService(id: string): Promise<User | null> {
  return await userRepo.findUserByIdInDb(id);
}

/**
 * Update an existing user.
 *
 * @async
 * @function updateUserService
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
 * Delete a user.
 *
 * @async
 * @function deleteUserService
 * @param {string} id - The ID of the user to delete.
 * @returns {Promise<void>}
 */
export async function deleteUserService(id: string): Promise<void> {
  await userRepo.deleteUserInDb(id);
}
/**
 * Find a user by email.
 *
 * @async
 * @function findUserByEmailService
 * @param {string} email - The email to search for.
 * @returns {Promise<User | null>} The found user or null if not found.
 */
export async function findUserByEmailService(
  email: string
): Promise<User | null> {
  return await userRepo.findUserByEmailInDb(email);
}


/**
 * Find a user by reset token.
 *
 * @async
 * @function findUserByTokenService
 * @param {string} token - Reset token to search.
 * @returns {Promise<User | null>} The found user or null if not found.
 */
export async function findUserByTokenService(
  token: string
): Promise<User | null> {
  return await userRepo.findUserByResetToken(token);
}

/**
 * Remove sensitive fields from a User object before sending to clients.
 *
 * @function sanitizeUser
 * @param {User} user - Full user object
 * @returns {Omit<User, 'password' | 'resetPasswordToken'>} Sanitized user object
 */
export function sanitizeUser(user: User) {
  const { password, resetPasswordToken, ...rest } = user;
  return rest;
}

// /meeting-service/src/services/user.service.ts (AÑADIDO)

/**
 * Get the list of email addresses for a given array of User IDs.
 * @async
 * @function getUsersEmailsByIdsService
 * @param {string[]} userIds - Array of User IDs.
 * @returns {Promise<string[]>} Array of valid email addresses.
 */
export async function getUsersEmailsByIdsService(userIds: string[]): Promise<string[]> {
    
    // LOG 1: ¿Qué IDs recibimos del Meeting Service? ⭐️
    console.log("[DEBUG USER SERVICE] IDs recibidos:", userIds); 
    
    if (userIds.length === 0) {
        // Esto NO debería ocurrir si el Meeting Service envió la petición, pero es seguro.
        return [];
    }

    // Obtener los usuarios del repositorio (Usando la función que añadimos)
    const users = await userRepo.findUsersByIdsInDb(userIds);
    
    // LOG 2: ¿Qué usuarios se encontraron en Firestore? ⭐️
    console.log("[DEBUG USER SERVICE] Usuarios encontrados (objetos):", users.map(u => ({ id: u.id, email: u.email })));

    // Extraer y filtrar solo los correos válidos
    // Tu user.model.ts define 'email: string', lo cual es correcto.
    const emails = users
        .map(user => user.email) 
        .filter(email => email && email.includes('@')); 

    //LOG 3: ¿Qué correos válidos estamos devolviendo? ⭐️
    console.log("[DEBUG USER SERVICE] Correos válidos devueltos:", emails);

    return emails;
}
