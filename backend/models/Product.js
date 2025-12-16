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
    
    console.log(`Obteniendo almacenes para ${data.length} productos`);
    
    // Para cada producto, obtener sus almacenes desde product_warehouses
    const productsWithWarehouses = await Promise.all(
      data.map(async (product) => {
        const { data: warehouseData, error: whError } = await supabase
          .from('product_warehouses')
          .select('warehouse_id')
          .eq('product_id', product.id);
        
        if (whError) {
          console.error(`Error obteniendo almacenes para producto ${product.id}:`, whError);
        }
        
        let warehouseIds = warehouseData?.map(w => w.warehouse_id) || [];
        
        // Si no hay warehouseIds pero sí warehouse_id, migrar el dato
        if (warehouseIds.length === 0 && product.warehouse_id) {
          console.log(`Migrando warehouse_id para producto ${product.code}: ${product.warehouse_id}`);
          warehouseIds = [product.warehouse_id];
          
          // Crear la relación en product_warehouses
          const { error: insertError } = await supabase
            .from('product_warehouses')
            .insert({
              product_id: product.id,
              warehouse_id: product.warehouse_id,
              stock_in_warehouse: product.stock || 0
            });
          
          if (insertError && insertError.code !== '23505') {
            console.error('Error al migrar warehouse_id:', insertError);
          }
        }
        
        return {
          ...product,
          supplier_name: product.suppliers?.name || product.supplier_name || '',
          warehouse_name: product.warehouses?.name || product.warehouse_name || '',
          supplier_id: product.supplier_id,
          supplierId: product.supplier_id,
          warehouse_id: product.warehouse_id,
          warehouseId: product.warehouse_id,
          warehouseIds: warehouseIds
        };
      })
    );
    
    console.log('Productos procesados con warehouseIds');
    
    return productsWithWarehouses;
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
    
    // Obtener almacenes asociados desde product_warehouses
    const { data: warehouseData, error: whError } = await supabase
      .from('product_warehouses')
      .select('warehouse_id')
      .eq('product_id', id);
    
    if (whError) {
      console.error(`Error obteniendo almacenes para producto ${id}:`, whError);
    }
    
    let warehouseIds = warehouseData?.map(w => w.warehouse_id) || [];
    
    // Si no hay warehouseIds pero sí warehouse_id, migrar el dato
    if (warehouseIds.length === 0 && data.warehouse_id) {
      console.log(`Migrando warehouse_id para producto ${data.code}: ${data.warehouse_id}`);
      warehouseIds = [data.warehouse_id];
      
      // Crear la relación en product_warehouses
      const { error: insertError } = await supabase
        .from('product_warehouses')
        .insert({
          product_id: data.id,
          warehouse_id: data.warehouse_id,
          stock_in_warehouse: data.stock || 0
        });
      
      if (insertError && insertError.code !== '23505') {
        console.error('Error al migrar warehouse_id:', insertError);
      }
    }
    
    console.log(`Producto ${data.code} tiene ${warehouseIds.length} almacenes`);
    
    // Mapear nombres
    return {
      ...data,
      supplier_name: data.suppliers?.name || data.supplier_name || '',
      warehouse_name: data.warehouses?.name || data.warehouse_name || '',
      supplier_id: data.supplier_id,
      supplierId: data.supplier_id,
      warehouse_id: data.warehouse_id,
      warehouseId: data.warehouse_id,
      warehouseIds: warehouseIds
    };
  }

  /**
   * Crear un nuevo producto
   * @param {Object} productData - Datos del producto a crear
   * @returns {Promise<Object>} Producto creado
   */
  static async create(productData) {
    console.log('Product.create recibido:', productData);
    
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: productData.name || productData.nombre,
        description: productData.description || productData.descripcion,
        price: productData.price || productData.precio,
        stock: productData.stock || 0,
        min_stock: productData.min_stock || productData.minStock || 0,
        max_stock: productData.max_stock || productData.maxStock || 100,
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
    
    // Si hay supplierId, crear la relación en supplier_products
    const supplierId = productData.supplierId || productData.supplier_id;
    if (supplierId && data.id) {
      const { error: relationError } = await supabase
        .from('supplier_products')
        .insert([{
          supplier_id: supplierId,
          product_id: data.id
        }]);
      
      if (relationError && relationError.code !== '23505') { // Ignorar duplicados
        console.error('Error al crear relación supplier_products:', relationError);
      }
    }
    
    // Si hay warehouseIds, crear las relaciones en product_warehouses
    const warehouseIds = productData.warehouseIds || [];
    console.log('Creando relaciones para warehouseIds:', warehouseIds);
    
    if (warehouseIds.length > 0 && data.id) {
      const warehouseRelations = warehouseIds.map(warehouseId => ({
        product_id: data.id,
        warehouse_id: warehouseId,
        stock_in_warehouse: 0
      }));
      
      console.log('Insertando en product_warehouses:', warehouseRelations);
      
      const { error: warehouseError } = await supabase
        .from('product_warehouses')
        .insert(warehouseRelations);
      
      if (warehouseError) {
        console.error('Error al crear relación product_warehouses:', warehouseError);
      } else {
        console.log('Relaciones de almacenes creadas exitosamente');
      }
    }
    
    // Mapear nombres y asegurar IDs
    return {
      ...data,
      supplier_name: data.suppliers?.name || data.supplier_name || '',
      warehouse_name: data.warehouses?.name || data.warehouse_name || '',
      supplier_id: data.supplier_id,
      supplierId: data.supplier_id,
      warehouse_id: data.warehouse_id,
      warehouseId: data.warehouse_id,
      warehouseIds: warehouseIds
    };
  }

  /**
   * Actualizar un producto existente
   * @param {string} id - ID del producto
   * @param {Object} productData - Datos a actualizar
   * @returns {Promise<Object>} Producto actualizado
   */
  static async update(id, productData) {
    console.log('Product.update recibido para id:', id);
    console.log('Product.update data:', productData);
    
    // Preparar los datos para actualizar
    const updateData = { ...productData };
    
    // Guardar el nuevo supplierId para actualizar la relación
    const newSupplierId = productData.supplierId || productData.supplier_id;
    const newWarehouseIds = productData.warehouseIds;
    
    console.log('newWarehouseIds:', newWarehouseIds);
    
    // Si se está actualizando el proveedor por nombre, buscar el ID
    if (productData.supplierId) {
      updateData.supplier_id = productData.supplierId;
      delete updateData.supplierId;
    }
    if (productData.warehouseId) {
      updateData.warehouse_id = productData.warehouseId;
      delete updateData.warehouseId;
    }
    
    // Eliminar warehouseIds del update ya que no es una columna de la tabla products
    delete updateData.warehouseIds;
    
    // Actualizar el producto
    const { error: updateError } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id);

    if (updateError) throw updateError;
    
    // Si se actualizó el supplier_id, actualizar la tabla supplier_products
    if (newSupplierId !== undefined) {
      // Eliminar relaciones anteriores
      await supabase
        .from('supplier_products')
        .delete()
        .eq('product_id', id);
      
      // Si hay un nuevo proveedor, crear la relación
      if (newSupplierId) {
        const { error: relationError } = await supabase
          .from('supplier_products')
          .insert([{
            supplier_id: newSupplierId,
            product_id: id
          }]);
        
        if (relationError && relationError.code !== '23505') { // Ignorar duplicados
          console.error('Error al actualizar relación supplier_products:', relationError);
        }
      }
    }
    
    // Si se actualizó warehouseIds, actualizar la tabla product_warehouses
    if (newWarehouseIds !== undefined && Array.isArray(newWarehouseIds)) {
      console.log('Actualizando almacenes para producto:', id);
      
      // Eliminar relaciones anteriores
      const { error: deleteError } = await supabase
        .from('product_warehouses')
        .delete()
        .eq('product_id', id);
      
      if (deleteError) {
        console.error('Error al eliminar relaciones antiguas:', deleteError);
      } else {
        console.log('Relaciones antiguas eliminadas');
      }
      
      // Crear nuevas relaciones
      if (newWarehouseIds.length > 0) {
        const warehouseRelations = newWarehouseIds.map(warehouseId => ({
          product_id: id,
          warehouse_id: warehouseId,
          stock_in_warehouse: 0
        }));
        
        console.log('Insertando nuevas relaciones:', warehouseRelations);
        
        const { error: warehouseError } = await supabase
          .from('product_warehouses')
          .insert(warehouseRelations);
        
        if (warehouseError) {
          console.error('Error al actualizar relación product_warehouses:', warehouseError);
        } else {
          console.log('Relaciones de almacenes actualizadas exitosamente');
        }
      }
    }
    
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
