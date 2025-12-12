/**
 * Controlador de Productos
 * Contiene la lógica de negocio para gestionar productos
 * Coordina entre las rutas (peticiones HTTP) y el modelo (base de datos)
 */

import Product from '../models/Product.js';

/**
 * Obtener todos los productos
 * GET /api/productos
 */
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await Product.getAll();
    
    res.status(200).json({
      success: true,
      data: productos,
      message: 'Productos obtenidos correctamente'
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los productos',
      error: error.message
    });
  }
};

/**
 * Obtener un producto por ID
 * GET /api/productos/:id
 */
export const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Product.getById(id);
    
    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: producto
    });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el producto',
      error: error.message
    });
  }
};

/**
 * Crear un nuevo producto
 * POST /api/productos
 * Body: { name/nombre, description/descripcion, price/precio, stock, code/codigo, category/categoria }
 */
export const crearProducto = async (req, res) => {
  try {
    const productData = req.body;
    
    // Mapear campos inglés a español para compatibilidad
    const mappedData = {
      nombre: productData.name || productData.nombre,
      descripcion: productData.description || productData.descripcion,
      precio: productData.price || productData.precio,
      stock: productData.stock || 0,
      min_stock: productData.minStock || productData.min_stock || 0,
      max_stock: productData.maxStock || productData.max_stock || 100,
      codigo: productData.code || productData.codigo,
      categoria: productData.category || productData.categoria,
      activo: productData.active !== undefined ? productData.active : true
    };
    
    // Validaciones básicas
    if (!mappedData.nombre || !mappedData.precio) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y precio son requeridos'
      });
    }

    const nuevoProducto = await Product.create(mappedData);
    
    res.status(201).json({
      success: true,
      data: nuevoProducto,
      message: 'Producto creado correctamente'
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el producto',
      error: error.message
    });
  }
};

/**
 * Actualizar un producto existente
 * PUT /api/productos/:id
 */
export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const productData = req.body;
    
    // Mapear campos inglés a español para compatibilidad
    const mappedData = {};
    
    if (productData.name !== undefined) mappedData.name = productData.name;
    if (productData.description !== undefined) mappedData.description = productData.description;
    if (productData.price !== undefined) mappedData.price = productData.price;
    if (productData.stock !== undefined) mappedData.stock = productData.stock;
    if (productData.minStock !== undefined) mappedData.min_stock = productData.minStock;
    if (productData.maxStock !== undefined) mappedData.max_stock = productData.maxStock;
    if (productData.code !== undefined) mappedData.code = productData.code;
    if (productData.category !== undefined) mappedData.category = productData.category;
    if (productData.supplier !== undefined) mappedData.supplier_name = productData.supplier;
    if (productData.image !== undefined) mappedData.image = productData.image;
    if (productData.active !== undefined) mappedData.active = productData.active;
    
    const productoActualizado = await Product.update(id, mappedData);
    
    res.status(200).json({
      success: true,
      data: productoActualizado,
      message: 'Producto actualizado correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el producto',
      error: error.message
    });
  }
};

/**
 * Eliminar un producto (soft delete)
 * DELETE /api/productos/:id
 */
export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    
    await Product.delete(id);
    
    res.status(200).json({
      success: true,
      message: 'Producto eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el producto',
      error: error.message
    });
  }
};
