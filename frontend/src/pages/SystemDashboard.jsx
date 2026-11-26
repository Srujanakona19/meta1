import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Server, Cpu, HardDrive, Activity, RefreshCw } from 'lucide-react';
import { getSystemLogs } from '../services/api';

export function SystemDashboard() {
  const [logs, setLogs] = useState([]);
  const [isLive, setIsLive] = useState(true);

  const fetchLogs = async () => {
    const data = await getSystemLogs();
    if (data && data.length > 0) {
      setLogs(data);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(() => {
      fetchLogs();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-12 px-8 md:px-16 min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold">System Telemetry</h1>
          <div className="flex items-center gap-2 text-xs font-mono uppercase bg-green-500/10 text-green-400 px-3 py-1.5 rounded-full border border-green-500/20">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Live Polling Active
          </div>
        </div>
        <p className="text-white/60 mb-12">Real-time health and API telemetry of the Meta-Learned Pipeline Recommender infrastructure.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <TelemetryCard icon={Activity} title="API Status" value="ONLINE (8000)" color="text-green-400" />
          <TelemetryCard icon={Server} title="Backend Compute" value="Node.js + MySQL" color="text-[var(--color-brand-blue)]" />
          <TelemetryCard icon={Cpu} title="CPU Health" value="Normal (<15%)" color="text-white" />
          <TelemetryCard icon={HardDrive} title="Database" value="Connected (klcap_db)" color="text-green-400" />
        </div>

        <div className="glass-panel p-8 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold tracking-widest uppercase text-white/50">Live Service & API Logs</h2>
            <button 
              onClick={fetchLogs} 
              className="flex items-center gap-1.5 text-xs text-[var(--color-brand-blue)] hover:text-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Now
            </button>
          </div>
          <div className="font-mono text-sm space-y-2 max-h-72 overflow-y-auto pr-2">
            {logs.length === 0 ? (
              <div className="text-white/40 text-center py-8">Awaiting new server events...</div>
            ) : (
              logs.map((log, idx) => (
                <LogLine key={idx} time={log.time} level={log.level} msg={log.msg} />
              ))
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function TelemetryCard({ icon: Icon, title, value, color = "text-white" }) {
  return (
    <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
      <div className="p-3 bg-white/5 rounded-xl">
        <Icon className="w-6 h-6 text-white/50" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-widest text-white/50 mb-1">{title}</div>
        <div className={`font-bold text-lg ${color}`}>{value}</div>
      </div>
    </div>
  );
}

function LogLine({ time, level, msg }) {
  const levelColors = {
    INFO: "text-[var(--color-brand-blue)]",
    WARNING: "text-yellow-400",
    SUCCESS: "text-green-400",
    ERROR: "text-red-400"
  };

  return (
    <div className="flex gap-4 border-b border-white/5 pb-2">
      <span className="text-white/30 w-20 shrink-0">{time}</span>
      <span className={`w-20 shrink-0 font-bold ${levelColors[level]}`}>[{level}]</span>
      <span className="text-white/80">{msg}</span>
    </div>
  );
}
