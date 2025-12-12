import Supplier from '../models/Supplier.js';
import AuditLog from '../models/AuditLog.js';

// Obtener todos los proveedores
export const obtenerProveedores = async (req, res) => {
  try {
    const proveedores = await Supplier.getAll();
    
    res.json({
      success: true,
      data: proveedores
    });
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener proveedores',
      error: error.message
    });
  }
};

// Obtener proveedor por ID
export const obtenerProveedorPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const proveedor = await Supplier.getById(id);
    
    if (!proveedor) {
      return res.status(404).json({
        success: false,
        message: 'Proveedor no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: proveedor
    });
  } catch (error) {
    console.error('Error al obtener proveedor:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener proveedor',
      error: error.message
    });
  }
};

// Crear proveedor
export const crearProveedor = async (req, res) => {
  try {
    const proveedor = await Supplier.create(req.body);
    
    // Registrar en auditoría
    if (req.user) {
      await AuditLog.log(
        req.user.id,
        req.user.nombre,
        'CREAR',
        'proveedores',
        proveedor.id,
        `Proveedor ${proveedor.nombre} creado`,
        req
      );
    }
    
    res.status(201).json({
      success: true,
      message: 'Proveedor creado exitosamente',
      data: proveedor
    });
  } catch (error) {
    console.error('Error al crear proveedor:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear proveedor',
      error: error.message
    });
  }
};

// Actualizar proveedor
export const actualizarProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const proveedor = await Supplier.update(id, req.body);
    
    // Registrar en auditoría
    if (req.user) {
      await AuditLog.log(
        req.user.id,
        req.user.nombre,
        'ACTUALIZAR',
        'proveedores',
        id,
        `Proveedor ${proveedor.nombre} actualizado`,
        req
      );
    }
    
    res.json({
      success: true,
      message: 'Proveedor actualizado exitosamente',
      data: proveedor
    });
  } catch (error) {
    console.error('Error al actualizar proveedor:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar proveedor',
      error: error.message
    });
  }
};

// Eliminar proveedor (soft delete)
export const eliminarProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const proveedor = await Supplier.delete(id);
    
    // Registrar en auditoría
    if (req.user) {
      await AuditLog.log(
        req.user.id,
        req.user.nombre,
        'ELIMINAR',
        'proveedores',
        id,
        `Proveedor ${proveedor.nombre} desactivado`,
        req
      );
    }
    
    res.json({
      success: true,
      message: 'Proveedor eliminado exitosamente',
      data: proveedor
    });
  } catch (error) {
    console.error('Error al eliminar proveedor:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar proveedor',
      error: error.message
    });
  }
};

// Obtener productos de un proveedor
export const obtenerProductosProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const productos = await Supplier.getProductos(id);
    
    res.json({
      success: true,
      data: productos
    });
  } catch (error) {
    console.error('Error al obtener productos del proveedor:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos del proveedor',
      error: error.message
    });
  }
};
