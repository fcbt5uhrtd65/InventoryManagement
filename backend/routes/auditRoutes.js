import express from 'express';
import {
  obtenerAuditoria,
  obtenerAuditoriaPorId,
  obtenerActividadUsuario,
  obtenerHistorialEntidad
} from '../controllers/auditController.js';

const router = express.Router();

// GET /api/auditoria - Obtener todos los registros de auditoría (con filtros)
router.get('/', obtenerAuditoria);

// GET /api/auditoria/:id - Obtener registro por ID
router.get('/:id', obtenerAuditoriaPorId);

// GET /api/auditoria/usuario/:usuarioId - Obtener actividad de un usuario
router.get('/usuario/:usuarioId', obtenerActividadUsuario);

// GET /api/auditoria/entidad/:entidad/:entidadId - Obtener historial de una entidad
router.get('/entidad/:entidad/:entidadId', obtenerHistorialEntidad);

export default router;
