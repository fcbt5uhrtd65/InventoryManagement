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
      pendiente: 'bg-amber-100 text-amber-800 border border-amber-300',
      aprobada: 'bg-blue-100 text-blue-800 border border-blue-300',
      completada: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
      rechazada: 'bg-red-100 text-red-800 border border-red-300'
    };

    const labels = {
      pendiente: 'Pendiente',
      aprobada: 'Aprobada',
      completada: 'Completada',
      rechazada: 'Rechazada'
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
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
            // eslint-disable-next-line
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
          >
            <Plus size={20} />
            Nueva Orden
          </button>
        )}
      </div>

      {/* Stats Cards - Diseño profesional con mejor distribución */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Órdenes */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-100 rounded-lg flex-shrink-0">
              <Package size={28} className="text-slate-600" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <p className="text-slate-500 text-sm font-medium">Total de Órdenes</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{stats.total}</p>
            </div>
          </div>
        </div>

        {/* Pendientes */}
        <div className="bg-white border border-amber-200 rounded-lg shadow-sm hover:shadow-md transition-all p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-lg flex-shrink-0">
              <Clock size={28} className="text-amber-600" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <p className="text-amber-700 text-sm font-medium">Pendientes</p>
              <p className="text-3xl font-bold text-amber-800 mt-1">{stats.pendientes}</p>
            </div>
          </div>
        </div>

        {/* Aprobadas */}
        <div className="bg-white border border-blue-200 rounded-lg shadow-sm hover:shadow-md transition-all p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
              <Check size={28} className="text-blue-600" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <p className="text-blue-700 text-sm font-medium">Aprobadas</p>
              <p className="text-3xl font-bold text-blue-800 mt-1">{stats.aprobadas}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Segunda fila de cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Completadas */}
        <div className="bg-white border border-emerald-200 rounded-lg shadow-sm hover:shadow-md transition-all p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg flex-shrink-0">
              <CheckCircle2 size={28} className="text-emerald-600" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <p className="text-emerald-700 text-sm font-medium">Completadas</p>
              <p className="text-3xl font-bold text-emerald-800 mt-1">{stats.completadas}</p>
            </div>
          </div>
        </div>

        {/* Monto Total */}
        <div className="bg-white border border-purple-200 rounded-lg shadow-sm hover:shadow-md transition-all p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg flex-shrink-0">
              <span className="text-3xl font-bold text-purple-600">$</span>
            </div>
            <div className="flex-1">
              <p className="text-purple-700 text-sm font-medium">Monto Total</p>
              <p className="text-3xl font-bold text-purple-800 mt-1">${(stats.totalAmount / 1000).toFixed(1)}K</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters - Diseño profesional */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por proveedor o ID de orden..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>

          <div className="relative w-full md:w-56">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
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

      {/* Orders Table - Diseño profesional mejorado */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">ID Orden</span>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Proveedor</span>
                </th>
                <th className="px-6 py-4 text-center">
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Productos</span>
                </th>
                <th className="px-6 py-4 text-right">
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Monto</span>
                </th>
                <th className="px-6 py-4 text-center">
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Estado</span>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Fecha</span>
                </th>
                <th className="px-6 py-4 text-center">
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Package size={32} className="text-slate-400" strokeWidth={1.5} />
                      </div>
                      <p className="text-slate-600 font-medium text-lg mb-1">No se encontraron órdenes</p>
                      <p className="text-slate-400 text-sm">Intenta ajustar los filtros de búsqueda</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <code className="text-xs font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded">
                        #{order.id.substring(0, 8).toUpperCase()}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center flex-shrink-0">
                          <Truck size={16} className="text-orange-600" strokeWidth={1.5} />
                        </div>
                        <span className="font-medium text-slate-800 text-sm">{order.supplierName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-sm font-medium">
                        <Package size={14} strokeWidth={1.5} />
                        <span>{order.products.length}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-slate-900 text-sm">
                        ${order.totalAmount.toLocaleString('es', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600 text-sm">
                        {new Date(order.createdAt).toLocaleDateString('es', { 
                          day: '2-digit', 
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        {/* Ver detalles */}
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowDetailModal(true);
                          }}
                          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Ver detalles"
                        >
                          <Eye size={18} strokeWidth={1.5} />
                        </button>

                        {/* Aprobar */}
                        {order.status === 'pendiente' && currentUser.role === 'admin' && (
                          <button
                            onClick={() => handleApprove(order.id)}
                            className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                            title="Aprobar orden"
                          >
                            <Check size={18} strokeWidth={1.5} />
                          </button>
                        )}

                        {/* Rechazar */}
                        {order.status === 'pendiente' && currentUser.role === 'admin' && (
                          <button
                            onClick={() => handleReject(order.id)}
                            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Rechazar orden"
                          >
                            <X size={18} strokeWidth={1.5} />
                          </button>
                        )}

                        {/* Recibir */}
                        {order.status === 'aprobada' && (currentUser.role === 'admin' || currentUser.role === 'encargado_bodega') && (
                          <button
                            onClick={() => handleComplete(order.id)}
                            className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded hover:bg-emerald-700 transition-colors"
                            title="Marcar como recibida"
                          >
                            Recibir
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

      {/* Detail Modal - Diseño mejorado */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 p-5 flex items-center justify-between rounded-t-xl">
              <div>
                <h3 className="text-xl font-bold text-white">Orden #{selectedOrder.id.substring(0, 8)}</h3>
                <p className="text-blue-100 text-sm">Detalles de la orden de compra</p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Info general */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-slate-500 text-xs mb-1">Proveedor</p>
                  <p className="font-semibold text-slate-800">{selectedOrder.supplierName}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-slate-500 text-xs mb-1">Estado</p>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-slate-500 text-xs mb-1">Fecha de creación</p>
                  <p className="font-semibold text-slate-800 text-sm">
                    {new Date(selectedOrder.createdAt).toLocaleString('es', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
                  <p className="text-blue-600 text-xs mb-1 font-medium">Monto Total</p>
                  <p className="font-bold text-blue-700 text-xl">
                    ${selectedOrder.totalAmount.toLocaleString('es', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Productos */}
              <div>
                <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Package size={18} className="text-blue-600" />
                  Productos ({selectedOrder.products.length})
                </h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">Producto</th>
                        <th className="px-3 py-2 text-center text-xs font-semibold text-slate-600">Cantidad</th>
                        <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600">Precio Unit.</th>
                        <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedOrder.products.map((product, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="px-3 py-2.5 text-slate-800 text-sm">{product.productName}</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="inline-block bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                              {product.quantity}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-right text-slate-600 text-sm">
                            ${product.price.toFixed(2)}
                          </td>
                          <td className="px-3 py-2.5 text-right font-semibold text-slate-800 text-sm">
                            ${(product.quantity * product.price).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 font-semibold">
                        <td colSpan={3} className="px-3 py-3 text-right text-slate-700">Total:</td>
                        <td className="px-3 py-3 text-right text-blue-700 text-lg">
                          ${selectedOrder.totalAmount.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Notas */}
              {selectedOrder.notes && (
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2 text-sm">Notas adicionales</h4>
                  <p className="text-slate-600 bg-amber-50 border border-amber-200 p-3 rounded-lg text-sm">{selectedOrder.notes}</p>
                </div>
              )}

              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
