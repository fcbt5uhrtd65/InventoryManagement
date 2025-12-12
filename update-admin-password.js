import { supabase } from './backend/config/supabaseClient.js';
import bcrypt from './backend/node_modules/bcrypt/bcrypt.js';

async function updateAdminPassword() {
  try {
    // Buscar usuario admin
    const { data: users, error: searchError } = await supabase
      .from('users')
      .select('id, name, email, role')
      .eq('role', 'admin');
    
    if (searchError) {
      console.error('Error buscando admin:', searchError);
      return;
    }
    
    console.log('Usuarios admin encontrados:', users);
    
    if (users.length === 0) {
      console.log('No hay usuarios admin. Creando uno...');
      
      // Crear usuario admin
      const password = 'admin123';
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const { data: newAdmin, error: createError } = await supabase
        .from('users')
        .insert([{
          name: 'Administrador',
          email: 'admin@inventory.com',
          password: hashedPassword,
          role: 'admin',
          active: true
        }])
        .select()
        .single();
      
      if (createError) {
        console.error('Error creando admin:', createError);
      } else {
        console.log('✅ Usuario admin creado:', newAdmin.email);
        console.log('Email: admin@inventory.com');
        console.log('Password: admin123');
      }
    } else {
      // Actualizar contraseña del primer admin encontrado
      const admin = users[0];
      const password = 'admin123';
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const { error: updateError } = await supabase
        .from('users')
        .update({ password: hashedPassword })
        .eq('id', admin.id);
      
      if (updateError) {
        console.error('Error actualizando contraseña:', updateError);
      } else {
        console.log('✅ Contraseña actualizada para:', admin.email);
        console.log('Nueva contraseña: admin123');
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  process.exit(0);
}

updateAdminPassword();
