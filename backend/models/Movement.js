import { supabase } from '../config/supabaseClient.js';

class Movement {
  // Obtener todos los movimientos
  static async getAll(filters = {}) {
    let query = supabase
      .from('movements')
      .select('*')
      .order('date', { ascending: false });
    
    // Filtros opcionales
    if (filters.tipo) {
      query = query.eq('tipo', filters.tipo);
    }
    if (filters.productoId) {
      query = query.eq('producto_id', filters.productoId);
    }
    if (filters.usuarioId) {
      query = query.eq('usuario_id', filters.usuarioId);
    }
    if (filters.fechaInicio) {
      query = query.gte('fecha', filters.fechaInicio);
    }
    if (filters.fechaFin) {
      query = query.lte('fecha', filters.fechaFin);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  }

  // Obtener movimiento por ID
  static async getById(id) {
    const { data, error } = await supabase
      .from('movements')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Crear movimiento
  static async create(movementData) {
    const { data, error } = await supabase
      .from('movements')
      .insert([{
        type: movementData.type,
        product_id: movementData.product_id,
        product_name: movementData.product_name,
        quantity: movementData.quantity,
        date: movementData.date,
        observation: movementData.observation,
        user_id: movementData.user_id,
        user_name: movementData.user_name,
        lot_number: movementData.lot_number,
        reason: movementData.reason,
        warehouse_id: movementData.warehouse_id,
        warehouse_name: movementData.warehouse_name
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Actualizar stock del producto según el movimiento
  static async actualizarStockProducto(productoId, tipo, cantidad) {
    // Obtener el stock actual
    const { data: producto, error: errorProducto } = await supabase
      .from('products')
      .select('stock')
      .eq('id', productoId)
      .single();
    
    if (errorProducto) throw errorProducto;
    
    let nuevoStock = producto.stock;
    
    // Calcular nuevo stock según el tipo de movimiento
    switch (tipo) {
      case 'entrada':
        nuevoStock += cantidad;
        break;
      case 'salida':
        nuevoStock -= cantidad;
        if (nuevoStock < 0) {
          throw new Error('Stock insuficiente para realizar la salida');
        }
        break;
      case 'ajuste':
        nuevoStock = cantidad; // El ajuste establece el stock exacto
        break;
      case 'devolucion':
        nuevoStock += cantidad;
        break;
      default:
        throw new Error('Tipo de movimiento no válido');
    }
    
    // Actualizar el stock
    const { error: errorUpdate } = await supabase
      .from('products')
      .update({ stock: nuevoStock })
      .eq('id', productoId);
    
    if (errorUpdate) throw errorUpdate;
    
    return nuevoStock;
  }

  // Registrar movimiento y actualizar stock (transacción)
  static async registrarMovimiento(movementData) {
    try {
      // 1. Actualizar stock del producto
      const nuevoStock = await this.actualizarStockProducto(
        movementData.product_id,
        movementData.type,
        movementData.quantity
      );
      
      // 2. Crear el registro de movimiento
      const movimiento = await this.create(movementData);
      
      return {
        movimiento,
        nuevoStock
      };
    } catch (error) {
      throw error;
    }
  }
}

export default Movement;
