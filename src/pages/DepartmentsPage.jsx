import React from 'react';
import { Link } from 'react-router-dom';
import { db } from '../services/db';
import { HeartPulse, Smile, Baby, Sparkles, Stethoscope, Activity, ArrowRight, Bot, ShieldCheck } from 'lucide-react';

export default function DepartmentsPage() {
  const departments = db.getDepartments();
  const doctors = db.getDoctors();

  const iconMap = {
    HeartPulse,
    Smile,
    Baby,
    Sparkles,
    Stethoscope,
    Activity,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#008080] bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          Clinical Divisions
        </span>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-slate-900">Hospital Departments</h1>
        <p className="text-sm text-slate-500">
          Our university hospital operates fully accredited specialized clinical divisions with leading physicians.
        </p>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          const Icon = iconMap[dept.icon] || HeartPulse;
          const deptDocs = doctors.filter((d) => d.department_id === dept.department_id);

          return (
            <div
              key={dept.department_id}
              className="brand-card p-6 flex flex-col justify-between hover:shadow-xl transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#008080] flex items-center justify-center font-bold">
                    <Icon className="w-6 h-6" />
                  </div>
                  {dept.emergency_supported && (
                    <span className="text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full uppercase">
                      24/7 Emergency
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-heading font-bold text-xl text-slate-900">{dept.name}</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{dept.description}</p>
                </div>

                <div className="bg-[#ebf1f1] p-3 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Active Specialists:</span>
                  <span className="font-bold text-[#008080]">{deptDocs.length} Consultants</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  to={`/doctors?dept=${dept.department_id}`}
                  className="text-xs font-bold text-[#008080] hover:text-[#006666] flex items-center gap-1"
                >
                  <span>View Doctors</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  to={`/ai-assistant?symptoms=${encodeURIComponent(dept.name)}`}
                  className="px-3 py-1.5 bg-teal-50 hover:bg-[#008080] text-[#008080] hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Ask AI</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

