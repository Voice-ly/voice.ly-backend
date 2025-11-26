/**
 * User controller
 *
 * Exposes HTTP handlers for user management and authentication flows.
 * Controllers are thin and delegate business rules to services.
 */
import admin from "firebase-admin";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import crypto from "crypto";

import {
  createUserService,
  updateUserService,
  deleteUserService,
  findUserByEmailService,
  findUserByTokenService,
  findUserByIdService,
  sanitizeUser,
} from "../services/user.service";
import { sendPasswordResetEmail } from "../utils/email";

// Extiende User para incluir el ID de Firestore
interface UserWithId extends User {
  id: string;
}

/**
 * Create a new user.
 *
 * @async
 * @function createUser
 * @param {Request} req - Express request with user data in `req.body`.
 * @param {Response} res - Express response used to return status and data.
 * @returns {Promise<Response>} 201 with created user id or error response.
 */

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
      password,
      createdAt: new Date(),
    };

    const id = await createUserService(userData);

    res.status(201).json({ id, message: "Usuario creado correctamente" });
  } catch (error: any) {
    console.error("Error creando usuario:", error);
    res.status(500).json({ error: error.message });
  }
};


/**
 * Get the authenticated user's profile.
 *
 * @async
 * @function getUsers
 * @param {Request} req - Express request; expects `req.user` populated by auth middleware.
 * @param {Response} res - Express response used to return the sanitized user.
 * @returns {Promise<Response>} 200 with user profile or error response.
 */
