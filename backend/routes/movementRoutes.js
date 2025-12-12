import express from 'express';
import {
  obtenerMovimientos,
  obtenerMovimientoPorId,
  crearMovimiento
} from '../controllers/movementController.js';

const router = express.Router();

// GET /api/movimientos - Obtener todos los movimientos (con filtros opcionales)
router.get('/', obtenerMovimientos);

// GET /api/movimientos/:id - Obtener movimiento por ID
router.get('/:id', obtenerMovimientoPorId);

// POST /api/movimientos - Crear movimiento y actualizar stock
router.post('/', crearMovimiento);

export default router;
