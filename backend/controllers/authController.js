import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';

// Registro de usuario
export const register = async (req, res) => {
  try {
    const { nombre, email, password, rol = 'empleado' } = req.body;

    // Validaciones
    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, email y contraseña son requeridos'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.getByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Crear usuario
    const usuario = await User.create({ nombre, email, password, rol, activo: true });

    // Registrar en auditoría
    await AuditLog.log(
      usuario.id,
      nombre,
      'REGISTRO',
      'users',
      usuario.id,
      `Usuario ${nombre} se registró con rol ${rol}`,
      req
    );

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: usuario
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      error: error.message
    });
  }
};

// Login de usuario
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario por email
    const usuario = await User.getByEmail(email);
    
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar si el usuario está activo
    if (!usuario.active) {
      return res.status(403).json({
        success: false,
        message: 'Usuario desactivado'
      });
    }

    // Verificar contraseña
    const isValidPassword = await User.verifyPassword(password, usuario.password);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Eliminar password del objeto de respuesta
    const { password: _, ...usuarioSinPassword } = usuario;

    // Registrar en auditoría
    await AuditLog.log(
      usuario.id,
      usuario.name,
      'LOGIN',
      'users',
      usuario.id,
      `Usuario ${usuario.name} inició sesión`,
      req
    );

    res.json({
      success: true,
      message: 'Login exitoso',
      user: usuarioSinPassword
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

// Obtener usuario actual (requiere estar autenticado)
export const getCurrentUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const usuario = await User.getById(userId);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Eliminar password
    const { password: _, ...usuarioSinPassword } = usuario;

    res.json({
      success: true,
      data: usuarioSinPassword
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener información del usuario',
      error: error.message
    });
  }
};

// Logout (solo registra en auditoría)
export const logout = async (req, res) => {
  try {
    const { userId, userName } = req.body;
    
    if (userId && userName) {
      await AuditLog.log(
        userId,
        userName,
        'LOGOUT',
        'usuarios',
        userId,
        `Usuario ${userName} cerró sesión`,
        req
      );
    }

    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cerrar sesión',
      error: error.message
    });
  }
};
