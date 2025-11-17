import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";

import {
  createUserService,
  getUsersService,
  updateUserService,
  deleteUserService,
  findUserByEmailService,
} from "../services/user.service";

// CREATE
export const createUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, age, email, password } = req.body;

    // Validaciones básicas
    if (!email || !password || !firstName || !lastName || !age) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Validar contraseña segura
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "La contraseña debe tener al menos 8 caracteres, incluir letra mayúscula, minúscula y un caracter especial",
      });
    }

    // Validar si el usuario ya existe
    const existingUser = await findUserByEmailService(email);
    if (existingUser) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Crear usuario
    const userData: User = {
      firstName,
      lastName,
      age,
      email,
      password: await bcrypt.hash(password, 10),
      createdAt: new Date(),
    };

    const id = await createUserService(userData);

    res.status(201).json({ id, message: "Usuario creado correctamente" });
  } catch (error: any) {
    console.error("Error creando usuario:", error);
    res.status(500).json({ error: error.message });
  }
};

// READ
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsersService();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const data = req.body;

    // Si se intenta actualizar la contraseña, la encriptamos
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    await updateUserService(userId, data);

    res.json({ message: "Usuario actualizado" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    await deleteUserService(userId);

    res.json({ message: "Usuario eliminado" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};