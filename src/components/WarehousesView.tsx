import { useState } from 'react';
import { Plus, Building2, MapPin, User, Package, Edit2, Trash2, TrendingUp, BarChart3, X } from 'lucide-react';
import type { Warehouse, Product } from '../types/index';

interface WarehousesViewProps {
  warehouses: Warehouse[];
  products: Product[];
  onSave: (warehouse: Omit<Warehouse, 'id'>) => void;
  onUpdate: (id: string, warehouse: Partial<Warehouse>) => void;
  onDelete: (id: string) => void;
}

export function WarehousesView({ warehouses, products, onSave, onUpdate, onDelete }: WarehousesViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Warehouse | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);

  const activeWarehouses = warehouses.filter(w => w.active).length;
  const totalCapacity = warehouses.reduce((sum, w) => sum + w.capacity, 0);
  
  // Calcular stock por almacén
  const getWarehouseStock = (warehouse: Warehouse) => {
    const warehouseProducts = products.filter(p => p.warehouse === warehouse.id);
    return warehouseProducts.reduce((sum, p) => sum + p.stock, 0);
  };

  const getWarehouseOccupancy = (warehouse: Warehouse) => {
    const stock = getWarehouseStock(warehouse);
    return (stock / warehouse.capacity) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Gestión de Almacenes</h2>
          <p className="text-slate-500">Administra ubicaciones físicas y capacidad</p>
        </div>
        <button
          onClick={() => { setEditing(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg"
        >
          <Plus size={20} />
          Nuevo Almacén
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Building2 size={28} />
            </div>
            <h2>{warehouses.length}</h2>
          </div>
          <p className="text-indigo-100">Total Almacenes</p>
          <p className="text-indigo-200">Ubicaciones registradas</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <TrendingUp size={28} />
            </div>
            <h2>{activeWarehouses}</h2>
          </div>
          <p className="text-emerald-100">Almacenes Activos</p>
          <p className="text-emerald-200">{Math.round((activeWarehouses/warehouses.length)*100)}% operativos</p>
        </div>

        <div className="bg-gradient-to-br from-cyan-600 to-cyan-700 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Package size={28} />
            </div>
            <h2>{totalCapacity.toLocaleString()}</h2>
          </div>
          <p className="text-cyan-100">Capacidad Total</p>
          <p className="text-cyan-200">Unidades combinadas</p>
        </div>
      </div>

      {/* Warehouses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {warehouses.map(warehouse => {
          const stock = getWarehouseStock(warehouse);
          const occupancy = getWarehouseOccupancy(warehouse);
          const warehouseProducts = products.filter(p => p.warehouse === warehouse.id);

          return (
            <div key={warehouse.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl text-white shadow-lg">
                  <Building2 size={24} />
                </div>
                <div className="flex-1">
                  <h4>{warehouse.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${warehouse.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    {warehouse.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin size={16} className="text-slate-400" />
                  <span className="text-sm truncate">{warehouse.location}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Package size={16} className="text-slate-400" />
                  <span className="text-sm">Capacidad: {warehouse.capacity.toLocaleString()} uds</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <User size={16} className="text-slate-400" />
                  <span className="text-sm">Encargado: {warehouse.manager}</span>
                </div>
              </div>

              {/* Occupancy Bar */}
              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-500">Ocupación</span>
                  <span className={`${
                    occupancy > 90 ? 'text-red-600' :
                    occupancy > 70 ? 'text-amber-600' :
                    'text-emerald-600'
                  }`}>
                    {occupancy.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                  <div 
                    className={`h-3 rounded-full transition-all ${
                      occupancy > 90 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                      occupancy > 70 ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
                      'bg-gradient-to-r from-emerald-500 to-emerald-600'
                    }`}
                    style={{ width: `${Math.min(occupancy, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Stock: {stock} uds</span>
                  <span className="text-slate-500">{warehouseProducts.length} productos</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedWarehouse(warehouse)}
                  className="flex items-center justify-center gap-2 px-3 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <BarChart3 size={16} />
                  <span>Detalles</span>
                </button>
                <button
                  onClick={() => { setEditing(warehouse); setIsModalOpen(true); }}
                  className="flex items-center justify-center gap-2 px-3 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                >
                  <Edit2 size={16} />
                  <span>Editar</span>
                </button>
              </div>

              <button
                onClick={() => {
                  if (confirm('¿Estás seguro de eliminar este almacén?')) {
                    onDelete(warehouse.id);
                  }
                }}
                className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
                <span>Eliminar</span>
              </button>
            </div>
          );
        })}
      </div>

      {warehouses.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <Building2 size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-slate-600 mb-2">No hay almacenes registrados</h3>
          <p className="text-slate-500">Comienza agregando tu primer almacén</p>
        </div>
      )}

      {/* Warehouse Form Modal */}
      {isModalOpen && (
        <WarehouseModal
          warehouse={editing}
          onClose={() => { setIsModalOpen(false); setEditing(null); }}
          onSave={(data) => {
            if (editing) onUpdate(editing.id, data);
            else onSave(data);
          }}
        />
      )}

      {/* Warehouse Details Modal */}
      {selectedWarehouse && (
        <WarehouseDetailsModal
          warehouse={selectedWarehouse}
          products={products.filter(p => p.warehouse === selectedWarehouse.id)}
          onClose={() => setSelectedWarehouse(null)}
        />
      )}
    </div>
  );
}

// Warehouse Form Modal
function WarehouseModal({ warehouse, onClose, onSave }: {
  warehouse: Warehouse | null;
  onClose: () => void;
  onSave: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    name: warehouse?.name || '',
    location: warehouse?.location || '',
    capacity: warehouse?.capacity || 0,
    manager: warehouse?.manager || '',
    active: warehouse?.active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 rounded-t-2xl flex items-center justify-between">
          <h3 className="text-white">{warehouse ? 'Editar' : 'Nuevo'} Almacén</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg text-white">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-slate-700 mb-2">Nombre del Almacén *</label>
            <input
              type="text"
              required
              placeholder="Ej: Bodega Principal"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-2">Ubicación *</label>
            <input
              type="text"
              required
              placeholder="Dirección completa"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-2">Capacidad (unidades) *</label>
            <input
              type="number"
              required
              min="1"
              placeholder="10000"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-2">Encargado *</label>
            <input
              type="text"
              required
              placeholder="Nombre del encargado"
              value={formData.manager}
              onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-5 h-5 text-indigo-600 rounded"
              />
              <span className="text-slate-700">Almacén activo</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50">
              Cancelar
            </button>
            <button type="submit" className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800">
              {warehouse ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Warehouse Details Modal
function WarehouseDetailsModal({ warehouse, products, onClose }: {
  warehouse: Warehouse;
  products: Product[];
  onClose: () => void;
}) {
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);
  const occupancy = (totalStock / warehouse.capacity) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 flex items-center justify-between rounded-t-2xl">
          <h3 className="text-white">Detalles del Almacén: {warehouse.name}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Info Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-500 mb-1">Ubicación</p>
              <p className="text-slate-700">{warehouse.location}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Encargado</p>
              <p className="text-slate-700">{warehouse.manager}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Capacidad</p>
              <p className="text-slate-700">{warehouse.capacity.toLocaleString()} unidades</p>
            </div>
            <div>
              <p className="text-slate-500 mb-1">Estado</p>
              <span className={`px-3 py-1 rounded-full ${warehouse.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                {warehouse.active ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl">
              <p className="text-blue-600 mb-1">Stock Total</p>
              <h4 className="text-blue-700">{totalStock.toLocaleString()}</h4>
              <p className="text-blue-500">unidades</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl">
              <p className="text-emerald-600 mb-1">Valor Total</p>
              <h4 className="text-emerald-700">${totalValue.toLocaleString('es', { minimumFractionDigits: 2 })}</h4>
              <p className="text-emerald-500">inventario</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl">
              <p className="text-purple-600 mb-1">Ocupación</p>
              <h4 className="text-purple-700">{occupancy.toFixed(1)}%</h4>
              <p className="text-purple-500">capacidad</p>
            </div>
          </div>

          {/* Products Table */}
          <div>
            <h4 className="mb-4">Productos en este Almacén ({products.length})</h4>
            <div className="bg-slate-50 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-4 py-3 text-left">Producto</th>
                    <th className="px-4 py-3 text-left">Categoría</th>
                    <th className="px-4 py-3 text-left">Stock</th>
                    <th className="px-4 py-3 text-left">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-white">
                      <td className="px-4 py-3">{product.name}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">{product.stock} uds</td>
                      <td className="px-4 py-3">${(product.stock * product.price).toLocaleString('es', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
