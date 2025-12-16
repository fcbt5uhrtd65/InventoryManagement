import { supabase } from '../config/supabaseClient.js';
import bcrypt from 'bcrypt';

class User {
  // Obtener todos los usuarios
  static async getAll() {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        warehouses:warehouse_id (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Mapear warehouse info
    return data.map(user => ({
      ...user,
      warehouse_name: user.warehouses?.name || null
    }));
  }

  // Obtener usuario por ID
  static async getById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Obtener usuario por email
  static async getByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return data;
  }

  // Crear usuario
  static async create(userData) {
    // Aceptar tanto campos en español como en inglés
    const nombre = userData.nombre || userData.name;
    const email = userData.email;
    const password = userData.password;
    const rol = userData.rol || userData.role;
    const activo = userData.activo !== undefined ? userData.activo : userData.active !== undefined ? userData.active : true;
    const avatar = userData.avatar;
    const warehouseId = userData.warehouseId || userData.warehouse_id || null;
    
    // Hash de la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name: nombre,
          email,
          password: hashedPassword,
          role: rol,
          active: activo,
          avatar,
          warehouse_id: warehouseId
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    
    // No devolver el hash de la contraseña
    const { password: _, ...userWithoutPassword } = data;
    return userWithoutPassword;
  }

  // Actualizar usuario
  static async update(id, userData) {
    // Mapear campos a inglés (formato de la BD)
    const mappedData = {};
    
    // Aceptar tanto español como inglés
    if (userData.nombre || userData.name) {
      mappedData.name = userData.nombre || userData.name;
    }
    if (userData.email) {
      mappedData.email = userData.email;
    }
    if (userData.rol || userData.role) {
      mappedData.role = userData.rol || userData.role;
    }
    if (userData.activo !== undefined || userData.active !== undefined) {
      mappedData.active = userData.activo !== undefined ? userData.activo : userData.active;
    }
    if (userData.avatar) {
      mappedData.avatar = userData.avatar;
    }
    if (userData.warehouseId !== undefined || userData.warehouse_id !== undefined) {
      mappedData.warehouse_id = userData.warehouseId || userData.warehouse_id;
    }
    
    // Si se actualiza la contraseña, hashearla
    if (userData.password) {
      const saltRounds = 10;
      mappedData.password = await bcrypt.hash(userData.password, saltRounds);
    }
    
    const { data, error } = await supabase
      .from('users')
      .update(mappedData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // No devolver el hash de la contraseña
    const { password: _, ...userWithoutPassword } = data;
    return userWithoutPassword;
  }

  // Eliminar usuario permanentemente
  static async delete(id) {
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Verificar contraseña
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

export default User;
