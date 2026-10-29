import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { db } from '../services/db';
import { Calendar, Bot, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

export default function BookAppointmentPage({ currentUser }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialDoctorId = searchParams.get('doctorId') || '2'; // Dr. Layla default
  const [selectedDoctorId, setSelectedDoctorId] = useState(initialDoctorId);
  const [selectedDate, setSelectedDate] = useState('2026-11-23');
  const [selectedTime, setSelectedTime] = useState('04:00 PM');
  const [reason, setReason] = useState('');
  const [patientName, setPatientName] = useState(currentUser?.name || 'Sara Cole');
  const [patientPhone, setPatientPhone] = useState(currentUser?.phone || '+234 803 123 4567');

  const doctors = db.getDoctors();
  const selectedDoctor = db.getDoctorById(selectedDoctorId) || doctors[0];
  const availableSlots = db.getAvailableSlots(selectedDoctor.doctor_id, selectedDate);

  const handleBook = (e) => {
    e.preventDefault();
    db.bookAppointment({
      patientId: currentUser?.user_id || 1,
      doctorId: selectedDoctor.doctor_id,
      departmentId: selectedDoctor.department_id,
      date: selectedDate,
      time: selectedTime,
      reason: reason || 'Routine clinical consultation',
      bookingSource: 'manual',
    });

    navigate('/my-appointments');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      {/* AI banner for patients who aren't sure */}
      <div className="bg-[#ebf1f1] border border-[#008080]/30 p-4 rounded-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Bot className="w-5 h-5 text-[#008080]" />
          <div>
            <p className="text-xs font-bold text-slate-900">Not sure which doctor to choose?</p>
            <p className="text-[11px] text-slate-500">Describe your symptoms to UNN AI and book automatically.</p>
          </div>
        </div>
        <Link
          to="/ai-assistant"
          className="px-3 py-1.5 bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold rounded-lg shrink-0"
        >
          Use AI Booking
        </Link>
      </div>

      {/* Main Manual Booking Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#008080]/20 shadow-md space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-slate-900">Book an Appointment</h1>
          <p className="text-xs text-slate-500">Select your preferred doctor, date, and open time slot.</p>
        </div>

        <form onSubmit={handleBook} className="space-y-4 text-xs">
          {/* Doctor Selection */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Doctor</label>
            <select
              value={selectedDoctorId}
              onChange={(e) => {
                setSelectedDoctorId(e.target.value);
                setSelectedTime('10:00 AM');
              }}
              className="w-full bg-[#ebf1f1] px-3.5 py-2.5 rounded-xl border border-[#008080]/20 focus:border-[#008080] focus:bg-white focus:outline-none"
            >
              {doctors.map((doc) => (
                <option key={doc.doctor_id} value={doc.doctor_id}>
                  {doc.name} — {doc.title} (${doc.consultation_fee})
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Appointment Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-[#ebf1f1] px-3.5 py-2.5 rounded-xl border border-[#008080]/20 focus:border-[#008080] focus:bg-white focus:outline-none"
            />
          </div>

          {/* Time Slots */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Available Slots ({selectedDoctor?.name})
            </label>
            <div className="flex flex-wrap gap-2">
              {availableSlots.length > 0 ? (
                availableSlots.map((slot, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedTime === slot
                        ? 'bg-[#008080] text-white shadow-sm'
                        : 'bg-[#ebf1f1] text-slate-700 hover:bg-teal-100 border border-[#008080]/20'
                    }`}
                  >
                    {slot}
                  </button>
                ))
              ) : (
                <p className="text-slate-400 italic">No available slots on this day.</p>
              )}
            </div>
          </div>

          {/* Patient Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Patient Name</label>
              <input
                required
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full bg-[#ebf1f1] px-3.5 py-2.5 rounded-xl border border-[#008080]/20 focus:border-[#008080] focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                required
                type="tel"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                className="w-full bg-[#ebf1f1] px-3.5 py-2.5 rounded-xl border border-[#008080]/20 focus:border-[#008080] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Reason / Symptoms (Optional)</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Toothache, routine review, blood pressure check..."
              className="w-full bg-[#ebf1f1] px-3.5 py-2.5 rounded-xl border border-[#008080]/20 focus:border-[#008080] focus:bg-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#008080] hover:bg-[#006666] text-white font-heading font-bold text-xs rounded-xl transition-colors shadow-md flex items-center justify-center gap-1.5 mt-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>Confirm & Book Appointment</span>
          </button>
        </form>
      </div>
    </div>
  );
}
