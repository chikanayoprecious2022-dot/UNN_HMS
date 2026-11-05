import { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  Plus,
  Check,
  Trash2,
  Upload,
  CheckCircle2,
  RefreshCw,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { api } from '../services/api';

const DEPARTMENTS = [
  { department_id: 1, name: 'Cardiology' },
  { department_id: 2, name: 'Dental' },
  { department_id: 3, name: 'Pediatrics' },
  { department_id: 4, name: 'Dermatology' },
  { department_id: 5, name: 'General Medicine' },
  { department_id: 6, name: 'Orthopedics' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('doctors');

  // Doctors State
  const [doctors, setDoctors] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [title, setTitle] = useState('Consultant Specialist');
  const [departmentId, setDepartmentId] = useState(1);
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('7');
  const [fee, setFee] = useState('30');
  const [availableDays, setAvailableDays] = useState('Monday, Wednesday, Friday');
  const [bio, setBio] = useState('');

  // Appointments State
  const [appointments, setAppointments] = useState([]);
  const [notification, setNotification] = useState(null);

  const departments = DEPARTMENTS;

  const fetchDoctors = async () => {
    try {
      const data = await api.getDoctors();
      if (data.success && data.doctors) setDoctors(data.doctors);
    } catch (err) {
      console.warn('Failed to fetch doctors:', err.message);
    }
  };

  const fetchAppointments = async () => {
    try {
      const data = await api.getAppointments();
      if (data.success && data.appointments) setAppointments(data.appointments);
    } catch (err) {
      console.warn('Failed to fetch appointments:', err.message);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    const selectedDept = departments.find((d) => d.department_id === Number(departmentId));

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('title', title);
      formData.append('department_id', departmentId);
      formData.append('department_name', selectedDept?.name || 'General');
      formData.append('specialization', specialization || 'General Medicine');
      formData.append('experience_years', experience);
      formData.append('consultation_fee', fee);
      formData.append('available_days', availableDays);
      formData.append('bio', bio || 'Board-certified clinical consultant at UNN HMS.');
      if (selectedFile) formData.append('avatar', selectedFile);

      const data = await api.addDoctor(formData);
      if (data.success && data.doctor) {
        setDoctors((prev) => [
          data.doctor,
          ...prev.filter((d) => (d.id || d.doctor_id) !== (data.doctor.id || data.doctor.doctor_id)),
        ]);
        setNotification(`Dr. ${name} successfully saved to database!`);
        fetchDoctors();
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (err) {
      const msg = err?.message || 'Could not save doctor to database.';
      setNotification(`Error: ${msg}`);
    } finally {
      setSubmitting(false);
      setIsAddModalOpen(false);
      resetForm();
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const resetForm = () => {
    setName('');
    setTitle('Consultant Specialist');
    setSpecialization('');
    setBio('');
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleToggleDoctor = async (docId) => {
    const target = doctors.find((d) => (d.id || d.doctor_id) === docId);
    if (!target) return;
    setDoctors((prev) =>
      prev.map((d) => ((d.id || d.doctor_id) === docId ? { ...d, is_active: !target.is_active } : d))
    );
    try {
      await api.toggleDoctor(docId);
      fetchDoctors();
    } catch (err) {
      console.warn('Toggle failed:', err.message);
    }
  };

  const handleDeleteDoctor = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;
    setDoctors((prev) => prev.filter((d) => (d.id || d.doctor_id) !== docId));
    try {
      await api.deleteDoctor(docId);
      fetchDoctors();
    } catch (err) {
      console.warn('Delete failed:', err.message);
    }
  };

  const handleConfirmAppointment = async (appId) => {
    setAppointments((prev) =>
      prev.map((a) => (a.appointment_id === appId || a.id === appId ? { ...a, status: 'confirmed' } : a))
    );
    try {
      await api.updateAppointmentStatus(appId, 'confirmed');
      fetchAppointments();
      setNotification(`Appointment #${appId} confirmed!`);
    } catch (err) {
      console.warn('Update status failed:', err.message);
    }
    setTimeout(() => setNotification(null), 3000);
  };

  const pendingCount = appointments.filter((a) => a.status === 'pending').length;

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-6">

      {/* ── Top Header ── */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#008080]/20 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-[#008080]">Administration</span>
            <span className="bg-[#ebf1f1] text-[#008080] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border border-[#008080]/20">
              Hospital Operations
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-slate-900 mt-1">Hospital Admin Desk</h1>
          <p className="text-xs text-slate-500">
            Add doctors with Cloudinary photo uploads, manage rosters, and approve patient appointments.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex bg-[#ebf1f1] p-1 rounded-xl self-start sm:self-center border border-[#008080]/15 shrink-0">
          <button
            onClick={() => setActiveTab('doctors')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'doctors' ? 'bg-[#008080] text-white shadow-xs' : 'text-slate-600 hover:text-[#008080]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Doctors ({doctors.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'appointments' ? 'bg-[#008080] text-white shadow-xs' : 'text-slate-600 hover:text-[#008080]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Appointments</span>
            {pendingCount > 0 && (
              <span className="bg-amber-400 text-slate-900 text-[10px] px-1.5 rounded-full font-bold ml-1">
                {pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Notification Toast ── */}
      {notification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* ═══════════ TAB 1: MANAGE DOCTORS ═══════════ */}
      {activeTab === 'doctors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-heading font-bold text-slate-900">Hospital Medical Faculty</h2>
              <p className="text-xs text-slate-500 hidden sm:block">Active roster displayed to patients.</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4 text-emerald-200" />
              <span>Add Doctor</span>
            </button>
          </div>

          {/* Desktop table — hidden on mobile */}
          <div className="bg-white rounded-2xl border border-[#008080]/20 shadow-sm hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#ebf1f1] text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-[#008080]/15">
                <tr>
                  <th className="py-3 px-4">Doctor</th>
                  <th className="py-3 px-4">Department &amp; Specialty</th>
                  <th className="py-3 px-4">Fee / Experience</th>
                  <th className="py-3 px-4">Clinic Days</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {doctors.map((doc) => {
                  const docId = doc.id || doc.doctor_id;
                  const dept = departments.find((d) => d.department_id === doc.department_id);
                  return (
                    <tr key={docId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={doc.avatar_url}
                            alt={doc.name}
                            className="w-10 h-10 rounded-xl object-cover border border-[#008080]/20 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{doc.name}</span>
                            <span className="text-[11px] text-slate-400">{doc.title}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#008080] block">{doc.department_name || dept?.name}</span>
                        <span className="text-[11px] text-slate-500">{doc.specialization}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">${doc.consultation_fee} / consult</span>
                        <span className="text-[11px] text-slate-400">{doc.experience_years} years exp</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-slate-600 font-medium">
                          {Array.isArray(doc.available_days) ? doc.available_days.join(', ') : doc.available_days}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                            doc.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {doc.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleToggleDoctor(docId)}
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                              doc.is_active
                                ? 'bg-[#ebf1f1] text-[#008080] hover:bg-teal-100'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {doc.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDeleteDoctor(docId)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {doctors.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-400 text-xs">
                      No doctors yet. Add your first doctor above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards — hidden on desktop */}
          <div className="md:hidden space-y-3">
            {doctors.length === 0 && (
              <div className="text-center py-10 text-slate-400 text-xs bg-white rounded-2xl border border-[#008080]/10">
                No doctors yet. Add your first doctor above.
              </div>
            )}
            {doctors.map((doc) => {
              const docId = doc.id || doc.doctor_id;
              const dept = departments.find((d) => d.department_id === doc.department_id);
              return (
                <div key={docId} className="bg-white rounded-2xl border border-[#008080]/20 shadow-sm p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <img
                      src={doc.avatar_url}
                      alt={doc.name}
                      className="w-14 h-14 rounded-xl object-cover border border-[#008080]/20 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-slate-900 block truncate">{doc.name}</span>
                      <span className="text-[11px] text-slate-400 block">{doc.title}</span>
                      <span className="text-[11px] font-bold text-[#008080]">
                        {doc.department_name || dept?.name}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                        doc.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {doc.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Info grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-[#ebf1f1] rounded-xl p-3">
                    <div>
                      <span className="text-slate-500 block">Fee</span>
                      <span className="font-bold text-slate-900">${doc.consultation_fee} / consult</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Experience</span>
                      <span className="font-bold text-slate-900">{doc.experience_years} yrs</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500 block">Clinic Days</span>
                      <span className="font-semibold text-slate-700">
                        {Array.isArray(doc.available_days) ? doc.available_days.join(', ') : doc.available_days}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleDoctor(docId)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-colors ${
                        doc.is_active
                          ? 'bg-[#ebf1f1] text-[#008080] hover:bg-teal-100'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {doc.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDeleteDoctor(docId)}
                      className="px-4 py-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════ TAB 2: MANAGE APPOINTMENTS ═══════════ */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-2xl border border-[#008080]/20 shadow-sm space-y-4 p-4 sm:p-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-heading font-bold text-slate-900">Appointments Queue</h2>
              <p className="text-xs text-slate-500 hidden sm:block">Review bookings and confirm clinic visits.</p>
            </div>
            <button
              onClick={fetchAppointments}
              className="p-1.5 text-slate-400 hover:text-[#008080] hover:bg-[#ebf1f1] rounded-lg"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Desktop table — hidden on mobile */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#ebf1f1] text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">ID &amp; Slot</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Doctor &amp; Dept</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {appointments.map((app) => (
                  <tr key={app.appointment_id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      #{app.appointment_id}
                      <span className="block font-normal text-slate-500 text-[11px]">{app.appointment_date}</span>
                      <span className="block font-bold text-[#008080] text-[11px]">{app.appointment_time}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{app.patient_name || 'Patient'}</span>
                      <span className="text-[11px] text-slate-400 truncate max-w-[180px] block">{app.reason}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900 block">{app.doctor_name}</span>
                      <span className="text-[11px] text-[#008080] font-semibold">{app.department_name}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          app.booking_source === 'ai_assistant'
                            ? 'bg-[#ebf1f1] text-[#008080] border-[#008080]/30 font-bold'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        {app.booking_source === 'ai_assistant' ? '🤖 AI' : '👤 Doctor'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          app.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {app.status === 'pending' ? (
                        <button
                          onClick={() => handleConfirmAppointment(app.appointment_id)}
                          className="px-3 py-1.5 bg-[#008080] hover:bg-[#006666] text-white rounded-lg text-xs font-bold inline-flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Confirm</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-semibold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confirmed</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-400 text-xs">
                      No appointments yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards — hidden on desktop */}
          <div className="md:hidden space-y-3">
            {appointments.length === 0 && (
              <div className="text-center py-10 text-slate-400 text-xs">No appointments yet.</div>
            )}
            {appointments.map((app) => (
              <div
                key={app.appointment_id}
                className="border border-[#008080]/15 rounded-2xl p-4 space-y-3 bg-[#ebf1f1]/30"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-400">#{app.appointment_id}</span>
                    <p className="font-bold text-slate-900">{app.patient_name || 'Patient'}</p>
                    <p className="text-xs text-slate-500">{app.reason}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full shrink-0 ${
                      app.status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                {/* Detail grid */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-white rounded-xl p-3 border border-[#008080]/10">
                  <div>
                    <span className="text-slate-400 block">Doctor</span>
                    <span className="font-semibold text-slate-900">{app.doctor_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Department</span>
                    <span className="font-semibold text-[#008080]">{app.department_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Date</span>
                    <span className="font-bold text-slate-800">{app.appointment_date}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Time</span>
                    <span className="font-bold text-[#008080]">{app.appointment_time}</span>
                  </div>
                </div>

                {/* Channel + action row */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      app.booking_source === 'ai_assistant'
                        ? 'bg-[#ebf1f1] text-[#008080] border-[#008080]/30 font-bold'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {app.booking_source === 'ai_assistant' ? '🤖 AI' : '👤 Doctor'}
                  </span>
                  {app.status === 'pending' ? (
                    <button
                      onClick={() => handleConfirmAppointment(app.appointment_id)}
                      className="flex items-center gap-1 px-4 py-2 bg-[#008080] hover:bg-[#006666] text-white rounded-xl text-xs font-bold"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Confirm</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Confirmed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════ ADD DOCTOR MODAL ═══════════ */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg p-5 sm:p-6 shadow-2xl border border-[#008080]/20 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#008080]" />
                <h3 className="font-heading font-bold text-base text-slate-900">Add Doctor to Hospital</h3>
              </div>
              <button
                onClick={() => { setIsAddModalOpen(false); resetForm(); }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-[#ebf1f1]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDoctor} className="space-y-3.5 text-xs">
              {/* Photo picker */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Doctor Photo (Cloudinary)</label>
                <div className="flex items-center gap-4 p-3 bg-[#ebf1f1] rounded-xl border border-dashed border-[#008080]/30">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-[#008080]/30 shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-white border border-[#008080]/20 flex items-center justify-center shrink-0">
                      <ImageIcon className="w-6 h-6 text-[#008080]" />
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <input type="file" id="photo-upload" accept="image/*" onChange={handleFileChange} className="hidden" />
                    <label
                      htmlFor="photo-upload"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-teal-50 text-[#008080] border border-[#008080]/30 rounded-lg font-bold cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Choose Photo</span>
                    </label>
                    <p className="text-[10px] text-slate-500">JPG, PNG, WEBP supported</p>
                  </div>
                </div>
              </div>

              {/* Name & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    required type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Adaeze Okafor"
                    className="w-full bg-[#ebf1f1] px-3 py-2 rounded-xl border border-[#008080]/20 focus:border-[#008080] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Clinical Title</label>
                  <input
                    type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Dental Surgeon"
                    className="w-full bg-[#ebf1f1] px-3 py-2 rounded-xl border border-[#008080]/20 focus:border-[#008080] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Department & Specialty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full bg-[#ebf1f1] px-3 py-2 rounded-xl border border-[#008080]/20 focus:border-[#008080] focus:bg-white focus:outline-none text-slate-700"
                  >
                    {departments.map((d) => (
                      <option key={d.department_id} value={d.department_id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Specialization</label>
                  <input
                    required type="text" value={specialization} onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="e.g. Pediatric Surgery"
                    className="w-full bg-[#ebf1f1] px-3 py-2 rounded-xl border border-[#008080]/20 focus:border-[#008080] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Fee & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Consultation Fee ($)</label>
                  <input
                    type="number" value={fee} onChange={(e) => setFee(e.target.value)}
                    className="w-full bg-[#ebf1f1] px-3 py-2 rounded-xl border border-[#008080]/20 focus:border-[#008080] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Experience (Years)</label>
                  <input
                    type="number" value={experience} onChange={(e) => setExperience(e.target.value)}
                    className="w-full bg-[#ebf1f1] px-3 py-2 rounded-xl border border-[#008080]/20 focus:border-[#008080] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinic Days (comma separated)</label>
                <input
                  type="text" value={availableDays} onChange={(e) => setAvailableDays(e.target.value)}
                  placeholder="e.g. Monday, Wednesday, Friday"
                  className="w-full bg-[#ebf1f1] px-3 py-2 rounded-xl border border-[#008080]/20 focus:border-[#008080] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Doctor Bio</label>
                <textarea
                  rows="2" value={bio} onChange={(e) => setBio(e.target.value)}
                  placeholder="Clinical experience and hospital background..."
                  className="w-full bg-[#ebf1f1] px-3 py-2 rounded-xl border border-[#008080]/20 focus:border-[#008080] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button" onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={submitting}
                  className="flex-1 py-2.5 bg-[#008080] hover:bg-[#006666] disabled:opacity-50 text-white font-bold rounded-xl transition-colors"
                >
                  {submitting ? 'Uploading...' : 'Save Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
