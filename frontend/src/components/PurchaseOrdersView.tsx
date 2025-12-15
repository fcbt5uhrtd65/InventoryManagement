import { useState, useEffect } from 'react';
import { Plus, Eye, Check, X, Package, Clock, CheckCircle2, XCircle, Truck, Search, Filter } from 'lucide-react';
import type { Product, Supplier, PurchaseOrder, User } from '../types/index';
import { PurchaseOrderFormModal } from './PurchaseOrderFormModal';
import purchaseOrderService from '../services/purchaseOrderService';

interface PurchaseOrdersViewProps {
  products: Product[];
  suppliers: Supplier[];
  currentUser: User;
}

export function PurchaseOrdersView({ products, suppliers, currentUser }: PurchaseOrdersViewProps) {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todas');
  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    aprobadas: 0,
    completadas: 0,
    rechazadas: 0,
    totalAmount: 0
  });

  useEffect(() => {
    loadOrders();
    loadStats();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await purchaseOrderService.getAll();
      if (response.success) {
        // Mapear los datos del backend al formato del frontend
        const mappedOrders = response.data.map((order: any) => ({
          id: order.id,
          supplierId: order.supplier_id,
          supplierName: order.supplier_name,
          products: order.items.map((item: any) => ({
            productId: item.product_id,
            productName: item.product_name,
            quantity: item.quantity,
            price: item.price
          })),
          totalAmount: parseFloat(order.total_amount),
          status: order.status,
          createdBy: order.created_by,
          createdAt: order.created_at,
          notes: order.notes
        }));
        setOrders(mappedOrders);
      }
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
      alert('Error al cargar las órdenes de compra');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await purchaseOrderService.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const handleCreateOrder = async (orderData: any) => {
    try {
      const response = await purchaseOrderService.create(orderData);
      if (response.success) {
        await loadOrders();
        await loadStats();
        alert('Orden de compra creada exitosamente');
      }
    } catch (error: any) {
      console.error('Error al crear orden:', error);
      alert(error.response?.data?.message || 'Error al crear la orden de compra');
    }
  };

  const handleApprove = async (orderId: string) => {
    if (!confirm('¿Estás seguro de aprobar esta orden de compra?')) return;

    try {
      const response = await purchaseOrderService.approve(orderId, currentUser.id, currentUser.name);
      if (response.success) {
        await loadOrders();
        await loadStats();
        alert('Orden aprobada exitosamente');
      }
    } catch (error: any) {
      console.error('Error al aprobar orden:', error);
      alert(error.response?.data?.message || 'Error al aprobar la orden');
    }
  };

  const handleReject = async (orderId: string) => {
    if (!confirm('¿Estás seguro de rechazar esta orden de compra?')) return;

    try {
      const response = await purchaseOrderService.reject(orderId, currentUser.id, currentUser.name);
      if (response.success) {
        await loadOrders();
        await loadStats();
        alert('Orden rechazada');
      }
    } catch (error: any) {
      console.error('Error al rechazar orden:', error);
      alert(error.response?.data?.message || 'Error al rechazar la orden');
    }
  };

  const handleComplete = async (orderId: string) => {
    if (!confirm('¿Confirmas la recepción de los productos? Esto actualizará el inventario.')) return;

    try {
      const response = await purchaseOrderService.complete(orderId, currentUser.id, currentUser.name);
      if (response.success) {
        await loadOrders();
        await loadStats();
        alert('Orden completada - Inventario actualizado exitosamente');
      }
    } catch (error: any) {
      console.error('Error al completar orden:', error);
      alert(error.response?.data?.message || 'Error al completar la orden');
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta orden de compra?')) return;

    try {
      const response = await purchaseOrderService.delete(orderId, currentUser.id, currentUser.name);
      if (response.success) {
        await loadOrders();
        await loadStats();
        alert('Orden eliminada exitosamente');
      }
    } catch (error: any) {
      console.error('Error al eliminar orden:', error);
      alert(error.response?.data?.message || 'Error al eliminar la orden');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pendiente: 'bg-amber-100 text-amber-800 border-amber-200',
      aprobada: 'bg-blue-100 text-blue-800 border-blue-200',
      completada: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      rechazada: 'bg-red-100 text-red-800 border-red-200'
    };

    const icons = {
      pendiente: <Clock size={16} />,
      aprobada: <Check size={16} />,
      completada: <CheckCircle2 size={16} />,
      rechazada: <XCircle size={16} />
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'todas' || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando órdenes de compra...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2>Órdenes de Compra</h2>
          <p className="text-slate-500">Gestiona las órdenes de compra a proveedores</p>
        </div>
        {(currentUser.role === 'admin' || currentUser.role === 'encargado_bodega') && (
          <button
            onClick={() => {
              setEditingOrder(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
          >
            <Plus size={20} />
            Nueva Orden
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Órdenes */}
        <div className="group bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 text-white rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
              <Package size={28} strokeWidth={2.5} />
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-slate-200 text-sm">Total Órdenes</p>
            <h3 className="text-white text-4xl font-bold">{stats.total}</h3>
          </div>
        </div>

        {/* Pendientes */}
        <div className="group bg-gradient-to-br from-amber-500 via-orange-600 to-orange-700 text-white rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
              <Clock size={28} strokeWidth={2.5} />
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-amber-100 text-sm">Pendientes</p>
            <h3 className="text-white text-4xl font-bold">{stats.pendientes}</h3>
          </div>
        </div>

        {/* Aprobadas */}
        <div className="group bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
              <Check size={28} strokeWidth={2.5} />
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-blue-100 text-sm">Aprobadas</p>
            <h3 className="text-white text-4xl font-bold">{stats.aprobadas}</h3>
          </div>
        </div>

        {/* Completadas */}
        <div className="group bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 text-white rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
              <CheckCircle2 size={28} strokeWidth={2.5} />
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-emerald-100 text-sm">Completadas</p>
            <h3 className="text-white text-4xl font-bold">{stats.completadas}</h3>
          </div>
        </div>

        {/* Monto Total */}
        <div className="group bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 text-white rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-3xl font-bold">$</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-purple-100 text-sm">Monto Total</p>
            <h3 className="text-white text-2xl font-bold">${stats.totalAmount.toLocaleString('es', { minimumFractionDigits: 2 })}</h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por proveedor o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="todas">Todos los estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="aprobada">Aprobadas</option>
              <option value="completada">Completadas</option>
              <option value="rechazada">Rechazadas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-slate-700 font-semibold">ID</th>
                <th className="px-6 py-4 text-left text-slate-700 font-semibold">Proveedor</th>
                <th className="px-6 py-4 text-left text-slate-700 font-semibold">Productos</th>
                <th className="px-6 py-4 text-left text-slate-700 font-semibold">Monto</th>
                <th className="px-6 py-4 text-left text-slate-700 font-semibold">Estado</th>
                <th className="px-6 py-4 text-left text-slate-700 font-semibold">Fecha</th>
                <th className="px-6 py-4 text-right text-slate-700 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No se encontraron órdenes de compra
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-slate-600">
                        #{order.id.substring(0, 8)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Truck size={18} className="text-slate-400" />
                        <span className="font-medium text-slate-800">{order.supplierName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600">{order.products.length} productos</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800">
                        ${order.totalAmount.toLocaleString('es', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600">
                        {new Date(order.createdAt).toLocaleDateString('es')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowDetailModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <Eye size={18} />
                        </button>

                        {order.status === 'pendiente' && currentUser.role === 'admin' && (
                          <>
                            <button
                              onClick={() => handleApprove(order.id)}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Aprobar"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => handleReject(order.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Rechazar"
                            >
                              <X size={18} />
                            </button>
                          </>
                        )}

                        {order.status === 'aprobada' && (currentUser.role === 'admin' || currentUser.role === 'encargado_bodega') && (
                          <button
                            onClick={() => handleComplete(order.id)}
                            className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                            title="Completar orden"
                          >
                            Recibir
                          </button>
                        )}

                        {(order.status === 'pendiente' || order.status === 'rechazada') && currentUser.role === 'admin' && (
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <X size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <PurchaseOrderFormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingOrder(null);
        }}
        onSubmit={handleCreateOrder}
        suppliers={suppliers}
        products={products}
        editingOrder={editingOrder}
        currentUserId={currentUser.id}
        currentUserName={currentUser.name}
      />

      {/* Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-2xl font-bold text-slate-800">Detalle de Orden #{selectedOrder.id.substring(0, 8)}</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Info general */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-600 mb-1">Proveedor</p>
                  <p className="font-semibold text-slate-800">{selectedOrder.supplierName}</p>
                </div>
                <div>
                  <p className="text-slate-600 mb-1">Estado</p>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <div>
                  <p className="text-slate-600 mb-1">Fecha de creación</p>
                  <p className="font-semibold text-slate-800">
                    {new Date(selectedOrder.createdAt).toLocaleString('es')}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 mb-1">Monto Total</p>
                  <p className="font-semibold text-slate-800 text-xl">
                    ${selectedOrder.totalAmount.toLocaleString('es', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Productos */}
              <div>
                <h4 className="font-semibold text-slate-800 mb-3">Productos</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-slate-700">Producto</th>
                        <th className="px-4 py-3 text-center text-slate-700">Cantidad</th>
                        <th className="px-4 py-3 text-right text-slate-700">Precio</th>
                        <th className="px-4 py-3 text-right text-slate-700">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {selectedOrder.products.map((product, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 text-slate-800">{product.productName}</td>
                          <td className="px-4 py-3 text-center text-slate-600">{product.quantity}</td>
                          <td className="px-4 py-3 text-right text-slate-600">
                            ${product.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-slate-800">
                            ${(product.quantity * product.price).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Notas */}
              {selectedOrder.notes && (
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">Notas</h4>
                  <p className="text-slate-600 bg-slate-50 p-4 rounded-xl">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
