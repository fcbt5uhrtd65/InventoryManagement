import Movement from '../models/Movement.js';
import AuditLog from '../models/AuditLog.js';

// Obtener todos los movimientos
export const obtenerMovimientos = async (req, res) => {
  try {
    const filters = {
      tipo: req.query.tipo,
      productoId: req.query.productoId,
      usuarioId: req.query.usuarioId,
      fechaInicio: req.query.fechaInicio,
      fechaFin: req.query.fechaFin
    };
    
    const movimientos = await Movement.getAll(filters);
    
    res.json({
      success: true,
      data: movimientos
    });
  } catch (error) {
    console.error('Error al obtener movimientos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener movimientos',
      error: error.message
    });
  }
};

// Obtener movimiento por ID
export const obtenerMovimientoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const movimiento = await Movement.getById(id);
    
    if (!movimiento) {
      return res.status(404).json({
        success: false,
        message: 'Movimiento no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: movimiento
    });
  } catch (error) {
    console.error('Error al obtener movimiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener movimiento',
      error: error.message
    });
  }
};

// Crear movimiento y actualizar stock
export const crearMovimiento = async (req, res) => {
  try {
    const movementData = req.body;
    
    // Mapear campos inglés a español para compatibilidad
    const tipo = movementData.type || movementData.tipo;
    const producto_id = movementData.productId || movementData.producto_id;
    const cantidad = movementData.quantity || movementData.cantidad;
    const observacion = movementData.observation || movementData.observacion || '';
    const usuario_id = movementData.userId || movementData.usuario_id;
    const usuario_nombre = movementData.userName || movementData.usuario_nombre;
    const producto_nombre = movementData.productName || movementData.producto_nombre;
    
    // Validaciones
    if (!tipo || !producto_id || !cantidad || !usuario_id) {
      return res.status(400).json({
        success: false,
        message: 'Tipo, producto, cantidad y usuario son requeridos'
      });
    }
    
    if (cantidad <= 0) {
      return res.status(400).json({
        success: false,
        message: 'La cantidad debe ser mayor a 0'
      });
    }
    
    // Registrar movimiento y actualizar stock
    const resultado = await Movement.registrarMovimiento({
      type: tipo,
      product_id: producto_id,
      product_name: producto_nombre,
      quantity: cantidad,
      date: new Date().toISOString(),
      observation: observacion,
      user_id: usuario_id,
      user_name: usuario_nombre
    });
    
    // Registrar en auditoría
    await AuditLog.log(
      usuario_id,
      usuario_nombre,
      `MOVIMIENTO_${tipo.toUpperCase()}`,
      'movimientos',
      resultado.movimiento.id,
      `${tipo} de ${cantidad} unidades de ${producto_nombre}. Nuevo stock: ${resultado.nuevoStock}`,
      req
    );
    
    res.status(201).json({
      success: true,
      message: `Movimiento de ${tipo} registrado exitosamente`,
      data: {
        movimiento: resultado.movimiento,
        nuevoStock: resultado.nuevoStock
      }
    });
  } catch (error) {
    console.error('Error al crear movimiento:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al crear movimiento',
      error: error.message
    });
  }
};
