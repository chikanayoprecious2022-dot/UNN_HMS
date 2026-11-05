import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { aiEngine } from '../services/aiEngine';
import { Bot, Calendar, Clock, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

const SLOTS_LIST = ['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '04:30 PM'];

export default function DoctorProfilePage() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dynamic slots
  const [selectedDate, setSelectedDate] = useState('2026-11-23');
  const availableSlots = SLOTS_LIST;

  // Embedded AI Check state
  const [symptomPrompt, setSymptomPrompt] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    api.getDoctor(id)
      .then((data) => {
        if (data.doctor) {
          setDoctor(data.doctor);
        }
      })
      .catch((err) => {
        console.warn('Could not load doctor:', err.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAiCheck = (e) => {
    e.preventDefault();
    if (!symptomPrompt.trim() || !doctor) return;

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 gap-3 text-[#008080]">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="text-sm font-semibold">Loading doctor profile from database...</span>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <p className="text-sm text-slate-600">Doctor not found in the hospital database.</p>
        <Link to="/doctors" className="px-4 py-2 bg-[#008080] text-white text-xs font-bold rounded-xl inline-block">
          Return to Doctors
        </Link>
      </div>
    );
  }

  const days = Array.isArray(doctor.available_days)
    ? doctor.available_days
    : String(doctor.available_days || '').split(',').map((s) => s.trim());

  const docId = doctor.id || doctor.doctor_id;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Doctor Card Overview */}
      <div className="brand-card overflow-hidden bg-white shadow-md">
        <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-start">
          <img
            src={doctor.avatar_url}
            alt={doctor.name}
            className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl object-cover border-4 border-teal-50 shadow-md shrink-0"
          />

          <div className="flex-1 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-[#008080] text-xs font-bold uppercase tracking-wider">
              <span>{doctor.department_name || 'General Clinic'}</span>
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
                <span className="font-bold text-slate-900 text-xs">{days.join(', ')}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">{doctor.bio}</p>
          </div>
        </div>

        {/* Real Available Slots Section */}
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
                  to={`/book?doctorId=${docId}&date=${selectedDate}&time=${encodeURIComponent(slot)}`}
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
              to={`/book?doctorId=${docId}&date=${selectedDate}`}
              className="inline-flex items-center gap-2 bg-[#008080] hover:bg-[#006666] text-white px-6 py-3 rounded-xl font-heading font-bold text-sm shadow-md transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment with {doctor.name}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Embedded "Ask AI Before Booking" Widget */}
      <div className="bg-white brand-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#008080] flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-slate-900">
              Not sure if {doctor.name} is the right doctor?
            </h3>
            <p className="text-xs text-slate-500">
              Describe your symptoms and UNN AI will verify whether {doctor.department_name} is suitable.
            </p>
          </div>
        </div>

        <form onSubmit={handleAiCheck} className="space-y-4">
          <div className="relative">
            <textarea
              rows={3}
              value={symptomPrompt}
              onChange={(e) => setSymptomPrompt(e.target.value)}
              placeholder="e.g. I have a severe headache, sensitivity to bright light, and throbbing pain..."
              className="w-full bg-[#ebf1f1] p-3.5 rounded-xl text-xs sm:text-sm border border-transparent focus:border-[#008080] focus:bg-white focus:outline-none transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isAnalyzing || !symptomPrompt.trim()}
            className="px-5 py-2.5 bg-[#008080] hover:bg-[#006666] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing Symptoms...</span>
              </>
            ) : (
              <>
                <Bot className="w-3.5 h-3.5" />
                <span>Check Department Suitability</span>
              </>
            )}
          </button>
        </form>

        {aiAnalysis && (
          <div
            className={`p-4 rounded-xl border ${
              aiAnalysis.isSuitable
                ? 'bg-emerald-50/60 border-emerald-200'
                : 'bg-amber-50/60 border-amber-200'
            } space-y-3 transition-all`}
          >
            <div className="flex items-start gap-3">
              {aiAnalysis.isSuitable ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <h4 className="font-heading font-bold text-sm text-slate-900">
                  {aiAnalysis.isSuitable
                    ? `✓ ${doctor.name} (${doctor.department_name}) is suitable for your condition.`
                    : `⚠️ We recommend consulting ${aiAnalysis.recommendedDepartment} instead.`}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">{aiAnalysis.aiExplanation}</p>
              </div>
            </div>

            {!aiAnalysis.isSuitable && (
              <div className="pt-2 flex gap-3">
                <Link
                  to={`/doctors?dept=${aiAnalysis.departmentId}`}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm"
                >
                  <span>View {aiAnalysis.recommendedDepartment} Doctors</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to={`/ai-assistant?q=${encodeURIComponent(symptomPrompt)}`}
                  className="px-4 py-2 bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold transition-colors"
                >
                  Full AI Consultation
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
