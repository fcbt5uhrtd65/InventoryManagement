/**
 * Servicio de API para Proveedores
 * Maneja todas las peticiones HTTP al backend relacionadas con proveedores
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Servicio de Proveedores
 */
export const supplierService = {
  /**
   * Obtener todos los proveedores
   * GET /api/proveedores
   */
  async getAll() {
    const response = await apiClient.get('/proveedores');
    return response.data;
  },

  /**
   * Obtener un proveedor por ID
   * GET /api/proveedores/:id
   */
  async getById(id: string) {
    const response = await apiClient.get(`/proveedores/${id}`);
    return response.data;
  },

  /**
   * Crear un nuevo proveedor
   * POST /api/proveedores
   */
  async create(supplierData: any) {
    const response = await apiClient.post('/proveedores', supplierData);
    return response.data;
  },

  /**
   * Actualizar un proveedor
   * PUT /api/proveedores/:id
   */
  async update(id: string, supplierData: any) {
    const response = await apiClient.put(`/proveedores/${id}`, supplierData);
    return response.data;
  },

  /**
   * Eliminar un proveedor
   * DELETE /api/proveedores/:id
   */
  async delete(id: string) {
    const response = await apiClient.delete(`/proveedores/${id}`);
    return response.data;
  },
};

export default supplierService;
