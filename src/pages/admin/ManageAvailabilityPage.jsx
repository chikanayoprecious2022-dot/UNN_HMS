import React, { useState } from 'react';
import { db } from '../../services/db';
import { Clock, Calendar, Check, AlertCircle } from 'lucide-react';

export default function ManageAvailabilityPage() {
  const doctors = db.getDoctors();
  const [selectedDoctorId, setSelectedDoctorId] = useState('2'); // Dr. Layla Karim
  const [selectedDate, setSelectedDate] = useState('2026-11-23');

  const selectedDoctor = db.getDoctorById(selectedDoctorId) || doctors[0];
  const slots = db.getAvailableSlots(selectedDoctor.doctor_id, selectedDate);
  const appointmentsOnDate = db
    .getAppointments()
    .filter((a) => a.doctor_id === Number(selectedDoctorId) && a.appointment_date === selectedDate);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#008080]">Scheduling Engine</span>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 mt-1">
          Manage Clinical Availability & Shift Slots
        </h1>
        <p className="text-xs text-slate-500">
          Source of truth: inspect real-time hospital slot availability for any doctor on any date.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Selector Panel */}
        <div className="brand-card p-6 bg-white space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Doctor
            </label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="w-full bg-[#ebf1f1] px-3.5 py-2.5 rounded-xl text-xs font-medium border border-transparent focus:border-[#008080] focus:bg-white focus:outline-none"
            >
              {doctors.map((doc) => (
                <option key={doc.doctor_id} value={doc.doctor_id}>
                  {doc.name} ({doc.specialization})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Date to Inspect
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-[#ebf1f1] px-3.5 py-2.5 rounded-xl text-xs font-medium border border-transparent focus:border-[#008080] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="p-3.5 bg-teal-50 rounded-xl border border-teal-100 text-xs space-y-1 text-slate-700">
            <p className="font-bold text-[#008080]">Doctor Clinic Days:</p>
            <p className="font-medium">{selectedDoctor?.available_days.join(', ')}</p>
          </div>
        </div>

        {/* Slot Availability View */}
        <div className="md:col-span-2 brand-card p-6 bg-white space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Slot Matrix: {selectedDoctor?.name}
              </h3>
              <p className="text-xs text-slate-500">Date: {selectedDate}</p>
            </div>
            <span className="text-xs font-bold text-[#008080] bg-teal-50 px-3 py-1 rounded-full">
              {slots.length} Open Slots
            </span>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Open Slots:</span>
            <div className="flex flex-wrap gap-2.5">
              {slots.length > 0 ? (
                slots.map((s, idx) => (
                  <div
                    key={idx}
                    className="px-3.5 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{s}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No open slots available on this date.</p>
              )}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Booked Slots ({appointmentsOnDate.length}):
            </span>
            <div className="space-y-2">
              {appointmentsOnDate.length > 0 ? (
                appointmentsOnDate.map((app) => (
                  <div
                    key={app.appointment_id}
                    className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-slate-900">Patient: {app.patient_name}</span>
                      <span className="text-slate-500 block">Status: {app.status}</span>
                    </div>
                    <span className="font-mono font-bold text-amber-800">{app.appointment_time}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No bookings on this day yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

