import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import userRoutes from './routes/user.routes';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Aquí irán tus rutas

app.use("/api/users", userRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);

export default app;
