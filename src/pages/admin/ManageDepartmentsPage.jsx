import React, { useState } from 'react';
import { db } from '../../services/db';
import { Building, Plus, HeartPulse, Smile, Baby, Sparkles, Stethoscope, Activity, X } from 'lucide-react';

export default function ManageDepartmentsPage() {
  const [departments, setDepartments] = useState(db.getDepartments());
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [emergency, setEmergency] = useState(false);

  const refreshList = () => {
    setDepartments(db.getDepartments());
  };

  const handleAddDept = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    db.saveDepartment({
      name,
      description: desc || 'Clinical specialty division at UNN Hospital.',
      icon: 'HeartPulse',
      emergency_supported: emergency,
    });

    setName('');
    setDesc('');
    setShowAdd(false);
    refreshList();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#008080]">Hospital Organization</span>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 mt-1">
            Manage Clinical Departments
          </h1>
          <p className="text-xs text-slate-500">
            Define hospital medical divisions, descriptions, and 24/7 casualty emergency triage coverage.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-[#008080] hover:bg-[#006666] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div key={dept.department_id} className="brand-card p-6 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#008080] flex items-center justify-center font-bold">
                <HeartPulse className="w-5 h-5" />
              </div>
              {dept.emergency_supported && (
                <span className="text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full uppercase">
                  Emergency Supported
                </span>
              )}
            </div>

            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900">{dept.name}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{dept.description}</p>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading font-bold text-base text-slate-900">Add Clinical Department</h3>
              <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDept} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department Name</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ophthalmology"
                  className="w-full bg-[#ebf1f1] px-3 py-2 rounded-xl border border-transparent focus:border-[#008080] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Clinical functions and diagnostic scopes..."
                  className="w-full bg-[#ebf1f1] px-3 py-2 rounded-xl border border-transparent focus:border-[#008080] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="emergency"
                  checked={emergency}
                  onChange={(e) => setEmergency(e.target.checked)}
                  className="rounded text-[#008080] focus:ring-[#008080]"
                />
                <label htmlFor="emergency" className="font-semibold text-slate-700">
                  Include in 24/7 Casualty Emergency Routing
                </label>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#008080] hover:bg-[#006666] text-white font-bold rounded-xl"
                >
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

