import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import type { Product, Supplier, PurchaseOrder } from '../types/index';

interface PurchaseOrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (order: any) => void;
  suppliers: Supplier[];
  products: Product[];
  editingOrder?: PurchaseOrder | null;
  currentUserId: string;
  currentUserName: string;
}

interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  supplier_id?: string;
  supplier_name?: string;
}

export function PurchaseOrderFormModal({
  isOpen,
  onClose,
  onSubmit,
  suppliers,
  products,
  editingOrder,
  currentUserId,
  currentUserName
}: PurchaseOrderFormModalProps) {
  const [formData, setFormData] = useState({
    supplier_id: '',
    supplier_name: '',
    notes: ''
  });

  const [items, setItems] = useState<OrderItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    product_id: '',
    product_name: '',
    quantity: 1,
    price: 0
  });

  // Cargar datos si estamos editando
  useEffect(() => {
    if (editingOrder) {
      setFormData({
        supplier_id: editingOrder.supplierId,
        supplier_name: editingOrder.supplierName,
        notes: editingOrder.notes || ''
      });

      // Convertir productos de la orden a items
      const orderItems = editingOrder.products.map(p => ({
        product_id: p.productId,
        product_name: p.productName,
        quantity: p.quantity,
        price: p.price
      }));
      setItems(orderItems);
    } else {
      // Reset form
      setFormData({ supplier_id: '', supplier_name: '', notes: '' });
      setItems([]);
    }
  }, [editingOrder]);

  const handleSupplierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const supplierId = e.target.value;
    const supplier = suppliers.find(s => s.id === supplierId);
    setFormData({
      ...formData,
      supplier_id: supplierId,
      supplier_name: supplier?.name || ''
    });
    
    // Solo limpiar el item actual, no los items agregados
    setCurrentItem({ product_id: '', product_name: '', quantity: 1, price: 0 });
  };

  // Filtrar productos por proveedor seleccionado
  const getAvailableProducts = () => {
    if (!formData.supplier_id) {
      return [];
    }
    
    // Filtrar productos que pertenecen al proveedor seleccionado
    return products.filter(p => 
      p.active && p.supplierId === formData.supplier_id
    );
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = e.target.value;
    const product = products.find(p => p.id === productId);
    if (product) {
      setCurrentItem({
        product_id: productId,
        product_name: product.name,
        quantity: 1,
        price: product.price
      });
    }
  };

  const addItem = () => {
    if (!currentItem.product_id || currentItem.quantity <= 0 || currentItem.price <= 0) {
      alert('Por favor completa todos los campos del producto');
      return;
    }

    // Verificar si el producto ya está en la lista
    if (items.some(item => item.product_id === currentItem.product_id)) {
      alert('Este producto ya está en la orden');
      return;
    }

    // Agregar el item con información del proveedor
    const itemWithSupplier = {
      ...currentItem,
      supplier_id: formData.supplier_id,
      supplier_name: formData.supplier_name
    };

    setItems([...items, itemWithSupplier]);
    setCurrentItem({ product_id: '', product_name: '', quantity: 1, price: 0 });
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      alert('Por favor agrega al menos un producto');
      return;
    }

    // Agrupar items por proveedor para crear múltiples órdenes si es necesario
    // Por ahora, usaremos el proveedor del primer item como referencia
    const firstSupplier = items[0].supplier_id || formData.supplier_id;
    const firstSupplierName = items[0].supplier_name || formData.supplier_name;

    const orderData = {
      supplier_id: firstSupplier,
      supplier_name: firstSupplierName,
      total_amount: calculateTotal(),
      created_by: currentUserId,
      user_name: currentUserName,
      notes: formData.notes,
      items
    };

    onSubmit(orderData);
    onClose();
    
    // Reset form
    setFormData({ supplier_id: '', supplier_name: '', notes: '' });
    setItems([]);
    setCurrentItem({ product_id: '', product_name: '', quantity: 1, price: 0 });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-2xl font-bold text-slate-800">
            {editingOrder ? 'Editar Orden de Compra' : 'Nueva Orden de Compra'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Proveedor */}
          <div>
            <label className="block text-slate-700 font-medium mb-2">
              Proveedor (Selecciona para agregar productos) *
            </label>
            <select
              value={formData.supplier_id}
              onChange={handleSupplierChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={editingOrder?.status !== 'pendiente' && !!editingOrder}
            >
              <option value="">Seleccionar proveedor para agregar productos</option>
              {suppliers.filter(s => s.active).map(supplier => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name} - {supplier.nit}
                </option>
              ))}
            </select>
            <p className="text-sm text-slate-500 mt-1">
              💡 Puedes cambiar de proveedor para agregar productos de diferentes proveedores
            </p>
          </div>

          {/* Agregar Productos */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-4">
            <h4 className="font-semibold text-slate-800">Agregar Productos</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-slate-700 mb-2">Producto</label>
                <select
                  value={currentItem.product_id}
                  onChange={handleProductChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!formData.supplier_id || (editingOrder?.status !== 'pendiente' && !!editingOrder)}
                >
                  <option value="">
                    {!formData.supplier_id 
                      ? 'Primero selecciona un proveedor' 
                      : getAvailableProducts().length === 0 
                        ? 'No hay productos para este proveedor'
                        : 'Seleccionar producto'}
                  </option>
                  {getAvailableProducts().map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - ${product.price}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-2">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  value={currentItem.quantity}
                  onChange={(e) => setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={editingOrder?.status !== 'pendiente' && !!editingOrder}
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-2">Precio</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentItem.price}
                  onChange={(e) => setCurrentItem({ ...currentItem, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={editingOrder?.status !== 'pendiente' && !!editingOrder}
                />
              </div>
            </div>

            {(!editingOrder || editingOrder.status === 'pendiente') && (
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                Agregar Producto
              </button>
            )}
          </div>

          {/* Lista de Productos */}
          {items.length > 0 && (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                <h4 className="font-semibold text-slate-800">Productos en la Orden</h4>
              </div>
              <div className="divide-y divide-slate-200">
                {items.map((item, index) => (
                  <div key={index} className="px-4 py-3 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{item.product_name}</p>
                      <p className="text-slate-600 text-sm">
                        {item.quantity} x ${item.price.toFixed(2)} = ${(item.quantity * item.price).toFixed(2)}
                      </p>
                      {item.supplier_name && (
                        <p className="text-slate-500 text-xs mt-1">
                          🏢 Proveedor: {item.supplier_name}
                        </p>
                      )}
                    </div>
                    {(!editingOrder || editingOrder.status === 'pendiente') && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="bg-slate-50 px-4 py-3 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-800">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Notas */}
          <div>
            <label className="block text-slate-700 font-medium mb-2">
              Notas (Opcional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Información adicional sobre la orden..."
              disabled={editingOrder?.status !== 'pendiente' && !!editingOrder}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            {(!editingOrder || editingOrder.status === 'pendiente') && (
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-colors shadow-lg"
              >
                {editingOrder ? 'Actualizar Orden' : 'Crear Orden'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
