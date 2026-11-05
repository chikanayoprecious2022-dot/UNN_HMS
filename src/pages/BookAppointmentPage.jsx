import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api, session } from '../services/api';
import { Bot, CheckCircle2, Loader2 } from 'lucide-react';

const SLOTS = ['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '04:30 PM'];

export default function BookAppointmentPage({ currentUser, onUserLogin }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialDoctorId = searchParams.get('doctorId') || '';
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(initialDoctorId);
  const [selectedDate, setSelectedDate] = useState('2026-11-23');
  const [selectedTime, setSelectedTime] = useState('04:00 PM');
  const [reason, setReason] = useState('');
  const [patientName, setPatientName] = useState(currentUser?.name || '');
  const [patientPhone, setPatientPhone] = useState(currentUser?.phone || '');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.getDoctors()
      .then((data) => {
        if (data.doctors && data.doctors.length > 0) {
          setDoctors(data.doctors);
          if (!selectedDoctorId) {
            setSelectedDoctorId(String(data.doctors[0].id || data.doctors[0].doctor_id));
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedDoctorId]);

  const selectedDoctor =
    doctors.find((d) => String(d.id || d.doctor_id) === String(selectedDoctorId)) || doctors[0];

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedDoctor) return;

    setSubmitting(true);

    let patient = currentUser;
    if (!patient) {
      patient = {
        user_id: Date.now(),
        name: patientName || 'Patient',
        email: 'patient@unn.edu',
        phone: patientPhone || '+234 803 123 4567',
        role: 'patient',
      };
      session.set(patient);
      if (onUserLogin) onUserLogin(patient);
    }

    try {
      await api.bookAppointment({
        patient_id: patient.user_id || patient.id,
        patient_name: patient.name,
        doctor_id: selectedDoctor.id || selectedDoctor.doctor_id,
        doctor_name: selectedDoctor.name,
        department_id: selectedDoctor.department_id,
        department_name: selectedDoctor.department_name,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        reason: reason || 'Routine clinical consultation',
        booking_source: 'manual',
      });

      navigate('/dashboard');
    } catch (err) {
      console.error('Error booking appointment in DB:', err);
      navigate('/dashboard');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3 text-[#008080]">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="text-sm font-semibold">Loading doctors from database...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      {/* AI Assistant Banner */}
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

      {/* Main Manual Booking Form */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#008080]/20 shadow-md space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-slate-900">Book an Appointment</h1>
          <p className="text-xs text-slate-500">
            Select your preferred doctor, date, and open time slot to book your appointment.
          </p>
        </div>

        <form onSubmit={handleBook} className="space-y-4 text-xs">
          {/* Doctor Selection */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Doctor</label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="w-full bg-[#ebf1f1] px-3.5 py-2.5 rounded-xl border border-transparent focus:border-[#008080] focus:bg-white focus:outline-none font-medium"
            >
              {doctors.map((d) => (
                <option key={d.id || d.doctor_id} value={d.id || d.doctor_id}>
                  {d.name} — {d.department_name} (${d.consultation_fee})
                </option>
              ))}
            </select>
          </div>

          {/* Selected Doctor Summary Card */}
          {selectedDoctor && (
            <div className="bg-[#ebf1f1] p-3.5 rounded-xl flex items-center gap-3">
              <img
                src={selectedDoctor.avatar_url}
                alt={selectedDoctor.name}
                className="w-12 h-12 rounded-lg object-cover border border-[#008080]/20"
              />
              <div className="flex-1">
                <span className="text-[10px] font-bold text-[#008080] uppercase">
                  {selectedDoctor.department_name}
                </span>
                <p className="font-bold text-slate-900 text-xs">{selectedDoctor.name}</p>
                <p className="text-[11px] text-slate-500">{selectedDoctor.specialization}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Fee</span>
                <span className="font-bold text-[#008080]">${selectedDoctor.consultation_fee}</span>
              </div>
            </div>
          )}

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Appointment Date</label>
              <input
                type="date"
                required
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-[#ebf1f1] px-3.5 py-2 rounded-xl border border-transparent focus:border-[#008080] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Preferred Time Slot</label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full bg-[#ebf1f1] px-3.5 py-2.5 rounded-xl border border-transparent focus:border-[#008080] focus:bg-white focus:outline-none font-medium"
              >
                {SLOTS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Patient Details */}
          {!currentUser && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Sara Cole"
                  className="w-full bg-[#ebf1f1] px-3.5 py-2 rounded-xl border border-transparent focus:border-[#008080] focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="+234 803 123 4567"
                  className="w-full bg-[#ebf1f1] px-3.5 py-2 rounded-xl border border-transparent focus:border-[#008080] focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Reason for Visit / Symptoms</label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Routine dental cleaning, tooth ache, blood pressure follow-up..."
              className="w-full bg-[#ebf1f1] p-3 rounded-xl border border-transparent focus:border-[#008080] focus:bg-white focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#008080] hover:bg-[#006666] disabled:opacity-60 text-white font-heading font-bold text-xs rounded-xl transition-colors shadow-md flex items-center justify-center gap-1.5"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Booking to Database...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Save Appointment</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
