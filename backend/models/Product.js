/**
 * Modelo de Producto
 * Define la estructura y las operaciones de base de datos para los productos
 * Se conecta a la tabla 'products' en Supabase
 */

import { supabase } from '../config/supabaseClient.js';

/**
 * Clase Product - Modelo MVC
 * Representa la entidad Producto y maneja la lógica de acceso a datos
 */
class Product {
  /**
   * Obtener todos los productos activos
   * @returns {Promise<Array>} Lista de productos
   */
  static async getAll() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        suppliers:supplier_id (
          id,
          name
        ),
        warehouses:warehouse_id (
          id,
          name
        )
      `)
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Mapear los datos para incluir el nombre del proveedor y almacén
    return data.map(product => ({
      ...product,
      supplier_name: product.suppliers?.name || product.supplier_name || '',
      warehouse_name: product.warehouses?.name || product.warehouse_name || '',
      // Asegurar que los IDs estén disponibles
      supplier_id: product.supplier_id,
      warehouse_id: product.warehouse_id
    }));
  }

  /**
   * Obtener un producto por ID
   * @param {string} id - ID del producto
   * @returns {Promise<Object>} Datos del producto
   */
  static async getById(id) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        suppliers:supplier_id (
          id,
          name
        ),
        warehouses:warehouse_id (
          id,
          name
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Producto no encontrado');
    
    // Mapear nombres
    return {
      ...data,
      supplier_name: data.suppliers?.name || data.supplier_name || '',
      warehouse_name: data.warehouses?.name || data.warehouse_name || '',
      supplier_id: data.supplier_id,
      warehouse_id: data.warehouse_id
    };
  }

  /**
   * Crear un nuevo producto
   * @param {Object} productData - Datos del producto a crear
   * @returns {Promise<Object>} Producto creado
   */
  static async create(productData) {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: productData.name || productData.nombre,
        description: productData.description || productData.descripcion,
        price: productData.price || productData.precio,
        stock: productData.stock || 0,
        min_stock: productData.min_stock || 0,
        max_stock: productData.max_stock || 100,
        code: productData.code || productData.codigo,
        category: productData.category || productData.categoria,
        supplier_id: productData.supplierId || productData.supplier_id || null,
        supplier_name: productData.supplier || productData.supplier_name || null,
        warehouse_id: productData.warehouseId || productData.warehouse_id || null,
        image: productData.image,
        active: true
      }])
      .select(`
        *,
        suppliers:supplier_id (
          id,
          name
        ),
        warehouses:warehouse_id (
          id,
          name
        )
      `)
      .single();

    if (error) throw error;
    
    // Mapear nombres y asegurar IDs
    return {
      ...data,
      supplier_name: data.suppliers?.name || data.supplier_name || '',
      warehouse_name: data.warehouses?.name || data.warehouse_name || '',
      supplier_id: data.supplier_id,
      warehouse_id: data.warehouse_id
    };
  }

  /**
   * Actualizar un producto existente
   * @param {string} id - ID del producto
   * @param {Object} productData - Datos a actualizar
   * @returns {Promise<Object>} Producto actualizado
   */
  static async update(id, productData) {
    // Preparar los datos para actualizar
    const updateData = { ...productData };
    
    // Si se está actualizando el proveedor por nombre, buscar el ID
    if (productData.supplierId) {
      updateData.supplier_id = productData.supplierId;
      delete updateData.supplierId;
    }
    if (productData.warehouseId) {
      updateData.warehouse_id = productData.warehouseId;
      delete updateData.warehouseId;
    }
    
    // Actualizar el producto
    const { error: updateError } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id);

    if (updateError) throw updateError;
    
    // Obtener el producto actualizado (usando getById que ya funciona)
    return this.getById(id);
  }

  /**
   * Eliminar un producto (soft delete)
   * @param {string} id - ID del producto
   * @returns {Promise<Object>} Producto eliminado
   */
  static async delete(id) {
    const { data, error } = await supabase
      .from('products')
      .update({ active: false })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export default Product;
