import React, { useState } from 'react';
import { db } from '../../services/db';
import { Users, Plus, Award, DollarSign, Check, X, Shield, Clock } from 'lucide-react';

export default function ManageDoctorsPage() {
  const [doctors, setDoctors] = useState(db.getDoctors());
  const [showAddModal, setShowAddModal] = useState(false);
  const departments = db.getDepartments();

  // Add doctor form state
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [deptId, setDeptId] = useState('1');
  const [specialization, setSpecialization] = useState('');
  const [fee, setFee] = useState('30');
  const [experience, setExperience] = useState('5');

  const refreshList = () => {
    setDoctors(db.getDoctors());
  };

  const handleToggleActive = (doc) => {
    const updated = { ...doc, is_active: !doc.is_active };
    db.saveDoctor(updated);
    refreshList();
  };

  const handleAddDoctor = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    db.saveDoctor({
      name,
      title: title || 'Specialist Consultant',
      department_id: Number(deptId),
      specialization: specialization || 'General Medicine',
      consultation_fee: Number(fee),
      experience_years: Number(experience),
      bio: 'Board-certified medical practitioner at University Hospital.',
      avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
      available_days: ['Monday', 'Wednesday', 'Friday'],
      is_active: true,
    });

    setName('');
    setShowAddModal(false);
    refreshList();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#008080]">Hospital Roster</span>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 mt-1">
            Manage Medical Faculty
          </h1>
          <p className="text-xs text-slate-500">
            Maintain physician profiles, consultation fee structures, and active clinic availability.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-[#008080] hover:bg-[#006666] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Doctor</span>
        </button>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doc) => {
          const dept = db.getDepartmentById(doc.department_id);

          return (
            <div
              key={doc.doctor_id}
              className={`brand-card p-5 bg-white flex flex-col justify-between space-y-4 ${
                !doc.is_active ? 'opacity-60 bg-slate-50' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <img
                  src={doc.avatar_url}
                  alt={doc.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-100 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-[#008080] uppercase tracking-wider block">
                    {dept?.name}
                  </span>
                  <h3 className="font-heading font-bold text-base text-slate-900 truncate">{doc.name}</h3>
                  <p className="text-xs text-slate-500 truncate">{doc.specialization}</p>

                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-900">${doc.consultation_fee} / visit</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">{doc.experience_years} yrs exp</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#ebf1f1] p-3 rounded-xl text-xs space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Available Days:</span>
                  <span className="font-semibold text-slate-900">{doc.available_days.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`font-bold ${doc.is_active ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {doc.is_active ? 'Active on Roster' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleToggleActive(doc)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    doc.is_active
                      ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {doc.is_active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Doctor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading font-bold text-base text-slate-900">Add Doctor to Faculty</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDoctor} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Doctor Full Name</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Ada Lovelace"
                  className="w-full bg-[#ebf1f1] px-3 py-2 rounded-xl border border-transparent focus:border-[#008080] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Department</label>
                <select
                  value={deptId}
                  onChange={(e) => setDeptId(e.target.value)}
                  className="w-full bg-[#ebf1f1] px-3 py-2 rounded-xl border border-transparent focus:border-[#008080] focus:bg-white focus:outline-none"
                >
                  {departments.map((d) => (
                    <option key={d.department_id} value={d.department_id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Specialization</label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="e.g. Pediatric Cardiology"
                  className="w-full bg-[#ebf1f1] px-3 py-2 rounded-xl border border-transparent focus:border-[#008080] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Consultation Fee ($)</label>
                  <input
                    type="number"
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                    className="w-full bg-[#ebf1f1] px-3 py-2 rounded-xl border border-transparent focus:border-[#008080] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full bg-[#ebf1f1] px-3 py-2 rounded-xl border border-transparent focus:border-[#008080] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#008080] hover:bg-[#006666] text-white font-bold rounded-xl"
                >
                  Save Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

