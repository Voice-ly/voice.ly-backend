/**
 * Application entrypoint that wires Express middlewares and routes.
 *
 * This file configures CORS, logging, body parsing and cookie parsing,
 * mounts the authentication and user routes under `/api/*`, and attaches
 * the global error handler.
 *
 * Only request handling and middleware registration should live here;
 * business logic is delegated to controllers and services.
 */
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import meetingRoutes from './routes/meeting.routes';
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

// para que no sobrescriba SameSite
app.set("trust proxy", 1);

/**
 * Parse allowed origins from ALLOWED_ORIGINS environment variable.
 * Defaults to localhost:3000 and localhost:5000 if not set.
 *
 * @constant {string[]}
 */
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000,http://localhost:5000")
    .split(",")
    .map(origin => origin.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Aquí irán tus rutas

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/meetings", meetingRoutes);
// app.use('/api/auth', authRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

/**
 * Express application instance configured with middleware and routes.
 *
 * Exported as default to be used by the HTTP server bootstrap in `server.ts`.
 */
export default app;
