import Warehouse from '../models/Warehouse.js';
import AuditLog from '../models/AuditLog.js';

// Obtener todas las bodegas
export const obtenerBodegas = async (req, res) => {
  try {
    const bodegas = await Warehouse.getAll();
    
    res.json({
      success: true,
      data: bodegas
    });
  } catch (error) {
    console.error('Error al obtener bodegas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener bodegas',
      error: error.message
    });
  }
};

// Obtener bodega por ID
export const obtenerBodegaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const bodega = await Warehouse.getById(id);
    
    if (!bodega) {
      return res.status(404).json({
        success: false,
        message: 'Bodega no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: bodega
    });
  } catch (error) {
    console.error('Error al obtener bodega:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener bodega',
      error: error.message
    });
  }
};

// Crear bodega
export const crearBodega = async (req, res) => {
  try {
    const bodega = await Warehouse.create(req.body);
    
    // Registrar en auditoría
    if (req.user) {
      await AuditLog.log(
        req.user.id,
        req.user.nombre,
        'CREAR',
        'bodegas',
        bodega.id,
        `Bodega ${bodega.nombre} creada`,
        req
      );
    }
    
    res.status(201).json({
      success: true,
      message: 'Bodega creada exitosamente',
      data: bodega
    });
  } catch (error) {
    console.error('Error al crear bodega:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear bodega',
      error: error.message
    });
  }
};

// Actualizar bodega
export const actualizarBodega = async (req, res) => {
  try {
    const { id } = req.params;
    const bodega = await Warehouse.update(id, req.body);
    
    // Registrar en auditoría
    if (req.user) {
      await AuditLog.log(
        req.user.id,
        req.user.nombre,
        'ACTUALIZAR',
        'bodegas',
        id,
        `Bodega ${bodega.nombre} actualizada`,
        req
      );
    }
    
    res.json({
      success: true,
      message: 'Bodega actualizada exitosamente',
      data: bodega
    });
  } catch (error) {
    console.error('Error al actualizar bodega:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar bodega',
      error: error.message
    });
  }
};

// Eliminar bodega (soft delete)
export const eliminarBodega = async (req, res) => {
  try {
    const { id } = req.params;
    const bodega = await Warehouse.delete(id);
    
    // Registrar en auditoría
    if (req.user) {
      await AuditLog.log(
        req.user.id,
        req.user.nombre,
        'ELIMINAR',
        'bodegas',
        id,
        `Bodega ${bodega.nombre} desactivada`,
        req
      );
    }
    
    res.json({
      success: true,
      message: 'Bodega eliminada exitosamente',
      data: bodega
    });
  } catch (error) {
    console.error('Error al eliminar bodega:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar bodega',
      error: error.message
    });
  }
};

// Obtener productos de una bodega
export const obtenerProductosBodega = async (req, res) => {
  try {
    const { id } = req.params;
    const productos = await Warehouse.getProductos(id);
    
    res.json({
      success: true,
      data: productos
    });
  } catch (error) {
    console.error('Error al obtener productos de la bodega:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos de la bodega',
      error: error.message
    });
  }
};
