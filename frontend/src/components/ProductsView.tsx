import { useState } from 'react';
import { Plus, Search, Filter, FileDown, Edit2, Trash2, AlertCircle, Package } from 'lucide-react';
import type { Product, User, Supplier, Warehouse } from '../types/index';
import { getStockStatus } from '../utils/stockUtils';
import { ProductFormModal } from './ProductFormModal';

interface ProductsViewProps {
  products: Product[];
  suppliers: Supplier[];
  warehouses: Warehouse[];
  onSave: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  onUpdate: (id: string, product: Partial<Product>) => void;
  onDelete: (id: string) => void;
  user: User;
}

export function ProductsView({ products, suppliers, warehouses, onSave, onUpdate, onDelete, user }: ProductsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const categories = ['Todas', ...Array.from(new Set(products.map(p => p.category)))];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Cálculo de paginación
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Resetear página al cambiar filtros
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      onDelete(id);
    }
  };

  const handleExport = () => {
    const csv = [
      ['Código', 'Nombre', 'Categoría', 'Stock', 'Precio', 'Proveedor', 'Estado'],
      ...filteredProducts.map(p => [
        p.code,
        p.name,
        p.category,
        p.stock,
        p.price,
        p.supplier,
        getStockStatus(p).label
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventario_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Gestión de Productos</h2>
          <p className="text-slate-500">Administra el catálogo de productos</p>
        </div>
        {user.role === 'admin' && (
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
          >
            <Plus size={20} />
            Nuevo Producto
          </button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre, código o proveedor..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="relative sm:w-64">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <FileDown size={20} />
            Exportar
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left">Código</th>
                <th className="px-6 py-4 text-left">Producto</th>
                <th className="px-6 py-4 text-left">Categoría</th>
                <th className="px-6 py-4 text-left">Stock</th>
                <th className="px-6 py-4 text-left">Precio</th>
                <th className="px-6 py-4 text-left">Proveedor</th>
                <th className="px-6 py-4 text-left">Almacenes</th>
                <th className="px-6 py-4 text-left">Estado</th>
                {user.role === 'admin' && <th className="px-6 py-4 text-left">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentProducts.map(product => {
                const status = getStockStatus(product);
                return (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p>{product.code}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                        ) : (
                          <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                            <Package size={20} />
                          </div>
                        )}
                        <div>
                          <p>{product.name}</p>
                          <p className="text-slate-500">{product.description.substring(0, 40)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className={
                        status.level === 'low' ? 'text-red-600' :
                        status.level === 'warning' ? 'text-amber-600' :
                        'text-emerald-600'
                      }>
                        {product.stock} uds
                      </p>
                      <p className="text-slate-500">Min: {product.minStock}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p>${product.price.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-600">{product.supplier || 'Sin asignar'}</p>
                    </td>
                    <td className="px-6 py-4">
                      {product.warehouseIds && product.warehouseIds.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {product.warehouseIds.slice(0, 2).map((warehouseId, index) => {
                            const warehouse = warehouses.find(w => w.id === warehouseId);
                            return warehouse ? (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                {warehouse.name}
                              </span>
                            ) : null;
                          })}
                          {product.warehouseIds.length > 2 && (
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                              +{product.warehouseIds.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <p className="text-slate-400 text-sm">Sin asignar</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit ${
                        status.level === 'low' ? 'bg-red-100 text-red-700' :
                        status.level === 'warning' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {status.level === 'low' && <AlertCircle size={14} />}
                        <span>{status.label}</span>
                      </div>
                    </td>
                    {user.role === 'admin' && (
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No se encontraron productos</p>
          </div>
        )}

        {/* Paginación */}
        {filteredProducts.length > productsPerPage && (
          <div className="border-t border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Mostrando {startIndex + 1} - {Math.min(endIndex, filteredProducts.length)} de {filteredProducts.length} productos
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-indigo-600 text-white'
                          : 'border border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={(data) => {
          if (editingProduct) {
            onUpdate(editingProduct.id, data);
          } else {
            onSave(data);
          }
        }}
        product={editingProduct}
        suppliers={suppliers}
        warehouses={warehouses}
      />
    </div>
  );
}
