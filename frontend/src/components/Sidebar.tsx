import { 
  LayoutDashboard, 
  Package, 
  ArrowLeftRight, 
  Bell, 
  BarChart3, 
  Users, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2,
  Truck,
  History,
  ShoppingCart
} from 'lucide-react';
import type { User } from '../types/index';
import { useState } from 'react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  user: User;
  onLogout: () => void;
}

export function Sidebar({ currentView, onViewChange, user, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'blue' },
    { id: 'products', label: 'Productos', icon: Package, color: 'purple' },
    { id: 'movements', label: 'Movimientos', icon: ArrowLeftRight, color: 'emerald' },
    { id: 'alerts', label: 'Alertas', icon: Bell, color: 'amber' },
    { id: 'reports', label: 'Reportes', icon: BarChart3, color: 'cyan' },
    ...(user.role === 'admin' || user.role === 'encargado_bodega' ? [
      { id: 'purchase-orders', label: 'Órdenes de Compra', icon: ShoppingCart, color: 'teal' },
    ] : []),
    ...(user.role === 'admin' ? [
      { id: 'suppliers', label: 'Proveedores', icon: Truck, color: 'orange' },
      { id: 'warehouses', label: 'Almacenes', icon: Building2, color: 'indigo' },
      { id: 'users', label: 'Usuarios', icon: Users, color: 'pink' },
      { id: 'audit', label: 'Auditoría', icon: History, color: 'slate' },
    ] : []),
  ];

  const colorClasses = {
    blue: 'from-blue-600 to-blue-700',
    purple: 'from-purple-600 to-purple-700',
    emerald: 'from-emerald-600 to-emerald-700',
    amber: 'from-amber-600 to-amber-700',
    cyan: 'from-cyan-600 to-cyan-700',
    teal: 'from-teal-600 to-teal-700',
    orange: 'from-orange-600 to-orange-700',
    indigo: 'from-indigo-600 to-indigo-700',
    pink: 'from-pink-600 to-pink-700',
    slate: 'from-slate-600 to-slate-700',
  };

  return (
    <aside className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'} flex flex-col shadow-2xl`}>
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg">
              <Package size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-white">InventoryPro</h3>
              <p className="text-slate-400">Sistema SGII</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group relative ${
                isActive 
                  ? `bg-gradient-to-r ${colorClasses[item.color as keyof typeof colorClasses]} text-white shadow-lg` 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
              )}
              <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
              {!collapsed && <span>{item.label}</span>}
              {collapsed && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className={`flex items-center gap-3 mb-4 p-3 bg-slate-800 rounded-xl ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white truncate">{user.name}</p>
              <p className="text-slate-400 truncate capitalize">{user.role.replace('_', ' ')}</p>
            </div>
          )}
        </div>
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-950 hover:text-red-300 rounded-xl transition-colors ${collapsed ? 'justify-center' : ''} group relative`}
        >
          <LogOut size={20} />
          {!collapsed && <span>Cerrar Sesión</span>}
          {collapsed && (
            <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl">
              Cerrar Sesión
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}