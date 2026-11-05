import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  Calendar,
  Clock,
  Bot,
  User,
  LogOut,
  Loader2,
} from 'lucide-react';

export default function DashboardPage({ currentUser, onLogout }) {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const refreshList = useCallback(async () => {
    try {
      const data = await api.getAppointments();
      if (data.success && data.appointments) {
        setAppointments(data.appointments);
      }
    } catch (err) {
      console.warn('Could not fetch appointments from DB:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await api.updateAppointmentStatus(id, 'cancelled');
        refreshList();
      } catch (err) {
        console.warn('Could not cancel appointment:', err.message);
      }
    }
  };

  // If user is not logged in, show access prompt
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#ebf1f1] border border-[#008080]/20 text-[#008080] flex items-center justify-center mx-auto shadow-sm">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-heading font-bold text-slate-900">Patient Dashboard</h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            Please sign in or register an account to view your appointment history and manage bookings.
          </p>
        </div>
        <div className="flex gap-3 justify-center pt-2">
          <Link
            to="/auth?mode=login"
            className="px-5 py-2.5 bg-white border border-[#008080] text-[#008080] hover:bg-[#ebf1f1] text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            Sign In
          </Link>
          <Link
            to="/auth?mode=register"
            className="px-5 py-2.5 bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  // Filter appointments for the current user
  const userAppointments = appointments.filter((app) => {
    if (currentUser?.user_id && app.patient_id === currentUser.user_id) return true;
    if (currentUser?.name && app.patient_name === currentUser.name) return true;
    return currentUser?.user_id === 1;
  });

  const pendingAppointments = userAppointments.filter((a) => a.status === 'pending');
  const confirmedAppointments = userAppointments.filter((a) => a.status === 'confirmed');

  const filtered = userAppointments.filter((app) => {
    if (statusFilter === 'all') return true;
    return app.status === statusFilter;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-6">

      {/* ── Welcome Banner ── */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#008080]/20 shadow-sm space-y-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ebf1f1] text-[#008080] text-[10px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#008080]"></span>
            <span>Patient Portal</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-heading font-bold text-slate-900 break-all sm:break-words">
            Welcome, {currentUser.name}!
          </h1>
          <p className="text-xs text-slate-500">
            Manage appointments, check doctor availability, or consult UNN AI.
          </p>
        </div>

        {/* Action buttons — always wrap on mobile */}
        <div className="flex flex-wrap gap-2">
          <Link
            to="/doctors"
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold rounded-xl shadow-xs transition-all"
          >
            <Calendar className="w-4 h-4 text-emerald-200 shrink-0" />
            <span>Browse Doctors &amp; Book</span>
          </Link>
          <Link
            to="/ai-assistant"
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#ebf1f1] hover:bg-teal-100 text-[#008080] border border-[#008080]/30 text-xs font-bold rounded-xl transition-all"
          >
            <Bot className="w-4 h-4 shrink-0" />
            <span>Ask AI Assistant</span>
          </Link>
          <button
            onClick={() => { if (onLogout) onLogout(); navigate('/'); }}
            className="inline-flex items-center gap-1 px-3 py-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-xs font-semibold"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* ── Metrics Strip ── */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="bg-white p-3 sm:p-5 rounded-2xl border border-[#008080]/15 shadow-xs space-y-0.5 sm:space-y-1">
          <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending</span>
          <p className="text-xl sm:text-2xl font-bold font-heading text-amber-600">{pendingAppointments.length}</p>
          <p className="text-[10px] sm:text-[11px] text-slate-500 hidden sm:block">Awaiting review</p>
        </div>
        <div className="bg-white p-3 sm:p-5 rounded-2xl border border-[#008080]/15 shadow-xs space-y-0.5 sm:space-y-1">
          <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Confirmed</span>
          <p className="text-xl sm:text-2xl font-bold font-heading text-emerald-600">{confirmedAppointments.length}</p>
          <p className="text-[10px] sm:text-[11px] text-slate-500 hidden sm:block">Scheduled visits</p>
        </div>
        <div className="bg-white p-3 sm:p-5 rounded-2xl border border-[#008080]/15 shadow-xs space-y-0.5 sm:space-y-1">
          <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total</span>
          <p className="text-xl sm:text-2xl font-bold font-heading text-[#008080]">{userAppointments.length}</p>
          <p className="text-[10px] sm:text-[11px] text-slate-500 hidden sm:block">All bookings</p>
        </div>
      </div>

      {/* ── My Appointments ── */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#008080]/20 shadow-sm space-y-4 sm:space-y-6">
        <div className="flex flex-col gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-heading font-bold text-slate-900">My Appointments</h2>
            <p className="text-xs text-slate-500">
              Booked manually through doctors or via the UNN AI Assistant.
            </p>
          </div>

          {/* Filter Tabs — always wrap */}
          <div className="flex flex-wrap gap-1.5">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                  statusFilter === tab
                    ? 'bg-[#008080] text-white shadow-xs'
                    : 'bg-[#ebf1f1] text-slate-600 hover:text-[#008080]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Appointments list */}
        <div className="space-y-3 sm:space-y-3.5">
          {loading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-[#008080]">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-xs font-semibold">Loading appointments...</span>
            </div>
          ) : filtered.length > 0 ? (
            filtered.map((app) => (
              <div
                key={app.appointment_id}
                className="p-4 rounded-xl border border-[#008080]/15 hover:border-[#008080]/40 bg-[#ebf1f1]/40 space-y-3 transition-all"
              >
                {/* Top row: status + ID */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-slate-400">#{app.appointment_id}</span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      app.status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : app.status === 'completed'
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {app.status}
                  </span>
                  <span className="text-[10px] bg-white border border-[#008080]/20 text-[#008080] px-2 py-0.5 rounded font-semibold">
                    {app.booking_source === 'ai_assistant' ? '🤖 AI' : '👤 Manual'}
                  </span>
                </div>

                {/* Doctor + department */}
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900">{app.doctor_name}</h3>
                  <p className="text-xs text-[#008080] font-semibold">{app.department_name} Department</p>
                  <p className="text-xs text-slate-500 mt-0.5">{app.reason}</p>
                </div>

                {/* Date/time + cancel — bottom row */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
                  <div className="text-xs space-y-0.5">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <Calendar className="w-3.5 h-3.5 text-[#008080] shrink-0" />
                      <span>{app.appointment_date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#008080] font-semibold">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>{app.appointment_time}</span>
                    </div>
                  </div>

                  {app.status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancel(app.appointment_id)}
                      className="text-xs text-rose-600 hover:text-rose-800 font-semibold underline shrink-0"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 sm:py-12 space-y-3 bg-[#ebf1f1]/30 rounded-xl border border-dashed border-[#008080]/20">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-700">No appointments found</p>
                <p className="text-xs text-slate-400">
                  Browse doctors to book an appointment or ask the UNN AI Assistant.
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-2 flex-wrap">
                <Link
                  to="/doctors"
                  className="px-4 py-2 bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold rounded-lg"
                >
                  Browse Doctors
                </Link>
                <Link
                  to="/ai-assistant"
                  className="px-4 py-2 bg-white border border-[#008080] text-[#008080] text-xs font-bold rounded-lg"
                >
                  Ask UNN AI
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
