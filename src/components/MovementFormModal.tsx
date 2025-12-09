import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import type { Product, Movement, User } from '../types/index';

interface MovementFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (movement: Omit<Movement, 'id'>) => void;
  products: Product[];
  user: User;
}

export function MovementFormModal({ isOpen, onClose, onSave, products, user }: MovementFormModalProps) {
  const [formData, setFormData] = useState({
    type: 'entrada' as 'entrada' | 'salida',
    productId: '',
    quantity: 0,
    observation: '',
  });

  const [error, setError] = useState('');

  const selectedProduct = products.find(p => p.id === formData.productId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.productId) {
      setError('Debes seleccionar un producto');
      return;
    }

    if (formData.quantity <= 0) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }

    if (formData.type === 'salida' && selectedProduct) {
      if (formData.quantity > selectedProduct.stock) {
        setError(`Stock insuficiente. Disponible: ${selectedProduct.stock} unidades`);
        return;
      }
    }

    const movement: Omit<Movement, 'id'> = {
      type: formData.type,
      productId: formData.productId,
      productName: selectedProduct?.name || '',
      quantity: formData.quantity,
      date: new Date().toISOString(),
      observation: formData.observation,
      userId: user.id,
      userName: user.name,
    };

    onSave(movement);
    setFormData({
      type: 'entrada',
      productId: '',
      quantity: 0,
      observation: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 p-6 flex items-center justify-between rounded-t-2xl">
          <h3 className="text-white">Registrar Movimiento</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-slate-700 mb-2">Tipo de Movimiento *</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'entrada' })}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    formData.type === 'entrada'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <p>Entrada</p>
                  <p className="text-slate-500">Ingreso de stock</p>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'salida' })}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    formData.type === 'salida'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <p>Salida</p>
                  <p className="text-slate-500">Egreso de stock</p>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 mb-2">Producto *</label>
              <select
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Selecciona un producto</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} (Stock: {product.stock} uds)
                  </option>
                ))}
              </select>
            </div>

            {selectedProduct && (
              <div className="bg-slate-50 p-4 rounded-xl">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-slate-500">Stock Actual</p>
                    <p className="text-slate-700">{selectedProduct.stock} uds</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Stock Mínimo</p>
                    <p className="text-slate-700">{selectedProduct.minStock} uds</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Precio</p>
                    <p className="text-slate-700">${selectedProduct.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-700 mb-2">Cantidad *</label>
              <input
                type="number"
                required
                min="1"
                value={formData.quantity || ''}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Cantidad de unidades"
              />
              {formData.type === 'salida' && selectedProduct && formData.quantity > selectedProduct.stock && (
                <p className="text-red-600 mt-2">⚠️ La cantidad excede el stock disponible</p>
              )}
            </div>

            <div>
              <label className="block text-slate-700 mb-2">Observación</label>
              <textarea
                value={formData.observation}
                onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
                placeholder="Notas adicionales sobre este movimiento (opcional)"
              />
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
              className={`flex-1 px-6 py-3 text-white rounded-xl transition-colors ${
                formData.type === 'entrada'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              Registrar {formData.type === 'entrada' ? 'Entrada' : 'Salida'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}