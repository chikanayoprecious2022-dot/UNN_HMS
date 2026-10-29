import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/db';
import { User, Lock, Mail, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AuthPage({ onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleAuth = (e) => {
    e.preventDefault();
    const user = {
      user_id: 1,
      name: name || (isRegister ? 'New Patient' : 'Sara Cole'),
      email: email || 'sara@unn.edu',
      phone: phone || '+234 803 123 4567',
      role: 'patient',
    };
    db.setCurrentUser(user);
    if (onAuthSuccess) onAuthSuccess(user);
    navigate('/my-appointments');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white p-8 rounded-2xl border border-[#008080]/20 shadow-md space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#008080]">
            {isRegister ? 'Patient Registration' : 'Patient Login'}
          </span>
          <h1 className="text-2xl font-heading font-bold text-slate-900">
            {isRegister ? 'Create an Account' : 'Welcome to UNN HMS'}
          </h1>
          <p className="text-xs text-slate-500">
            {isRegister ? 'Register to book and manage appointments' : 'Sign in to access your appointments'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-[#ebf1f1] p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            className={`flex-1 py-2 rounded-lg transition-all ${
              !isRegister ? 'bg-[#008080] text-white shadow-sm' : 'text-slate-600 hover:text-[#008080]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            className={`flex-1 py-2 rounded-lg transition-all ${
              isRegister ? 'bg-[#008080] text-white shadow-sm' : 'text-slate-600 hover:text-[#008080]'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-4 text-xs">
          {isRegister && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sara Cole"
                className="w-full bg-[#ebf1f1] px-3.5 py-2.5 rounded-xl border border-[#008080]/20 focus:border-[#008080] focus:bg-white focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sara@unn.edu"
              className="w-full bg-[#ebf1f1] px-3.5 py-2.5 rounded-xl border border-[#008080]/20 focus:border-[#008080] focus:bg-white focus:outline-none"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 803 123 4567"
                className="w-full bg-[#ebf1f1] px-3.5 py-2.5 rounded-xl border border-[#008080]/20 focus:border-[#008080] focus:bg-white focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Password</label>
            <input
              required
              type="password"
              placeholder="••••••••"
              defaultValue="password123"
              className="w-full bg-[#ebf1f1] px-3.5 py-2.5 rounded-xl border border-[#008080]/20 focus:border-[#008080] focus:bg-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#008080] hover:bg-[#006666] text-white font-heading font-bold text-xs rounded-xl transition-colors shadow-md flex items-center justify-center gap-1.5"
          >
            <span>{isRegister ? 'Register & Continue' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Fill button */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={handleAuth}
            className="text-[11px] text-[#008080] font-semibold hover:underline"
          >
            Click here to continue directly as Patient (Sara Cole)
          </button>
        </div>
      </div>
    </div>
  );
}

