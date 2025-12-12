import type { LucideProps } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
  trend?: string;
  trendUp?: boolean;
  color: 'primary' | 'secondary' | 'warning' | 'danger' | 'info';
}

export function StatsCard({ title, value, icon: Icon, trend, trendUp, color }: StatsCardProps) {
  const colorClasses = {
    primary: 'from-blue-600 to-blue-700',
    secondary: 'from-emerald-600 to-emerald-700',
    warning: 'from-amber-600 to-amber-700',
    danger: 'from-red-600 to-red-700',
    info: 'from-cyan-600 to-cyan-700',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-500 mb-2">{title}</p>
          <h3 className="mb-2">{value}</h3>
          {trend && (
            <p className={`flex items-center gap-1 ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
              <span>{trendUp ? '↑' : '↓'}</span>
              <span>{trend}</span>
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white shadow-lg`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}