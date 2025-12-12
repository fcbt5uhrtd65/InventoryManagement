import express from 'express';
import {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} from '../controllers/userController.js';

const router = express.Router();

// GET /api/usuarios - Obtener todos los usuarios
router.get('/', obtenerUsuarios);

// GET /api/usuarios/:id - Obtener usuario por ID
router.get('/:id', obtenerUsuarioPorId);

// POST /api/usuarios - Crear nuevo usuario
router.post('/', crearUsuario);

// PUT /api/usuarios/:id - Actualizar usuario
router.put('/:id', actualizarUsuario);

// DELETE /api/usuarios/:id - Eliminar usuario (soft delete)
router.delete('/:id', eliminarUsuario);

export default router;
