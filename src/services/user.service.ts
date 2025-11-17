// src/services/user.service.ts
import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import * as userRepo from "../repositories/user.repository";

//CREATE
export async function createUserService(data: User) {
  // Hashear la contraseña antes de guardar
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const userToSave: User = { ...data, password: hashedPassword };

  return await userRepo.createUserInDb(userToSave);
}

//READ ALL
export async function getUsersService() {
  return await userRepo.getAllUsersFromDb();
}

//UPDATE
export async function updateUserService(id: string, data: Partial<User>) {
  // Si viene contraseña, la hasheamos
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  await userRepo.updateUserInDb(id, data);
}

//DELETE
export async function deleteUserService(id: string) {
  await userRepo.deleteUserInDb(id);
}

//FIND BY EMAIL
export async function findUserByEmailService(email: string) {
  return await userRepo.findUserByEmailInDb(email);
}