import { useState } from 'react';
import { History, Search, Calendar, User, FileText, Filter, Download, Eye, Shield, AlertCircle } from 'lucide-react';
import type { AuditLog } from '../types/index';

interface AuditViewProps {
  logs: AuditLog[];
}

export function AuditView({ logs }: AuditViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || log.timestamp.startsWith(dateFilter);
    const matchesAction = actionFilter === 'all' || log.action.includes(actionFilter);
    const matchesEntity = entityFilter === 'all' || log.entity === entityFilter;
    return matchesSearch && matchesDate && matchesAction && matchesEntity;
  });

  const getActionColor = (action: string) => {
    if (action.includes('creó') || action.includes('Creó') || action.includes('agregó') || action.includes('registró')) return 'emerald';
    if (action.includes('editó') || action.includes('Actualizó') || action.includes('actualizó') || action.includes('modificó')) return 'blue';
    if (action.includes('eliminó') || action.includes('Eliminó') || action.includes('desactivó')) return 'red';
    if (action.includes('inició sesión') || action.includes('Inició sesión')) return 'purple';
    if (action.includes('cerró sesión') || action.includes('Cerró sesión')) return 'orange';
    return 'slate';
  };

  const getActionIcon = (action: string) => {
    if (action.includes('creó') || action.includes('Creó') || action.includes('agregó')) return '✨';
    if (action.includes('editó') || action.includes('Actualizó') || action.includes('actualizó')) return '✏️';
    if (action.includes('eliminó') || action.includes('Eliminó')) return '🗑️';
    if (action.includes('inició sesión') || action.includes('Inició sesión')) return '🔓';
    if (action.includes('cerró sesión') || action.includes('Cerró sesión')) return '🔒';
    return '📝';
  };

  const getActionBgGradient = (color: string) => {
    const gradients = {
      emerald: 'from-emerald-50 to-emerald-100 border-emerald-200',
      blue: 'from-blue-50 to-blue-100 border-blue-200',
      red: 'from-red-50 to-red-100 border-red-200',
      purple: 'from-purple-50 to-purple-100 border-purple-200',
      orange: 'from-orange-50 to-orange-100 border-orange-200',
      slate: 'from-slate-50 to-slate-100 border-slate-200',
    };
    return gradients[color as keyof typeof gradients] || gradients.slate;
  };

  const getActionTextColor = (color: string) => {
    const colors = {
      emerald: 'text-emerald-700',
      blue: 'text-blue-700',
      red: 'text-red-700',
      purple: 'text-purple-700',
      orange: 'text-orange-700',
      slate: 'text-slate-700',
    };
    return colors[color as keyof typeof colors] || colors.slate;
  };

  const actions = ['all', 'creó', 'editó', 'eliminó', 'inició sesión', 'cerró sesión'];
  const entities = ['all', ...Array.from(new Set(logs.map(l => l.entity)))];

  const handleExportLogs = () => {
    const csv = [
      ['Fecha', 'Usuario', 'Acción', 'Entidad', 'Detalles'],
      ...filteredLogs.map(l => [
        new Date(l.timestamp).toLocaleString('es'),
        l.userName,
        l.action,
        l.entity,
        l.details
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditoria_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Estadísticas
  const totalActions = filteredLogs.length;
  const uniqueUsers = new Set(filteredLogs.map(l => l.userId)).size;
  const todayActions = filteredLogs.filter(l => 
    new Date(l.timestamp).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Registro de Auditoría</h2>
          <p className="text-slate-500">Historial completo de acciones del sistema</p>
        </div>
        <button
          onClick={handleExportLogs}
          className="flex items-center gap-2 bg-linear-to-r from-slate-600 to-slate-700 text-white px-6 py-3 rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all shadow-lg"
        >
          <Download size={20} />
          Exportar Registros
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <History size={28} />
            </div>
            <h2>{totalActions}</h2>
          </div>
          <p className="text-purple-100">Total de Acciones</p>
          <p className="text-purple-200">Registros en el sistema</p>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <User size={28} />
            </div>
            <h2>{uniqueUsers}</h2>
          </div>
          <p className="text-blue-100">Usuarios Activos</p>
          <p className="text-blue-200">Con actividad registrada</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Calendar size={28} />
            </div>
            <h2>{todayActions}</h2>
          </div>
          <p className="text-emerald-100">Acciones Hoy</p>
          <p className="text-emerald-200">Actividad del día</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar en auditoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 appearance-none bg-white"
            >
              {actions.map(action => (
                <option key={action} value={action}>
                  {action === 'all' ? 'Todas las acciones' : action.charAt(0).toUpperCase() + action.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 appearance-none bg-white"
            >
              {entities.map(entity => (
                <option key={entity} value={entity}>
                  {entity === 'all' ? 'Todas las entidades' : entity.charAt(0).toUpperCase() + entity.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={() => {
            setSearchTerm('');
            setDateFilter('');
            setActionFilter('all');
            setEntityFilter('all');
          }}
          className="mt-4 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          Limpiar Filtros
        </button>
      </div>

      {/* Audit Logs */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="divide-y divide-slate-200">
          {filteredLogs.map(log => {
            const color = getActionColor(log.action);
            const icon = getActionIcon(log.action);
            
            return (
              <div key={log.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`p-3 bg-${color}-100 text-${color}-600 rounded-xl flex-shrink-0`}>
                    <span className="text-2xl">{icon}</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h4>{log.action}</h4>
                      <span className={`px-3 py-1 bg-${color}-100 text-${color}-700 rounded-full`}>
                        {log.entity}
                      </span>
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="ml-auto px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Eye size={16} />
                        <span>Ver Detalles</span>
                      </button>
                    </div>
                    
                    <p className="text-slate-600 mb-3">{log.details}</p>
                    
                    <div className="flex items-center gap-6 text-slate-500">
                      <div className="flex items-center gap-2">
                        <User size={14} />
                        <span>{log.userName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        <span>{new Date(log.timestamp).toLocaleDateString('es')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <History size={14} />
                        <span>{new Date(log.timestamp).toLocaleTimeString('es')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredLogs.length === 0 && (
          <div className="p-12 text-center">
            <FileText size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-slate-600 mb-2">No hay registros</h3>
            <p className="text-slate-500">No se encontraron registros de auditoría con los filtros aplicados</p>
          </div>
        )}
      </div>

      {/* Audit Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="bg-linear-to-r from-purple-600 to-purple-700 p-6 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-white">Detalles del Registro de Auditoría</h3>
              <button 
                onClick={() => setSelectedLog(null)} 
                className="p-2 hover:bg-white/20 rounded-lg text-white"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-slate-700 mb-2">Acción Realizada</label>
                  <div className={`p-4 bg-${getActionColor(selectedLog.action)}-50 rounded-xl`}>
                    <p className={`text-${getActionColor(selectedLog.action)}-700`}>{selectedLog.action}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">Usuario</label>
                  <div className="p-4 bg-slate-50 rounded-xl flex items-center gap-2">
                    <User size={18} className="text-slate-400" />
                    <p className="text-slate-700">{selectedLog.userName}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">Entidad</label>
                  <div className="p-4 bg-slate-50 rounded-xl flex items-center gap-2">
                    <FileText size={18} className="text-slate-400" />
                    <p className="text-slate-700">{selectedLog.entity}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">Fecha</label>
                  <div className="p-4 bg-slate-50 rounded-xl flex items-center gap-2">
                    <Calendar size={18} className="text-slate-400" />
                    <p className="text-slate-700">{new Date(selectedLog.timestamp).toLocaleDateString('es')}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">Hora</label>
                  <div className="p-4 bg-slate-50 rounded-xl flex items-center gap-2">
                    <History size={18} className="text-slate-400" />
                    <p className="text-slate-700">{new Date(selectedLog.timestamp).toLocaleTimeString('es')}</p>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-slate-700 mb-2">Detalles</label>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-slate-700">{selectedLog.details}</p>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-slate-700 mb-2">ID de Registro</label>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-slate-500 font-mono text-sm">{selectedLog.id}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedLog(null)}
                className="w-full px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-xl flex items-start gap-4">
        <Shield className="text-blue-600 flex-shrink-0" size={24} />
        <div>
          <h4 className="text-blue-800 mb-2">Seguridad y Cumplimiento</h4>
          <p className="text-blue-700">
            Todos los registros de auditoría son permanentes e inmutables. Este sistema mantiene un historial completo
            de todas las acciones realizadas por los usuarios para garantizar la trazabilidad y cumplimiento normativo.
            Los registros se conservan por un período mínimo de 90 días.
          </p>
        </div>
      </div>
    </div>
  );
}