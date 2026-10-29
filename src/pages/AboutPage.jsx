import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Award, Users, Stethoscope, Building, Bot, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#008080] bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          About University Hospital
        </span>
        <h1 className="text-3xl sm:text-5xl font-heading font-bold text-slate-900 leading-tight">
          Pioneering AI-Augmented Clinical Excellence
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          UNN HMS is an integrated hospital administration and patient appointment platform developed to harmonize
          cutting-edge artificial intelligence with compassionate medical practice.
        </p>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="brand-card p-6 bg-white space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#008080] flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-lg text-slate-900">Safety-First AI Guardrails</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Our assistant never prescribes drugs or invents diagnosis. It triages symptoms, intercepts medical
            emergencies, and routes patients to the appropriate clinical department.
          </p>
        </div>

        <div className="brand-card p-6 bg-white space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#008080] flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-lg text-slate-900">Dual Equal Booking Paths</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Patients who know their doctor enjoy straightforward manual scheduling, while unsure patients benefit from
            natural-language conversational triage.
          </p>
        </div>

        <div className="brand-card p-6 bg-white space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#008080] flex items-center justify-center font-bold">
            <Building className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-lg text-slate-900">Real-Time Hospital Truth</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            All appointment queries are backed by real database records, preventing double bookings, phantom slots, and
            scheduling conflicts.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="brand-card p-8 bg-gradient-to-r from-[#008080] to-[#005555] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <h2 className="text-xl font-heading font-bold text-white">Experience UNN HMS in Action</h2>
          <p className="text-xs text-teal-100">Try our AI symptom assistant or book a verified clinical doctor.</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/ai-assistant"
            className="px-5 py-2.5 bg-white text-[#008080] font-bold text-xs rounded-xl hover:bg-teal-50 transition-colors shadow-sm"
          >
            Ask UNN AI
          </Link>
          <Link
            to="/book"
            className="px-5 py-2.5 bg-black/20 text-white font-bold text-xs rounded-xl hover:bg-black/30 border border-white/20 transition-colors"
          >
            Book Appointment
          </Link>
        </div>
      </div>
    </div>
  );
}

