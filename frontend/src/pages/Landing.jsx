import { motion } from 'framer-motion';
import { ChevronRight, Database, Activity, Mail, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="bg-black text-white overflow-x-hidden pt-16">
      
      {/* HERO SECTION */}
      <section id="hero" className="min-h-screen flex items-center px-8 md:px-24 py-24 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[var(--color-brand-blue)]/10 via-black to-black pointer-events-none" />
        
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-brand-blue)] to-[var(--color-brand-purple)] glow-effect">Pipeline Recommender</span>
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
              onClick={() => navigate('/login')}
              className="group relative px-8 py-4 bg-[var(--color-brand-blue)] text-black font-semibold rounded-lg overflow-hidden shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transition-all cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Database className="w-5 h-5" /> Get Started
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
            <a 
              href="#how-it-works"
              className="group px-8 py-4 glass-panel hover:bg-white/10 text-white font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer border border-white/10"
            >
              Learn More <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-32 px-8 md:px-24 bg-gradient-to-b from-black to-[#0a0a0f]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-sm font-bold tracking-widest text-[var(--color-brand-blue)] mb-4 uppercase">Process</h2>
            <h3 className="text-4xl md:text-5xl font-bold">How It Works</h3>
            <p className="mt-4 text-white/60 max-w-2xl mx-auto">Our Meta-Learned Architecture breaks down the pipeline recommendation process into three intelligent steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-brand-blue)]/50 to-transparent" />
            
            <div className="glass-panel p-8 rounded-2xl border-t-2 border-t-[var(--color-brand-blue)] relative z-10">
              <div className="w-16 h-16 rounded-full bg-black border border-[var(--color-brand-blue)] flex items-center justify-center text-2xl font-bold text-[var(--color-brand-blue)] mb-6 mx-auto shadow-[0_0_20px_rgba(0,240,255,0.2)]">1</div>
              <h4 className="text-2xl font-bold mb-4 text-center">Understand Data</h4>
              <p className="text-white/70 text-center leading-relaxed">
                Extracting meta-features from your new dataset. We analyze statistical properties, distribution shapes, and information-theoretic measures to build a comprehensive profile.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl border-t-2 border-t-[var(--color-brand-purple)] relative z-10">
              <div className="w-16 h-16 rounded-full bg-black border border-[var(--color-brand-purple)] flex items-center justify-center text-2xl font-bold text-[var(--color-brand-purple)] mb-6 mx-auto shadow-[0_0_20px_rgba(188,19,254,0.2)]">2</div>
              <h4 className="text-2xl font-bold mb-4 text-center">Detect Shift</h4>
              <p className="text-white/70 text-center leading-relaxed">
                Mapping the new dataset into our historical knowledge space to identify distribution shifts and anomalies before training even begins.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl border-t-2 border-t-green-400 relative z-10">
              <div className="w-16 h-16 rounded-full bg-black border border-green-400 flex items-center justify-center text-2xl font-bold text-green-400 mb-6 mx-auto shadow-[0_0_20px_rgba(74,222,128,0.2)]">3</div>
              <h4 className="text-2xl font-bold mb-4 text-center">Recommend Pipeline</h4>
              <p className="text-white/70 text-center leading-relaxed">
                Simulating hundreds of ML pipelines to prune out unstable paths, leaving only the most reliable architectures backed by meta-learned evidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-32 px-8 md:px-24 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2">
            <div className="aspect-square rounded-full bg-gradient-to-tr from-[var(--color-brand-blue)]/20 to-[var(--color-brand-purple)]/20 blur-3xl absolute -z-10" />
            <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop" alt="AI Core" className="rounded-3xl border border-white/10 shadow-2xl grayscale hover:grayscale-0 transition-all duration-700" />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-sm font-bold tracking-widest text-[var(--color-brand-purple)] mb-4 uppercase">About KLCAP-2026</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-6">Pioneering Next-Gen AutoML</h3>
            <p className="text-lg text-white/70 mb-6 leading-relaxed">
              We are a research team dedicated to solving the cold-start problem in Machine Learning. Traditional AutoML explores pipelines blindly, wasting massive computational resources. 
            </p>
            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              KLCAP-2026 leverages **Meta-Learning** to learn from thousands of previously trained datasets. By instantly detecting dataset shift and predicting pipeline failures before they happen, we provide Enterprise-grade reliability.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="glass-panel p-4 rounded-xl border-l-2 border-[var(--color-brand-blue)]">
                <div className="text-3xl font-black mb-1">10k+</div>
                <div className="text-xs text-white/50 uppercase tracking-widest">Datasets Learned</div>
              </div>
              <div className="glass-panel p-4 rounded-xl border-l-2 border-[var(--color-brand-purple)]">
                <div className="text-3xl font-black mb-1">99.9%</div>
                <div className="text-xs text-white/50 uppercase tracking-widest">Failure Avoidance</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEEDBACK SECTION */}
      <section id="feedback" className="py-32 px-8 md:px-24 bg-gradient-to-t from-black to-[#0a0a0f]">
        <div className="max-w-3xl mx-auto glass-panel p-12 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--color-brand-blue)] rounded-full blur-[100px] opacity-30" />
          
          <div className="text-center mb-10 relative z-10">
            <h2 className="text-sm font-bold tracking-widest text-[var(--color-brand-blue)] mb-4 uppercase">Get In Touch</h2>
            <h3 className="text-4xl font-bold">Feedback & Support</h3>
            <p className="mt-4 text-white/60">Have suggestions or need help with the Recommender? Let us know.</p>
          </div>

          <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50">Name</label>
                <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[var(--color-brand-blue)] transition-colors" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/50">Email</label>
                <input type="email" className="w-full bg-black/50 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[var(--color-brand-blue)] transition-colors" placeholder="john@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white/50">Message</label>
              <textarea rows={4} className="w-full bg-black/50 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[var(--color-brand-blue)] transition-colors resize-none" placeholder="Your feedback here..."></textarea>
            </div>
            <button type="button" onClick={() => alert('Feedback submitted! (Mock)')} className="w-full py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /> Send Feedback
            </button>
          </form>
        </div>
      </section>
      
      {/* FOOTER */}
      <footer className="border-t border-white/10 py-8 text-center text-white/30 text-sm">
        &copy; 2026 KLCAP Meta-Learned Platform. All rights reserved.
      </footer>
    </div>
  );
}
