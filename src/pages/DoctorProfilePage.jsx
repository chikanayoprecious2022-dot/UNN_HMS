import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import { aiEngine } from '../services/aiEngine';
import { Bot, Calendar, Clock, Award, DollarSign, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function DoctorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const doctor = db.getDoctorById(id) || db.getDoctors()[1]; // fallback to Dr. Layla Karim
  const dept = db.getDepartmentById(doctor.department_id);

  // Dynamic slots for 2026-11-23
  const [selectedDate, setSelectedDate] = useState('2026-11-23');
  const availableSlots = db.getAvailableSlots(doctor.doctor_id, selectedDate);

  // Embedded AI Check state
  const [symptomPrompt, setSymptomPrompt] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAiCheck = (e) => {
    e.preventDefault();
    if (!symptomPrompt.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const rec = aiEngine.recommendDepartment(symptomPrompt);
      const isSuitable = rec.departmentId === doctor.department_id;
      setAiAnalysis({
        ...rec,
        isSuitable,
      });
      setIsAnalyzing(false);
    }, 400);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Doctor Card Overview per idea.md Section 6 */}
      <div className="brand-card overflow-hidden bg-white shadow-md">
        <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-start">
          <img
            src={doctor.avatar_url}
            alt={doctor.name}
            className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl object-cover border-4 border-teal-50 shadow-md shrink-0"
          />

          <div className="flex-1 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-[#008080] text-xs font-bold uppercase tracking-wider">
              <span>{dept?.name}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900">{doctor.name}</h1>
            <p className="text-sm text-slate-600 font-medium">{doctor.specialization}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-[#ebf1f1] p-3 rounded-xl">
                <span className="text-[11px] text-slate-500 uppercase font-semibold block">Experience</span>
                <span className="font-bold text-slate-900 text-sm">{doctor.experience_years} Years</span>
              </div>
              <div className="bg-[#ebf1f1] p-3 rounded-xl">
                <span className="text-[11px] text-slate-500 uppercase font-semibold block">Consultation Fee</span>
                <span className="font-bold text-[#008080] text-sm">${doctor.consultation_fee} USD</span>
              </div>
              <div className="bg-[#ebf1f1] p-3 rounded-xl col-span-2 sm:col-span-1">
                <span className="text-[11px] text-slate-500 uppercase font-semibold block">Clinic Schedule</span>
                <span className="font-bold text-slate-900 text-xs">{doctor.available_days.join(', ')}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">{doctor.bio}</p>
          </div>
        </div>

        {/* Real Available Slots Section per idea.md */}
        <div className="bg-slate-50 p-6 sm:p-8 border-t border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">Available Slots for Booking</h3>
              <p className="text-xs text-slate-500">Live hospital availability source of truth.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Select Date:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-white px-3 py-1.5 rounded-lg text-xs border border-slate-300 font-medium text-slate-700"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {availableSlots.length > 0 ? (
              availableSlots.map((slot, idx) => (
                <Link
                  key={idx}
                  to={`/book?doctorId=${doctor.doctor_id}&date=${selectedDate}&time=${encodeURIComponent(slot)}`}
                  className="px-4 py-2 bg-white hover:bg-[#008080] text-slate-800 hover:text-white border border-teal-200 hover:border-transparent rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{slot}</span>
                </Link>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No slots available for this doctor on {selectedDate}.</p>
            )}
          </div>

          <div className="pt-2">
            <Link
              to={`/book?doctorId=${doctor.doctor_id}&date=${selectedDate}`}
              className="inline-flex items-center gap-2 bg-[#008080] hover:bg-[#006666] text-white px-6 py-3 rounded-xl font-heading font-bold text-sm shadow-md transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment with {doctor.name}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Embedded AI Section per idea.md Section 6 */}
      <div className="brand-card p-6 sm:p-8 bg-gradient-to-br from-white to-teal-50/40 border-2 border-teal-300/80 shadow-md">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#008080] text-white flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6 text-emerald-300" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="font-heading font-bold text-lg text-slate-900">
              Not sure if this doctor is right for you?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Describe your symptoms and UNN AI will check whether this department ({dept?.name}) is suitable or suggest
              other options.
            </p>

            {/* Symptom Input Check */}
            <form onSubmit={handleAiCheck} className="mt-4 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={symptomPrompt}
                onChange={(e) => setSymptomPrompt(e.target.value)}
                placeholder="e.g. 'I have tooth pain and swollen gums' or 'chest pain'..."
                className="flex-1 bg-white px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-teal-200 focus:outline-none focus:ring-2 focus:ring-[#008080]"
              />
              <button
                type="submit"
                disabled={isAnalyzing || !symptomPrompt.trim()}
                className="bg-[#008080] hover:bg-[#006666] text-white font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-sm shrink-0"
              >
                {isAnalyzing ? 'Analyzing...' : 'Ask AI Before Booking'}
              </button>
            </form>

            {/* Analysis Result Display */}
            {aiAnalysis && (
              <div className="mt-4 pt-4 border-t border-teal-100 animate-fadeIn">
                {aiAnalysis.emergencyDetected ? (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs space-y-2">
                    <div className="flex items-center gap-2 font-bold text-rose-700">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>EMERGENCY WARNING</span>
                    </div>
                    <p className="font-semibold">{aiAnalysis.message}</p>
                    <p className="text-[11px] text-rose-800">
                      Routine outpatient booking for {doctor.name} is blocked for your safety.
                    </p>
                  </div>
                ) : aiAnalysis.isSuitable ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs space-y-2">
                    <div className="flex items-center gap-2 font-bold text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Match Confirmed: {dept?.name} is suitable!</span>
                    </div>
                    <p>{aiAnalysis.message} {doctor.name} specializes in this area.</p>
                    <Link
                      to={`/book?doctorId=${doctor.doctor_id}&date=${selectedDate}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008080] underline pt-1"
                    >
                      <span>Proceed with {doctor.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-2">
                    <div className="flex items-center gap-2 font-bold text-amber-800">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>Department Mismatch: Recommended {aiAnalysis.departmentName}</span>
                    </div>
                    <p>
                      Your symptoms appear to correspond to <strong>{aiAnalysis.departmentName}</strong> rather than{' '}
                      <strong>{dept?.name}</strong>.
                    </p>
                    <Link
                      to={`/doctors?dept=${aiAnalysis.departmentId}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008080] underline pt-1"
                    >
                      <span>Browse specialists in {aiAnalysis.departmentName}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

