/**
 * Cliente de Supabase para el Backend
 * Este archivo configura la conexión con Supabase usando las credenciales del .env
 * Usa la clave SERVICE_ROLE para operaciones privilegiadas del servidor
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno desde la raíz del proyecto
dotenv.config({ path: resolve(__dirname, '../../.env') });

// Obtener las credenciales de Supabase desde las variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validar que las credenciales existan
if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('❌ Faltan las credenciales de Supabase. Verifica tu archivo .env');
}

// Crear el cliente de Supabase con la clave de servicio
// La service role key tiene permisos completos, úsala solo en el backend
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('✅ Cliente de Supabase configurado correctamente en el backend');