export const getUsers = async (req: Request, res: Response) => {
  try {

    if (!req.user) return res.status(402).json({ message: "Token inválido" });

    const email: any = req.user.email;
    const user: any = (await findUserByEmailService(email)) as UserWithId | null;


    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    console.log(user);

    return res.json(sanitizeUser(user));

  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};


/**
 * Update the authenticated user's profile.
 *
 * @async
 * @function updateUser
 * @param {Request} req - Express request; expects `req.user` and updated fields in `req.body`.
 * @param {Response} res - Express response used to return status.
 * @returns {Promise<Response>} 200 on success or error response.
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Token inválido" });


    const email: any = req.user.email;
    const user: any = (await findUserByEmailService(email)) as UserWithId | null;
    const data = req.body;

    const allowedFields: (keyof User)[] = ["firstName", "lastName", "age", "email", "password"];
    const updateData: Partial<User> = {};

    // Actualizar cualquier campo permitido
    for (const field of allowedFields) {
      if (data[field] !== undefined && data[field] !== "") {
        updateData[field] = data[field];
      }
    }

    // Validaciones
    if (updateData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updateData.email)) {
        throw { status: 400, message: "Email inválido" };
      }
    }

    if (updateData.password) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
      if (!passwordRegex.test(updateData.password)) {
        throw {
          status: 400,
          message:
            "La contraseña debe tener 8 caracteres, mayúscula, minúscula y un caracter especial",
        };
      }
    }

    await updateUserService(user.id, updateData);

    return res.json({ message: "Usuario actualizado" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Delete the authenticated user's account.
 *
 * @async
 * @function deleteUser
 * @param {Request} req - Express request; expects `req.user`.
 * @param {Response} res - Express response used to return status.
 * @returns {Promise<Response>} 200 on success or error response.
 */

export const deleteUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Token inválido" });

    const password = req.body.password;
    if (!password) return res.status(400).json({ message: "Contraseña requerida para eliminar cuenta" });

    const email: string = req.user.email || "";
    const user: any = (await findUserByEmailService(email)) as UserWithId | null;

    const match = await bcrypt.compare(password, user?.password);
    if (!match) return res.status(401).json({ message: "Contraseña incorrecta" });


    await deleteUserService(user.id);


    return res.json({ message: "Usuario eliminado correctamente" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Authenticate user and issue JWT cookie.
 *
 * @async
 * @function loginUser
 * @param {Request} req - Express request with `email` and `password` in body.
 * @param {Response} res - Express response used to set cookie and return status.
 * @returns {Promise<Response>} 200 on success or error response.
 */
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email y contraseña requeridos" });

    const user = (await findUserByEmailService(email)) as UserWithId | null;
    if (!user) return res.status(401).json({ message: "Usuario no encontrado" });

    if (!user.password) return res.status(401).json({ message: "Credenciales inválidas" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Contraseña incorrecta" });

    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ message: "JWT_SECRET no está configurado" });

    // Determinar expiresIn para jwt y maxAge para cookie (ms)
    const expiresEnv = process.env.JWT_EXPIRES_IN || "1h"; // puede ser '3600' (segundos), '1h', '30m', etc.
    let cookieMaxAge = 60 * 60 * 1000; // default 1h en ms

    if (/^\d+$/.test(expiresEnv)) {
      // valor en segundos
      cookieMaxAge = Number(expiresEnv) * 1000;
    } else if (/^\d+h$/i.test(expiresEnv)) {
      cookieMaxAge = Number(expiresEnv.replace(/h/i, "")) * 60 * 60 * 1000;
    } else if (/^\d+m$/i.test(expiresEnv)) {
      cookieMaxAge = Number(expiresEnv.replace(/m/i, "")) * 60 * 1000;
    }

    // Crear token JWT (jsonwebtoken acepta string|number para expiresIn)
    const token = (jwt as any).sign({ uid: user.id, email: user.email }, secret as any, {
      expiresIn: expiresEnv,
    });

    // Guardamos el token en cookie HTTP-only
    const isProduction = process.env.NODE_ENV === "production" || req.secure || req.headers["x-forwarded-proto"] === "https";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,           // secure solo en HTTPS
      sameSite: isProduction ? "none" : "lax", // none en producción, lax en local
      domain: ".voice-ly.onrender.com", // Ajusta el dominio según tu configuración
      maxAge: cookieMaxAge,
    });

    return res.json({ message: "Login exitoso" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Logout handler - clears authentication cookie.
 *
 * @function logoutUser
 * @param {Request} req - Express request.
 * @param {Response} res - Express response used to clear cookie.
 */
export const logoutUser = (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain: ".voice-ly.onrender.com",
    });

    return res.json({ message: "Usuario deslogueado correctamente" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Handles the password recovery process by generating a reset token,
 * storing it in the database, and sending a password reset email.
 *
 * @async
 * @function forgotPassword
 * @param {Request} req - Express request object containing the user's email in the body.
 * @param {Response} res - Express response object used to return the operation result.
 * 
 * @returns {Promise<Response>} JSON message indicating success or failure.
 * 
 * @description
 * Steps performed by this handler:
 * 1. Validate the email received in the request body.
 * 2. Search for a user with the provided email.
 * 3. Generate a secure random token for password reset.
 * 4. Save the token in the database associated with the user.
 * 5. Generate a reset URL pointing to the frontend application.
 * 6. Send the password reset email using Mailtrap.
 * 7. Return an appropriate JSON response.
 */

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    // 1. Validar email
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // 2. Buscar usuario en tu DB
    const user: any = await findUserByEmailService(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 3. Generar token único
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 4. Guardar token y expiración en la DB
    await updateUserService(user.id, {
      resetPasswordToken: resetToken,
    });

    // 5. Crear URL de recuperación
    if (!process.env.FRONTEND_URL) {
      return res.status(500).json({ message: "FRONTEND_URL no está configurada" });
    }

    const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Enviar correo usando Mailtrap
    await sendPasswordResetEmail(email, resetURL);

    return res.json({ message: "Password reset link sent to email" });
  } catch (error: any) {
    console.error("Error sending reset email:", error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Resets the user's password by validating the reset token,
 * checking password security rules, and updating the user's data.
 *
 * @async
 * @function resetPassword
 * @param {Request} req - Express request containing token (query) and new password (body).
 * @param {Response} res - Express response used to return the process result.
 *
 * @returns {Promise<Response>} JSON response indicating success or failure.
 *
 * @description
 * This function performs the following steps:
 * 1. Extract token from query params and password from request body.
 * 2. Validate that both fields are present.
 * 3. Search for a user with the matching reset token in the database.
 * 4. Validate password strength based on security rules.
 * 5. Update the user's password and clear the token from the database.
 * 6. Respond with a success message or an error.
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const tokenRaw = req.query.token;
    console.log(tokenRaw);

    const { password } = req.body;
    const tokenStr = typeof tokenRaw === "string" ? tokenRaw : Array.isArray(tokenRaw) ? tokenRaw[0] : undefined;
    if (!tokenStr) return res.status(400).json({ message: "Token requerido" });

    const user = (await findUserByTokenService(tokenStr as string)) as UserWithId | null;
    if (!user) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    // Validar contraseña segura
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "La contraseña debe tener al menos 8 caracteres, incluir letra mayúscula, minúscula y un caracter especial",
      });
    }


    await updateUserService(user.id, {
      resetPasswordToken: '',
      password,
    });

    return res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error al restablecer la contraseña" });
  }
}

export const socialAuthController = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    // Firebase Admin verifica el token independientemente del proveedor (Google, Facebook, GitHub, etc.)
    const decodedUser = await admin.auth().verifyIdToken(idToken);
    const email: any = decodedUser.email;

    let user: any = (await findUserByEmailService(email)) as UserWithId | null;

    if (!user) {
      user = {
        firstName: decodedUser.name || "Sin Nombre",
        email: email || "",
        password: crypto.randomBytes(16).toString("hex"),
        createdAt: new Date(),
      };

      await createUserService(user);
    }


    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ message: "JWT_SECRET no está configurado" });

    const expiresEnv = process.env.JWT_EXPIRES_IN || "1h"; // puede ser '3600' (segundos), '1h', '30m', etc.
    let cookieMaxAge = 60 * 60 * 1000; // default 1h en ms

    if (/^\d+$/.test(expiresEnv)) {
      // valor en segundos
      cookieMaxAge = Number(expiresEnv) * 1000;
    } else if (/^\d+h$/i.test(expiresEnv)) {
      cookieMaxAge = Number(expiresEnv.replace(/h/i, "")) * 60 * 60 * 1000;
    } else if (/^\d+m$/i.test(expiresEnv)) {
      cookieMaxAge = Number(expiresEnv.replace(/m/i, "")) * 60 * 1000;
    }

    // Crear token JWT (jsonwebtoken acepta string|number para expiresIn)
    const token = (jwt as any).sign({ uid: user.id, email: user.email }, secret as any, {
      expiresIn: expiresEnv,
    });

    // Guardamos el token en cookie HTTP-only
    const isProduction = process.env.NODE_ENV === "production" || req.secure || req.headers["x-forwarded-proto"] === "https";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,           // secure solo en HTTPS
      sameSite: isProduction ? "none" : "lax", // none en producción, lax en local
      domain: ".voice-ly.onrender.com", // Ajusta el dominio según tu configuración
      maxAge: cookieMaxAge,
    });

    return res.json({ message: "Login exitoso" });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Token inválido" });
  }
};