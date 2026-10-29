import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { db } from '../../services/db';
import { User, Shield, Stethoscope, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LoginPage({ onUserLogin }) {
  const [searchParams] = useSearchParams();
  const targetRole = searchParams.get('role') || 'patient';
  const navigate = useNavigate();

  const [role, setRole] = useState(targetRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleQuickDemoLogin = (roleType) => {
    const user = db.switchUserByRole(roleType);
    onUserLogin(user);
    if (roleType === 'admin') navigate('/admin/dashboard');
    else if (roleType === 'doctor') navigate('/doctor/dashboard');
    else navigate('/patient/dashboard');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleQuickDemoLogin(role);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="brand-card p-8 bg-white shadow-xl space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#008080]">Secure Access</span>
          <h1 className="text-2xl font-heading font-bold text-slate-900">Hospital Portal Login</h1>
          <p className="text-xs text-slate-500">Sign in to your UNN HMS portal account</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-[#ebf1f1] p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setRole('patient')}
            className={`py-2 text-xs font-bold rounded-lg transition-colors ${
              role === 'patient' ? 'bg-white text-[#008080] shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Patient
          </button>
          <button
            type="button"
            onClick={() => setRole('doctor')}
            className={`py-2 text-xs font-bold rounded-lg transition-colors ${
              role === 'doctor' ? 'bg-white text-[#008080] shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Doctor
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`py-2 text-xs font-bold rounded-lg transition-colors ${
              role === 'admin' ? 'bg-white text-[#008080] shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hospital Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={
                role === 'admin'
                  ? 'admin@unn-hms.edu'
                  : role === 'doctor'
                  ? 'layla.karim@unn-hms.edu'
                  : 'sara@unn.edu'
              }
              className="w-full bg-[#ebf1f1] px-3.5 py-2.5 rounded-xl border border-transparent focus:border-[#008080] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#ebf1f1] px-3.5 py-2.5 rounded-xl border border-transparent focus:border-[#008080] focus:bg-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#008080] hover:bg-[#006666] text-white font-heading font-bold text-xs rounded-xl transition-colors shadow-md"
          >
            Sign In to {role.toUpperCase()}
          </button>
        </form>

        {/* 1-Click Demo Login Box */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">
            One-Click Defense Demo Accounts:
          </p>
          <div className="space-y-1.5">
            <button
              onClick={() => handleQuickDemoLogin('patient')}
              className="w-full p-2 rounded-lg bg-teal-50 hover:bg-teal-100 text-xs font-semibold text-[#008080] text-left flex items-center justify-between transition-colors"
            >
              <span>Demo as Patient: Sara Cole</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleQuickDemoLogin('doctor')}
              className="w-full p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 text-left flex items-center justify-between transition-colors"
            >
              <span>Demo as Doctor: Dr. Layla Karim</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleQuickDemoLogin('admin')}
              className="w-full p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white text-left flex items-center justify-between transition-colors"
            >
              <span>Demo as Hospital Admin: Chief Medical Officer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

