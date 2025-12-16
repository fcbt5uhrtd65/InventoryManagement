import { useState } from 'react';
import { FileDown, Calendar, Package, DollarSign, ShoppingCart, BarChart3 } from 'lucide-react';
import type { Product, Movement } from '../types/index';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { calculateTotalValue } from '../utils/stockUtils';

interface ReportsViewProps {
  products: Product[];
  movements: Movement[];
}

export function ReportsView({ products, movements }: ReportsViewProps) {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const activeProducts = products.filter(p => p.active);
  const categories = ['Todas', ...Array.from(new Set(activeProducts.map(p => p.category)))];

  // Filtrar datos según selección
  const filteredProducts = selectedCategory === 'Todas' 
    ? activeProducts 
    : activeProducts.filter(p => p.category === selectedCategory);

  const filteredMovements = movements.filter(m => {
    let matches = true;
    if (dateRange.start) {
      matches = matches && new Date(m.date) >= new Date(dateRange.start);
    }
    if (dateRange.end) {
      matches = matches && new Date(m.date) <= new Date(dateRange.end);
    }
    if (selectedCategory !== 'Todas') {
      const product = products.find(p => p.id === m.productId);
      matches = matches && product?.category === selectedCategory;
    }
    return matches;
  });

  // KPIs
  const totalValue = calculateTotalValue(filteredProducts);
  const totalStock = filteredProducts.reduce((sum, p) => sum + p.stock, 0);
  const avgPrice = filteredProducts.length > 0 
    ? filteredProducts.reduce((sum, p) => sum + p.price, 0) / filteredProducts.length 
    : 0;
  const totalSales = filteredMovements
    .filter(m => m.type === 'salida')
    .reduce((sum, m) => {
      const product = products.find(p => p.id === m.productId);
      return sum + (product ? product.price * m.quantity : 0);
    }, 0);

  // Stock por categoría (usa filteredProducts para respetar el filtro)
  const stockByCategory = filteredProducts.reduce((acc, product) => {
    const existing = acc.find(item => item.name === product.category);
    if (existing) {
      existing.stock += product.stock;
      existing.valor += product.stock * product.price;
      existing.productos += 1;
    } else {
      acc.push({ 
        name: product.category, 
        stock: product.stock,
        valor: product.stock * product.price,
        productos: 1
      });
    }
    return acc;
  }, [] as { name: string; stock: number; valor: number; productos: number }[])
    .sort((a, b) => b.valor - a.valor);

  // Movimientos por día (últimos 30 días)
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });

  const movementsByDay = last30Days.map(date => {
    const dayMovements = filteredMovements.filter(m => m.date.split('T')[0] === date);
    const entradas = dayMovements.filter(m => m.type === 'entrada').reduce((sum, m) => sum + m.quantity, 0);
    const salidas = dayMovements.filter(m => m.type === 'salida').reduce((sum, m) => sum + m.quantity, 0);
    return {
      fecha: new Date(date).toLocaleDateString('es', { month: 'short', day: 'numeric' }),
      entradas,
      salidas,
      neto: entradas - salidas
    };
  });

  // Productos más vendidos (usa filteredProducts para respetar el filtro)
  const topProducts = filteredProducts
    .map(product => {
      const sales = filteredMovements
        .filter(m => m.productId === product.id && m.type === 'salida')
        .reduce((sum, m) => sum + m.quantity, 0);
      return { 
        nombre: product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name,
        unidades: sales, 
        ingresos: sales * product.price 
      };
    })
    .filter(p => p.unidades > 0)
    .sort((a, b) => b.ingresos - a.ingresos)
    .slice(0, 8);

  const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#06B6D4', '#EF4444', '#14B8A6'];

  const handleExport = () => {
    const report = `
╔════════════════════════════════════════════════════════════════════════════════╗
║                           REPORTE DE INVENTARIO                                ║
╚════════════════════════════════════════════════════════════════════════════════╝

Fecha de generación: ${new Date().toLocaleString('es')}
Categoría: ${selectedCategory}
Período: ${dateRange.start || 'Inicio'} - ${dateRange.end || 'Actual'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INDICADORES CLAVE (KPIs)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Valor Total del Inventario:     $${totalValue.toLocaleString('es', { minimumFractionDigits: 2 })}
Total de Productos:              ${filteredProducts.length}
Total de Unidades en Stock:      ${totalStock}
Precio Promedio:                 $${avgPrice.toLocaleString('es', { minimumFractionDigits: 2 })}
Total de Ventas (período):       $${totalSales.toLocaleString('es', { minimumFractionDigits: 2 })}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STOCK POR CATEGORÍA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${stockByCategory.map(cat => 
  `${cat.name.padEnd(20)} | Stock: ${cat.stock.toString().padStart(6)} uds | Valor: $${cat.valor.toLocaleString('es', { minimumFractionDigits: 2 }).padStart(12)}`
).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRODUCTOS MÁS VENDIDOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${topProducts.map((p, i) => 
  `${(i+1).toString().padStart(2)}. ${p.nombre.padEnd(30)} | ${p.unidades} uds | $${p.ingresos.toLocaleString('es', { minimumFractionDigits: 2 })}`
).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generado por InventoryPro - Sistema de Gestión Inteligente de Inventario
    `.trim();

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_inventario_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Reportes y Análisis</h2>
          <p className="text-slate-500">Visualiza estadísticas detalladas del inventario</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
        >
          <FileDown size={20} />
          Exportar Reporte
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-700 mb-2">Fecha Inicio</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-700 mb-2">Fecha Fin</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-700 mb-2">Categoría</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <DollarSign size={28} />
            </div>
          </div>
          <p className="text-blue-100 mb-2">Valor Total</p>
          <h3 className="text-white">${totalValue.toLocaleString('es', { minimumFractionDigits: 2 })}</h3>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Package size={28} />
            </div>
          </div>
          <p className="text-purple-100 mb-2">Total Stock</p>
          <h3 className="text-white">{totalStock.toLocaleString()} uds</h3>
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <ShoppingCart size={28} />
            </div>
          </div>
          <p className="text-emerald-100 mb-2">Ventas Período</p>
          <h3 className="text-white">${totalSales.toLocaleString('es', { minimumFractionDigits: 2 })}</h3>
        </div>

        <div className="bg-gradient-to-br from-amber-600 to-amber-700 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <BarChart3 size={28} />
            </div>
          </div>
          <p className="text-amber-100 mb-2">Precio Promedio</p>
          <h3 className="text-white">${avgPrice.toLocaleString('es', { minimumFractionDigits: 2 })}</h3>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Movimientos por Día */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="mb-6">Movimientos de Inventario (30 días)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={movementsByDay}>
              <defs>
                <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSalidas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="fecha" 
                stroke="#64748B"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#64748B" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '12px'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="entradas" 
                stroke="#10B981" 
                fillOpacity={1} 
                fill="url(#colorEntradas)" 
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="salidas" 
                stroke="#EF4444" 
                fillOpacity={1} 
                fill="url(#colorSalidas)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Stock por Categoría */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="mb-6">Distribución por Categoría</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stockByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="valor"
              >
                {stockByCategory.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `$${value.toLocaleString('es', { minimumFractionDigits: 2 })}`}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productos Más Vendidos */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="mb-6">Productos Más Vendidos</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis type="number" stroke="#64748B" style={{ fontSize: '12px' }} />
              <YAxis 
                dataKey="nombre" 
                type="category" 
                width={150}
                stroke="#64748B" 
                style={{ fontSize: '11px' }}
              />
              <Tooltip 
                formatter={(value: number) => `${value} unidades`}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '12px'
                }}
              />
              <Bar dataKey="unidades" radius={[0, 8, 8, 0]}>
                {topProducts.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Valor por Categoría */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="mb-6">Valor por Categoría</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={stockByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="name" 
                stroke="#64748B" 
                style={{ fontSize: '12px' }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis stroke="#64748B" style={{ fontSize: '12px' }} />
              <Tooltip 
                formatter={(value: number) => `$${value.toLocaleString('es', { minimumFractionDigits: 2 })}`}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '12px'
                }}
              />
              <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
                {stockByCategory.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
