import { supabase } from '../config/supabaseClient.js';

class Warehouse {
  // Obtener todas las bodegas
  static async getAll() {
    const { data, error } = await supabase
      .from('warehouses')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  // Obtener bodega por ID
  static async getById(id) {
    const { data, error } = await supabase
      .from('warehouses')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Crear bodega
  static async create(warehouseData) {
    const { data, error } = await supabase
      .from('warehouses')
      .insert([warehouseData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Actualizar bodega
  static async update(id, warehouseData) {
    const { data, error } = await supabase
      .from('warehouses')
      .update(warehouseData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Eliminar bodega (soft delete)
  static async delete(id) {
    const { data, error } = await supabase
      .from('warehouses')
      .update({ active: false })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Obtener productos en una bodega
  static async getProductos(bodegaId) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('warehouse_id', bodegaId)
      .eq('active', true);
    
    if (error) throw error;
    return data;
  }
}

export default Warehouse;
