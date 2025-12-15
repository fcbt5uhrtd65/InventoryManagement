/**
 * Servicio de Órdenes de Compra
 * Maneja las peticiones HTTP al backend para órdenes de compra
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const BASE_URL = `${API_URL}/api/ordenes-compra`;

const purchaseOrderService = {
  /**
   * Obtener todas las órdenes de compra
   */
  async getAll() {
    try {
      const response = await axios.get(BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error al obtener órdenes de compra:', error);
      throw error;
    }
  },

  /**
   * Obtener una orden de compra por ID
   */
  async getById(id: string) {
    try {
      const response = await axios.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener orden de compra:', error);
      throw error;
    }
  },

  /**
   * Obtener órdenes por estado
   */
  async getByStatus(status: 'pendiente' | 'aprobada' | 'rechazada' | 'completada') {
    try {
      const response = await axios.get(`${BASE_URL}/estado/${status}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener órdenes por estado:', error);
      throw error;
    }
  },

  /**
   * Obtener órdenes por proveedor
   */
  async getBySupplier(supplierId: string) {
    try {
      const response = await axios.get(`${BASE_URL}/proveedor/${supplierId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener órdenes por proveedor:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de órdenes de compra
   */
  async getStats() {
    try {
      const response = await axios.get(`${BASE_URL}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  },

  /**
   * Crear una nueva orden de compra
   */
  async create(orderData: any) {
    try {
      const response = await axios.post(BASE_URL, orderData);
      return response.data;
    } catch (error) {
      console.error('Error al crear orden de compra:', error);
      throw error;
    }
  },

  /**
   * Actualizar una orden de compra
   */
  async update(id: string, orderData: any) {
    try {
      const response = await axios.put(`${BASE_URL}/${id}`, orderData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar orden de compra:', error);
      throw error;
    }
  },

  /**
   * Aprobar una orden de compra
   */
  async approve(id: string, userId: string, userName: string) {
    try {
      const response = await axios.patch(`${BASE_URL}/${id}/aprobar`, {
        user_id: userId,
        user_name: userName
      });
      return response.data;
    } catch (error) {
      console.error('Error al aprobar orden de compra:', error);
      throw error;
    }
  },

  /**
   * Rechazar una orden de compra
   */
  async reject(id: string, userId: string, userName: string) {
    try {
      const response = await axios.patch(`${BASE_URL}/${id}/rechazar`, {
        user_id: userId,
        user_name: userName
      });
      return response.data;
    } catch (error) {
      console.error('Error al rechazar orden de compra:', error);
      throw error;
    }
  },

  /**
   * Completar una orden de compra (crear movimientos de entrada)
   */
  async complete(id: string, userId: string, userName: string) {
    try {
      const response = await axios.patch(`${BASE_URL}/${id}/completar`, {
        user_id: userId,
        user_name: userName
      });
      return response.data;
    } catch (error) {
      console.error('Error al completar orden de compra:', error);
      throw error;
    }
  },

  /**
   * Eliminar una orden de compra
   */
  async delete(id: string, userId?: string, userName?: string) {
    try {
      const response = await axios.delete(`${BASE_URL}/${id}`, {
        data: { user_id: userId, user_name: userName }
      });
      return response.data;
    } catch (error) {
      console.error('Error al eliminar orden de compra:', error);
      throw error;
    }
  }
};

export default purchaseOrderService;
