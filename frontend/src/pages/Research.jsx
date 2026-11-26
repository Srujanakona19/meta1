import { motion } from 'framer-motion';

export function Research() {
  return (
    <div className="py-12 px-8 md:px-16 min-h-screen pb-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Research & Methodology</h1>
        <p className="text-[var(--color-brand-blue)] font-bold tracking-widest uppercase mb-12">Project: KLCAP-2026-00161</p>
        
        <div className="space-y-12 text-white/80 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">1. Problem Statement</h2>
            <p className="mb-4">Choosing the correct machine-learning pipeline for a new dataset is traditionally a trial-and-error process. Our system automates this by analyzing previously unseen datasets, extracting meta-features, detecting dataset shift, and recommending reliable ML pipelines.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">2. Meta-Feature Extraction</h2>
            <p className="mb-4">The system computes statistical meta-features (mean, variance, skewness, kurtosis, signal-to-noise ratio) and information-theoretic measures (entropy) to uniquely profile the incoming dataset.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">3. Dataset Shift Detection</h2>
            <p className="mb-4">We compare the extracted profile against our historical meta-learning dataset knowledge base. High distances in the latent space trigger a Dataset Shift warning, which scales down the confidence of our pipeline recommendation.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">4. Failure-Aware Ensembling</h2>
            <p className="mb-4">If the recommendation confidence falls below our safety threshold, the system automatically falls back to an Ensemble Mode. Instead of deploying a single potentially brittle pipeline, the system weights the predictions of robust, diverse base models (e.g., Random Forest, SVM, Logistic Regression) to ensure fail-safe performance.</p>
          </section>

          <section className="glass-panel p-8 rounded-2xl border border-white/10 mt-8">
            <h2 className="text-xl font-bold mb-6 text-white text-center">Architecture Flow</h2>
            <div className="flex flex-col items-center gap-2 font-mono text-sm text-center">
              <div>DATASET</div>
              <div>↓</div>
              <div>META-FEATURE EXTRACTION</div>
              <div>↓</div>
              <div>DATASET SIMILARITY / SHIFT DETECTION</div>
              <div>↓</div>
              <div>FAILURE ANALYSIS</div>
              <div>↓</div>
              <div className="grid grid-cols-2 gap-8 w-full mt-4 border-t border-white/20 pt-4">
                <div>
                  <div className="text-green-400 mb-2">High Confidence</div>
                  <div>→ Single Pipeline</div>
                </div>
                <div>
                  <div className="text-yellow-400 mb-2">Low Confidence</div>
                  <div>→ Failure-Aware Ensemble</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
