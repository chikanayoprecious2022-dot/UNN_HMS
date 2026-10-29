import React from 'react';
import { db } from '../services/db';
import { RefreshCw, UserCheck, Shield, Stethoscope, Eye } from 'lucide-react';

export default function TopDemoBar({ currentUser, onUserChange, onResetData }) {
  const roles = [
    { id: 'public', label: 'Public Visitor', icon: Eye, roleName: 'visitor' },
    { id: 'patient', label: 'Patient (Sara Cole)', icon: UserCheck, roleName: 'patient' },
    { id: 'doctor', label: 'Doctor (Dr. Layla)', icon: Stethoscope, roleName: 'doctor' },
    { id: 'admin', label: 'Hospital Admin', icon: Shield, roleName: 'admin' },
  ];

  const handleRoleSelect = (r) => {
    if (r.id === 'public') {
      db.setCurrentUser({ user_id: 0, name: 'Guest Visitor', role: 'visitor' });
      onUserChange({ user_id: 0, name: 'Guest Visitor', role: 'visitor' });
    } else {
      const switched = db.switchUserByRole(r.roleName);
      onUserChange(switched);
    }
  };

  const currentRole = currentUser?.role || 'visitor';

  return (
    <div className="bg-[#006666] text-white text-xs py-2 px-4 border-b border-teal-800/40 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-semibold tracking-wider text-teal-100 uppercase">UNN HMS Live Demo Control:</span>
          <span className="hidden sm:inline text-teal-200">Active Persona:</span>
          <span className="bg-white/20 text-white font-medium px-2 py-0.5 rounded-full border border-white/20">
            {currentUser?.name || 'Guest Visitor'} ({currentRole.toUpperCase()})
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-teal-200 hidden md:inline">Quick Persona Switch:</span>
          <div className="inline-flex rounded-lg bg-black/20 p-0.5 border border-white/10">
            {roles.map((item) => {
              const Icon = item.icon;
              const isActive = (item.id === 'public' && currentRole === 'visitor') || (item.roleName === currentRole && currentRole !== 'visitor');
              return (
                <button
                  key={item.id}
                  onClick={() => handleRoleSelect(item)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-white text-[#006666] shadow-sm font-semibold'
                      : 'text-teal-100 hover:text-white hover:bg-white/10'
                  }`}
                  title={`Switch to ${item.label}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={onResetData}
            className="flex items-center gap-1 bg-teal-800/80 hover:bg-teal-700 text-teal-100 hover:text-white px-2.5 py-1 rounded-md text-xs font-medium transition-colors border border-teal-600/40 ml-1"
            title="Reset database to initial demo state"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Reset Demo State</span>
          </button>
        </div>
      </div>
    </div>
  );
}

