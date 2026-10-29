import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../services/db';
import { Calendar, Clock, Bot, Plus, Trash2 } from 'lucide-react';

export default function MyAppointmentsPage({ currentUser }) {
  const [appointments, setAppointments] = useState(db.getAppointments());

  const handleCancel = (id) => {
    if (window.confirm('Do you want to cancel this appointment?')) {
      db.cancelAppointment(id);
      setAppointments(db.getAppointments());
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#008080]/20 pb-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-900">My Appointments</h1>
          <p className="text-xs text-slate-500">
            View all appointments booked manually or through the UNN AI Assistant.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/ai-assistant"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Book with AI</span>
          </Link>
          <Link
            to="/book"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#008080] text-[#008080] hover:bg-[#ebf1f1] text-xs font-bold rounded-xl shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book Manually</span>
          </Link>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {appointments.length > 0 ? (
          appointments.map((app) => (
            <div
              key={app.appointment_id}
              className="bg-white p-5 rounded-xl border border-[#008080]/20 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-400">#{app.appointment_id}</span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      app.status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {app.status}
                  </span>
                  <span className="text-[10px] bg-[#ebf1f1] text-[#008080] px-2 py-0.5 rounded font-mono font-semibold">
                    via {app.booking_source === 'ai_assistant' ? 'AI Assistant' : 'Manual'}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900">{app.doctor_name}</h3>
                <p className="text-xs text-[#008080] font-semibold">{app.department_name} Department</p>
                <p className="text-xs text-slate-500">{app.reason}</p>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                <div className="text-left sm:text-right text-xs">
                  <div className="flex items-center sm:justify-end gap-1.5 font-bold text-slate-800">
                    <Calendar className="w-3.5 h-3.5 text-[#008080]" />
                    <span>{app.appointment_date}</span>
                  </div>
                  <div className="flex items-center sm:justify-end gap-1.5 text-[#008080] font-semibold mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{app.appointment_time}</span>
                  </div>
                </div>

                {app.status !== 'cancelled' && (
                  <button
                    onClick={() => handleCancel(app.appointment_id)}
                    className="text-xs text-rose-600 hover:text-rose-800 font-semibold underline"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-10 rounded-2xl text-center text-slate-400 text-xs border border-[#008080]/15">
            No appointments booked yet. Click "Book with AI" or "Book Manually" above.
          </div>
        )}
      </div>
    </div>
  );
}

