/**
 * Script para actualizar productos existentes y asignar proveedor
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: resolve(__dirname, '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateProductsWithSupplier() {
  try {
    console.log('🔍 Buscando proveedores...');
    
    // Obtener el primer proveedor activo
    const { data: suppliers, error: supplierError } = await supabase
      .from('suppliers')
      .select('id, name')
      .eq('active', true)
      .limit(1);

    if (supplierError) throw supplierError;
    
    if (!suppliers || suppliers.length === 0) {
      console.log('⚠️ No hay proveedores activos en la base de datos');
      return;
    }

    const supplier = suppliers[0];
    console.log(`✅ Proveedor encontrado: ${supplier.name} (${supplier.id})`);

    // Obtener productos sin proveedor
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, supplier_id')
      .is('supplier_id', null)
      .eq('active', true);

    if (productsError) throw productsError;

    if (!products || products.length === 0) {
      console.log('✅ Todos los productos ya tienen proveedor asignado');
      return;
    }

    console.log(`📦 Encontrados ${products.length} productos sin proveedor`);

    // Actualizar cada producto
    for (const product of products) {
      const { error: updateError } = await supabase
        .from('products')
        .update({ 
          supplier_id: supplier.id,
          supplier_name: supplier.name
        })
        .eq('id', product.id);

      if (updateError) {
        console.error(`❌ Error actualizando producto ${product.name}:`, updateError);
      } else {
        console.log(`✅ Actualizado: ${product.name}`);
      }
    }

    console.log('\n🎉 ¡Todos los productos han sido actualizados!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Ejecutar el script
updateProductsWithSupplier();
