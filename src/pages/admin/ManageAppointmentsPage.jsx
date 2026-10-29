import React, { useState } from 'react';
import { db } from '../../services/db';
import { Calendar, Clock, CheckCircle2, XCircle, Search, Filter, Bot, User, Check, RefreshCw } from 'lucide-react';

export default function ManageAppointmentsPage() {
  const [appointments, setAppointments] = useState(db.getAppointments());
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastAction, setLastAction] = useState(null);

  const refreshList = () => {
    setAppointments(db.getAppointments());
  };

  const handleUpdateStatus = (appId, newStatus) => {
    const updated = db.updateAppointmentStatus(appId, newStatus);
    if (updated) {
      setLastAction(`Appointment #${appId} updated to ${newStatus.toUpperCase()}`);
      refreshList();
      setTimeout(() => setLastAction(null), 4000);
    }
  };

  const filtered = appointments.filter((app) => {
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesSource = filterSource === 'all' || app.booking_source === filterSource;
    const matchesSearch =
      (app.patient_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.doctor_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(app.appointment_id).includes(searchQuery);

    return matchesStatus && matchesSource && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#008080]">Hospital Admin Desk</span>
            <span className="text-xs font-bold bg-[#ebf1f1] text-[#008080] px-2.5 py-0.5 rounded-full">
              {appointments.length} Appointments Total
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 mt-1">
            Manage Clinical Appointments
          </h1>
          <p className="text-xs text-slate-500">
            Review incoming appointment requests, validate doctor schedules, and approve pending bookings.
          </p>
        </div>

        <button
          onClick={refreshList}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors shadow-sm self-start sm:self-center"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#008080]" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Success Notification Alert */}
      {lastAction && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{lastAction}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="brand-card p-5 bg-white space-y-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by patient name, doctor, or ID..."
              className="w-full bg-[#ebf1f1] pl-10 pr-3.5 py-2 rounded-xl text-xs border border-transparent focus:border-[#008080] focus:bg-white focus:outline-none"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#ebf1f1] px-3.5 py-2 rounded-xl text-xs border border-transparent focus:border-[#008080] focus:bg-white focus:outline-none text-slate-700 font-medium"
          >
            <option value="all">Filter by Status (All)</option>
            <option value="pending">Pending Approval</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="bg-[#ebf1f1] px-3.5 py-2 rounded-xl text-xs border border-transparent focus:border-[#008080] focus:bg-white focus:outline-none text-slate-700 font-medium"
          >
            <option value="all">Filter by Booking Source (All)</option>
            <option value="ai_assistant">AI Assistant Bookings</option>
            <option value="manual">Manual Bookings</option>
          </select>
        </div>
      </div>

      {/* Appointments Data Table */}
      <div className="brand-card bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#ebf1f1] text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-teal-100">
              <tr>
                <th className="py-3.5 px-4">ID & Date</th>
                <th className="py-3.5 px-4">Patient</th>
                <th className="py-3.5 px-4">Doctor & Dept</th>
                <th className="py-3.5 px-4">Channel</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length > 0 ? (
                filtered.map((app) => (
                  <tr key={app.appointment_id} className="hover:bg-slate-50/80 transition-colors">
                    {/* ID & Date */}
                    <td className="py-4 px-4">
                      <span className="font-mono font-bold text-slate-900 block">#{app.appointment_id}</span>
                      <span className="text-slate-500">{app.appointment_date}</span>
                      <span className="text-[#008080] font-semibold block text-[11px]">{app.appointment_time}</span>
                    </td>

                    {/* Patient */}
                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-900 block">{app.patient_name || 'Sara Cole'}</span>
                      <span className="text-slate-400 text-[11px] line-clamp-1">{app.reason}</span>
                    </td>

                    {/* Doctor & Dept */}
                    <td className="py-4 px-4">
                      <span className="font-semibold text-slate-900 block">{app.doctor_name}</span>
                      <span className="text-xs text-[#008080] font-medium">{app.department_name}</span>
                    </td>

                    {/* Channel */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-full border ${
                          app.booking_source === 'ai_assistant'
                            ? 'bg-teal-50 text-[#008080] border-teal-200 font-bold'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {app.booking_source === 'ai_assistant' ? '🤖 AI Assistant' : '👤 Manual'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                          app.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 animate-pulse font-extrabold'
                            : app.status === 'completed'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>

                    {/* Actions per idea.md Section 15 */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {app.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(app.appointment_id, 'confirmed')}
                            className="px-3 py-1.5 bg-[#008080] hover:bg-[#006666] text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                            title="Confirm appointment (Defense Step 16)"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Confirm</span>
                          </button>
                        )}
                        {app.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(app.appointment_id, 'completed')}
                            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold transition-colors border border-emerald-200"
                          >
                            Complete
                          </button>
                        )}
                        {app.status !== 'cancelled' && (
                          <button
                            onClick={() => handleUpdateStatus(app.appointment_id, 'cancelled')}
                            className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold transition-colors border border-rose-200"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-slate-400 italic">
                    No appointments match your search criteria.
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

