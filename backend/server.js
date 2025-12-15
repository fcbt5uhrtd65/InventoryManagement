/**
 * Servidor principal del Backend
 * Configura Express, middlewares, rutas y levanta el servidor
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import movementRoutes from './routes/movementRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import warehouseRoutes from './routes/warehouseRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import purchaseOrderRoutes from './routes/purchaseOrderRoutes.js';

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno desde la raíz del proyecto
dotenv.config({ path: resolve(__dirname, '../.env') });

// Crear la aplicación Express
const app = express();

// Puerto del servidor (configurable desde .env)
const PORT = process.env.API_PORT || 3001;

// ==================== MIDDLEWARES ====================

// CORS - Permitir peticiones desde el frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Parser de JSON - Leer el body de las peticiones
app.use(express.json());

// Parser de URL encoded - Para formularios
app.use(express.urlencoded({ extended: true }));

// Middleware de logging simple
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Manejo de errores de uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// ==================== RUTAS ====================

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API de Inventario funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      productos: '/api/productos',
      movimientos: '/api/movimientos',
      proveedores: '/api/proveedores',
      bodegas: '/api/bodegas',
      auditoria: '/api/auditoria',
      ordenesCompra: '/api/ordenes-compra'
    }
  });
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de usuarios
app.use('/api/usuarios', userRoutes);

// Rutas de productos (patrón MVC)
app.use('/api/productos', productRoutes);

// Rutas de movimientos
app.use('/api/movimientos', movementRoutes);

// Rutas de proveedores
app.use('/api/proveedores', supplierRoutes);

// Rutas de bodegas
app.use('/api/bodegas', warehouseRoutes);

// Rutas de auditoría
app.use('/api/auditoria', auditRoutes);

// Rutas de órdenes de compra
app.use('/api/ordenes-compra', purchaseOrderRoutes);

// ==================== MANEJO DE ERRORES ====================

// Ruta no encontrada (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado'
  });
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ==================== INICIAR SERVIDOR ====================

app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║  🚀 Servidor Backend iniciado             ║');
  console.log(`║  📡 Puerto: ${PORT}                        ║`);
  console.log(`║  🌐 URL: http://localhost:${PORT}          ║`);
  console.log('║  ✅ Patrón MVC con Supabase               ║');
  console.log('╚════════════════════════════════════════════╝');
});

export default app;
