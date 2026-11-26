import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, LogOut, Settings, BarChart2, GitMerge, AlertTriangle, ShieldAlert, Layers, Database, FlaskConical, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../../context/StoreContext';
import { toast } from 'sonner';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useStore();

  const authLinks = [
    { name: 'Analyze', path: '/analyze', icon: BarChart2 },
    { name: 'Pipelines', path: '/recommendations', icon: GitMerge },
    { name: 'Shift Detection', path: '/shift', icon: AlertTriangle },
    { name: 'Failures', path: '/failures', icon: ShieldAlert },
    { name: 'Ensembles', path: '/ensembles', icon: Layers },
    { name: 'Experiments', path: '/experiments', icon: Database },
    { name: 'Research', path: '/research', icon: FlaskConical },
    { name: 'System', path: '/system', icon: LayoutDashboard },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <aside className="w-64 h-screen border-r border-white/10 bg-black/40 backdrop-blur-xl flex flex-col shrink-0 sticky top-0">
      <div className="h-20 flex items-center px-6 border-b border-white/10">
        <Link to="/" className="flex items-center gap-3 text-white">
          <Activity className="w-8 h-8 text-[var(--color-brand-blue)] glow-effect" />
          <span className="font-black tracking-widest uppercase text-sm bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-brand-blue)] to-[var(--color-brand-purple)]">
            KLCAP-2026
          </span>
        </Link>
      </div>
      
      <div className="flex-1 py-8 px-4 flex flex-col gap-2 overflow-y-auto">
        <div className="text-xs font-bold text-white/30 tracking-widest uppercase mb-4 px-2">ML Workspace</div>
        {authLinks.map(link => {
          const isActive = location.pathname === link.path;
          const Icon = link.icon;
          return (
            <Link 
              key={link.name} 
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative overflow-hidden group ${isActive ? 'text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
            >
              {isActive && (
                <motion.div 
                  layoutId="sidebar-indicator"
                  className="absolute inset-0 bg-gradient-to-r from-[var(--color-brand-blue)]/20 to-transparent border-l-4 border-[var(--color-brand-blue)]"
                />
              )}
              <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-[var(--color-brand-blue)]' : 'group-hover:text-[var(--color-brand-blue)] transition-colors'}`} />
              <span className="text-sm font-bold uppercase tracking-wider relative z-10">{link.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/10 flex flex-col gap-2">
        {user && (
          <div className="px-4 py-3 mb-2 bg-white/5 rounded-xl border border-white/10">
            <div className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Logged In As</div>
            <div className="text-sm font-semibold truncate text-[var(--color-brand-blue)]">
              {user.firstName ? `${user.firstName} ${user.lastName}` : user.email}
            </div>
          </div>
        )}
        <Link 
          to="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-white/50 hover:text-white hover:bg-white/5"
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-wider">Settings</span>
        </Link>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-wider">Logout</span>
        </button>
      </div>
    </aside>
  );
}
