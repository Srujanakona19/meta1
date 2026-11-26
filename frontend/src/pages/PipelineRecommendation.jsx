import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { recommendPipeline, exportPipelineCode, trainPipelineOnline } from '../services/api';
import { CheckCircle, AlertTriangle, Zap, Target, ShieldCheck, Download, Move, Play, RefreshCw, Award, BarChart3 } from 'lucide-react';
import { ReactFlow, Background, Controls, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ScoreCard } from '../components/ui/ScoreCard';
import { useStore } from '../context/StoreContext';
import { toast } from 'sonner';

export function PipelineRecommendation() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [training, setTraining] = useState(false);
  const [trainResults, setTrainResults] = useState(null);
  const [trainStep, setTrainStep] = useState(0);
  const { datasetProfile } = useStore();
  const [error, setError] = useState(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#00f0ff', strokeWidth: 2 } }, eds)),
    [setEdges]
  );

  useEffect(() => {
    recommendPipeline().then(res => {
      setData(res);
      
      const initialNodes = res.recommended.nodes.map((n, i) => ({
        id: n.id,
        position: { x: 50 + (i * 200), y: 120 },
        data: { label: n.name },
        style: { 
          background: n.type === 'model' ? '#bc13fe' : '#00f0ff',
          color: '#000',
          border: 'none',
          borderRadius: '8px',
          padding: '10px',
          fontWeight: 'bold',
          width: 150,
          textAlign: 'center',
          cursor: 'grab'
        }
      }));

      const initialEdges = res.recommended.nodes.slice(0, -1).map((n, i) => ({
        id: `e-${n.id}-${res.recommended.nodes[i+1].id}`,
        source: n.id,
        target: res.recommended.nodes[i+1].id,
        animated: true,
        style: { stroke: '#fff', strokeWidth: 2 }
      }));

      setNodes(initialNodes);
      setEdges(initialEdges);
      setLoading(false);
    }).catch(err => {
      setError(err.message);
      setLoading(false);
      toast.error(err.message || 'Failed to fetch recommendation');
    });
  }, [setNodes, setEdges]);

  const handleTrain = async () => {
    try {
      setTraining(true);
      setTrainResults(null);
      setTrainStep(1);

      const stepTimer1 = setTimeout(() => setTrainStep(2), 500);
      const stepTimer2 = setTimeout(() => setTrainStep(3), 1000);

      const currentNodes = nodes.map(n => ({
        id: n.id,
        name: n.data?.label || n.id,
        type: n.style?.background === '#bc13fe' ? 'model' : 'preprocessing'
      }));

      const res = await trainPipelineOnline(
        data.recommended.name,
        currentNodes.length > 0 ? currentNodes : data.recommended.nodes,
        datasetProfile
      );

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setTrainResults(res);
      toast.success(`Training completed! Accuracy: ${(res.metrics.accuracy * 100).toFixed(1)}%`);
    } catch (err) {
      toast.error(err.message || 'Failed to train pipeline');
    } finally {
      setTraining(false);
      setTrainStep(0);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const currentNodes = nodes.map(n => ({
        id: n.id,
        name: n.data?.label || n.id,
        type: n.style?.background === '#bc13fe' ? 'model' : 'preprocessing'
      }));

      const res = await exportPipelineCode(
        data.recommended.name,
        currentNodes.length > 0 ? currentNodes : data.recommended.nodes,
        datasetProfile
      );
      
      const blob = new Blob([res.code], { type: 'text/python' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.recommended.name.replace(/\s+/g, '_')}_pipeline.py`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Pipeline Python code downloaded successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to export pipeline code');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return <div className="pt-24 px-8 text-center text-[var(--color-brand-blue)] animate-pulse glow-effect font-medium tracking-widest uppercase">Calculating Recommendation Confidence...</div>;
  }

  if (error) {
    return <div className="pt-24 px-8 text-center text-red-500 font-medium">Error: {error}. Please log out and log in again if your session expired.</div>;
  }

  const rec = data.recommended;

  return (
    <div className="py-12 px-8 md:px-16 min-h-screen flex flex-col">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
        <h1 className="text-4xl font-bold mb-2">Pipeline Recommendation Engine</h1>
        <p className="text-white/60 mb-12">
          {datasetProfile ? `The AI has analyzed your dataset (${datasetProfile.num_rows} rows) and determined the most reliable pipeline.` : `The AI has analyzed meta-features, shift, and failures to determine the most reliable pipeline.`}
        </p>
        
        {/* Main Recommendation */}
        <div className="glass-panel p-8 rounded-3xl border border-[var(--color-brand-blue)]/50 shadow-[0_0_50px_rgba(0,240,255,0.1)] relative overflow-hidden mb-12 flex flex-col">
          <div className="absolute top-0 right-0 p-8 z-10 pointer-events-none">
            <div className="flex flex-col items-end">
              <span className="text-xs uppercase tracking-widest text-white/50 mb-1">Recommendation Reliability</span>
              <span className="text-2xl font-black text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">{data.recommendation_reliability}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-2 relative z-10">
            <h2 className="text-sm font-bold tracking-widest text-[var(--color-brand-blue)] uppercase">AI Recommendation</h2>
            <span className="flex items-center gap-1 text-[11px] text-white/50 bg-white/5 px-2 py-0.5 rounded border border-white/10">
              <Move className="w-3 h-3 text-[var(--color-brand-blue)]" /> Interactive Canvas (Drag & Connect)
            </span>
          </div>

          <h3 className="text-5xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-brand-blue)] to-[var(--color-brand-purple)] relative z-10">
            {rec.name}
          </h3>

          <div className="w-full h-[320px] mb-8 relative rounded-xl overflow-hidden border border-white/10 bg-black/40">
            <ReactFlow 
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
              attributionPosition="bottom-left"
            >
              <Background color="#fff" gap={16} opacity={0.1} />
              <Controls className="!bg-black/50 !border-white/10 !fill-white" />
            </ReactFlow>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/10 relative z-10 mb-8">
            <ScoreCard icon={Target} label="Confidence" value={`${(rec.confidence * 100).toFixed(1)}%`} highlight />
            <ScoreCard icon={Zap} label="Expected Perf." value={`${(rec.expected_performance * 100).toFixed(1)}%`} />
            <ScoreCard icon={AlertTriangle} label="Shift Risk" value="LOW" color="text-green-400" />
            <ScoreCard icon={ShieldCheck} label="Failure Risk" value={rec.failure_risk} color="text-green-400" />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 z-10">
            <button 
              onClick={handleTrain}
              disabled={training}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-black font-extrabold rounded-lg shadow-[0_0_20px_rgba(74,222,128,0.4)] hover:shadow-[0_0_30px_rgba(74,222,128,0.7)] transition-all disabled:opacity-50 cursor-pointer"
            >
              {training ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
              {training ? `Training... (${trainStep === 1 ? 'Splitting CV' : trainStep === 2 ? 'Fitting Estimators' : 'Evaluating Folds'})` : 'Train Model Online'}
            </button>

            <button 
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-2 px-6 py-3 bg-[var(--color-brand-blue)] text-black font-bold rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] transition-all disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-5 h-5" />
              {exporting ? 'Generating Python Code...' : 'Export Pipeline to Python'}
            </button>
          </div>
        </div>

        {/* Training Results Dashboard (If trained) */}
        <AnimatePresence>
          {trainResults && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="glass-panel p-8 rounded-3xl border border-green-500/40 shadow-[0_0_50px_rgba(74,222,128,0.15)] mb-12 space-y-8"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-green-400 font-bold uppercase tracking-widest text-xs mb-1">
                    <Award className="w-4 h-4" /> Live Execution Results
                  </div>
                  <h3 className="text-3xl font-black">Online Model Training Report</h3>
                </div>
                <div className="text-xs text-white/50 font-mono bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                  Execution Time: {trainResults.metrics.training_time_sec}s
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xs text-white/40 uppercase mb-1">Test Accuracy</div>
                  <div className="text-2xl font-black text-green-400">{(trainResults.metrics.accuracy * 100).toFixed(1)}%</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xs text-white/40 uppercase mb-1">F1 Score</div>
                  <div className="text-2xl font-black text-[var(--color-brand-blue)]">{(trainResults.metrics.f1_score * 100).toFixed(1)}%</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xs text-white/40 uppercase mb-1">Precision</div>
                  <div className="text-2xl font-black text-white">{(trainResults.metrics.precision * 100).toFixed(1)}%</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xs text-white/40 uppercase mb-1">Recall</div>
                  <div className="text-2xl font-black text-white">{(trainResults.metrics.recall * 100).toFixed(1)}%</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xs text-white/40 uppercase mb-1">ROC-AUC</div>
                  <div className="text-2xl font-black text-[var(--color-brand-purple)]">{(trainResults.metrics.roc_auc * 100).toFixed(1)}%</div>
                </div>
              </div>

              {/* Confusion Matrix & CV Folds */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/10">
                {/* 2x2 Confusion Matrix */}
                <div>
                  <h4 className="text-sm font-bold tracking-wider uppercase text-white/60 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[var(--color-brand-blue)]" /> Confusion Matrix (Test Split)
                  </h4>
                  <div className="grid grid-cols-2 gap-3 max-w-sm font-mono text-center">
                    <div className="p-4 bg-green-500/15 border border-green-500/30 rounded-xl">
                      <div className="text-xs text-white/50 mb-1">True Negative</div>
                      <div className="text-2xl font-bold text-green-400">{trainResults.confusion_matrix.matrix[0][0]}</div>
                    </div>
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <div className="text-xs text-white/50 mb-1">False Positive</div>
                      <div className="text-2xl font-bold text-red-400">{trainResults.confusion_matrix.matrix[0][1]}</div>
                    </div>
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <div className="text-xs text-white/50 mb-1">False Negative</div>
                      <div className="text-2xl font-bold text-red-400">{trainResults.confusion_matrix.matrix[1][0]}</div>
                    </div>
                    <div className="p-4 bg-green-500/15 border border-green-500/30 rounded-xl">
                      <div className="text-xs text-white/50 mb-1">True Positive</div>
                      <div className="text-2xl font-bold text-green-400">{trainResults.confusion_matrix.matrix[1][1]}</div>
                    </div>
                  </div>
                </div>

                {/* 5-Fold Cross Validation */}
                <div>
                  <h4 className="text-sm font-bold tracking-wider uppercase text-white/60 mb-4">
                    5-Fold Cross Validation Scores (Mean: {(trainResults.metrics.cv_mean * 100).toFixed(1)}%)
                  </h4>
                  <div className="space-y-2.5">
                    {trainResults.cv_scores.map((score, idx) => (
                      <div key={idx} className="flex items-center gap-4 text-xs font-mono">
                        <span className="w-16 text-white/40">Fold {idx + 1}:</span>
                        <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[var(--color-brand-blue)] to-[var(--color-brand-purple)]"
                            style={{ width: `${score * 100}%` }}
                          />
                        </div>
                        <span className="w-16 text-right font-bold text-white">{(score * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Evidence */}
        <h3 className="text-2xl font-bold mb-6">Why should you trust this recommendation?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {data.evidence.map((ev, i) => (
            <div key={i} className="glass-panel p-6 rounded-xl flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-[var(--color-brand-purple)] shrink-0" />
              <p className="text-sm text-white/80 leading-relaxed">{ev}</p>
            </div>
          ))}
        </div>

      </motion.div>
    </div>
  );
}
