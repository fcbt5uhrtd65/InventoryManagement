/**
 * Rutas de Productos
 * Define los endpoints HTTP para la gestión de productos
 * Conecta las URLs con los controladores
 */

import express from 'express';
import {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../controllers/productController.js';

const router = express.Router();

/**
 * @route   GET /api/productos
 * @desc    Obtener todos los productos
 * @access  Public
 */
router.get('/', obtenerProductos);

/**
 * @route   GET /api/productos/:id
 * @desc    Obtener un producto por ID
 * @access  Public
 */
router.get('/:id', obtenerProductoPorId);

/**
 * @route   POST /api/productos
 * @desc    Crear un nuevo producto
 * @access  Private (añadir autenticación después)
 */
router.post('/', crearProducto);

/**
 * @route   PUT /api/productos/:id
 * @desc    Actualizar un producto
 * @access  Private
 */
router.put('/:id', actualizarProducto);

/**
 * @route   DELETE /api/productos/:id
 * @desc    Eliminar un producto (soft delete)
 * @access  Private
 */
router.delete('/:id', eliminarProducto);

export default router;
