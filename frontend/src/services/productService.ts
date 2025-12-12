/**
 * Servicio de API para Productos
 * Maneja todas las peticiones HTTP al backend relacionadas con productos
 * Usa Axios para hacer las llamadas al servidor Express
 */

import axios from 'axios';

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
 * Servicio de Productos
 * Expone métodos para consumir la API del backend
 */
export const productService = {
  /**
   * Obtener todos los productos
   * GET /api/productos
   */
  async getAll() {
    const response = await apiClient.get('/productos');
    return response.data;
  },

  /**
   * Obtener un producto por ID
   * GET /api/productos/:id
   */
  async getById(id: string) {
    const response = await apiClient.get(`/productos/${id}`);
    return response.data;
  },

  /**
   * Crear un nuevo producto
   * POST /api/productos
   */
  async create(productData: any) {
    const response = await apiClient.post('/productos', productData);
    return response.data;
  },

  /**
   * Actualizar un producto
   * PUT /api/productos/:id
   */
  async update(id: string, productData: any) {
    const response = await apiClient.put(`/productos/${id}`, productData);
    return response.data;
  },

  /**
   * Eliminar un producto
   * DELETE /api/productos/:id
   */
  async delete(id: string) {
    const response = await apiClient.delete(`/productos/${id}`);
    return response.data;
  },
};

export default productService;
