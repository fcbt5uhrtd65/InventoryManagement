import { supabase } from '../config/supabaseClient.js';

class Supplier {
  // Obtener todos los proveedores
  static async getAll() {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  // Obtener proveedor por ID
  static async getById(id) {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Crear proveedor
  static async create(supplierData) {
    // Mapear solo los campos que existen en la BD
    const dataToInsert = {
      name: supplierData.name,
      contact: supplierData.contact,
      email: supplierData.email,
      phone: supplierData.phone,
      nit: supplierData.nit,
      address: supplierData.address,
      active: supplierData.active !== undefined ? supplierData.active : true
    };
    
    const { data, error } = await supabase
      .from('suppliers')
      .insert([dataToInsert])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Actualizar proveedor
  static async update(id, supplierData) {
    // Mapear solo los campos que existen en la BD y filtrar undefined
    const dataToUpdate = {};
    
    if (supplierData.name !== undefined) dataToUpdate.name = supplierData.name;
    if (supplierData.contact !== undefined) dataToUpdate.contact = supplierData.contact;
    if (supplierData.email !== undefined) dataToUpdate.email = supplierData.email;
    if (supplierData.phone !== undefined) dataToUpdate.phone = supplierData.phone;
    if (supplierData.nit !== undefined) dataToUpdate.nit = supplierData.nit;
    if (supplierData.address !== undefined) dataToUpdate.address = supplierData.address;
    if (supplierData.active !== undefined) dataToUpdate.active = supplierData.active;
    
    const { data, error } = await supabase
      .from('suppliers')
      .update(dataToUpdate)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Eliminar proveedor (soft delete)
  static async delete(id) {
    const { data, error } = await supabase
      .from('suppliers')
      .update({ active: false })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Obtener productos de un proveedor
  static async getProductos(proveedorId) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('supplier_id', proveedorId)
      .eq('active', true);
    
    if (error) throw error;
    return data;
  }
}

export default Supplier;
