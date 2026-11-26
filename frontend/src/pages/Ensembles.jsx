import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { recommendEnsemble } from '../services/api';
import { Network, AlertCircle, ArrowRight } from 'lucide-react';

export function Ensembles() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    recommendEnsemble().then(res => {
      setData(res);
      setLoading(false);
    }).catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="pt-24 px-8 text-center text-white/50">Calculating Ensemble Weights...</div>;
  }

  if (error) {
    return <div className="pt-24 px-8 text-center text-red-500 font-medium">Error: {error}</div>;
  }

  return (
    <div className="py-12 px-8 md:px-16 min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
        
        <div className="flex items-center gap-4 mb-4 text-yellow-400 bg-yellow-400/10 px-6 py-3 rounded-xl border border-yellow-400/20 w-fit">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="font-semibold text-sm">LOW CONFIDENCE TRIGGER: {data.trigger_reason}</span>
        </div>

        <h1 className="text-4xl font-bold mb-4">Failure-Aware Ensemble Mode</h1>
        <p className="text-white/60 mb-12">The system has fallen back to a weighted ensemble of pipelines to mitigate the detected risks and increase reliability.</p>
        
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 mb-16">
          {/* Models */}
          <div className="flex flex-col justify-center gap-6 flex-1 max-w-sm">
            {data.pipelines.map((pipe, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className="glass-panel p-6 rounded-2xl relative border-l-4 border-[var(--color-brand-purple)]"
              >
                <div className="text-sm font-bold tracking-widest text-white/50 uppercase mb-2">Weight: {(pipe.weight * 100).toFixed(0)}%</div>
                <div className="text-xl font-bold">{pipe.pipeline_name}</div>
              </motion.div>
            ))}
          </div>

          {/* Flow Arrows */}
          <div className="hidden md:flex flex-col justify-center gap-12 text-white/20">
             <ArrowRight className="w-8 h-8" />
             <ArrowRight className="w-8 h-8" />
             <ArrowRight className="w-8 h-8" />
          </div>

          {/* Central Decision */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="flex-1 flex flex-col items-center justify-center glass-panel p-12 rounded-full border-2 border-[var(--color-brand-blue)] shadow-[0_0_50px_rgba(0,240,255,0.2)]"
          >
            <Network className="w-16 h-16 text-[var(--color-brand-blue)] mb-6 glow-effect" />
            <h2 className="text-2xl font-black text-center mb-2">ENSEMBLE DECISION</h2>
            <div className="text-sm text-green-400 font-bold tracking-widest uppercase">
              Expected Stability: {data.expected_stability}
            </div>
          </motion.div>

        </div>

      </motion.div>
    </div>
  );
}
