import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, LogOut, Menu, X, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../context/StoreContext';
import { toast } from 'sonner';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const authLinks = [
    { name: 'Analyze', path: '/analyze' },
    { name: 'Recommendations', path: '/recommendations' },
    { name: 'Shift', path: '/shift' },
    { name: 'Failures', path: '/failures' },
    { name: 'Ensembles', path: '/ensembles' },
    { name: 'Experiments', path: '/experiments' },
    { name: 'Research', path: '/research' },
    { name: 'System', path: '/system' },
  ];

  const publicLinks = [
    { name: 'Home', path: '/' },
    { name: 'How it works', path: '/#how-it-works' },
    { name: 'About', path: '/#about' },
    { name: 'Feedback', path: '/#feedback' },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const currentLinks = isAuthenticated ? authLinks : publicLinks;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/10 bg-black/40 backdrop-blur-xl shadow-lg px-6 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 text-white z-50">
        <Activity className="w-6 h-6 text-[var(--color-brand-blue)] glow-effect" />
        <span className="font-bold tracking-widest uppercase text-sm">KLCAP-2026</span>
      </Link>
      
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-1">
        {currentLinks.map(link => {
          const isActive = location.pathname === link.path && !link.path.includes('#');
          const isHashLink = link.path.startsWith('/#');
          
          if (isHashLink) {
            return (
              <a
                key={link.name}
                href={link.path}
                className="relative px-3 py-2 text-xs font-medium uppercase tracking-wider transition-colors text-white/50 hover:text-white"
              >
                {link.name}
              </a>
            );
          }

          return (
            <Link 
              key={link.name} 
              to={link.path}
              className={`relative px-3 py-2 text-xs font-medium uppercase tracking-wider transition-colors hover:text-white ${isActive ? 'text-white' : 'text-white/50'}`}
            >
              {link.name}
              {isActive && (
                <motion.div 
                  layoutId="navbar-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-brand-blue)] glow-effect"
                />
              )}
            </Link>
          );
        })}
      </div>

      <div className="hidden md:flex items-center gap-4">
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="text-xs font-bold uppercase tracking-wider text-white/70 hover:text-white transition-colors">
              Login
            </Link>
            <Link to="/register" className="px-4 py-2 bg-[var(--color-brand-blue)] text-black text-xs font-bold uppercase tracking-wider rounded-lg shadow-[0_0_10px_rgba(0,240,255,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all">
              Register
            </Link>
          </>
        ) : (
          <>
            <Link to="/settings" className="text-white/50 hover:text-white transition-colors p-2">
              <Settings className="w-4 h-4" />
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button 
        className="md:hidden z-50 p-2 text-white/70 hover:text-white"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-3xl flex flex-col pt-24 px-8"
          >
            <div className="flex flex-col gap-6 text-lg font-bold uppercase tracking-widest">
              {currentLinks.map(link => (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white/70 hover:text-white"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="mt-auto pb-12 flex flex-col gap-4">
              {!isAuthenticated ? (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="py-4 text-center border border-white/10 rounded-xl text-white font-bold uppercase tracking-widest">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="py-4 text-center bg-[var(--color-brand-blue)] text-black font-bold uppercase tracking-widest rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/settings" onClick={() => setMobileMenuOpen(false)} className="py-4 text-center border border-white/10 rounded-xl text-white font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    <Settings className="w-4 h-4" /> Settings
                  </Link>
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="py-4 text-center border border-red-500/20 text-red-400 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
