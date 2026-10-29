import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../services/db';
import { Calendar, Clock, CheckCircle2, AlertCircle, XCircle, RotateCcw, Bot, Plus } from 'lucide-react';

export default function MyAppointmentsPage({ currentUser }) {
  const patientId = currentUser?.user_id || 1;
  const [appointments, setAppointments] = useState(db.getAppointmentsByPatient(patientId));
  const [statusFilter, setStatusFilter] = useState('all');

  const refreshList = () => {
    setAppointments(db.getAppointmentsByPatient(patientId));
  };

  const handleCancel = (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      db.cancelAppointment(id);
      refreshList();
    }
  };

  const filtered = appointments.filter((app) => {
    if (statusFilter === 'all') return true;
    return app.status === statusFilter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900">My Appointments</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Review status, cancellation requests, and booking history for patient account.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/ai-assistant"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
          >
            <Bot className="w-3.5 h-3.5 text-emerald-300" />
            <span>Book with AI</span>
          </Link>
          <Link
            to="/book?mode=manual"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-[#008080] text-[#008080] hover:bg-teal-50 text-xs font-bold rounded-xl shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book Manually</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
              statusFilter === tab
                ? 'bg-[#008080] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((app) => (
            <div
              key={app.appointment_id}
              className="brand-card p-6 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
            >
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-xs font-bold text-slate-400">#{app.appointment_id}</span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      app.status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'pending'
                        ? 'bg-amber-100 text-amber-800 animate-pulse'
                        : app.status === 'completed'
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    Status: {app.status}
                  </span>

                  {/* Booking Source Tag per idea.md */}
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      app.booking_source === 'ai_assistant'
                        ? 'bg-teal-50 text-[#008080] border-teal-200 font-bold'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    Channel: {app.booking_source === 'ai_assistant' ? '🤖 AI Assistant' : '👤 Manual Booking'}
                  </span>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900">{app.doctor_name}</h3>
                  <p className="text-xs font-medium text-[#008080]">{app.department_name} Department</p>
                  <p className="text-xs text-slate-500 mt-1">{app.reason}</p>
                </div>
              </div>

              {/* Date & Action */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                <div className="text-left md:text-right">
                  <div className="flex items-center md:justify-end gap-1.5 text-xs font-bold text-slate-800">
                    <Calendar className="w-3.5 h-3.5 text-[#008080]" />
                    <span>{app.appointment_date}</span>
                  </div>
                  <div className="flex items-center md:justify-end gap-1.5 text-xs text-slate-500 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{app.appointment_time}</span>
                  </div>
                </div>

                {app.status !== 'cancelled' && app.status !== 'completed' && (
                  <button
                    onClick={() => handleCancel(app.appointment_id)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 rounded-lg transition-colors border border-rose-200"
                  >
                    Cancel Appointment
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="brand-card p-12 bg-white text-center space-y-3">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-heading font-bold text-slate-700">No appointments found</h3>
            <p className="text-xs text-slate-400">You do not have any appointments matching the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

