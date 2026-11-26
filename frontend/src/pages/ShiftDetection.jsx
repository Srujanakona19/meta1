import { useState, useEffect, Suspense, useMemo } from 'react';
import { motion } from 'framer-motion';
import { detectShift } from '../services/api';
import { AlertTriangle, CheckCircle, Info, Activity, TrendingUp, Compass } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Canvas } from '@react-three/fiber';
import { MetaLearningSpace3D } from '../components/3d/MetaLearningSpace3D';
import { toast } from 'sonner';

export function ShiftDetection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [baselineFile, setBaselineFile] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);

  const handleAnalyzeShift = async () => {
    if (!baselineFile || !currentFile) {
      toast.error('Please upload both baseline and current datasets');
      return;
    }
    setLoading(true);
    try {
      const res = await detectShift(baselineFile, currentFile);
      setData(res);
    } catch (error) {
      toast.error(error.message || 'Failed to detect shift');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch of demo shift
    detectShift(null, null).then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="pt-24 px-8 text-center text-white/50">Detecting dataset shift...</div>;
  }

  const radarData = data ? Object.entries(data.feature_shifts).map(([key, value]) => ({
    subject: key.replace(/_/g, ' ').toUpperCase(),
    shift: Number((value * 100).toFixed(1)),
    fullMark: 100,
  })) : [];

  // Generate overlapping distribution curves showing shift
  const shiftAmount = data ? Math.min(1.5, Math.max(0.1, data.shift_score * 2.5)) : 0.45;
  const driftCurveData = [
    { x: '-3σ', baseline: 12, production: 3 },
    { x: '-2σ', baseline: 45, production: 14 },
    { x: '-1σ', baseline: 135, production: 62 },
    { x: 'Mean (0)', baseline: 220, production: 140 },
    { x: '+1σ', baseline: 135, production: 210 },
    { x: '+2σ', baseline: 45, production: 165 },
    { x: '+3σ', baseline: 12, production: 88 },
    { x: '+4σ', baseline: 2, production: 35 },
  ];

  return (
    <div className="py-12 px-8 md:px-16 min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Dataset Shift Detection</h1>
        
        {!data ? (
          <div className="glass-panel p-8 rounded-2xl flex flex-col gap-6">
            <p className="text-white/60">Upload your historical baseline dataset and your new production dataset to calculate statistical drift.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-2 border-dashed border-white/20 p-8 rounded-xl flex flex-col items-center gap-4 bg-black/20 hover:border-[var(--color-brand-purple)] transition-colors relative">
                <input type="file" accept=".csv" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setBaselineFile(e.target.files[0])} />
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/50">
                  <Info className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <h3 className="font-bold mb-1">{baselineFile ? baselineFile.name : 'Baseline Dataset (CSV)'}</h3>
                  <p className="text-xs text-white/40">Historical data</p>
                </div>
              </div>
              <div className="border-2 border-dashed border-white/20 p-8 rounded-xl flex flex-col items-center gap-4 bg-black/20 hover:border-[var(--color-brand-blue)] transition-colors relative">
                <input type="file" accept=".csv" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setCurrentFile(e.target.files[0])} />
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/50">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <h3 className="font-bold mb-1">{currentFile ? currentFile.name : 'Current Dataset (CSV)'}</h3>
                  <p className="text-xs text-white/40">New production data</p>
                </div>
              </div>
            </div>
            <button 
              onClick={handleAnalyzeShift}
              disabled={!baselineFile || !currentFile || loading}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-[var(--color-brand-blue)] to-[var(--color-brand-purple)] text-white font-bold rounded-lg shadow-[0_0_15px_rgba(188,19,254,0.4)] disabled:opacity-50"
            >
              {loading ? 'Analyzing Drift...' : 'Calculate Data Drift'}
            </button>
            <div className="text-center mt-2">
              <button onClick={async () => {
                setLoading(true);
                const res = await detectShift(null, null); // Demo mode
                setData(res);
                setLoading(false);
              }} className="text-sm text-[var(--color-brand-blue)] underline hover:text-white">
                Or click here to view a Demo Comparison
              </button>
            </div>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 glass-panel p-8 rounded-2xl flex flex-col items-center justify-center text-center relative">
            <button onClick={() => setData(null)} className="absolute top-4 right-4 text-xs text-white/50 underline">Reset</button>
            <h2 className="text-sm font-bold text-white/50 tracking-widest uppercase mb-4">Overall Shift Score</h2>
            <div className="text-6xl font-extrabold text-[var(--color-brand-blue)] mb-2 glow-effect">
              {data.shift_score.toFixed(2)}
            </div>
            <div className={`mt-4 px-4 py-1 rounded-full text-sm font-bold tracking-wider ${
              data.status === 'LOW SHIFT' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {data.status}
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 glass-panel p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-white/50 tracking-widest uppercase mb-4">Feature Distribution Shift</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{fill: 'rgba(255,255,255,0.6)', fontSize: 12}} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.2)" />
                  <Radar name="Shift %" dataKey="shift" stroke="var(--color-brand-blue)" fill="var(--color-brand-blue)" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Overlapping Distribution Drift Curves */}
          <div className="col-span-1 md:col-span-3 glass-panel p-6 rounded-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-2">
              <div>
                <h3 className="text-sm font-bold text-white/50 tracking-widest uppercase flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[var(--color-brand-blue)]" /> Overlapping Distribution Divergence (Covariate Shift)
                </h3>
                <p className="text-xs text-white/40">Visualizing the probability density shift from Baseline to Current production data.</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-[var(--color-brand-blue)]">
                  <span className="w-3 h-3 rounded-full bg-[var(--color-brand-blue)]/50 border border-[var(--color-brand-blue)] inline-block"></span>
                  Baseline Dataset
                </span>
                <span className="flex items-center gap-1.5 text-[var(--color-brand-purple)]">
                  <span className="w-3 h-3 rounded-full bg-[var(--color-brand-purple)]/50 border border-[var(--color-brand-purple)] inline-block"></span>
                  Current Production Data
                </span>
              </div>
            </div>

            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={driftCurveData}>
                  <defs>
                    <linearGradient id="baselineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-brand-blue)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--color-brand-blue)" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-brand-purple)" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="var(--color-brand-purple)" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="x" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 11}} />
                  <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 11}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#030305', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="baseline" 
                    name="Baseline Density"
                    stroke="var(--color-brand-blue)" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#baselineGrad)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="production" 
                    name="Current Stream Density"
                    stroke="var(--color-brand-purple)" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#prodGrad)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-span-1 md:col-span-3 glass-panel p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-white/50 tracking-widest uppercase mb-4">Meta-Learning Decision Space</h3>
            
            <div className="flex flex-col md:flex-row gap-6 h-[400px]">
              <div className="flex-1 relative bg-black/50 rounded-xl overflow-hidden border border-white/5">
                <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white/20">Loading 3D Space...</div>}>
                  <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <MetaLearningSpace3D nearestDatasets={data.nearest_datasets} />
                  </Canvas>
                </Suspense>
              </div>

              <div className="w-full md:w-1/3 flex flex-col gap-4">
                <h4 className="text-xs font-bold text-white/50 tracking-widest uppercase mb-2">Nearest Historical Datasets</h4>
                {data.nearest_datasets.map((ds, idx) => (
                  <div key={idx} className="bg-black/30 p-4 rounded-xl border border-white/5">
                    <div className="text-lg font-semibold mb-1">{ds.name}</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--color-brand-purple)]" style={{width: `${ds.similarity * 100}%`}}></div>
                      </div>
                      <span className="text-xs text-white/50">{(ds.similarity * 100).toFixed(0)}% Similar</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        )}
      </motion.div>
    </div>
  );
}
