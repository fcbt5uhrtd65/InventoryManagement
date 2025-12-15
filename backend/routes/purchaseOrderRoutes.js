/**
 * Rutas de Órdenes de Compra
 * Define los endpoints para gestionar órdenes de compra
 */

import express from 'express';
import {
  getAllPurchaseOrders,
  getPurchaseOrderById,
  getPurchaseOrdersByStatus,
  getPurchaseOrdersBySupplier,
  createPurchaseOrder,
  updatePurchaseOrder,
  approvePurchaseOrder,
  rejectPurchaseOrder,
  completePurchaseOrder,
  deletePurchaseOrder,
  getPurchaseOrderStats
} from '../controllers/purchaseOrderController.js';

const router = express.Router();

/**
 * @route   GET /api/ordenes-compra
 * @desc    Obtener todas las órdenes de compra
 * @access  Privado
 */
router.get('/', getAllPurchaseOrders);

/**
 * @route   GET /api/ordenes-compra/stats
 * @desc    Obtener estadísticas de órdenes de compra
 * @access  Privado
 */
router.get('/stats', getPurchaseOrderStats);

/**
 * @route   GET /api/ordenes-compra/estado/:status
 * @desc    Obtener órdenes por estado (pendiente, aprobada, rechazada, completada)
 * @access  Privado
 */
router.get('/estado/:status', getPurchaseOrdersByStatus);

/**
 * @route   GET /api/ordenes-compra/proveedor/:supplierId
 * @desc    Obtener órdenes por proveedor
 * @access  Privado
 */
router.get('/proveedor/:supplierId', getPurchaseOrdersBySupplier);

/**
 * @route   GET /api/ordenes-compra/:id
 * @desc    Obtener una orden de compra por ID
 * @access  Privado
 */
router.get('/:id', getPurchaseOrderById);

/**
 * @route   POST /api/ordenes-compra
 * @desc    Crear una nueva orden de compra
 * @access  Privado (admin, encargado_bodega)
 */
router.post('/', createPurchaseOrder);

/**
 * @route   PUT /api/ordenes-compra/:id
 * @desc    Actualizar una orden de compra (solo pendientes)
 * @access  Privado (admin, encargado_bodega)
 */
router.put('/:id', updatePurchaseOrder);

/**
 * @route   PATCH /api/ordenes-compra/:id/aprobar
 * @desc    Aprobar una orden de compra
 * @access  Privado (admin)
 */
router.patch('/:id/aprobar', approvePurchaseOrder);

/**
 * @route   PATCH /api/ordenes-compra/:id/rechazar
 * @desc    Rechazar una orden de compra
 * @access  Privado (admin)
 */
router.patch('/:id/rechazar', rejectPurchaseOrder);

/**
 * @route   PATCH /api/ordenes-compra/:id/completar
 * @desc    Completar una orden de compra (crear movimientos de entrada)
 * @access  Privado (admin, encargado_bodega)
 */
router.patch('/:id/completar', completePurchaseOrder);

/**
 * @route   DELETE /api/ordenes-compra/:id
 * @desc    Eliminar una orden de compra (solo pendientes/rechazadas)
 * @access  Privado (admin)
 */
router.delete('/:id', deletePurchaseOrder);

export default router;
