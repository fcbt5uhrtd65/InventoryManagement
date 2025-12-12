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
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Obtener un producto por ID
   * @param {string} id - ID del producto
   * @returns {Promise<Object>} Datos del producto
   */
  static async getById(id) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
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
        supplier_name: productData.supplier || productData.supplier_name,
        image: productData.image,
        active: true
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Actualizar un producto existente
   * @param {string} id - ID del producto
   * @param {Object} productData - Datos a actualizar
   * @returns {Promise<Object>} Producto actualizado
   */
  static async update(id, productData) {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
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
