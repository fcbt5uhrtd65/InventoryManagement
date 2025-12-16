import { useState } from 'react';
import { AlertCircle, Package, Search, AlertTriangle, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../types/index';
import { getStockStatus } from '../utils/stockUtils';

interface AlertsViewProps {
  products: Product[];
}

export function AlertsView({ products }: AlertsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<'all' | 'critical' | 'warning'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const alertsPerPage = 10;

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (level: 'all' | 'critical' | 'warning') => {
    setFilterLevel(level);
    setCurrentPage(1);
  };

  const activeProducts = products.filter(p => p.active);

  const criticalProducts = activeProducts.filter(p => p.stock <= p.minStock);
  const warningProducts = activeProducts.filter(p => {
    const percentage = (p.stock / p.minStock) * 100;
    return p.stock > p.minStock && percentage <= 150;
  });
  const goodProducts = activeProducts.filter(p => {
    const percentage = (p.stock / p.minStock) * 100;
    return percentage > 150;
  });

  const filteredProducts = activeProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterLevel === 'critical') return matchesSearch && product.stock <= product.minStock;
    if (filterLevel === 'warning') {
      const percentage = (product.stock / product.minStock) * 100;
      return matchesSearch && product.stock > product.minStock && percentage <= 150;
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2>Alertas de Inventario</h2>
        <p className="text-slate-500">Monitorea productos con stock crítico o bajo</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Critical Stock Card */}
        <div className="group bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
              <XCircle size={28} strokeWidth={2.5} />
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold opacity-90 group-hover:scale-110 transition-transform inline-block">{criticalProducts.length}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-white text-xl font-semibold">Stock Crítico</h4>
            <p className="text-red-100/90 text-sm">Productos agotados o en nivel mínimo</p>
            
            <div className="pt-3 mt-3 border-t border-white/30">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2">
                <span className="w-2 h-2 bg-red-300 rounded-full animate-pulse shadow-lg"></span>
                <p className="text-white text-sm">Requiere atención inmediata</p>
              </div>
            </div>
          </div>
        </div>

        {/* Warning Stock Card */}
        <div className="group bg-gradient-to-br from-amber-500 via-orange-600 to-orange-700 text-white rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
              <AlertTriangle size={28} strokeWidth={2.5} />
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold opacity-90 group-hover:scale-110 transition-transform inline-block">{warningProducts.length}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-white text-xl font-semibold">Stock Bajo</h4>
            <p className="text-amber-100/90 text-sm">Productos por debajo del nivel óptimo</p>
            
            <div className="pt-3 mt-3 border-t border-white/30">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2">
                <span className="w-2 h-2 bg-amber-300 rounded-full animate-pulse shadow-lg"></span>
                <p className="text-white text-sm">Considerar reabastecimiento</p>
              </div>
            </div>
          </div>
        </div>

        {/* Good Stock Card */}
        <div className="group bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 text-white rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
              <CheckCircle2 size={28} strokeWidth={2.5} />
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold opacity-90 group-hover:scale-110 transition-transform inline-block">{goodProducts.length}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-white text-xl font-semibold">Stock Óptimo</h4>
            <p className="text-emerald-100/90 text-sm">Productos con niveles adecuados</p>
            
            <div className="pt-3 mt-3 border-t border-white/30">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2">
                <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse shadow-lg"></span>
                <p className="text-white text-sm">Inventario saludable</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-6 py-3 rounded-xl transition-all ${
                filterLevel === 'all' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => handleFilterChange('critical')}
              className={`px-6 py-3 rounded-xl transition-all ${
                filterLevel === 'critical' 
                  ? 'bg-red-600 text-white shadow-lg' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Críticos
            </button>
            <button
              onClick={() => handleFilterChange('warning')}
              className={`px-6 py-3 rounded-xl transition-all ${
                filterLevel === 'warning' 
                  ? 'bg-amber-600 text-white shadow-lg' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Bajos
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Producto</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Código</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-slate-700">Stock Actual</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-slate-700">Stock Mín</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-slate-700">Stock Máx</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-slate-700">Nivel</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-slate-700">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts
                .slice((currentPage - 1) * alertsPerPage, currentPage * alertsPerPage)
                .map(product => {
                  const status = getStockStatus(product);
                  const percentage = (product.stock / product.minStock) * 100;
                  
                  return (
                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">{product.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600 font-mono">{product.code}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-semibold text-slate-900">{product.stock}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm text-slate-600">{product.minStock}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm text-slate-600">{product.maxStock}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <span className={`text-sm font-bold ${
                            status.color === 'red' ? 'text-red-600' :
                            status.color === 'amber' ? 'text-amber-600' :
                            'text-emerald-600'
                          }`}>
                            {percentage.toFixed(0)}%
                          </span>
                          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full transition-all ${
                                status.color === 'red' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                                status.color === 'amber' ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
                                'bg-gradient-to-r from-emerald-500 to-emerald-600'
                              }`}
                              style={{ width: `${Math.min((product.stock / product.maxStock) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          status.color === 'red' ? 'bg-red-100 text-red-700' :
                          status.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {status.color === 'red' ? <XCircle size={14} /> : 
                           status.color === 'amber' ? <AlertTriangle size={14} /> : 
                           <CheckCircle2 size={14} />}
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredProducts.length > alertsPerPage && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Mostrando {((currentPage - 1) * alertsPerPage) + 1} - {Math.min(currentPage * alertsPerPage, filteredProducts.length)} de {filteredProducts.length} productos
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              
              {Array.from({ length: Math.ceil(filteredProducts.length / alertsPerPage) }, (_, i) => i + 1)
                .filter(page => {
                  const totalPages = Math.ceil(filteredProducts.length / alertsPerPage);
                  if (totalPages <= 5) return true;
                  if (page === 1 || page === totalPages) return true;
                  if (Math.abs(page - currentPage) <= 1) return true;
                  return false;
                })
                .map((page, index, array) => {
                  if (index > 0 && page - array[index - 1] > 1) {
                    return [
                      <span key={`ellipsis-${page}`} className="px-2 text-slate-400">...</span>,
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-lg transition-colors ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {page}
                      </button>
                    ];
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredProducts.length / alertsPerPage), prev + 1))}
                disabled={currentPage === Math.ceil(filteredProducts.length / alertsPerPage)}
                className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <Package size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-slate-600 mb-2">No se encontraron alertas</h3>
          <p className="text-slate-500">No hay productos que coincidan con los filtros aplicados</p>
        </div>
      )}
    </div>
  );
}