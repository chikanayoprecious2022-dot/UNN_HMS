import React, { useState } from 'react';
import { PhoneCall, Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-heading font-bold text-slate-900">Hospital Contact & Emergency</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Reach our outpatient support, clinical administration, or 24/7 casualty dispatch.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Casualty Desk */}
        <div className="brand-card p-6 bg-rose-50 border-rose-300 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
            <PhoneCall className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">24/7 Casualty Desk</span>
          <h3 className="font-heading font-bold text-lg text-rose-950">+234 (0) 800-UNN-911</h3>
          <p className="text-xs text-rose-900 leading-relaxed">
            Emergency triage, ambulance dispatch, trauma resuscitation, and acute cardiology admissions.
          </p>
        </div>

        {/* General Outpatient */}
        <div className="brand-card p-6 bg-white space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#008080] flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#008080] block">Outpatient Desk</span>
          <h3 className="font-heading font-bold text-lg text-slate-900">+234 (0) 803 111 2233</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            General inquiries, doctor availability verification, and routine appointment assistance.
          </p>
        </div>

        {/* Administrative Office */}
        <div className="brand-card p-6 bg-white space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#008080] flex items-center justify-center font-bold">
            <Mail className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#008080] block">Official Email</span>
          <h3 className="font-heading font-bold text-lg text-slate-900">contact@unn-hms.edu</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Medical director office, student health insurance validation, and administrative records.
          </p>
        </div>
      </div>

      {/* Inquiry Form */}
      <div className="brand-card p-8 bg-white max-w-2xl mx-auto space-y-6 shadow-md">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-lg font-heading font-bold text-slate-900">Send an Inquiry or Feedback</h2>
          <p className="text-xs text-slate-500">Our patient relations team replies within 12 hours.</p>
        </div>

        {submitted ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-emerald-900 text-sm">Message Sent Successfully!</h4>
            <p className="text-xs text-emerald-800">Thank you for reaching out. We will get back to you shortly.</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. John Doe"
                  className="w-full bg-[#ebf1f1] px-3.5 py-2.5 rounded-xl text-xs border border-transparent focus:border-[#008080] focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  required
                  type="email"
                  placeholder="name@example.com"
                  className="w-full bg-[#ebf1f1] px-3.5 py-2.5 rounded-xl text-xs border border-transparent focus:border-[#008080] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Inquiry Topic</label>
              <select className="w-full bg-[#ebf1f1] px-3.5 py-2.5 rounded-xl text-xs border border-transparent focus:border-[#008080] focus:bg-white focus:outline-none">
                <option>Appointment Inquiries</option>
                <option>AI Assistant Feedback</option>
                <option>Billing & Insurance</option>
                <option>General Support</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
              <textarea
                required
                rows="3"
                placeholder="How can we assist you today?"
                className="w-full bg-[#ebf1f1] px-3.5 py-2.5 rounded-xl text-xs border border-transparent focus:border-[#008080] focus:bg-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#008080] hover:bg-[#006666] text-white font-heading font-bold text-xs rounded-xl transition-colors shadow-md flex items-center justify-center gap-1.5"
            >
              <span>Submit Message</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

