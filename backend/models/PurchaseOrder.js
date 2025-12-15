/**
 * Modelo de Orden de Compra
 * Gestiona las órdenes de compra a proveedores
 */

import { supabase } from '../config/supabaseClient.js';

class PurchaseOrder {
  /**
   * Obtener todas las órdenes de compra
   */
  static async getAll() {
    const { data, error } = await supabase
      .from('purchase_orders')
      .select(`
        *,
        supplier:suppliers(id, name, email),
        items:purchase_order_items(
          id,
          product_id,
          product_name,
          quantity,
          price,
          subtotal
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Obtener órdenes por estado
   */
  static async getByStatus(status) {
    const { data, error } = await supabase
      .from('purchase_orders')
      .select(`
        *,
        supplier:suppliers(id, name, email),
        items:purchase_order_items(
          id,
          product_id,
          product_name,
          quantity,
          price,
          subtotal
        )
      `)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Obtener órdenes por proveedor
   */
  static async getBySupplier(supplierId) {
    const { data, error } = await supabase
      .from('purchase_orders')
      .select(`
        *,
        supplier:suppliers(id, name, email),
        items:purchase_order_items(
          id,
          product_id,
          product_name,
          quantity,
          price,
          subtotal
        )
      `)
      .eq('supplier_id', supplierId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Obtener una orden de compra por ID
   */
  static async getById(id) {
    const { data, error } = await supabase
      .from('purchase_orders')
      .select(`
        *,
        supplier:suppliers(id, name, email, phone, address),
        items:purchase_order_items(
          id,
          product_id,
          product_name,
          quantity,
          price,
          subtotal
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Crear una nueva orden de compra
   */
  static async create(orderData) {
    const { items, ...orderInfo } = orderData;

    // 1. Crear la orden principal
    const { data: order, error: orderError } = await supabase
      .from('purchase_orders')
      .insert([orderInfo])
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Crear los items de la orden
    const itemsWithOrderId = items.map(item => ({
      purchase_order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      price: item.price
    }));

    const { error: itemsError } = await supabase
      .from('purchase_order_items')
      .insert(itemsWithOrderId);

    if (itemsError) {
      // Rollback: eliminar la orden si falló la creación de items
      await supabase.from('purchase_orders').delete().eq('id', order.id);
      throw itemsError;
    }

    // 3. Retornar la orden completa con sus items
    return await this.getById(order.id);
  }

  /**
   * Actualizar el estado de una orden
   */
  static async updateStatus(id, status, userId) {
    const { data, error } = await supabase
      .from('purchase_orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Aprobar una orden de compra
   */
  static async approve(id, userId) {
    return await this.updateStatus(id, 'aprobada', userId);
  }

  /**
   * Rechazar una orden de compra
   */
  static async reject(id, userId) {
    return await this.updateStatus(id, 'rechazada', userId);
  }

  /**
   * Completar una orden de compra (y crear movimientos de entrada)
   */
  static async complete(id, userId, userName) {
    // 1. Obtener la orden con sus items
    const order = await this.getById(id);
    
    if (order.status !== 'aprobada') {
      throw new Error('Solo se pueden completar órdenes aprobadas');
    }

    // 2. Crear movimientos de entrada para cada item
    const movements = order.items.map(item => ({
      type: 'entrada',
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      date: new Date().toISOString(),
      observation: `Orden de compra #${order.id.substring(0, 8)} - ${order.supplier.name}`,
      user_id: userId,
      user_name: userName,
      reason: `Recepción de orden de compra`
    }));

    // 3. Insertar los movimientos
    const { error: movementsError } = await supabase
      .from('movements')
      .insert(movements);

    if (movementsError) throw movementsError;

    // 4. Actualizar el stock de cada producto
    for (const item of order.items) {
      const { data: product } = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.product_id)
        .single();

      if (product) {
        await supabase
          .from('products')
          .update({ 
            stock: product.stock + item.quantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', item.product_id);
      }
    }

    // 5. Marcar la orden como completada
    return await this.updateStatus(id, 'completada', userId);
  }

  /**
   * Actualizar una orden de compra
   */
  static async update(id, orderData) {
    const { items, ...orderInfo } = orderData;

    // 1. Actualizar la orden principal
    const { data: order, error: orderError } = await supabase
      .from('purchase_orders')
      .update({
        ...orderInfo,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Si hay items, actualizar (primero eliminar los antiguos)
    if (items && items.length > 0) {
      // Eliminar items antiguos
      await supabase
        .from('purchase_order_items')
        .delete()
        .eq('purchase_order_id', id);

      // Insertar nuevos items
      const itemsWithOrderId = items.map(item => ({
        purchase_order_id: id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('purchase_order_items')
        .insert(itemsWithOrderId);

      if (itemsError) throw itemsError;
    }

    // 3. Retornar la orden actualizada
    return await this.getById(id);
  }

  /**
   * Eliminar una orden de compra
   */
  static async delete(id) {
    // Los items se eliminan automáticamente por CASCADE
    const { error } = await supabase
      .from('purchase_orders')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true, message: 'Orden eliminada correctamente' };
  }

  /**
   * Obtener estadísticas de órdenes de compra
   */
  static async getStats() {
    const { data: orders, error } = await supabase
      .from('purchase_orders')
      .select('id, status, total_amount, created_at');

    if (error) throw error;

    const stats = {
      total: orders.length,
      pendientes: orders.filter(o => o.status === 'pendiente').length,
      aprobadas: orders.filter(o => o.status === 'aprobada').length,
      completadas: orders.filter(o => o.status === 'completada').length,
      rechazadas: orders.filter(o => o.status === 'rechazada').length,
      totalAmount: orders.reduce((sum, o) => sum + parseFloat(o.total_amount), 0),
      thisMonth: orders.filter(o => {
        const date = new Date(o.created_at);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }).length
    };

    return stats;
  }
}

export default PurchaseOrder;
