import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Settings as SettingsIcon, Bell, Shield, Key, Copy, Check, Lock, Save } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { updateUserProfile, updateUserPassword } from '../services/api';
import { toast } from 'sonner';

export function Settings() {
  const { user, token, updateUser } = useStore();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile Form State
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  // Copied token state
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await updateUserProfile(firstName, lastName);
      updateUser(res.user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error('New passwords do not match');
    }
    if (newPassword.length < 6) {
      return toast.error('New password must be at least 6 characters');
    }

    try {
      setSavingPassword(true);
      await updateUserPassword(currentPassword, newPassword);
      toast.success('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  const copyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      toast.success('API JWT Token copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="py-12 px-8 md:px-16 min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 flex items-center gap-4">
          <SettingsIcon className="w-8 h-8 text-[var(--color-brand-blue)]" />
          Settings & Account
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Navigation Tabs */}
          <div className="md:col-span-1 space-y-2">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === 'profile' 
                  ? 'bg-white/10 text-white border border-[var(--color-brand-blue)]/50 shadow-[0_0_15px_rgba(0,240,255,0.1)]' 
                  : 'hover:bg-white/5 text-white/70'
              }`}
            >
              <User className="w-4 h-4 text-[var(--color-brand-blue)]" /> Profile Details
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === 'security' 
                  ? 'bg-white/10 text-white border border-[var(--color-brand-blue)]/50 shadow-[0_0_15px_rgba(0,240,255,0.1)]' 
                  : 'hover:bg-white/5 text-white/70'
              }`}
            >
              <Shield className="w-4 h-4 text-green-400" /> Security & Password
            </button>
            <button 
              onClick={() => setActiveTab('api')}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === 'api' 
                  ? 'bg-white/10 text-white border border-[var(--color-brand-blue)]/50 shadow-[0_0_15px_rgba(0,240,255,0.1)]' 
                  : 'hover:bg-white/5 text-white/70'
              }`}
            >
              <Key className="w-4 h-4 text-[var(--color-brand-purple)]" /> API Keys & Token
            </button>
            <button 
              onClick={() => setActiveTab('preferences')}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === 'preferences' 
                  ? 'bg-white/10 text-white border border-[var(--color-brand-blue)]/50 shadow-[0_0_15px_rgba(0,240,255,0.1)]' 
                  : 'hover:bg-white/5 text-white/70'
              }`}
            >
              <Bell className="w-4 h-4 text-yellow-400" /> System Preferences
            </button>
          </div>

          {/* Content Pane */}
          <div className="md:col-span-2 space-y-6">
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">Personal Information</h2>
                  <p className="text-xs text-white/50">Update your account information stored in MySQL.</p>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-white/50">First Name</label>
                      <input 
                        type="text" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)} 
                        className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-[var(--color-brand-blue)]" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase text-white/50">Last Name</label>
                      <input 
                        type="text" 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)} 
                        className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-[var(--color-brand-blue)]" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-white/50">Email Address (Read-only)</label>
                    <input 
                      type="email" 
                      value={email} 
                      disabled 
                      className="w-full bg-white/5 border border-white/5 rounded-lg py-2.5 px-3 text-white/50 cursor-not-allowed" 
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-white/5">
                  <button 
                    type="submit" 
                    disabled={savingProfile}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-brand-blue)] text-black font-bold rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {savingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <form onSubmit={handleSavePassword} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">Change Account Password</h2>
                  <p className="text-xs text-white/50">Update your master login password using bcrypt encryption.</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-white/50">Current Password</label>
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••"
                      value={currentPassword} 
                      onChange={(e) => setCurrentPassword(e.target.value)} 
                      className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-[var(--color-brand-blue)]" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-white/50">New Password</label>
                    <input 
                      type="password" 
                      required
                      placeholder="At least 6 characters"
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                      className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-[var(--color-brand-blue)]" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-white/50">Confirm New Password</label>
                    <input 
                      type="password" 
                      required
                      placeholder="Re-type new password"
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-[var(--color-brand-blue)]" 
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-white/5">
                  <button 
                    type="submit" 
                    disabled={savingPassword}
                    className="flex items-center gap-2 px-6 py-2.5 bg-green-400 text-black font-bold rounded-lg shadow-[0_0_15px_rgba(74,222,128,0.4)] hover:shadow-[0_0_25px_rgba(74,222,128,0.6)] transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Lock className="w-4 h-4" />
                    {savingPassword ? 'Updating Password...' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}

            {/* API TAB */}
            {activeTab === 'api' && (
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">Developer JWT Token</h2>
                  <p className="text-xs text-white/50">Use this token in the Authorization header to call `/api/ml/*` endpoints directly.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-white/50">Active Bearer Token</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={token || 'Not authenticated'} 
                      className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-3 text-white/70 font-mono text-xs overflow-hidden" 
                    />
                    <button 
                      onClick={copyToken}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer border border-white/10"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PREFERENCES TAB */}
            {activeTab === 'preferences' && (
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
                <h2 className="text-xl font-bold mb-1">Interface Preferences</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-[var(--color-brand-blue)]/40 cursor-pointer">
                    <input type="radio" name="theme" defaultChecked className="text-[var(--color-brand-blue)]" />
                    <div>
                      <div className="font-semibold text-sm">Cyberpunk Obsidian (Active)</div>
                      <div className="text-xs text-white/50">Deep black canvas with cyan and purple neon highlights</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 opacity-50 cursor-not-allowed">
                    <input type="radio" name="theme" disabled />
                    <div>
                      <div className="font-semibold text-sm">Clean Lab (Light Mode)</div>
                      <div className="text-xs text-white/50">High-contrast white theme (Coming soon in Phase 4)</div>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
