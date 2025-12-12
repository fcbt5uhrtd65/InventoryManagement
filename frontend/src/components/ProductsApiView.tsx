/**
 * Vista de Productos desde API Backend
 * Componente React que consume la API del backend para gestionar productos
 * Ejemplo funcional del patrón MVC completo
 */

import { useState, useEffect } from 'react';
import productService from '../services/productService';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Trash2, Edit, RefreshCw } from 'lucide-react';

/**
 * Componente principal de la vista de productos
 */
export function ProductsApiView() {
  // Estados del componente
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    codigo: '',
    categoria: '',
  });

  /**
   * Cargar productos al montar el componente
   */
  useEffect(() => {
    cargarProductos();
  }, []);

  /**
   * Función para cargar todos los productos desde la API
   */
  const cargarProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getAll();
      
      if (response.success) {
        setProductos(response.data);
      } else {
        setError('Error al cargar productos');
      }
    } catch (err: any) {
      console.error('Error al cargar productos:', err);
      setError(err.response?.data?.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Función para crear o actualizar un producto
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
      };

      let response;
      if (editingProduct) {
        // Actualizar producto existente
        response = await productService.update(editingProduct.id, productData);
      } else {
        // Crear nuevo producto
        response = await productService.create(productData);
      }

      if (response.success) {
        // Recargar la lista de productos
        await cargarProductos();
        
        // Resetear formulario
        resetForm();
      }
    } catch (err: any) {
      console.error('Error al guardar producto:', err);
      setError(err.response?.data?.message || 'Error al guardar el producto');
    }
  };

  /**
   * Función para eliminar un producto
   */
  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      const response = await productService.delete(id);
      
      if (response.success) {
        await cargarProductos();
      }
    } catch (err: any) {
      console.error('Error al eliminar producto:', err);
      setError(err.response?.data?.message || 'Error al eliminar el producto');
    }
  };

  /**
   * Función para editar un producto
   */
  const handleEdit = (producto: any) => {
    setEditingProduct(producto);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio.toString(),
      stock: producto.stock.toString(),
      codigo: producto.codigo || '',
      categoria: producto.categoria || '',
    });
    setShowForm(true);
  };

  /**
   * Resetear formulario
   */
  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      codigo: '',
      categoria: '',
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  /**
   * Manejar cambios en el formulario
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Productos (API Backend)</h1>
          <p className="text-muted-foreground">Gestiona productos usando el backend MVC</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={cargarProductos} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Producto
          </Button>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <Card className="border-red-500">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Formulario de producto */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</CardTitle>
            <CardDescription>
              {editingProduct ? 'Actualiza los datos del producto' : 'Completa el formulario para crear un nuevo producto'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Nombre *</label>
                <Input
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  placeholder="Nombre del producto"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Código</label>
                <Input
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleInputChange}
                  placeholder="Código SKU"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium">Descripción</label>
                <Input
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  placeholder="Descripción del producto"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Precio *</label>
                <Input
                  name="precio"
                  type="number"
                  step="0.01"
                  value={formData.precio}
                  onChange={handleInputChange}
                  required
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Stock</label>
                <Input
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Categoría</label>
                <Input
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  placeholder="Categoría"
                />
              </div>

              <div className="md:col-span-2 flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingProduct ? 'Actualizar' : 'Crear'} Producto
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de productos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Productos</CardTitle>
          <CardDescription>
            {loading ? 'Cargando...' : `${productos.length} producto(s) encontrado(s)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">Cargando productos...</p>
            </div>
          ) : productos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No hay productos registrados</p>
              <Button onClick={() => setShowForm(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Crear primer producto
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productos.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell className="font-mono text-sm">{producto.codigo}</TableCell>
                    <TableCell className="font-medium">{producto.nombre}</TableCell>
                    <TableCell className="text-muted-foreground">{producto.descripcion}</TableCell>
                    <TableCell>{producto.categoria}</TableCell>
                    <TableCell className="text-right">${producto.precio?.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{producto.stock}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(producto)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(producto.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
