import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../../services/db';
import { UserPlus, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function RegisterPage({ onUserLogin }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Female');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      user_id: Date.now(),
      name,
      email,
      phone,
      gender,
      role: 'patient',
    };
    db.setCurrentUser(newUser);
    onUserLogin(newUser);
    navigate('/patient/dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="brand-card p-8 bg-white shadow-xl space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#008080]">New Patient</span>
          <h1 className="text-2xl font-heading font-bold text-slate-900">Register Patient Account</h1>
          <p className="text-xs text-slate-500">Create an account to track your hospital appointments</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sara Cole"
              className="w-full bg-[#ebf1f1] px-3.5 py-2.5 rounded-xl border border-transparent focus:border-[#008080] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sara@example.com"
              className="w-full bg-[#ebf1f1] px-3.5 py-2.5 rounded-xl border border-transparent focus:border-[#008080] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+234 803 123 4567"
              className="w-full bg-[#ebf1f1] px-3.5 py-2.5 rounded-xl border border-transparent focus:border-[#008080] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-[#ebf1f1] px-3.5 py-2.5 rounded-xl border border-transparent focus:border-[#008080] focus:bg-white focus:outline-none"
            >
              <option>Female</option>
              <option>Male</option>
              <option>Other</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#008080] hover:bg-[#006666] text-white font-heading font-bold text-xs rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <span>Create Patient Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/patient/login" className="text-[#008080] font-bold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}

