import express from 'express';
import {
  obtenerProveedores,
  obtenerProveedorPorId,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor,
  obtenerProductosProveedor
} from '../controllers/supplierController.js';

const router = express.Router();

// GET /api/proveedores - Obtener todos los proveedores
router.get('/', obtenerProveedores);

// GET /api/proveedores/:id - Obtener proveedor por ID
router.get('/:id', obtenerProveedorPorId);

// GET /api/proveedores/:id/productos - Obtener productos de un proveedor
router.get('/:id/productos', obtenerProductosProveedor);

// POST /api/proveedores - Crear nuevo proveedor
router.post('/', crearProveedor);

// PUT /api/proveedores/:id - Actualizar proveedor
router.put('/:id', actualizarProveedor);

// DELETE /api/proveedores/:id - Eliminar proveedor (soft delete)
router.delete('/:id', eliminarProveedor);

export default router;
