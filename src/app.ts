import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Aquí irán tus rutas

app.use("/api/users", userRoutes);
// app.use('/api/auth', authRoutes);

export default app;
