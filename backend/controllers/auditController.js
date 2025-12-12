import AuditLog from '../models/AuditLog.js';

// Obtener todos los registros de auditoría
export const obtenerAuditoria = async (req, res) => {
  try {
    const filters = {
      usuarioId: req.query.usuarioId,
      entidad: req.query.entidad,
      accion: req.query.accion,
      fechaInicio: req.query.fechaInicio,
      fechaFin: req.query.fechaFin,
      limit: req.query.limit ? parseInt(req.query.limit) : 100
    };
    
    const registros = await AuditLog.getAll(filters);
    
    res.json({
      success: true,
      data: registros
    });
  } catch (error) {
    console.error('Error al obtener registros de auditoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener registros de auditoría',
      error: error.message
    });
  }
};

// Obtener registro de auditoría por ID
export const obtenerAuditoriaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const registro = await AuditLog.getById(id);
    
    if (!registro) {
      return res.status(404).json({
        success: false,
        message: 'Registro de auditoría no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: registro
    });
  } catch (error) {
    console.error('Error al obtener registro de auditoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener registro de auditoría',
      error: error.message
    });
  }
};

// Obtener actividad de un usuario
export const obtenerActividadUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit) : 50;
    
    const actividad = await AuditLog.getActividadUsuario(usuarioId, limit);
    
    res.json({
      success: true,
      data: actividad
    });
  } catch (error) {
    console.error('Error al obtener actividad del usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener actividad del usuario',
      error: error.message
    });
  }
};

// Obtener historial de una entidad
export const obtenerHistorialEntidad = async (req, res) => {
  try {
    const { entidad, entidadId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit) : 50;
    
    const historial = await AuditLog.getHistorialEntidad(entidad, entidadId, limit);
    
    res.json({
      success: true,
      data: historial
    });
  } catch (error) {
    console.error('Error al obtener historial de la entidad:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener historial de la entidad',
      error: error.message
    });
  }
};
