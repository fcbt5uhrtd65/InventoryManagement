/**
 * Cliente de Supabase para el Frontend
 * Este archivo configura la conexión con Supabase usando la clave pública
 * Es seguro usar este cliente en el navegador
 */

import { createClient } from '@supabase/supabase-js';

// Obtener las credenciales de Supabase desde las variables de entorno de Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bnznireqkcwteeqpocmh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_mx37g_eCm1Id_Jfyajaxhg_s2PH0lLM';

// Validar que las credenciales existan
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Faltan las credenciales de Supabase en el frontend');
}

// Crear el cliente de Supabase con la clave anónima (pública)
// Esta clave es segura para usarse en el frontend
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('✅ Cliente de Supabase configurado en el frontend');
