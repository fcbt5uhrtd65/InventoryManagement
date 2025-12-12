import { useState } from 'react';
import { AlertCircle, Package, Search, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import type { Product } from '../types/index';
import { getStockStatus } from '../utils/stockUtils';

interface AlertsViewProps {
  products: Product[];
}

export function AlertsView({ products }: AlertsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<'all' | 'critical' | 'warning'>('all');

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Critical Stock Card */}
        <div className="group relative bg-linear-to-br from-red-500 via-red-600 to-red-700 text-white rounded-3xl shadow-xl p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <XCircle size={36} strokeWidth={2.5} />
              </div>
              <div className="text-right">
                <div className="text-6xl opacity-90 group-hover:scale-110 transition-transform inline-block">{criticalProducts.length}</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-white text-2xl">Stock Crítico</h4>
              <p className="text-red-100/90 leading-relaxed">Productos agotados o en nivel mínimo</p>
              
              <div className="pt-4 mt-4 border-t border-white/30">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3">
                  <span className="w-3 h-3 bg-red-300 rounded-full animate-pulse shadow-lg"></span>
                  <p className="text-white">Requiere atención inmediata</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Warning Stock Card */}
        <div className="group relative bg-linear-to-br from-amber-500 via-orange-600 to-orange-700 text-white rounded-3xl shadow-xl p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <AlertTriangle size={36} strokeWidth={2.5} />
              </div>
              <div className="text-right">
                <div className="text-6xl opacity-90 group-hover:scale-110 transition-transform inline-block">{warningProducts.length}</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-white text-2xl">Stock Bajo</h4>
              <p className="text-amber-100/90 leading-relaxed">Productos por debajo del nivel óptimo</p>
              
              <div className="pt-4 mt-4 border-t border-white/30">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3">
                  <span className="w-3 h-3 bg-amber-300 rounded-full animate-pulse shadow-lg"></span>
                  <p className="text-white">Considerar reabastecimiento</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Good Stock Card */}
        <div className="group relative bg-linear-to-br from-emerald-500 via-green-600 to-teal-700 text-white rounded-3xl shadow-xl p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <CheckCircle2 size={36} strokeWidth={2.5} />
              </div>
              <div className="text-right">
                <div className="text-6xl opacity-90 group-hover:scale-110 transition-transform inline-block">{goodProducts.length}</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-white text-2xl">Stock Óptimo</h4>
              <p className="text-emerald-100/90 leading-relaxed">Productos con niveles adecuados</p>
              
              <div className="pt-4 mt-4 border-t border-white/30">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3">
                  <span className="w-3 h-3 bg-emerald-300 rounded-full animate-pulse shadow-lg"></span>
                  <p className="text-white">Inventario saludable</p>
                </div>
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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterLevel('all')}
              className={`px-6 py-3 rounded-xl transition-all ${
                filterLevel === 'all' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterLevel('critical')}
              className={`px-6 py-3 rounded-xl transition-all ${
                filterLevel === 'critical' 
                  ? 'bg-red-600 text-white shadow-lg' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Críticos
            </button>
            <button
              onClick={() => setFilterLevel('warning')}
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

      {/* Products List */}
      <div className="space-y-4">
        {filteredProducts.map(product => {
          const status = getStockStatus(product);
          const percentage = (product.stock / product.minStock) * 100;
          
          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-sm border-l-4 border-slate-200 p-6 hover:shadow-md transition-all"
              style={{ borderLeftColor: status.color === 'red' ? '#EF4444' : status.color === 'amber' ? '#F59E0B' : '#10B981' }}
            >
              <div className="flex items-start gap-6">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-xl"
                />
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="mb-1">{product.name}</h4>
                      <p className="text-slate-500">{product.code}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                      status.color === 'red' ? 'bg-red-100 text-red-700' :
                      status.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {status.color === 'red' ? <XCircle size={18} /> : 
                       status.color === 'amber' ? <AlertTriangle size={18} /> : 
                       <CheckCircle2 size={18} />}
                      {status.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-slate-500 mb-1">Stock Actual</p>
                      <p className="text-slate-900">{product.stock} uds</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Stock Mínimo</p>
                      <p className="text-slate-900">{product.minStock} uds</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Stock Máximo</p>
                      <p className="text-slate-900">{product.maxStock} uds</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Nivel</p>
                      <p className={`${
                        status.color === 'red' ? 'text-red-600' :
                        status.color === 'amber' ? 'text-amber-600' :
                        'text-emerald-600'
                      }`}>
                        {percentage.toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative">
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          status.color === 'red' ? 'bg-linear-to-r from-red-500 to-red-600' :
                          status.color === 'amber' ? 'bg-linear-to-r from-amber-500 to-amber-600' :
                          'bg-linear-to-r from-emerald-500 to-emerald-600'
                        }`}
                        style={{ width: `${Math.min((product.stock / product.maxStock) * 100, 100)}%` }}
                      />
                    </div>
                    {product.stock <= product.minStock && (
                      <div className="mt-3 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg">
                        <AlertCircle size={18} />
                        <span>Se recomienda reabastecer {product.maxStock - product.stock} unidades</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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