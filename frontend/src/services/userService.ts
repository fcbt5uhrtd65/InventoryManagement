/**
 * Servicio de API para Usuarios
 * Maneja todas las peticiones HTTP al backend relacionadas con usuarios
 * Usa Axios para hacer las llamadas al servidor Express
 */

import axios from 'axios';
import type { User } from '../types';

// En desarrollo, Vite proxy redirige /api a http://localhost:3001/api
const API_URL = import.meta.env.VITE_API_URL || '';

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar respuestas
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en userService:', error);
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Servicio de Usuarios
 * Expone métodos para consumir la API del backend
 */
export const userService = {
  /**
   * Obtener todos los usuarios
   * GET /api/usuarios
   */
  async getAll(): Promise<User[]> {
    const response = await apiClient.get('/usuarios');
    return response.data.data || response.data;
  },

  /**
   * Obtener un usuario por ID
   * GET /api/usuarios/:id
   */
  async getById(id: string): Promise<User> {
    const response = await apiClient.get(`/usuarios/${id}`);
    return response.data.data || response.data;
  },

  /**
   * Crear un nuevo usuario
   * POST /api/usuarios
   */
  async create(userData: Partial<User> & { password: string }): Promise<User> {
    const response = await apiClient.post('/usuarios', userData);
    return response.data.data || response.data;
  },

  /**
   * Actualizar un usuario
   * PUT /api/usuarios/:id
   */
  async update(id: string, userData: Partial<User>): Promise<User> {
    const response = await apiClient.put(`/usuarios/${id}`, userData);
    return response.data.data || response.data;
  },

  /**
   * Eliminar un usuario permanentemente
   * DELETE /api/usuarios/:id
   */
  async delete(id: string): Promise<User> {
    const response = await apiClient.delete(`/usuarios/${id}`);
    return response.data.data || response.data;
  },
};

export default userService;
