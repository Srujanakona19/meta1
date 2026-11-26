import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Lock, Mail, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { toast } from 'sonner';

import { registerUser } from '../services/api';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useStore();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return toast.error('Please fill in all fields.');
    }
    
    setLoading(true);
    try {
      const parts = name.split(' ');
      const firstName = parts[0];
      const lastName = parts.slice(1).join(' ');
      
      const data = await registerUser(email, password, firstName, lastName);
      login(data.token, data.user);
      toast.success('Account created successfully!');
      navigate('/analyze');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-panel p-8 rounded-3xl border border-[var(--color-brand-purple)]/30 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-brand-blue)] to-[var(--color-brand-purple)]" />
        
        <div className="flex flex-col items-center mb-8">
          <Activity className="w-12 h-12 text-[var(--color-brand-purple)] glow-effect mb-4" />
          <h2 className="text-2xl font-bold">Create Account</h2>
          <p className="text-white/50 text-sm">Join the Meta-Learned ML Platform</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-white/50">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[var(--color-brand-purple)] transition-colors"
                placeholder="Jane Doe"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-white/50">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[var(--color-brand-purple)] transition-colors"
                placeholder="data.scientist@company.com"
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-white/50">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[var(--color-brand-purple)] transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button disabled={loading} type="submit" className="w-full py-3 mt-4 bg-[var(--color-brand-purple)] text-white font-bold rounded-lg shadow-[0_0_15px_rgba(188,19,254,0.4)] hover:shadow-[0_0_25px_rgba(188,19,254,0.6)] transition-all disabled:opacity-50">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-white/50 text-sm mt-6">
          Already have an account? <Link to="/login" className="text-[var(--color-brand-purple)] hover:underline">Sign in here</Link>
        </p>
      </motion.div>
    </div>
  );
}
