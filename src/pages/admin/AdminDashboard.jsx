import React from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../services/db';
import {
  Shield,
  Calendar,
  Bot,
  Users,
  Activity,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertTriangle,
  Building,
} from 'lucide-react';

export default function AdminDashboard() {
  const appointments = db.getAppointments();
  const doctors = db.getDoctors();
  const departments = db.getDepartments();
  const aiRecs = db.getAiRecommendations();

  const pendingCount = appointments.filter((a) => a.status === 'pending').length;
  const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length;
  const aiBookedCount = appointments.filter((a) => a.booking_source === 'ai_assistant').length;
  const manualBookedCount = appointments.filter((a) => a.booking_source === 'manual').length;
  const emergencyCount = aiRecs.filter((r) => r.emergency_detected === 1).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="brand-card p-6 sm:p-8 bg-white border-l-4 border-l-[#008080] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#008080]">Hospital Administration</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              Operational
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900">
            Hospital Operations Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time appointment governance, doctor availability scheduling, and AI triage audit metrics.
          </p>
        </div>

        {/* Quick Review Pending Action per idea.md Section 15 */}
        <Link
          to="/admin/appointments"
          className="bg-[#008080] hover:bg-[#006666] text-white px-5 py-3 rounded-xl font-heading font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 shrink-0 transform hover:-translate-y-0.5"
        >
          <Clock className="w-4 h-4 text-amber-300" />
          <span>Review Pending Appointments ({pendingCount})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="brand-card p-6 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Pending Approval</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold font-heading text-amber-600">{pendingCount}</p>
          <p className="text-[11px] text-slate-500">Awaiting clinical validation</p>
        </div>

        <div className="brand-card p-6 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Confirmed Appointments</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold font-heading text-emerald-600">{confirmedCount}</p>
          <p className="text-[11px] text-slate-500">Active clinic sessions</p>
        </div>

        <div className="brand-card p-6 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">AI vs Manual Ratio</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#008080] flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-heading text-slate-900">
            {aiBookedCount} <span className="text-xs font-normal text-slate-400">AI</span> / {manualBookedCount}{' '}
            <span className="text-xs font-normal text-slate-400">Manual</span>
          </p>
          <p className="text-[11px] text-slate-500">Dual booking distribution</p>
        </div>

        <div className="brand-card p-6 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Emergency Alerts</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold font-heading text-rose-600">{emergencyCount}</p>
          <p className="text-[11px] text-slate-500">Interception triggers</p>
        </div>
      </div>

      {/* Admin Action Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/appointments"
          className="brand-card p-6 bg-white hover:border-[#008080] space-y-3 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#008080] flex items-center justify-center group-hover:bg-[#008080] group-hover:text-white transition-colors">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-slate-900 group-hover:text-[#008080] transition-colors">
            Manage Appointments
          </h3>
          <p className="text-xs text-slate-500">
            Approve pending appointments to confirmed status, view booking channel tags, and filter by doctor.
          </p>
        </Link>

        <Link
          to="/admin/ai-reports"
          className="brand-card p-6 bg-white hover:border-[#008080] space-y-3 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#008080] flex items-center justify-center group-hover:bg-[#008080] group-hover:text-white transition-colors">
            <Bot className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-slate-900 group-hover:text-[#008080] transition-colors">
            AI Recommendations Report
          </h3>
          <p className="text-xs text-slate-500">
            Audit symptom logs, triage urgency classification, conversion to appointment rates, and emergency triggers.
          </p>
        </Link>

        <Link
          to="/admin/doctors"
          className="brand-card p-6 bg-white hover:border-[#008080] space-y-3 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#008080] flex items-center justify-center group-hover:bg-[#008080] group-hover:text-white transition-colors">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-slate-900 group-hover:text-[#008080] transition-colors">
            Manage Medical Faculty
          </h3>
          <p className="text-xs text-slate-500">
            Configure {doctors.length} active hospital doctors, consultation tariffs, specialties, and clinical days.
          </p>
        </Link>
      </div>
    </div>
  );
}

