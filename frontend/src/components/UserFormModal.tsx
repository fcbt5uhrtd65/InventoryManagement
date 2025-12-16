import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { User, Warehouse } from '../types/index';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<User, 'id' | 'createdAt'>) => void;
  user?: User | null;
  warehouses: Warehouse[];
}

export function UserFormModal({ isOpen, onClose, onSave, user, warehouses }: UserFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'empleado' as 'admin' | 'empleado' | 'auditor' | 'encargado_bodega',
    active: true,
    warehouseId: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '', // No mostrar password existente
        role: user.role,
        active: user.active,
        warehouseId: user.warehouseId || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'empleado',
        active: true,
        warehouseId: '',
      });
    }
  }, [user, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Si estamos editando y no se cambió el password, mantener el anterior
    const dataToSave = user && !formData.password 
      ? { ...formData, password: user.password }
      : formData;

    onSave(dataToSave);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-1">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="bg-indigo-600 p-6 flex items-center justify-between rounded-t-xl">
          <h3 className="text-xl font-semibold text-white">{user ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-indigo-700 rounded-lg transition-colors text-white"
          >
            <X size={22} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nombre Completo *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Juan Pérez"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Correo Electrónico *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="usuario@ejemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Contraseña {user ? <span className="text-slate-500 font-normal text-xs">(dejar vacío para mantener actual)</span> : '*'}
              </label>
              <input
                type="password"
                required={!user}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Rol *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'empleado' | 'auditor' | 'encargado_bodega' })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer"
              >
                <option value="empleado">Empleado</option>
                <option value="admin">Administrador</option>
                <option value="auditor">Auditor</option>
                <option value="encargado_bodega">Encargado de Bodega</option>
              </select>
              <p className="text-xs text-slate-500 mt-2">
                {formData.role === 'admin' 
                  ? '✓ Control total del sistema'
                  : formData.role === 'auditor'
                  ? '✓ Puede ver auditorías y reportes'
                  : formData.role === 'encargado_bodega'
                  ? '✓ Gestiona almacenes y stock'
                  : '✓ Solo puede registrar entradas/salidas'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Almacén Asignado (Opcional)</label>
              <select
                value={formData.warehouseId}
                onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer"
              >
                <option value="">Sin almacén asignado</option>
                {warehouses.filter(w => w.active).map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name} - {warehouse.location}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-2">
                {formData.role === 'encargado_bodega' 
                  ? '✓ Recomendado para encargados de bodega'
                  : 'Opcional para otros roles'}
              </p>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">Usuario activo</span>
              </label>
            </div>
          </div>
          
          <div className="flex gap-3 mt-8 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
            >
              {user ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
