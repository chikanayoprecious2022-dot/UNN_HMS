import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import { Bot, Calendar, ArrowRight, Clock, Award, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const [symptomInput, setSymptomInput] = useState('');
  const navigate = useNavigate();
  const doctors = db.getDoctors().slice(0, 4);

  const handleStartAi = (prompt) => {
    const q = prompt || symptomInput;
    if (q.trim()) {
      navigate(`/ai-assistant?q=${encodeURIComponent(q)}`);
    } else {
      navigate('/ai-assistant');
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white via-white to-[#ebf1f1] border-b border-[#008080]/15 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ebf1f1] text-[#008080] text-xs font-bold uppercase tracking-wider border border-[#008080]/20">
            <span>UNN Hospital Appointment System</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Book Hospital Appointments with Ease
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Browse our verified hospital doctors or describe your symptoms to the UNN AI Assistant to find the right department instantly.
          </p>

          {/* Core Dual Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/book"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border-2 border-[#008080] text-[#008080] font-heading font-bold text-xs sm:text-sm hover:bg-[#ebf1f1] transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#008080]" />
              <span>Book Appointment Manually</span>
            </Link>

            <Link
              to="/ai-assistant"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#008080] text-white font-heading font-bold text-xs sm:text-sm hover:bg-[#006666] transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Bot className="w-4 h-4 text-emerald-200" />
              <span>Ask UNN AI Assistant</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick AI Search Box */}
          <div className="mt-8 max-w-xl mx-auto bg-white p-4 rounded-2xl border border-[#008080]/20 shadow-md space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStartAi()}
                placeholder="Describe your symptoms (e.g. tooth pain, skin rash)..."
                className="flex-1 bg-[#ebf1f1] px-3.5 py-2.5 rounded-xl text-xs border border-transparent focus:border-[#008080] focus:bg-white focus:outline-none"
              />
              <button
                onClick={() => handleStartAi()}
                className="px-4 py-2.5 bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold rounded-xl shrink-0"
              >
                Ask AI
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
              <span className="text-slate-400 font-semibold">Try:</span>
              {['I have tooth pain and swollen gums', 'Skin rash on my arms', 'Need cardiologist'].map((ex, i) => (
                <button
                  key={i}
                  onClick={() => handleStartAi(ex)}
                  className="bg-[#ebf1f1] hover:bg-[#008080] text-slate-700 hover:text-white px-2.5 py-1 rounded-lg transition-colors"
                >
                  "{ex}"
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="max-w-5xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-slate-900">Hospital Specialists</h2>
            <p className="text-xs text-slate-500">Board-certified doctors available for appointment booking.</p>
          </div>
          <Link to="/doctors" className="text-xs font-bold text-[#008080] hover:underline flex items-center gap-1">
            <span>View All Doctors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {doctors.map((doc) => {
            const dept = db.getDepartmentById(doc.department_id);
            return (
              <div
                key={doc.doctor_id}
                className="bg-white p-4 rounded-xl border border-[#008080]/20 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <img
                    src={doc.avatar_url}
                    alt={doc.name}
                    className="w-full h-32 object-cover rounded-lg border border-[#008080]/15"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#008080]">{dept?.name}</span>
                    <h3 className="font-heading font-bold text-sm text-slate-900">{doc.name}</h3>
                    <p className="text-[11px] text-slate-500">${doc.consultation_fee} / consultation</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex gap-2">
                  <Link
                    to={`/book?doctorId=${doc.doctor_id}`}
                    className="flex-1 py-1.5 text-center bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Book
                  </Link>
                  <Link
                    to={`/ai-assistant?symptoms=${encodeURIComponent(doc.specialization)}`}
                    className="px-2.5 py-1.5 text-center bg-[#ebf1f1] text-[#008080] text-xs font-semibold rounded-lg hover:bg-teal-100 transition-colors"
                    title="Consult AI about this doctor"
                  >
                    Ask AI
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
