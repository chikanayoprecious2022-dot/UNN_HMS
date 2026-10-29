import React from 'react';
import { db } from '../../services/db';
import { Bot, AlertTriangle, CheckCircle2, TrendingUp, ShieldCheck, Clock, ArrowRight } from 'lucide-react';

export default function AiReportsPage() {
  const recommendations = db.getAiRecommendations();
  const totalQueries = recommendations.length;
  const emergencies = recommendations.filter((r) => r.emergency_detected === 1).length;
  const converted = recommendations.filter((r) => r.converted_to_booking === 1).length;
  const conversionRate = totalQueries > 0 ? Math.round((converted / totalQueries) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#008080]">Hospital Analytics</span>
          <span className="text-xs font-bold bg-teal-50 text-[#008080] px-2.5 py-0.5 rounded-full border border-teal-200">
            Audit Log (idea.md Section 13)
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 mt-1">
          AI Recommendations & Triage Report
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Transparent monitoring of symptom triage requests, emergency safeguards, and conversion to clinical bookings.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="brand-card p-6 bg-white space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total AI Consultations</span>
          <p className="text-3xl font-bold font-heading text-slate-900">{totalQueries}</p>
          <p className="text-[11px] text-slate-500">Symptom evaluation queries</p>
        </div>

        <div className="brand-card p-6 bg-white space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase">Converted to Booking</span>
          <p className="text-3xl font-bold font-heading text-[#008080]">{converted}</p>
          <p className="text-[11px] text-slate-500">Scheduled clinical appointments</p>
        </div>

        <div className="brand-card p-6 bg-white space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase">Conversion Efficiency</span>
          <p className="text-3xl font-bold font-heading text-emerald-600">{conversionRate}%</p>
          <p className="text-[11px] text-slate-500">From symptom to booked slot</p>
        </div>

        <div className="brand-card p-6 bg-white space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase">Emergency Interceptions</span>
          <p className="text-3xl font-bold font-heading text-rose-600">{emergencies}</p>
          <p className="text-[11px] text-slate-500">Routine booking prevented</p>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="brand-card bg-white overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-heading font-bold text-base text-slate-900">Clinical Triage Audit Trail</h2>
          <span className="text-xs text-slate-500">Direct SQL Schema Mirror</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#ebf1f1] text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Rec ID</th>
                <th className="py-3 px-4">Patient Reported Symptoms</th>
                <th className="py-3 px-4">Recommended Dept</th>
                <th className="py-3 px-4">Urgency</th>
                <th className="py-3 px-4">Emergency</th>
                <th className="py-3 px-4">Converted</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recommendations.length > 0 ? (
                recommendations.map((rec) => (
                  <tr key={rec.recommendation_id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">#{rec.recommendation_id}</td>
                    <td className="py-3.5 px-4 font-medium max-w-xs truncate" title={rec.symptoms_text}>
                      "{rec.symptoms_text}"
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#008080]">{rec.department_name}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          rec.urgency_level === 'emergency'
                            ? 'bg-rose-100 text-rose-800'
                            : rec.urgency_level === 'urgent'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-teal-100 text-[#008080]'
                        }`}
                      >
                        {rec.urgency_level}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {rec.emergency_detected ? (
                        <span className="inline-flex items-center gap-1 font-bold text-rose-600">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>YES (Blocked)</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">No</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {rec.converted_to_booking ? (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Booked</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">Triaged Only</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400 text-[11px]">
                      {new Date(rec.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-slate-400 italic">
                    No AI triage queries recorded yet. Try asking the UNN AI Assistant on the home or assistant page.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

