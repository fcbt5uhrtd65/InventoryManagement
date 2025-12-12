import express from 'express';
import {
  obtenerBodegas,
  obtenerBodegaPorId,
  crearBodega,
  actualizarBodega,
  eliminarBodega,
  obtenerProductosBodega
} from '../controllers/warehouseController.js';

const router = express.Router();

// GET /api/bodegas - Obtener todas las bodegas
router.get('/', obtenerBodegas);

// GET /api/bodegas/:id - Obtener bodega por ID
router.get('/:id', obtenerBodegaPorId);

// GET /api/bodegas/:id/productos - Obtener productos de una bodega
router.get('/:id/productos', obtenerProductosBodega);

// POST /api/bodegas - Crear nueva bodega
router.post('/', crearBodega);

// PUT /api/bodegas/:id - Actualizar bodega
router.put('/:id', actualizarBodega);

// DELETE /api/bodegas/:id - Eliminar bodega (soft delete)
router.delete('/:id', eliminarBodega);

export default router;
