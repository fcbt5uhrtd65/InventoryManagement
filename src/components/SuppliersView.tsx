import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Phone, Mail, MapPin, FileText, Truck, Package, TrendingUp, CheckCircle, X } from 'lucide-react';
import type { Supplier, Product } from '../types/index';

interface SuppliersViewProps {
  suppliers: Supplier[];
  products: Product[];
  onSave: (supplier: Omit<Supplier, 'id' | 'createdAt'>) => void;
  onUpdate: (id: string, supplier: Partial<Supplier>) => void;
  onDelete: (id: string) => void;
}

export function SuppliersView({ suppliers, products, onSave, onUpdate, onDelete }: SuppliersViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.nit.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeSuppliers = suppliers.filter(s => s.active).length;
  const totalProducts = suppliers.reduce((sum, s) => sum + s.products.length, 0);

  const getSupplierProducts = (supplier: Supplier) => {
    return products.filter(p => supplier.products.includes(p.id));
  };

  const handleGeneratePurchaseOrder = (supplier: Supplier) => {
    const supplierProducts = getSupplierProducts(supplier);
    const lowStockProducts = supplierProducts.filter(p => p.stock <= p.minStock);
    
    if (lowStockProducts.length === 0) {
      alert('Este proveedor no tiene productos con stock bajo');
      return;
    }

    const orderDetails = lowStockProducts.map(p => {
      const recommended = p.maxStock - p.stock;
      const total = recommended * p.price;
      return `${p.name} | Cantidad: ${recommended} uds | Precio Unit: $${p.price} | Total: $${total.toFixed(2)}`;
    }).join('\n');

    const totalAmount = lowStockProducts.reduce((sum, p) => {
      const recommended = p.maxStock - p.stock;
      return sum + (recommended * p.price);
    }, 0);

    const order = `
╔════════════════════════════════════════════════════════════╗
║           ORDEN DE COMPRA - INVENTORYPRO                   ║
╚════════════════════════════════════════════════════════════╝

Fecha: ${new Date().toLocaleDateString('es')}
Hora: ${new Date().toLocaleTimeString('es')}

PROVEEDOR:
━━━━━━���━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nombre: ${supplier.name}
NIT: ${supplier.nit}
Contacto: ${supplier.contact}
Email: ${supplier.email}
Teléfono: ${supplier.phone}
Dirección: ${supplier.address}

PRODUCTOS SOLICITADOS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${orderDetails}

RESUMEN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total de productos: ${lowStockProducts.length}
Monto total: $${totalAmount.toLocaleString('es', { minimumFractionDigits: 2 })}

OBSERVACIONES:
Orden generada automáticamente por el sistema de gestión
de inventario debido a niveles de stock críticos.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();

    console.log(order);
    
    // Crear y descargar archivo
    const blob = new Blob([order], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orden_compra_${supplier.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    
    alert(`Orden de compra generada exitosamente.\n\n${lowStockProducts.length} productos incluidos.\nMonto total: $${totalAmount.toLocaleString('es', { minimumFractionDigits: 2 })}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Gestión de Proveedores</h2>
          <p className="text-slate-500">Administra tus proveedores y genera órdenes de compra</p>
        </div>
        <button
          onClick={() => {
            setEditingSupplier(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg"
        >
          <Plus size={20} />
          Nuevo Proveedor
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-orange-600 to-orange-700 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Truck size={28} />
            </div>
            <h2>{suppliers.length}</h2>
          </div>
          <p className="text-orange-100">Total Proveedores</p>
          <p className="text-orange-200">Registrados en el sistema</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <CheckCircle size={28} />
            </div>
            <h2>{activeSuppliers}</h2>
          </div>
          <p className="text-emerald-100">Proveedores Activos</p>
          <p className="text-emerald-200">{Math.round((activeSuppliers/suppliers.length)*100)}% del total</p>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Package size={28} />
            </div>
            <h2>{totalProducts}</h2>
          </div>
          <p className="text-blue-100">Productos Suministrados</p>
          <p className="text-blue-200">En catálogo</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre, NIT o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map(supplier => {
          const supplierProducts = getSupplierProducts(supplier);
          const lowStockCount = supplierProducts.filter(p => p.stock <= p.minStock).length;
          
          return (
            <div key={supplier.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl text-white shadow-lg">
                    <Truck size={24} />
                  </div>
                  <div>
                    <h4>{supplier.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      supplier.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {supplier.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 mb-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <FileText size={16} className="text-slate-400" />
                  <span className="text-sm">NIT: {supplier.nit}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail size={16} className="text-slate-400" />
                  <span className="text-sm truncate">{supplier.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone size={16} className="text-slate-400" />
                  <span className="text-sm">{supplier.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin size={16} className="text-slate-400" />
                  <span className="text-sm truncate">{supplier.address}</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-500">Productos</span>
                  <span className="text-slate-700">{supplierProducts.length}</span>
                </div>
                {lowStockCount > 0 && (
                  <div className="flex items-center gap-2 text-red-600">
                    <TrendingUp size={14} />
                    <span className="text-sm">{lowStockCount} con stock bajo</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedSupplier(supplier)}
                  className="flex items-center justify-center gap-2 px-3 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Package size={16} />
                  <span>Ver Detalles</span>
                </button>
                <button
                  onClick={() => handleGeneratePurchaseOrder(supplier)}
                  disabled={lowStockCount === 0}
                  className="flex items-center justify-center gap-2 px-3 py-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileText size={16} />
                  <span>Orden</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={() => {
                    setEditingSupplier(supplier);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-2 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                >
                  <Edit2 size={16} />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm('¿Estás seguro de eliminar este proveedor?')) {
                      onDelete(supplier.id);
                    }
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSuppliers.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <Truck size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-slate-600 mb-2">No se encontraron proveedores</h3>
          <p className="text-slate-500">Intenta ajustar tu búsqueda o agrega un nuevo proveedor</p>
        </div>
      )}

      {/* Supplier Modal */}
      {isModalOpen && (
        <SupplierModal
          supplier={editingSupplier}
          products={products}
          onClose={() => {
            setIsModalOpen(false);
            setEditingSupplier(null);
          }}
          onSave={(data) => {
            if (editingSupplier) {
              onUpdate(editingSupplier.id, data);
            } else {
              onSave(data);
            }
          }}
        />
      )}

      {/* Supplier Details Modal */}
      {selectedSupplier && (
        <SupplierDetailsModal
          supplier={selectedSupplier}
          products={getSupplierProducts(selectedSupplier)}
          onClose={() => setSelectedSupplier(null)}
        />
      )}
    </div>
  );
}

// Supplier Modal Component
function SupplierModal({ supplier, products, onClose, onSave }: {
  supplier: Supplier | null;
  products: Product[];
  onClose: () => void;
  onSave: (data: Omit<Supplier, 'id' | 'createdAt'>) => void;
}) {
  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    contact: supplier?.contact || '',
    email: supplier?.email || '',
    phone: supplier?.phone || '',
    nit: supplier?.nit || '',
    address: supplier?.address || '',
    products: supplier?.products || [],
    active: supplier?.active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-700 p-6 flex items-center justify-between rounded-t-2xl">
          <h3 className="text-white">{supplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg text-white">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-slate-700 mb-2">Nombre del Proveedor *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-2">Persona de Contacto *</label>
              <input
                type="text"
                required
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-2">NIT *</label>
              <input
                type="text"
                required
                value={formData.nit}
                onChange={(e) => setFormData({ ...formData, nit: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-2">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-2">Teléfono *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-slate-700 mb-2">Dirección *</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-5 h-5 text-orange-600 rounded"
                />
                <span className="text-slate-700">Proveedor activo</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:from-orange-700 hover:to-orange-800"
            >
              {supplier ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Supplier Details Modal Component
function SupplierDetailsModal({ supplier, products, onClose }: {
  supplier: Supplier;
  products: Product[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-700 p-6 flex items-center justify-between rounded-t-2xl">
          <h3 className="text-white">Detalles del Proveedor</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg text-white">
            ×
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-slate-700 mb-2">Nombre del Proveedor</label>
              <input
                type="text"
                value={supplier.name}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                readOnly
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-2">Persona de Contacto</label>
              <input
                type="text"
                value={supplier.contact}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                readOnly
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-2">NIT</label>
              <input
                type="text"
                value={supplier.nit}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                readOnly
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={supplier.email}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                readOnly
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-2">Teléfono</label>
              <input
                type="tel"
                value={supplier.phone}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                readOnly
              />
            </div>

            <div className="col-span-2">
              <label className="block text-slate-700 mb-2">Dirección</label>
              <input
                type="text"
                value={supplier.address}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                readOnly
              />
            </div>

            <div className="col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={supplier.active}
                  className="w-5 h-5 text-orange-600 rounded"
                  readOnly
                />
                <span className="text-slate-700">Proveedor activo</span>
              </label>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-slate-700">Productos Suministrados</h4>
            <div className="bg-slate-50 rounded-xl p-3 mt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500">Nombre</span>
                <span className="text-slate-500">Stock</span>
                <span className="text-slate-500">Min Stock</span>
                <span className="text-slate-500">Max Stock</span>
                <span className="text-slate-500">Precio</span>
              </div>
              {products.map(product => (
                <div key={product.id} className="flex items-center justify-between mb-2">
                  <span className="text-slate-700">{product.name}</span>
                  <span className="text-slate-700">{product.stock}</span>
                  <span className="text-slate-700">{product.minStock}</span>
                  <span className="text-slate-700">{product.maxStock}</span>
                  <span className="text-slate-700">$ {product.price.toLocaleString('es', { minimumFractionDigits: 2 })}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}