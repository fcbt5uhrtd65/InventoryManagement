import { supabase } from '../config/supabaseClient.js';

class AuditLog {
  // Obtener todos los registros de auditoría
  static async getAll(filters = {}) {
    let query = supabase
      .from('audit_logs')
      .select('*')
      .order('timestamp', { ascending: false });
    
    // Filtros opcionales
    if (filters.usuarioId) {
      query = query.eq('user_id', filters.usuarioId);
    }
    if (filters.entidad) {
      query = query.eq('entity', filters.entidad);
    }
    if (filters.accion) {
      query = query.eq('action', filters.accion);
    }
    if (filters.fechaInicio) {
      query = query.gte('timestamp', filters.fechaInicio);
    }
    if (filters.fechaFin) {
      query = query.lte('timestamp', filters.fechaFin);
    }
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  }

  // Obtener registro por ID
  static async getById(id) {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Crear registro de auditoría
  static async create(logData) {
    const { data, error } = await supabase
      .from('audit_logs')
      .insert([logData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Registrar acción de auditoría
  static async log(usuarioId, usuarioNombre, accion, entidad, entidadId, detalles = '', req = null) {
    const logData = {
      user_id: usuarioId,
      user_name: usuarioNombre,
      action: accion,
      entity: entidad,
      entity_id: entidadId,
      details: detalles
    };
    
    return await this.create(logData);
  }

  // Obtener actividad reciente de un usuario
  static async getActividadUsuario(usuarioId, limit = 50) {
    return await this.getAll({
      usuarioId,
      limit
    });
  }

  // Obtener historial de una entidad específica
  static async getHistorialEntidad(entidad, entidadId, limit = 50) {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('entity', entidad)
      .eq('entity_id', entidadId)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }
}

export default AuditLog;
