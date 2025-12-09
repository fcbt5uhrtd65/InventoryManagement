import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { User } from '../types/index';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<User, 'id' | 'createdAt'>) => void;
  user?: User | null;
}

export function UserFormModal({ isOpen, onClose, onSave, user }: UserFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'empleado' as 'admin' | 'empleado' | 'auditor' | 'encargado_bodega',
    active: true,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '', // No mostrar password existente
        role: user.role,
        active: user.active,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'empleado',
        active: true,
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex items-center justify-between rounded-t-2xl">
          <h3 className="text-white">{user ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors text-white"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 mb-2">Nombre Completo *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Juan Pérez"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-2">Correo Electrónico *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="usuario@ejemplo.com"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-2">
                Contraseña {user ? '(dejar vacío para mantener actual)' : '*'}
              </label>
              <input
                type="password"
                required={!user}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-2">Rol *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'empleado' | 'auditor' | 'encargado_bodega' })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="empleado">Empleado</option>
                <option value="admin">Administrador</option>
                <option value="auditor">Auditor</option>
                <option value="encargado_bodega">Encargado de Bodega</option>
              </select>
              <p className="text-slate-500 mt-2">
                {formData.role === 'admin' 
                  ? 'Control total del sistema'
                  : formData.role === 'auditor'
                  ? 'Puede ver auditorías y reportes'
                  : formData.role === 'encargado_bodega'
                  ? 'Gestiona almacenes y stock'
                  : 'Solo puede registrar entradas/salidas'}
              </p>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-slate-700">Usuario activo</span>
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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-colors"
            >
              {user ? 'Actualizar' : 'Crear'} Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
