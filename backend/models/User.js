import { supabase } from '../config/supabaseClient.js';
import bcrypt from 'bcrypt';

class User {
  // Obtener todos los usuarios
  static async getAll() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
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
    const { nombre, email, password, rol, activo = true, avatar } = userData;
    
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
          avatar
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
    const updateData = { ...userData };
    
    // Mapear campos a inglés
    const mappedData = {};
    if (updateData.nombre) mappedData.name = updateData.nombre;
    if (updateData.email) mappedData.email = updateData.email;
    if (updateData.rol) mappedData.role = updateData.rol;
    if (updateData.activo !== undefined) mappedData.active = updateData.activo;
    if (updateData.avatar) mappedData.avatar = updateData.avatar;
    
    // Si se actualiza la contraseña, hashearla
    if (updateData.password) {
      const saltRounds = 10;
      mappedData.password = await bcrypt.hash(updateData.password, saltRounds);
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

  // Eliminar usuario (soft delete)
  static async delete(id) {
    const { data, error } = await supabase
      .from('users')
      .update({ active: false })
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
