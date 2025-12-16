import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Product, Supplier, Warehouse } from '../types/index';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  product?: Product | null;
  suppliers: Supplier[];
  warehouses: Warehouse[];
}

const categories = ['Electrónica', 'Ropa', 'Alimentos', 'Hogar', 'Deportes', 'Libros', 'Juguetes', 'Herramientas', 'Otro'];

export function ProductFormModal({ isOpen, onClose, onSave, product, suppliers, warehouses }: ProductFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: '',
    category: categories[0],
    customCategory: '',
    price: 0,
    stock: 0,
    minStock: 5,
    maxStock: 100,
    supplier: '',
    supplierId: '',
    warehouseId: '',
    image: '',
    active: true,
  });

  useEffect(() => {
    if (product) {
      console.log('Editando producto:', product);
      console.log('supplierId:', product.supplierId, 'warehouseId:', product.warehouseId);
      const isCustomCategory = !categories.includes(product.category);
      setFormData({
        name: product.name,
        description: product.description,
        code: product.code,
        category: isCustomCategory ? 'Otro' : product.category,
        customCategory: isCustomCategory ? product.category : '',
        price: product.price,
        stock: product.stock,
        minStock: product.minStock,
        maxStock: product.maxStock,
        supplier: product.supplier,
        supplierId: product.supplierId || '',
        warehouseId: product.warehouseId || '',
        image: product.image,
        active: product.active,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        code: `PRD-${Date.now().toString(36).toUpperCase()}`,
        category: categories[0],
        customCategory: '',
        price: 0,
        stock: 0,
        minStock: 5,
        maxStock: 100,
        supplier: '',
        supplierId: '',
        warehouseId: '',
        image: '',
        active: true,
      });
    }
  }, [product, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Usar categoría personalizada si se seleccionó "Otro"
    const finalCategory = formData.category === 'Otro' && formData.customCategory.trim() 
      ? formData.customCategory.trim() 
      : formData.category;
    
    const { customCategory, ...productData } = formData;
    
    // Solo enviar los campos necesarios al backend
    onSave({
      ...productData,
      category: finalCategory,
      supplier: formData.supplier || '',
      // El backend obtendrá el nombre del proveedor desde la relación si hay supplierId
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-linear-to-r from-purple-600 to-indigo-600 p-6 flex items-center justify-between rounded-t-2xl">
          <h3 className="text-white">{product ? 'Editar Producto' : 'Nuevo Producto'}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-slate-700 mb-2">Nombre del Producto *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ej: Laptop HP Pavilion 15"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-700 mb-2">Descripción *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
                placeholder="Descripción detallada del producto"
              />
            </div>
            
            <div>
              <label className="block text-slate-700 mb-2">Código del Producto *</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="PRD-12345"
              />
            </div>
            
            <div>
              <label className="block text-slate-700 mb-2">Categoría *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value, customCategory: '' })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Campo de categoría personalizada que aparece cuando se selecciona "Otro" */}
            {formData.category === 'Otro' && (
              <div className="md:col-span-2">
                <label className="block text-slate-700 mb-2">Nombre de Categoría Personalizada *</label>
                <input
                  type="text"
                  required
                  value={formData.customCategory}
                  onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                  placeholder="Ej: Accesorios, Muebles, Papelería, etc."
                />
                <p className="text-slate-500 mt-2">💡 Escribe el nombre de la categoría que deseas crear</p>
              </div>
            )}

            <div>
              <label className="block text-slate-700 mb-2">Proveedor</label>
              <select
                value={formData.supplierId}
                onChange={(e) => {
                  const selectedSupplier = suppliers.find(s => s.id === e.target.value);
                  setFormData({ 
                    ...formData, 
                    supplierId: e.target.value,
                    supplier: selectedSupplier?.name || ''
                  });
                }}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Sin proveedor asignado</option>
                {suppliers.filter(s => s.active).map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 mb-2">Precio Unitario ($) *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="99.99"
              />
            </div>
            
            <div>
              <label className="block text-slate-700 mb-2">Stock Actual *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="100"
              />
            </div>
            
            <div>
              <label className="block text-slate-700 mb-2">Stock Mínimo *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="5"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-2">Stock Máximo *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.maxStock}
                onChange={(e) => setFormData({ ...formData, maxStock: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="100"
              />
            </div>
            
            <div>
              <label className="block text-slate-700 mb-2">Almacén (Opcional)</label>
              <select
                value={formData.warehouseId}
                onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Sin asignar</option>
                {warehouses.filter(w => w.active).map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-700 mb-2">URL de Imagen *</label>
              <input
                type="url"
                required
                maxLength={500}
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                  formData.image.length > 500 ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-indigo-500'
                }`}
                placeholder="https://example.com/image.jpg"
              />
              <p className={`text-sm mt-1 ${formData.image.length > 450 ? 'text-amber-600' : 'text-slate-500'}`}>
                {formData.image.length}/500 caracteres {formData.image.length > 500 && '⚠️ URL demasiado larga'}
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-slate-700">Producto activo</span>
              </label>
            </div>
          </div>
          
          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-colors"
            >
              {product ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}