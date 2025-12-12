/**
 * Servicio de Autenticación
 * Maneja las peticiones HTTP al backend para login y registro
 */

import axios from 'axios';

// En desarrollo, Vite proxy redirige /api a http://localhost:3001/api
// En producción, el backend sirve todo desde el mismo dominio
const API_URL = import.meta.env.VITE_API_URL || '';

const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export interface LoginResponse {
  success: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    active: boolean;
  };
  token?: string;
  message?: string;
}

export interface RegisterResponse {
  success: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token?: string;
  message?: string;
}

export const authService = {
  /**
   * Iniciar sesión
   * POST /api/auth/login
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post('/auth/login', { email, password });
    
    // Guardar usuario en localStorage
    if (response.data.success && response.data.user) {
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
    }
    
    return response.data;
  },

  /**
   * Registrar nuevo usuario
   * POST /api/auth/register
   */
  async register(nombre: string, email: string, password: string, rol: string = 'empleado'): Promise<RegisterResponse> {
    const response = await apiClient.post('/auth/register', { 
      nombre, 
      email, 
      password,
      rol 
    });
    
    // Guardar usuario en localStorage
    if (response.data.success && response.data.user) {
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
    }
    
    return response.data;
  },

  /**
   * Cerrar sesión
   */
  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
  },

  /**
   * Obtener usuario actual desde localStorage
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Verificar si hay sesión activa
   */
  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  },
};

export default authService;
