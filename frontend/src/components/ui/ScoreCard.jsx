export function ScoreCard({ icon: Icon, label, value, highlight, color = "text-white" }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-white/50 mb-2">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      </div>
      <div className={`text-3xl font-extrabold ${highlight ? 'text-[var(--color-brand-blue)] glow-effect' : color}`}>
        {value}
      </div>
    </div>
  );
}
