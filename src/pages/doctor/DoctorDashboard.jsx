import React, { useState } from 'react';
import { db } from '../../services/db';
import { Calendar, Clock, CheckCircle2, User, Activity, AlertCircle, Check } from 'lucide-react';

export default function DoctorDashboard({ currentUser }) {
  // Dr. Layla Karim default if switched
  const doctorId = currentUser?.doctor_id || 2;
  const doctor = db.getDoctorById(doctorId) || db.getDoctors()[1];
  const [appointments, setAppointments] = useState(db.getAppointmentsByDoctor(doctor.doctor_id));

  const refreshList = () => {
    setAppointments(db.getAppointmentsByDoctor(doctor.doctor_id));
  };

  const handleStatusChange = (appId, newStatus) => {
    db.updateAppointmentStatus(appId, newStatus);
    refreshList();
  };

  const pendingCount = appointments.filter((a) => a.status === 'pending').length;
  const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="brand-card p-6 sm:p-8 bg-white border-l-4 border-l-[#008080] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <img
            src={doctor.avatar_url}
            alt={doctor.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-100 shrink-0"
          />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#008080]">Doctor Portal</span>
            <h1 className="text-2xl font-heading font-bold text-slate-900">{doctor.name}</h1>
            <p className="text-xs text-slate-500 font-medium">
              {doctor.title} — {doctor.specialization}
            </p>
          </div>
        </div>

        <div className="bg-[#ebf1f1] px-4 py-2.5 rounded-xl text-xs space-y-0.5">
          <span className="text-slate-500 font-medium">Clinic Days:</span>
          <p className="font-bold text-slate-900">{doctor.available_days.join(', ')}</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="brand-card p-6 bg-white space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase">Awaiting Action</span>
          <p className="text-2xl font-bold font-heading text-amber-600">{pendingCount}</p>
          <p className="text-[11px] text-slate-500">Pending appointments</p>
        </div>
        <div className="brand-card p-6 bg-white space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase">Confirmed Consultations</span>
          <p className="text-2xl font-bold font-heading text-emerald-600">{confirmedCount}</p>
          <p className="text-[11px] text-slate-500">Scheduled clinical appointments</p>
        </div>
        <div className="brand-card p-6 bg-white space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase">Consultation Fee</span>
          <p className="text-2xl font-bold font-heading text-[#008080]">${doctor.consultation_fee} USD</p>
          <p className="text-[11px] text-slate-500">Standard outpatient rate</p>
        </div>
      </div>

      {/* Doctor Appointments Queue */}
      <div className="brand-card p-6 bg-white space-y-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="font-heading font-bold text-base text-slate-900">Patient Appointment Queue</h2>
          <span className="text-xs font-bold text-slate-500">{appointments.length} Total Patients</span>
        </div>

        {appointments.length > 0 ? (
          <div className="space-y-3">
            {appointments.map((app) => (
              <div
                key={app.appointment_id}
                className="p-5 rounded-2xl border border-slate-100 hover:border-teal-200 bg-[#ebf1f1]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">#{app.appointment_id}</span>
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
                      Channel: {app.booking_source}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900">Patient: {app.patient_name || 'Sara Cole'}</h4>
                  <p className="text-xs text-slate-600">
                    <strong>Complaint:</strong> {app.reason}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="text-left md:text-right text-xs">
                    <p className="font-bold text-slate-900">{app.appointment_date}</p>
                    <p className="text-[#008080] font-semibold">{app.appointment_time}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {app.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusChange(app.appointment_id, 'completed')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        Mark Completed
                      </button>
                    )}
                    {app.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(app.appointment_id, 'confirmed')}
                        className="px-3 py-1.5 bg-[#008080] hover:bg-[#006666] text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        Accept Appointment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic py-6 text-center">No patients currently in schedule.</p>
        )}
      </div>
    </div>
  );
}

