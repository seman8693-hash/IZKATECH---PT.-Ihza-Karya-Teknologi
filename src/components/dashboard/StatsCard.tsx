import React from 'react';
import { LucideProps } from 'lucide-react';

type AccentColor = 'cyan' | 'amber' | 'blue' | 'emerald' | 'rose' | 'purple' | 'teal';

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: React.FC<LucideProps>;
  accent?: AccentColor;
  sub?: string;
  onClick?: () => void;
  className?: string;
}

const ACCENTS: Record<AccentColor, { chip: string; value: string; sub: string }> = {
  cyan: { chip: 'bg-cyan-100 text-cyan-700', value: 'text-cyan-700', sub: 'text-cyan-600' },
  teal: { chip: 'bg-teal-100 text-teal-700', value: 'text-teal-700', sub: 'text-teal-600' },
  amber: { chip: 'bg-amber-100 text-amber-700', value: 'text-amber-600', sub: 'text-amber-600' },
  blue: { chip: 'bg-blue-100 text-blue-700', value: 'text-blue-700', sub: 'text-blue-600' },
  emerald: { chip: 'bg-emerald-100 text-emerald-700', value: 'text-emerald-600', sub: 'text-emerald-600' },
  rose: { chip: 'bg-rose-100 text-rose-700', value: 'text-rose-600', sub: 'text-rose-500' },
  purple: { chip: 'bg-purple-100 text-purple-700', value: 'text-purple-700', sub: 'text-purple-600' },
};

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  icon: Icon,
  accent = 'cyan',
  sub,
  onClick,
  className = '',
}) => {
  const a = ACCENTS[accent];
  const Wrapper = onClick ? 'button' : 'div';
  return (
    <Wrapper
      onClick={onClick}
      className={`w-full text-left bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden transition-all h-full min-h-[132px] flex flex-col ${className} ${
        onClick ? 'hover:border-cyan-300 hover:shadow-md cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] sm:text-xs font-medium text-slate-500 leading-tight">{label}</span>
        <span className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${a.chip}`}>
          <Icon className="w-4 h-4" />
        </span>
      </div>
      <div className={`mt-2 text-2xl sm:text-3xl font-bold font-display ${a.value}`}>{value}</div>
      {sub && <div className={`text-[10px] sm:text-[11px] mt-auto pt-1.5 leading-snug ${a.sub}`}>{sub}</div>}
    </Wrapper>
  );
};
