/**
 * Controlador de Órdenes de Compra
 * Maneja la lógica de negocio para órdenes de compra
 */

import PurchaseOrder from '../models/PurchaseOrder.js';
import { addAuditLog } from './auditController.js';

/**
 * Obtener todas las órdenes de compra
 */
export const getAllPurchaseOrders = async (req, res) => {
  try {
    const orders = await PurchaseOrder.getAll();
    
    res.status(200).json({
      success: true,
      data: orders,
      count: orders.length
    });
  } catch (error) {
    console.error('Error al obtener órdenes de compra:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener órdenes de compra',
      error: error.message
    });
  }
};

/**
 * Obtener órdenes por estado
 */
export const getPurchaseOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const validStatuses = ['pendiente', 'aprobada', 'rechazada', 'completada'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Estado inválido'
      });
    }

    const orders = await PurchaseOrder.getByStatus(status);
    
    res.status(200).json({
      success: true,
      data: orders,
      count: orders.length
    });
  } catch (error) {
    console.error('Error al obtener órdenes por estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener órdenes por estado',
      error: error.message
    });
  }
};

/**
 * Obtener órdenes por proveedor
 */
export const getPurchaseOrdersBySupplier = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const orders = await PurchaseOrder.getBySupplier(supplierId);
    
    res.status(200).json({
      success: true,
      data: orders,
      count: orders.length
    });
  } catch (error) {
    console.error('Error al obtener órdenes por proveedor:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener órdenes por proveedor',
      error: error.message
    });
  }
};

/**
 * Obtener una orden de compra por ID
 */
export const getPurchaseOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await PurchaseOrder.getById(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Orden de compra no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error al obtener orden de compra:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener orden de compra',
      error: error.message
    });
  }
};

/**
 * Crear una nueva orden de compra
 */
export const createPurchaseOrder = async (req, res) => {
  try {
    const { supplier_id, supplier_name, total_amount, created_by, notes, items } = req.body;

    // Validaciones
    if (!supplier_id || !supplier_name || !created_by || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Datos incompletos'
      });
    }

    // Calcular el monto total si no viene
    const calculatedTotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    const orderData = {
      supplier_id,
      supplier_name,
      total_amount: total_amount || calculatedTotal,
      status: 'pendiente',
      created_by,
      notes,
      items
    };

    const newOrder = await PurchaseOrder.create(orderData);

    // Registrar en auditoría
    await addAuditLog({
      body: {
        user_id: created_by,
        user_name: req.body.user_name || 'Usuario',
        action: 'CREAR',
        entity: 'orden_compra',
        entity_id: newOrder.id,
        details: `Orden de compra creada para ${supplier_name} por $${total_amount}`
      }
    }, { status: () => ({ json: () => {} }) });

    res.status(201).json({
      success: true,
      message: 'Orden de compra creada exitosamente',
      data: newOrder
    });
  } catch (error) {
    console.error('Error al crear orden de compra:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear orden de compra',
      error: error.message
    });
  }
};

/**
 * Actualizar una orden de compra
 */
export const updatePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const orderData = req.body;

    // Solo permitir actualizar órdenes pendientes
    const existingOrder = await PurchaseOrder.getById(id);
    if (existingOrder.status !== 'pendiente') {
      return res.status(400).json({
        success: false,
        message: 'Solo se pueden editar órdenes pendientes'
      });
    }

    const updatedOrder = await PurchaseOrder.update(id, orderData);

    // Registrar en auditoría
    if (req.body.user_id) {
      await addAuditLog({
        body: {
          user_id: req.body.user_id,
          user_name: req.body.user_name || 'Usuario',
          action: 'ACTUALIZAR',
          entity: 'orden_compra',
          entity_id: id,
          details: `Orden de compra actualizada`
        }
      }, { status: () => ({ json: () => {} }) });
    }

    res.status(200).json({
      success: true,
      message: 'Orden de compra actualizada exitosamente',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Error al actualizar orden de compra:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar orden de compra',
      error: error.message
    });
  }
};

/**
 * Aprobar una orden de compra
 */
export const approvePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, user_name } = req.body;

    const order = await PurchaseOrder.approve(id, user_id);

    // Registrar en auditoría
    await addAuditLog({
      body: {
        user_id,
        user_name: user_name || 'Usuario',
        action: 'APROBAR',
        entity: 'orden_compra',
        entity_id: id,
        details: `Orden de compra aprobada`
      }
    }, { status: () => ({ json: () => {} }) });

    res.status(200).json({
      success: true,
      message: 'Orden de compra aprobada exitosamente',
      data: order
    });
  } catch (error) {
    console.error('Error al aprobar orden de compra:', error);
    res.status(500).json({
      success: false,
      message: 'Error al aprobar orden de compra',
      error: error.message
    });
  }
};

/**
 * Rechazar una orden de compra
 */
export const rejectPurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, user_name } = req.body;

    const order = await PurchaseOrder.reject(id, user_id);

    // Registrar en auditoría
    await addAuditLog({
      body: {
        user_id,
        user_name: user_name || 'Usuario',
        action: 'RECHAZAR',
        entity: 'orden_compra',
        entity_id: id,
        details: `Orden de compra rechazada`
      }
    }, { status: () => ({ json: () => {} }) });

    res.status(200).json({
      success: true,
      message: 'Orden de compra rechazada exitosamente',
      data: order
    });
  } catch (error) {
    console.error('Error al rechazar orden de compra:', error);
    res.status(500).json({
      success: false,
      message: 'Error al rechazar orden de compra',
      error: error.message
    });
  }
};

/**
 * Completar una orden de compra (crear movimientos de entrada)
 */
export const completePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, user_name } = req.body;

    if (!user_id || !user_name) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere user_id y user_name'
      });
    }

    const order = await PurchaseOrder.complete(id, user_id, user_name);

    // Registrar en auditoría
    await addAuditLog({
      body: {
        user_id,
        user_name,
        action: 'COMPLETAR',
        entity: 'orden_compra',
        entity_id: id,
        details: `Orden de compra completada - Stock actualizado`
      }
    }, { status: () => ({ json: () => {} }) });

    res.status(200).json({
      success: true,
      message: 'Orden de compra completada - Productos recibidos en inventario',
      data: order
    });
  } catch (error) {
    console.error('Error al completar orden de compra:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al completar orden de compra',
      error: error.message
    });
  }
};

/**
 * Eliminar una orden de compra
 */
export const deletePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Solo permitir eliminar órdenes pendientes o rechazadas
    const existingOrder = await PurchaseOrder.getById(id);
    if (existingOrder.status === 'completada') {
      return res.status(400).json({
        success: false,
        message: 'No se pueden eliminar órdenes completadas'
      });
    }

    await PurchaseOrder.delete(id);

    // Registrar en auditoría
    if (req.body.user_id) {
      await addAuditLog({
        body: {
          user_id: req.body.user_id,
          user_name: req.body.user_name || 'Usuario',
          action: 'ELIMINAR',
          entity: 'orden_compra',
          entity_id: id,
          details: `Orden de compra eliminada`
        }
      }, { status: () => ({ json: () => {} }) });
    }

    res.status(200).json({
      success: true,
      message: 'Orden de compra eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar orden de compra:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar orden de compra',
      error: error.message
    });
  }
};

/**
 * Obtener estadísticas de órdenes de compra
 */
export const getPurchaseOrderStats = async (req, res) => {
  try {
    const stats = await PurchaseOrder.getStats();
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
};
