import React from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../services/db';
import { Bot, Calendar, Clock, User, CheckCircle2, ArrowRight, Activity, AlertCircle } from 'lucide-react';

export default function PatientDashboard({ currentUser }) {
  const patientId = currentUser?.user_id || 1;
  const appointments = db.getAppointmentsByPatient(patientId);
  const pendingAppointments = appointments.filter((a) => a.status === 'pending');
  const confirmedAppointments = appointments.filter((a) => a.status === 'confirmed');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="brand-card p-6 sm:p-8 bg-white border-l-4 border-l-[#008080] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#008080]">Patient Portal</span>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900">
            Welcome back, {currentUser?.name || 'Sara Cole'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track your consultations, schedule new clinic visits, or consult the UNN AI assistant.
          </p>
        </div>

        {/* AI Quick Action per idea.md Section 2 */}
        <Link
          to="/ai-assistant"
          className="bg-[#008080] hover:bg-[#006666] text-white px-5 py-3 rounded-xl font-heading font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 shrink-0 transform hover:-translate-y-0.5"
        >
          <Bot className="w-4 h-4 text-emerald-300" />
          <span>Ask AI Health Assistant</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="brand-card p-6 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Pending Review</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-heading text-slate-900">{pendingAppointments.length}</p>
          <p className="text-[11px] text-slate-500">Awaiting hospital admin confirmation</p>
        </div>

        <div className="brand-card p-6 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Confirmed Visits</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-heading text-slate-900">{confirmedAppointments.length}</p>
          <p className="text-[11px] text-slate-500">Scheduled clinical appointments</p>
        </div>

        <div className="brand-card p-6 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Bookings</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#008080] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-heading text-slate-900">{appointments.length}</p>
          <p className="text-[11px] text-slate-500">All registered appointments</p>
        </div>
      </div>

      {/* Recent Appointments & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Appointments List */}
        <div className="lg:col-span-2 brand-card p-6 bg-white space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-heading font-bold text-base text-slate-900">Recent Appointments</h2>
            <Link to="/patient/appointments" className="text-xs font-bold text-[#008080] hover:underline">
              View All ({appointments.length})
            </Link>
          </div>

          {appointments.length > 0 ? (
            <div className="space-y-3">
              {appointments.slice(0, 3).map((app) => (
                <div
                  key={app.appointment_id}
                  className="p-4 rounded-xl border border-slate-100 hover:border-teal-200 bg-[#ebf1f1]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">#{app.appointment_id}</span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          app.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : app.status === 'completed'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {app.status}
                      </span>
                      <span className="text-[10px] bg-white border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                        via {app.booking_source}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900">{app.doctor_name}</h4>
                    <p className="text-xs text-slate-500">{app.reason}</p>
                  </div>

                  <div className="text-right sm:shrink-0 text-xs">
                    <p className="font-bold text-[#008080]">{app.appointment_date}</p>
                    <p className="text-slate-500">{app.appointment_time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic py-4">No appointments found. Book your first session below.</p>
          )}

          <div className="pt-2 flex gap-3">
            <Link
              to="/book"
              className="flex-1 py-2.5 bg-slate-900 hover:bg-[#008080] text-white text-xs font-bold rounded-xl text-center transition-colors shadow-sm"
            >
              Book Manually
            </Link>
            <Link
              to="/ai-assistant"
              className="flex-1 py-2.5 bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold rounded-xl text-center transition-colors shadow-sm"
            >
              Book with UNN AI
            </Link>
          </div>
        </div>

        {/* Quick Health Card */}
        <div className="brand-card p-6 bg-white space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-heading font-bold text-base text-slate-900">Patient Vitals & Profile</h3>
            <p className="text-xs text-slate-500">Registered hospital medical file</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Full Name:</span>
              <span className="font-bold text-slate-900">{currentUser?.name || 'Sara Cole'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Blood Group:</span>
              <span className="font-bold text-[#008080]">O+</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Registered Phone:</span>
              <span className="font-semibold text-slate-800">{currentUser?.phone || '+234 803 123 4567'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Student/Staff ID:</span>
              <span className="font-mono text-slate-700">UNN/MED/2026/048</span>
            </div>
          </div>

          <div className="p-3.5 bg-teal-50 rounded-xl border border-teal-100 text-[11px] text-[#006666] space-y-1">
            <p className="font-bold">Hospital Notice:</p>
            <p>Please arrive at the clinic 15 minutes prior to your scheduled consultation time.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

