export function MetricCard({ icon: Icon, label, value }) {
  return (
    <div className="glass-panel p-6 flex flex-col justify-center border-l-2 border-l-[var(--color-brand-blue)]/50 hover:border-l-[var(--color-brand-blue)] transition-colors">
      <div className="flex items-center gap-2 text-white/50 mb-2">
        {Icon && <Icon className="w-4 h-4" />}
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
    </div>
  );
}
