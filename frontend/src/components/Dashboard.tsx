import { Package, DollarSign, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { Product, Movement } from '../types/index';
import { StatsCard } from './StatsCard';
import { calculateTotalValue, getLowStockProducts } from '../utils/stockUtils';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  products: Product[];
  movements: Movement[];
}

export function Dashboard({ products, movements }: DashboardProps) {
  const activeProducts = products.filter(p => p.active);
  const totalProducts = activeProducts.length;
  const totalValue = calculateTotalValue(activeProducts);
  const totalStock = activeProducts.reduce((sum, p) => sum + p.stock, 0);
  const lowStockProducts = getLowStockProducts(activeProducts);

  // Datos para gráfico de categorías
  const categoryData = activeProducts.reduce((acc, product) => {
    const existing = acc.find(item => item.name === product.category);
    if (existing) {
      existing.value += product.stock;
    } else {
      acc.push({ name: product.category, value: product.stock });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Datos para movimientos por mes (últimos 6 meses)
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    return date.toLocaleString('es', { month: 'short' });
  });

  const movementData = last6Months.map((month, index) => {
    const monthIndex = new Date().getMonth() - (5 - index);
    const monthMovements = movements.filter(m => {
      const movDate = new Date(m.date);
      return movDate.getMonth() === monthIndex;
    });

    return {
      month,
      entradas: monthMovements.filter(m => m.type === 'entrada').reduce((sum, m) => sum + m.quantity, 0),
      salidas: monthMovements.filter(m => m.type === 'salida').reduce((sum, m) => sum + m.quantity, 0),
    };
  });

  // Top 5 productos con más rotación
  const topProducts = activeProducts
    .map(product => {
      const productMovements = movements.filter(m => m.productId === product.id);
      const totalMoved = productMovements.reduce((sum, m) => sum + m.quantity, 0);
      return { name: product.name, value: totalMoved };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  // Movimientos recientes
  const recentMovements = movements.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2>Dashboard</h2>
        <p className="text-slate-500">Vista general del inventario</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Productos"
          value={totalProducts}
          icon={Package}
          trend="12% vs mes anterior"
          trendUp={true}
          color="primary"
        />
        <StatsCard
          title="Valor Total Inventario"
          value={`$${totalValue.toLocaleString('es', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          trend="8% vs mes anterior"
          trendUp={true}
          color="secondary"
        />
        <StatsCard
          title="Stock Total"
          value={`${totalStock.toLocaleString()} uds`}
          icon={TrendingUp}
          trend="5% vs mes anterior"
          trendUp={false}
          color="warning"
        />
        <StatsCard
          title="Alertas de Stock"
          value={lowStockProducts.length}
          icon={AlertTriangle}
          trend={`${lowStockProducts.length} productos críticos`}
          trendUp={false}
          color="danger"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Movimientos por Mes */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h4 className="mb-4">Entradas y Salidas (Últimos 6 meses)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={movementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Legend />
              <Bar dataKey="entradas" fill="#10b981" name="Entradas" radius={[8, 8, 0, 0]} />
              <Bar dataKey="salidas" fill="#ef4444" name="Salidas" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stock por Categoría */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h4 className="mb-4">Distribución por Categoría</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top 5 Productos */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h4 className="mb-4">Top 5 Productos con Más Rotación</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" />
              <YAxis dataKey="name" type="category" stroke="#64748b" width={100} />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" name="Movimientos" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Movimientos Recientes */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h4 className="mb-4">Últimos Movimientos</h4>
          <div className="space-y-3">
            {recentMovements.length > 0 ? (
              recentMovements.map(movement => (
                <div key={movement.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${movement.type === 'entrada' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                      {movement.type === 'entrada' ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
                    </div>
                    <div>
                      <p className="truncate max-w-[150px]">{movement.productName}</p>
                      <p className="text-slate-500">{new Date(movement.date).toLocaleDateString('es')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={movement.type === 'entrada' ? 'text-emerald-600' : 'text-red-600'}>
                      {movement.type === 'entrada' ? '+' : '-'}{movement.quantity} uds
                    </p>
                    <p className="text-slate-500">{movement.userName}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-8">No hay movimientos registrados</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
