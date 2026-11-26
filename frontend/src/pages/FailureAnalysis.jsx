import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { analyzeFailures } from '../services/api';
import { ShieldCheck, ShieldAlert, AlertOctagon } from 'lucide-react';

export function FailureAnalysis() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    analyzeFailures().then(res => {
      setData(res);
      setLoading(false);
    }).catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="pt-24 px-8 text-center text-white/50">Analyzing failures...</div>;
  }

  if (error) {
    return <div className="pt-24 px-8 text-center text-red-500 font-medium">Error: {error}</div>;
  }

  return (
    <div className="py-12 px-8 md:px-16 min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Failure-Aware Pipeline Analysis</h1>
        <p className="text-white/60 mb-12">Simulating edge cases and dataset stressors to detect potential failure conditions.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item, idx) => (
            <FailureCard key={idx} item={item} index={idx} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function FailureCard({ item, index }) {
  const isPass = item.status === 'PASS';
  const isWarn = item.status === 'WARNING';
  
  const Icon = isPass ? ShieldCheck : (isWarn ? ShieldAlert : AlertOctagon);
  const colorClass = isPass ? 'text-green-400' : (isWarn ? 'text-yellow-400' : 'text-red-400');
  const borderClass = isPass ? 'border-green-400/20' : (isWarn ? 'border-yellow-400/20' : 'border-red-400/20');
  const bgClass = isPass ? 'bg-green-400/5' : (isWarn ? 'bg-yellow-400/5' : 'bg-red-400/5');

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className={`glass-panel p-6 rounded-2xl border-l-4 ${borderClass} ${bgClass}`}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-bold tracking-wide">{item.name}</h3>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
      
      <div className="mb-4">
        <div className="text-xs text-white/40 uppercase tracking-widest mb-1">Risk Level</div>
        <div className={`font-extrabold text-lg ${colorClass}`}>{item.risk}</div>
      </div>

      <div className="mb-4">
        <div className="text-xs text-white/40 uppercase tracking-widest mb-1">Status</div>
        <div className={`font-semibold ${colorClass}`}>{item.status}</div>
      </div>

      <p className="text-sm text-white/60 leading-relaxed border-t border-white/5 pt-4">
        {item.description}
      </p>
    </motion.div>
  );
}
