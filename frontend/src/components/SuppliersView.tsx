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
    // Filtrar productos que tienen el supplierId igual al id del proveedor
    // o que están en el array de products del proveedor
    return products.filter(p => 
      p.supplierId === supplier.id || supplier.products.includes(p.id)
    );
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
  // Separar el prefijo del número de teléfono si existe
  const parsePhone = (phone: string) => {
    const match = phone.match(/^(\+\d+)\s*(.+)$/);
    if (match) {
      return { prefix: match[1], number: match[2] };
    }
    return { prefix: '+57', number: phone };
  };

  const initialPhone = supplier?.phone ? parsePhone(supplier.phone) : { prefix: '+57', number: '' };

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

  const [phonePrefix, setPhonePrefix] = useState(initialPhone.prefix);
  const [phoneNumber, setPhoneNumber] = useState(initialPhone.number);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Combinar prefijo y número en el campo phone
    const combinedPhone = `${phonePrefix} ${phoneNumber}`;
    onSave({ ...formData, phone: combinedPhone });
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
              <div className="flex gap-2">
                <select
                  value={phonePrefix}
                  onChange={(e) => setPhonePrefix(e.target.value)}
                  className="w-32 px-3 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="+57">🇨🇴 +57</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+52">🇲🇽 +52</option>
                  <option value="+54">🇦🇷 +54</option>
                  <option value="+56">🇨🇱 +56</option>
                  <option value="+51">🇵🇪 +51</option>
                  <option value="+593">🇪🇨 +593</option>
                  <option value="+58">🇻🇪 +58</option>
                  <option value="+591">🇧🇴 +591</option>
                  <option value="+595">🇵🇾 +595</option>
                  <option value="+598">🇺🇾 +598</option>
                  <option value="+34">🇪🇸 +34</option>
                  <option value="+44">🇬🇧 +44</option>
                </select>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Número de teléfono"
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
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
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-linear-to-r from-orange-600 to-orange-700 p-6 flex items-center justify-between rounded-t-2xl">
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
            <h4 className="text-slate-700 text-lg font-semibold mb-4">Productos Suministrados ({products.length})</h4>
            {products.length === 0 ? (
              <div className="bg-slate-50 rounded-xl p-6 text-center">
                <Package size={48} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500">Este proveedor no tiene productos asignados</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Código</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Nombre</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">Stock</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">Min</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">Max</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">Precio</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {products.map(product => {
                      const stockLevel = product.stock <= product.minStock ? 'low' : 
                                       product.stock >= product.maxStock ? 'high' : 'ok';
                      return (
                        <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-slate-600">{product.code}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {product.image && (
                                <img 
                                  src={product.image} 
                                  alt={product.name}
                                  className="w-8 h-8 rounded object-cover"
                                />
                              )}
                              <div>
                                <p className="text-sm font-medium text-slate-900">{product.name}</p>
                                <p className="text-xs text-slate-500">{product.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              stockLevel === 'low' ? 'bg-red-100 text-red-700' :
                              stockLevel === 'high' ? 'bg-blue-100 text-blue-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-slate-600">{product.minStock}</td>
                          <td className="px-4 py-3 text-center text-sm text-slate-600">{product.maxStock}</td>
                          <td className="px-4 py-3 text-right text-sm font-medium text-slate-900">
                            ${product.price.toLocaleString('es', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {stockLevel === 'low' && (
                              <span className="inline-flex items-center gap-1 text-xs text-red-600">
                                <TrendingUp size={14} />
                                Bajo
                              </span>
                            )}
                            {stockLevel === 'ok' && (
                              <span className="inline-flex items-center gap-1 text-xs text-green-600">
                                <CheckCircle size={14} />
                                OK
                              </span>
                            )}
                            {stockLevel === 'high' && (
                              <span className="inline-flex items-center gap-1 text-xs text-blue-600">
                                <CheckCircle size={14} />
                                Alto
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
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