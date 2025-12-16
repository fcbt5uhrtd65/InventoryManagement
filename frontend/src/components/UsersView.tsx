import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, UserCheck, UserX, Shield, User as UserIcon, Loader2 } from 'lucide-react';
import type { User, Warehouse } from '../types/index';
import { UserFormModal } from './UserFormModal';
import { userService } from '../services/userService';
import { warehouseService } from '../services/warehouseService';
import { authService } from '../services/authService';

export function UsersView() {
  const [users, setUsers] = useState<User[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const currentUser = authService.getCurrentUser();

  // Cargar usuarios y almacenes al montar el componente
  useEffect(() => {
    loadUsers();
    loadWarehouses();
  }, []);

  // Función para cargar usuarios
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersData = await userService.getAll();
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (err) {
      console.error('Error cargando usuarios:', err);
      setError('Error al cargar los usuarios. Por favor, intenta de nuevo.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar almacenes
  const loadWarehouses = async () => {
    try {
      const warehousesData = await warehouseService.getAll();
      setWarehouses(Array.isArray(warehousesData) ? warehousesData : []);
    } catch (err) {
      console.error('Error cargando almacenes:', err);
    }
  };

  // Crear o actualizar usuario
  const handleSave = async (userData: any) => {
    try {
      if (editingUser) {
        await userService.update(editingUser.id, userData);
      } else {
        await userService.create(userData);
      }
      await loadUsers();
      setIsModalOpen(false);
      setEditingUser(null);
    } catch (err) {
      console.error('Error guardando usuario:', err);
      alert('Error al guardar el usuario. Por favor, intenta de nuevo.');
    }
  };

  // Actualizar usuario
  const handleUpdate = async (id: string, userData: Partial<User>) => {
    try {
      await userService.update(id, userData);
      await loadUsers();
    } catch (err) {
      console.error('Error actualizando usuario:', err);
      alert('Error al actualizar el usuario. Por favor, intenta de nuevo.');
    }
  };

  // Mostrar loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  // Mostrar error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <h3 className="text-red-800 mb-2">Error</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadUsers}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <p className="text-amber-800">No se pudo obtener el usuario actual.</p>
      </div>
    );
  }

  const activeUsers = users.filter(u => u.active).length;
  const adminUsers = users.filter(u => u.role === 'admin').length;
  const employeeUsers = users.filter(u => u.role === 'empleado').length;

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (id === currentUser.id) {
      alert('No puedes eliminar tu propia cuenta');
      return;
    }
    if (confirm('¿Estás seguro de eliminar este usuario permanentemente?')) {
      try {
        await userService.delete(id);
        await loadUsers();
      } catch (err) {
        console.error('Error eliminando usuario:', err);
        alert('Error al eliminar el usuario. Por favor, intenta de nuevo.');
      }
    }
  };

  const handleToggleActive = (user: User) => {
    if (user.id === currentUser.id) {
      alert('No puedes desactivar tu propia cuenta');
      return;
    }
    handleUpdate(user.id, { active: !user.active });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Gestión de Usuarios</h2>
          <p className="text-slate-500">Administra los usuarios del sistema</p>
        </div>
        <button
          onClick={() => {
            setEditingUser(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
        >
          <Plus size={20} />
          Nuevo Usuario
        </button>
      </div>

      {/* Stats Cards - Diseño profesional */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-emerald-200 rounded-lg shadow-sm hover:shadow-md transition-all p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg flex-shrink-0">
              <UserCheck size={28} className="text-emerald-600" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <p className="text-emerald-700 text-sm font-medium">Usuarios Activos</p>
              <p className="text-3xl font-bold text-emerald-800 mt-1">{activeUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-indigo-200 rounded-lg shadow-sm hover:shadow-md transition-all p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-lg flex-shrink-0">
              <Shield size={28} className="text-indigo-600" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <p className="text-indigo-700 text-sm font-medium">Administradores</p>
              <p className="text-3xl font-bold text-indigo-800 mt-1">{adminUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-blue-200 rounded-lg shadow-sm hover:shadow-md transition-all p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
              <UserIcon size={28} className="text-blue-600" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <p className="text-blue-700 text-sm font-medium">Empleados</p>
              <p className="text-3xl font-bold text-blue-800 mt-1">{employeeUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Usuario</span>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Correo</span>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Rol</span>
                </th>
                <th className="px-6 py-4 text-center">
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Estado</span>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Fecha Registro</span>
                </th>
                <th className="px-6 py-4 text-center">
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(user => (
                <tr key={user.id} className={`hover:bg-slate-50 transition-colors ${!user.active ? 'opacity-60' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{user.name}</p>
                        {user.id === currentUser.id && (
                          <span className="text-xs text-indigo-600 font-medium">(Tú)</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-600 text-sm">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                      user.role === 'admin' 
                        ? 'bg-indigo-100 text-indigo-800 border-indigo-300' 
                        : 'bg-blue-100 text-blue-800 border-blue-300'
                    }`}>
                      {user.role === 'admin' ? 'Administrador' : 'Empleado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                      user.active 
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                        : 'bg-slate-100 text-slate-800 border-slate-300'
                    }`}>
                      {user.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-600 text-sm">
                      {new Date(user.createdAt).toLocaleDateString('es', { 
                        day: '2-digit', 
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                        title="Editar usuario"
                      >
                        <Edit2 size={18} strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => handleToggleActive(user)}
                        className={`p-2 rounded transition-colors ${
                          user.active
                            ? 'text-slate-600 hover:text-amber-600 hover:bg-amber-50'
                            : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={user.active ? 'Desactivar usuario' : 'Activar usuario'}
                        disabled={user.id === currentUser.id}
                      >
                        {user.active ? <UserX size={18} strokeWidth={1.5} /> : <UserCheck size={18} strokeWidth={1.5} />}
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Eliminar usuario"
                        disabled={user.id === currentUser.id}
                      >
                        <Trash2 size={18} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSave}
        user={editingUser}
        warehouses={warehouses}
      />
    </div>
  );
}
