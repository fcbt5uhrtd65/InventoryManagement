import { useState } from 'react';
import { Plus, Edit2, Trash2, UserCheck, UserX, Shield, User as UserIcon } from 'lucide-react';
import type { User } from '../types/index';
import { UserFormModal } from './UserFormModal';

interface UsersViewProps {
  users: User[];
  onSave: (user: Omit<User, 'id' | 'createdAt'>) => void;
  onUpdate: (id: string, user: Partial<User>) => void;
  onDelete: (id: string) => void;
  currentUser: User;
}

export function UsersView({ users, onSave, onUpdate, onDelete, currentUser }: UsersViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const activeUsers = users.filter(u => u.active).length;
  const adminUsers = users.filter(u => u.role === 'admin').length;
  const employeeUsers = users.filter(u => u.role === 'empleado').length;

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (id === currentUser.id) {
      alert('No puedes eliminar tu propia cuenta');
      return;
    }
    if (confirm('¿Estás seguro de desactivar este usuario?')) {
      onUpdate(id, { active: false });
    }
  };

  const handleToggleActive = (user: User) => {
    if (user.id === currentUser.id) {
      alert('No puedes desactivar tu propia cuenta');
      return;
    }
    onUpdate(user.id, { active: !user.active });
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500">Usuarios Activos</p>
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <UserCheck size={20} />
            </div>
          </div>
          <h3>{activeUsers}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500">Administradores</p>
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <Shield size={20} />
            </div>
          </div>
          <h3>{adminUsers}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500">Empleados</p>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <UserIcon size={20} />
            </div>
          </div>
          <h3>{employeeUsers}</h3>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left">Usuario</th>
                <th className="px-6 py-4 text-left">Correo</th>
                <th className="px-6 py-4 text-left">Rol</th>
                <th className="px-6 py-4 text-left">Estado</th>
                <th className="px-6 py-4 text-left">Fecha de Registro</th>
                <th className="px-6 py-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map(user => (
                <tr key={user.id} className={`hover:bg-slate-50 transition-colors ${!user.active ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p>{user.name}</p>
                        {user.id === currentUser.id && (
                          <span className="text-indigo-600">(Tú)</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-600">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role === 'admin' ? (
                        <span className="flex items-center gap-1">
                          <Shield size={14} />
                          Administrador
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <UserIcon size={14} />
                          Empleado
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full flex items-center gap-1 w-fit ${
                      user.active 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {user.active ? (
                        <>
                          <UserCheck size={14} />
                          Activo
                        </>
                      ) : (
                        <>
                          <UserX size={14} />
                          Inactivo
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-600">
                      {new Date(user.createdAt).toLocaleDateString('es')}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleToggleActive(user)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.active
                            ? 'text-slate-600 hover:text-amber-600 hover:bg-amber-50'
                            : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={user.active ? 'Desactivar' : 'Activar'}
                        disabled={user.id === currentUser.id}
                      >
                        {user.active ? <UserX size={18} /> : <UserCheck size={18} />}
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                        disabled={user.id === currentUser.id}
                      >
                        <Trash2 size={18} />
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
        onSave={(data) => {
          if (editingUser) {
            onUpdate(editingUser.id, data);
          } else {
            onSave(data);
          }
        }}
        user={editingUser}
      />
    </div>
  );
}
