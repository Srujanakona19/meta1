import { Scroll } from '@react-three/drei'
import { motion } from 'framer-motion'
import { ChevronRight, Database, Activity } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function Overlay() {
  const navigate = useNavigate();

  return (
    <Scroll html style={{ width: '100%', height: '100%' }}>
      {/* PAGE 1: HERO */}
      <div className="w-screen h-screen flex items-center px-8 md:px-24">
        <div className="w-full md:w-1/2 flex flex-col gap-6 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-[var(--color-brand-blue)]/30 w-fit"
          >
            <Activity className="w-4 h-4 text-[var(--color-brand-blue)]" />
            <span className="text-xs font-bold tracking-wider text-[var(--color-brand-blue)] uppercase">
              AI For Computational Intelligence
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight"
          >
            Meta-Learned
            <br />
            <span className="text-gradient glow-effect">Pipeline Recommender</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl font-light text-white/90"
          >
            with Dataset Shift Detection <br />
            <span className="text-white/60">& Failure-Aware Ensembling</span>
          </motion.p>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-sm md:text-base max-w-lg text-white/70 leading-relaxed"
          >
            An intelligent machine-learning decision engine that learns from previous datasets, detects distribution shift, identifies pipeline failures, and recommends reliable ML pipelines with evidence-backed confidence.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-wrap gap-4 mt-4"
          >
            <button 
              onClick={() => navigate('/analyze')}
              className="group relative px-8 py-4 bg-[var(--color-brand-blue)] text-black font-semibold rounded-lg overflow-hidden shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transition-all cursor-pointer pointer-events-auto"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Database className="w-5 h-5" /> Analyze Dataset
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
            <button 
              onClick={() => navigate('/research')}
              className="group px-8 py-4 glass-panel hover:bg-white/10 text-white font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer pointer-events-auto"
            >
              Explore Architecture <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* PAGE 2: UNDERSTANDING DATA */}
      <div className="w-screen h-screen flex items-center justify-end px-8 md:px-24">
        <div className="w-full md:w-1/3 text-right">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">1.</span> Understanding the Data
          </h2>
          <p className="text-lg text-white/70">
            Extracting meta-features from the new dataset. We analyze statistical properties, distribution shapes, and information-theoretic measures to build a comprehensive profile.
          </p>
        </div>
      </div>

      {/* PAGE 3: SIMILARITY & SHIFT */}
      <div className="w-screen h-screen flex flex-col justify-center px-8 md:px-24">
        <div className="w-full md:w-1/3">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-[var(--color-brand-purple)] glow-effect">2.</span> Detecting Shift
          </h2>
          <p className="text-lg text-white/70 mb-4">
            Mapping the new dataset into our historical knowledge space.
          </p>
          <div className="glass-panel p-4 rounded-xl border-[var(--color-brand-purple)]/30 inline-block">
            <div className="text-sm text-white/50 mb-1">DATASET SIMILARITY</div>
            <div className="text-2xl font-bold text-white">87.4% Match</div>
            <div className="text-sm text-green-400 mt-2">Distribution Shift: LOW</div>
          </div>
        </div>
      </div>

      {/* PAGE 4: PIPELINES & FAILURES */}
      <div className="w-screen h-screen flex flex-col items-center justify-center">
        <div className="text-center max-w-xl px-4">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="text-white">3.</span> Identifying Failures
          </h2>
          <p className="text-lg text-white/70">
            Simulating hundreds of ML pipelines. Unstable or high-risk paths are pruned out based on our meta-learned failure models, leaving only the most reliable architectures.
          </p>
        </div>
      </div>

      {/* PAGE 5: RECOMMENDATION */}
      <div className="w-screen h-screen flex items-center px-8 md:px-24">
        <div className="w-full md:w-1/3 glass-panel p-8 rounded-2xl border-[var(--color-brand-blue)]/50 shadow-[0_0_40px_rgba(0,240,255,0.1)] backdrop-blur-2xl">
          <h2 className="text-sm font-bold tracking-widest text-[var(--color-brand-blue)] mb-6 uppercase">
            Final Recommendation
          </h2>
          <h3 className="text-3xl font-bold mb-8">Random Forest Pipeline</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-white/70 text-sm">Confidence</span>
                <span className="font-bold text-[var(--color-brand-blue)]">94.2%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-[var(--color-brand-blue)] to-[var(--color-brand-purple)] h-2 rounded-full w-[94.2%]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div>
                <div className="text-xs text-white/50 mb-1">Reliability</div>
                <div className="font-bold text-green-400">HIGH</div>
              </div>
              <div>
                <div className="text-xs text-white/50 mb-1">Shift</div>
                <div className="font-bold text-green-400">LOW</div>
              </div>
              <div>
                <div className="text-xs text-white/50 mb-1">Failure Risk</div>
                <div className="font-bold text-green-400">LOW</div>
              </div>
            </div>
            
            <button className="w-full py-4 mt-6 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors border border-white/10">
              Deploy Pipeline
            </button>
          </div>
        </div>
      </div>
    </Scroll>
  )
}
