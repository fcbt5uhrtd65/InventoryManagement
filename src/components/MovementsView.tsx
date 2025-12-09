import { useState } from 'react';
import { Plus, Search, ArrowUpRight, ArrowDownRight, FileDown } from 'lucide-react';
import type { Product, Movement, User } from '../types/index';
import { MovementFormModal } from './MovementFormModal';

interface MovementsViewProps {
  products: Product[];
  movements: Movement[];
  onAddMovement: (movement: Omit<Movement, 'id'>) => void;
  user: User;
}

export function MovementsView({ products, movements, onAddMovement, user }: MovementsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'entrada' | 'salida'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const filteredMovements = movements.filter(movement => {
    const matchesSearch = movement.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.observation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || movement.type === selectedType;
    
    let matchesDate = true;
    if (dateRange.start) {
      matchesDate = matchesDate && new Date(movement.date) >= new Date(dateRange.start);
    }
    if (dateRange.end) {
      matchesDate = matchesDate && new Date(movement.date) <= new Date(dateRange.end);
    }
    
    return matchesSearch && matchesType && matchesDate;
  });

  const totalEntradas = filteredMovements
    .filter(m => m.type === 'entrada')
    .reduce((sum, m) => sum + m.quantity, 0);

  const totalSalidas = filteredMovements
    .filter(m => m.type === 'salida')
    .reduce((sum, m) => sum + m.quantity, 0);

  const handleExport = () => {
    const csv = [
      ['Fecha', 'Tipo', 'Producto', 'Cantidad', 'Usuario', 'Observación'],
      ...filteredMovements.map(m => [
        new Date(m.date).toLocaleString('es'),
        m.type,
        m.productName,
        m.quantity,
        m.userName,
        m.observation
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `movimientos_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Movimientos de Inventario</h2>
          <p className="text-slate-500">Registro de entradas y salidas</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
        >
          <Plus size={20} />
          Registrar Movimiento
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500">Total Movimientos</p>
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <ArrowUpRight size={20} />
            </div>
          </div>
          <h3>{filteredMovements.length}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500">Total Entradas</p>
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <ArrowDownRight size={20} />
            </div>
          </div>
          <h3 className="text-emerald-600">{totalEntradas} uds</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-500">Total Salidas</p>
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <ArrowUpRight size={20} />
            </div>
          </div>
          <h3 className="text-red-600">{totalSalidas} uds</h3>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
          >
            <option value="all">Todos los tipos</option>
            <option value="entrada">Solo Entradas</option>
            <option value="salida">Solo Salidas</option>
          </select>

          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Fecha inicio"
          />

          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Fecha fin"
          />
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedType('all');
              setDateRange({ start: '', end: '' });
            }}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Limpiar Filtros
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <FileDown size={18} />
            Exportar
          </button>
        </div>
      </div>

      {/* Movements Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left">Fecha y Hora</th>
                <th className="px-6 py-4 text-left">Tipo</th>
                <th className="px-6 py-4 text-left">Producto</th>
                <th className="px-6 py-4 text-left">Cantidad</th>
                <th className="px-6 py-4 text-left">Usuario</th>
                <th className="px-6 py-4 text-left">Observación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredMovements.map(movement => (
                <tr key={movement.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p>{new Date(movement.date).toLocaleDateString('es')}</p>
                    <p className="text-slate-500">{new Date(movement.date).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit ${
                      movement.type === 'entrada' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {movement.type === 'entrada' ? (
                        <ArrowDownRight size={16} />
                      ) : (
                        <ArrowUpRight size={16} />
                      )}
                      <span className="capitalize">{movement.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p>{movement.productName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className={movement.type === 'entrada' ? 'text-emerald-600' : 'text-red-600'}>
                      {movement.type === 'entrada' ? '+' : '-'}{movement.quantity} uds
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-600">{movement.userName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-500 max-w-xs truncate">{movement.observation || '-'}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMovements.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No se encontraron movimientos</p>
          </div>
        )}
      </div>

      <MovementFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onAddMovement}
        products={products.filter(p => p.active)}
        user={user}
      />
    </div>
  );
}
