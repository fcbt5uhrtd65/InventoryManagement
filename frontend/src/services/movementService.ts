/**
 * Servicio de API para Movimientos
 * Maneja todas las peticiones HTTP al backend relacionadas con movimientos de inventario
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
 * Servicio de Movimientos
 */
export const movementService = {
  /**
   * Obtener todos los movimientos
   * GET /api/movimientos
   */
  async getAll() {
    const response = await apiClient.get('/movimientos');
    return response.data;
  },

  /**
   * Obtener un movimiento por ID
   * GET /api/movimientos/:id
   */
  async getById(id: string) {
    const response = await apiClient.get(`/movimientos/${id}`);
    return response.data;
  },

  /**
   * Crear un nuevo movimiento
   * POST /api/movimientos
   */
  async create(movementData: any) {
    const response = await apiClient.post('/movimientos', movementData);
    return response.data;
  },
};

export default movementService;
