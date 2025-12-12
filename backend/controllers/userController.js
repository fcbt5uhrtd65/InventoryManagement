import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';

// Obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await User.getAll();
    
    // Eliminar password_hash de todos los usuarios
    const usuariosSinPassword = usuarios.map(({ password_hash, ...user }) => user);
    
    res.json({
      success: true,
      data: usuariosSinPassword
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
};

// Obtener usuario por ID
export const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await User.getById(id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const { password_hash, ...usuarioSinPassword } = usuario;
    
    res.json({
      success: true,
      data: usuarioSinPassword
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario',
      error: error.message
    });
  }
};

// Crear usuario
export const crearUsuario = async (req, res) => {
  try {
    const usuario = await User.create(req.body);
    
    // Registrar en auditoría (asumiendo que req.user contiene el usuario autenticado)
    if (req.user) {
      await AuditLog.log(
        req.user.id,
        req.user.nombre,
        'CREAR',
        'usuarios',
        usuario.id,
        `Usuario ${usuario.nombre} creado con rol ${usuario.rol}`,
        req
      );
    }
    
    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: usuario
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear usuario',
      error: error.message
    });
  }
};

// Actualizar usuario
export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await User.update(id, req.body);
    
    // Registrar en auditoría
    if (req.user) {
      await AuditLog.log(
        req.user.id,
        req.user.nombre,
        'ACTUALIZAR',
        'usuarios',
        id,
        `Usuario ${usuario.nombre} actualizado`,
        req
      );
    }
    
    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: usuario
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar usuario',
      error: error.message
    });
  }
};

// Eliminar usuario (soft delete)
export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await User.delete(id);
    
    // Registrar en auditoría
    if (req.user) {
      await AuditLog.log(
        req.user.id,
        req.user.nombre,
        'ELIMINAR',
        'usuarios',
        id,
        `Usuario ${usuario.nombre} desactivado`,
        req
      );
    }
    
    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente',
      data: usuario
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar usuario',
      error: error.message
    });
  }
};
