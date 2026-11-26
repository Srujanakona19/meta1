import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Upload, Database, BarChart2, CheckCircle, AlertCircle, FileText, SlidersHorizontal, Activity, Layers } from 'lucide-react';
import { analyzeDataset } from '../services/api';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useStore } from '../context/StoreContext';
import { MetricCard } from '../components/ui/MetricCard';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { toast } from 'sonner';

export function DatasetAnalysis() {
  const [loading, setLoading] = useState(false);
  const { datasetProfile: data, setDatasetProfile: setData } = useStore();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  // Default distribution fallback if dataset has no distributions yet
  const defaultDistributions = useMemo(() => ({
    'feature_age': {
      min: 18, max: 75, mean: 41.2,
      bins: [
        { range: '18-25', count: 180 },
        { range: '25-32', count: 320 },
        { range: '32-39', count: 480 },
        { range: '39-46', count: 540 },
        { range: '46-53', count: 390 },
        { range: '53-60', count: 260 },
        { range: '60-67', count: 140 },
        { range: '67-75', count: 70 },
      ]
    },
    'feature_income': {
      min: 15000, max: 180000, mean: 68500,
      bins: [
        { range: '15k-35k', count: 210 },
        { range: '35k-55k', count: 450 },
        { range: '55k-75k', count: 620 },
        { range: '75k-95k', count: 410 },
        { range: '95k-115k', count: 280 },
        { range: '115k-135k', count: 160 },
        { range: '135k-155k', count: 90 },
        { range: '155k-180k', count: 40 },
      ]
    },
    'credit_score': {
      min: 300, max: 850, mean: 672,
      bins: [
        { range: '300-400', count: 45 },
        { range: '400-500', count: 120 },
        { range: '500-600', count: 310 },
        { range: '600-700', count: 780 },
        { range: '700-750', count: 520 },
        { range: '750-800', count: 390 },
        { range: '800-850', count: 180 },
      ]
    }
  }), []);

  const activeDistributions = (data && data.distributions && Object.keys(data.distributions).length > 0)
    ? data.distributions 
    : defaultDistributions;

  const [selectedCol, setSelectedCol] = useState(() => Object.keys(activeDistributions)[0] || 'feature_age');

  const currentColData = activeDistributions[selectedCol] || activeDistributions[Object.keys(activeDistributions)[0]];

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setPreviewFile(file);
      // Parse first few rows using PapaParse
      Papa.parse(file, {
        header: true,
        preview: 5,
        skipEmptyLines: true,
        complete: (results) => {
          setPreviewData(results.data);
        },
        error: (err) => {
          toast.error("Failed to parse CSV file");
          console.error(err);
        }
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (!previewFile) return;
    
    setLoading(true);
    setProgress(0);
    setError(null);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) {
          clearInterval(interval);
          return 90;
        }
        return p + 10;
      });
    }, 200);

    try {
      const result = await analyzeDataset(previewFile);
      setProgress(100);
      setTimeout(() => {
        setData(result);
        if (result.distributions && Object.keys(result.distributions).length > 0) {
          setSelectedCol(Object.keys(result.distributions)[0]);
        }
        setLoading(false);
        setPreviewData(null);
        setPreviewFile(null);
        toast.success("Dataset analyzed successfully!");
      }, 500);
    } catch (e) {
      console.error(e);
      clearInterval(interval);
      setError(e.message || "An error occurred while analyzing the dataset.");
      setLoading(false);
    }
  };

  const chartData = data ? [
    { name: 'Numerical', count: data.num_numerical },
    { name: 'Categorical', count: data.num_categorical }
  ] : [];

  return (
    <div className="py-12 px-8 md:px-16 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Analyze a New Dataset</h1>
            <p className="text-white/60">Upload a dataset to extract meta-features, distributions, and profile its characteristics.</p>
          </div>
          {data && (
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-4 py-2 rounded-full border border-green-400/20">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-semibold tracking-wider">META-FEATURE EXTRACTION COMPLETE</span>
              </div>
              <button 
                onClick={() => setData(null)}
                className="text-xs text-white/50 hover:text-white underline tracking-wider uppercase cursor-pointer"
              >
                Analyze New Dataset
              </button>
            </div>
          )}
        </div>

        {!data && !loading && !previewData && (
          <div className="flex flex-col gap-4">
            <div 
              {...getRootProps()}
              className={`w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors group bg-black/40 backdrop-blur-xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-blue)] ${isDragActive ? 'border-[var(--color-brand-blue)] bg-[var(--color-brand-blue)]/5' : 'border-white/20 hover:border-[var(--color-brand-blue)]'}`}
            >
              <input {...getInputProps()} />
              <div className={`p-4 rounded-full transition-colors ${isDragActive ? 'bg-[var(--color-brand-blue)]/20' : 'bg-white/5 group-hover:bg-[var(--color-brand-blue)]/20'}`}>
                <Upload className={`w-8 h-8 ${isDragActive ? 'text-[var(--color-brand-blue)]' : 'text-white/50 group-hover:text-[var(--color-brand-blue)]'}`} />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium mb-1 text-white">
                  {isDragActive ? "Drop the file here..." : "Drag & Drop CSV"}
                </p>
                <p className="text-sm text-white/40">Or click to select a file</p>
              </div>
            </div>
            
            {/* Fallback Demo Button */}
            <div className="text-center mt-2">
              <button onClick={() => {
                setPreviewFile({ name: "Demo_Dataset.csv" });
                setPreviewData([{ id: 1, feature_age: 34, feature_income: 62000, credit_score: 710, target: 1 }, { id: 2, feature_age: 48, feature_income: 88000, credit_score: 640, target: 0 }]);
              }} className="text-sm text-[var(--color-brand-blue)] underline hover:text-white cursor-pointer">
                Or click here to load a Demo Dataset
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-lg border border-red-400/20">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}

        {/* Data Preview Section */}
        {!data && !loading && previewData && (
          <div className="glass-panel p-6 rounded-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-[var(--color-brand-blue)]" />
                <div>
                  <h3 className="font-bold text-lg">{previewFile.name}</h3>
                  <p className="text-xs text-white/50">Previewing first {previewData.length} rows</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => { setPreviewData(null); setPreviewFile(null); }}
                  className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpload}
                  className="px-6 py-2 bg-[var(--color-brand-blue)] text-black font-bold rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] transition-all cursor-pointer"
                >
                  Analyze Dataset
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-white/5 text-white/70">
                  <tr>
                    {Object.keys(previewData[0] || {}).map(key => (
                      <th key={key} className="px-6 py-3">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                      {Object.values(row).map((val, j) => (
                        <td key={j} className="px-6 py-3 font-mono">{String(val)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {loading && (
          <div className="w-full h-64 flex flex-col items-center justify-center gap-6 glass-panel border border-[var(--color-brand-blue)]/30 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
            <div className="text-lg font-medium text-[var(--color-brand-blue)] glow-effect animate-pulse">
              {progress < 30 ? "Initializing Dataset Analyzer..." : 
               progress < 60 ? "Extracting Meta-Features & Distributions..." : 
               "Generating Profile..."}
            </div>
            <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-[var(--color-brand-blue)] to-[var(--color-brand-purple)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {data && (
          <>
            {/* Meta-Feature Cards & Feature Types */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
              {/* Meta-Feature Cards */}
              <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
                <MetricCard icon={Database} label="Rows" value={data.num_rows.toLocaleString()} />
                <MetricCard icon={BarChart2} label="Columns" value={data.num_cols.toLocaleString()} />
                <MetricCard label="Missing Ratio" value={`${(data.missing_ratio * 100).toFixed(1)}%`} />
                <MetricCard label="Class Imbalance" value={`${(data.class_imbalance * 100).toFixed(1)}%`} />
                <MetricCard label="Target Type" value={data.target_type.toUpperCase()} />
                <MetricCard label="Dimensionality Ratio" value={data.dimensionality_ratio.toFixed(4)} />
              </div>

              {/* Categorical vs Numerical */}
              <div className="col-span-1 glass-panel p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white/50 mb-4 tracking-wider uppercase flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[var(--color-brand-blue)]" /> Feature Breakdown
                  </h3>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} />
                        <Tooltip 
                          cursor={{fill: 'rgba(255,255,255,0.05)'}}
                          contentStyle={{ backgroundColor: '#030305', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        />
                        <Bar dataKey="count" fill="var(--color-brand-blue)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="text-xs text-white/40 pt-2 border-t border-white/5 flex justify-between">
                  <span>Numeric: {data.num_numerical}</span>
                  <span>Categorical: {data.num_categorical}</span>
                </div>
              </div>
            </div>

            {/* Advanced Column Distribution & Histograms */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[var(--color-brand-blue)]" /> Continuous Feature Distribution (Histogram)
                  </h3>
                  <p className="text-xs text-white/50">Inspecting bin frequencies to detect skewness, kurtosis, and outliers.</p>
                </div>

                {/* Column Selector */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase text-white/50 flex items-center gap-1">
                    <SlidersHorizontal className="w-3.5 h-3.5" /> Feature:
                  </span>
                  <select 
                    value={selectedCol} 
                    onChange={(e) => setSelectedCol(e.target.value)}
                    className="bg-black/60 border border-white/15 text-white text-xs font-semibold py-2 px-3 rounded-xl focus:outline-none focus:border-[var(--color-brand-blue)]"
                  >
                    {Object.keys(activeDistributions).map(col => (
                      <option key={col} value={col} className="bg-neutral-900 text-white">{col}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Column Stats Summary */}
              {currentColData && (
                <div className="grid grid-cols-3 gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 font-mono text-center">
                  <div>
                    <div className="text-xs text-white/40 uppercase">Min Value</div>
                    <div className="text-lg font-bold text-white">{currentColData.min}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/40 uppercase">Mean Value</div>
                    <div className="text-lg font-bold text-[var(--color-brand-blue)]">{currentColData.mean}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/40 uppercase">Max Value</div>
                    <div className="text-lg font-bold text-white">{currentColData.max}</div>
                  </div>
                </div>
              )}

              {/* Histogram AreaChart */}
              {currentColData && (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={currentColData.bins}>
                      <defs>
                        <linearGradient id="histGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-brand-blue)" stopOpacity={0.6}/>
                          <stop offset="95%" stopColor="var(--color-brand-purple)" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                      <XAxis dataKey="range" stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                      <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#030305', border: '1px solid rgba(0,240,255,0.3)', borderRadius: '8px' }}
                        labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="count" 
                        stroke="var(--color-brand-blue)" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#histGradient)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

