import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, description, icon: Icon, trend, trendValue }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="glass-card rounded-2xl p-5 flex flex-col gap-4 group"
    >
      {/* Top row: label + icon */}
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold text-[#78716C] uppercase tracking-wider leading-tight">
          {title}
        </span>
        <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center group-hover:bg-orange-500/15 transition-colors shrink-0">
          {Icon && <Icon className="h-4 w-4 text-orange-400" />}
        </div>
      </div>

      {/* Value */}
      <div>
        <p className="text-2xl font-black text-white tracking-tight leading-none">{value}</p>
        {description && (
          <p className="text-xs text-[#57534E] mt-1.5 leading-snug">{description}</p>
        )}
      </div>

      {/* Trend badge */}
      {trend && trendValue && (
        <div className={`flex items-center gap-1 text-[10px] font-bold w-fit px-2 py-0.5 rounded-full ${
          trend === 'up'
            ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
            : 'text-red-400 bg-red-500/10 border border-red-500/20'
        }`}>
          {trend === 'up'
            ? <TrendingUp className="h-3 w-3" />
            : <TrendingDown className="h-3 w-3" />
          }
          {trendValue}
        </div>
      )}
    </motion.div>
  );
}
