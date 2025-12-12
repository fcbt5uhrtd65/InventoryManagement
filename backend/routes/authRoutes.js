import express from 'express';
import { register, login, logout, getCurrentUser } from '../controllers/authController.js';

const router = express.Router();

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', register);

// POST /api/auth/login - Iniciar sesión
router.post('/login', login);

// POST /api/auth/logout - Cerrar sesión
router.post('/logout', logout);

// GET /api/auth/user/:userId - Obtener usuario actual
router.get('/user/:userId', getCurrentUser);

export default router;
