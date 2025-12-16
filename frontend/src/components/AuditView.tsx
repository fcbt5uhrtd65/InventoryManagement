import { useState } from 'react';
import { History, Search, Calendar, User, FileText, Filter, Download, Eye, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 15;

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || log.timestamp.startsWith(dateFilter);
    const matchesAction = actionFilter === 'all' || log.action.includes(actionFilter);
    const matchesEntity = entityFilter === 'all' || log.entity === entityFilter;
    return matchesSearch && matchesDate && matchesAction && matchesEntity;
  });

  // Cálculo de paginación
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const startIndex = (currentPage - 1) * logsPerPage;
  const endIndex = startIndex + logsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  // Resetear página al cambiar filtros
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleDateChange = (value: string) => {
    setDateFilter(value);
    setCurrentPage(1);
  };

  const handleActionChange = (value: string) => {
    setActionFilter(value);
    setCurrentPage(1);
  };

  const handleEntityChange = (value: string) => {
    setEntityFilter(value);
    setCurrentPage(1);
  };

  const getActionColor = (action: string) => {
    if (action.includes('creó') || action.includes('Creó') || action.includes('agregó') || action.includes('registró')) return 'emerald';
    if (action.includes('editó') || action.includes('Actualizó') || action.includes('actualizó') || action.includes('modificó')) return 'blue';
    if (action.includes('eliminó') || action.includes('Eliminó') || action.includes('desactivó')) return 'red';
    if (action.includes('inició sesión') || action.includes('Inició sesión')) return 'purple';
    if (action.includes('cerró sesión') || action.includes('Cerró sesión')) return 'orange';
    return 'slate';
  };

  const getActionIcon = (action: string) => {
    if (action.includes('creó') || action.includes('Creó') || action.includes('agregó')) return FileText;
    if (action.includes('editó') || action.includes('Actualizó') || action.includes('actualizó')) return FileText;
    if (action.includes('eliminó') || action.includes('Eliminó')) return FileText;
    if (action.includes('inició sesión') || action.includes('Inició sesión')) return User;
    if (action.includes('cerró sesión') || action.includes('Cerró sesión')) return User;
    return FileText;
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
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <select
              value={actionFilter}
              onChange={(e) => handleActionChange(e.target.value)}
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
              onChange={(e) => handleEntityChange(e.target.value)}
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
            setCurrentPage(1);
          }}
          className="mt-4 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          Limpiar Filtros
        </button>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-slate-700 font-semibold">Acción</th>
                <th className="px-6 py-4 text-left text-slate-700 font-semibold">Entidad</th>
                <th className="px-6 py-4 text-left text-slate-700 font-semibold">Usuario</th>
                <th className="px-6 py-4 text-left text-slate-700 font-semibold">Detalles</th>
                <th className="px-6 py-4 text-left text-slate-700 font-semibold">Fecha y Hora</th>
                <th className="px-6 py-4 text-center text-slate-700 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentLogs.map(log => {
                const color = getActionColor(log.action);
                const IconComponent = getActionIcon(log.action);
                
                return (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 bg-${color}-100 rounded-lg`}>
                          <IconComponent size={18} className={`text-${color}-600`} />
                        </div>
                        <span className="font-medium text-slate-800">{log.action}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 bg-${color}-100 text-${color}-700 rounded-full text-sm font-medium`}>
                        {log.entity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-slate-400" />
                        <span className="text-slate-700">{log.userName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-600 max-w-xs truncate" title={log.details}>
                        {log.details}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar size={14} />
                          <span className="text-sm">{new Date(log.timestamp).toLocaleDateString('es')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                          <History size={14} />
                          <span className="text-sm">{new Date(log.timestamp).toLocaleTimeString('es')}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="inline-flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye size={16} />
                        <span className="text-sm">Ver</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="p-12 text-center">
            <FileText size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-slate-600 mb-2">No hay registros</h3>
            <p className="text-slate-500">No se encontraron registros de auditoría con los filtros aplicados</p>
          </div>
        )}

        {/* Paginación */}
        {filteredLogs.length > logsPerPage && (
          <div className="border-t border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Mostrando {startIndex + 1} - {Math.min(endIndex, filteredLogs.length)} de {filteredLogs.length} registros
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          currentPage === page
                            ? 'bg-slate-600 text-white'
                            : 'border border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
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