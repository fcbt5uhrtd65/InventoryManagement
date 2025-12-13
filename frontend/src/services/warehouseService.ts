/**
 * Servicio de API para Bodegas
 * Maneja todas las peticiones HTTP al backend relacionadas con bodegas
 * Usa Axios para hacer las llamadas al servidor Express
 */

import axios from 'axios';
import type { Warehouse, Product } from '../types';

// En desarrollo, Vite proxy redirige /api a http://localhost:3001/api
const API_URL = import.meta.env.VITE_API_URL || '';

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Servicio de Bodegas
 * Expone métodos para consumir la API del backend
 */
export const warehouseService = {
  /**
   * Obtener todas las bodegas
   * GET /api/bodegas
   */
  async getAll(): Promise<Warehouse[]> {
    const response = await apiClient.get('/bodegas');
    return response.data.data || response.data;
  },

  /**
   * Obtener una bodega por ID
   * GET /api/bodegas/:id
   */
  async getById(id: string): Promise<Warehouse> {
    const response = await apiClient.get(`/bodegas/${id}`);
    return response.data.data || response.data;
  },

  /**
   * Obtener productos de una bodega
   * GET /api/bodegas/:id/productos
   */
  async getProducts(id: string): Promise<Product[]> {
    const response = await apiClient.get(`/bodegas/${id}/productos`);
    return response.data.data || response.data;
  },

  /**
   * Crear una nueva bodega
   * POST /api/bodegas
   */
  async create(warehouseData: Partial<Warehouse>): Promise<Warehouse> {
    const response = await apiClient.post('/bodegas', warehouseData);
    return response.data.data || response.data;
  },

  /**
   * Actualizar una bodega
   * PUT /api/bodegas/:id
   */
  async update(id: string, warehouseData: Partial<Warehouse>): Promise<Warehouse> {
    const response = await apiClient.put(`/bodegas/${id}`, warehouseData);
    return response.data.data || response.data;
  },

  /**
   * Eliminar una bodega (soft delete)
   * DELETE /api/bodegas/:id
   */
  async delete(id: string): Promise<Warehouse> {
    const response = await apiClient.delete(`/bodegas/${id}`);
    return response.data.data || response.data;
  },
};

export default warehouseService;
