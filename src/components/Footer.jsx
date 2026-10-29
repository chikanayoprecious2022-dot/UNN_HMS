import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Bot, PhoneCall, ShieldCheck, MapPin, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-10 border-t-4 border-[#008080]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#008080] flex items-center justify-center text-white font-bold">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <span className="font-heading text-xl font-bold tracking-tight text-white">UNN HMS</span>
                <p className="text-xs text-teal-400 font-medium">University Hospital Management System</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Delivering patient-first medical excellence through integrated intelligent triage and seamless clinical
              scheduling. AI-assisted symptom guidance paired with verified hospital doctors.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-[#008080]" />
              <span>Registered Clinical Health System — University Teaching Hospital</span>
            </div>
          </div>

          {/* Emergency Hotline Alert Box */}
          <div>
            <h4 className="text-white font-heading font-semibold text-sm mb-4 uppercase tracking-wider">
              Emergency & Triage
            </h4>
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/40 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>24/7 Casualty Desk</span>
              </div>
              <p className="text-white font-bold text-lg tracking-wide">+234 (0) 800-UNN-911</p>
              <p className="text-[11px] text-slate-400 leading-tight">
                For severe chest pain, breathing trauma, or acute injury, proceed immediately to the Emergency Ward.
              </p>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-white font-heading font-semibold text-sm mb-4 uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-[#008080] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/departments" className="hover:text-[#008080] transition-colors">
                  Clinical Departments
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="hover:text-[#008080] transition-colors">
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link to="/book" className="hover:text-[#008080] transition-colors">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link to="/ai-assistant" className="text-teal-400 hover:text-white flex items-center gap-1.5 font-medium">
                  <Bot className="w-3.5 h-3.5" />
                  <span>UNN AI Assistant</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Hospital Address & Hours */}
          <div>
            <h4 className="text-white font-heading font-semibold text-sm mb-4 uppercase tracking-wider">Contact & Hours</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#008080] shrink-0 mt-0.5" />
                <span>University Medical Center, Main Campus, UNN</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#008080] shrink-0" />
                <span>appointments@unn-hms.edu</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#008080] shrink-0 mt-0.5" />
                <span>Outpatient Clinics: Mon – Sat (8:00 AM – 6:00 PM)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer per idea.md Rule */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} UNN HMS. All rights reserved. Hospital Appointment & Resource Management.
          </p>
          <p className="max-w-xl text-center md:text-right text-[11px] text-slate-500">
            <strong>Medical Disclaimer:</strong> The UNN AI Assistant provides preliminary department recommendations
            based on reported symptoms and is not a substitute for diagnostic medical evaluation or prescriptions.
          </p>
        </div>
      </div>
    </footer>
  );
}

