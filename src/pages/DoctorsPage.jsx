import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Bot, Search, Award, ArrowRight, Loader2 } from 'lucide-react';

const DEPARTMENTS = [
  { id: 1, name: 'Cardiology' },
  { id: 2, name: 'Dental' },
  { id: 3, name: 'Pediatrics' },
  { id: 4, name: 'Dermatology' },
  { id: 5, name: 'General Medicine' },
  { id: 6, name: 'Orthopedics' },
];

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function DoctorsPage() {
  const [searchParams] = useSearchParams();
  const initialDept = searchParams.get('dept') || '';

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState(initialDept);
  const [selectedDay, setSelectedDay] = useState('');

  useEffect(() => {
    api.getDoctors()
      .then((data) => {
        if (data.success && data.doctors) setDoctors(data.doctors);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchesSearch =
        doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialization?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = !selectedDept || doc.department_id === Number(selectedDept);
      const days = Array.isArray(doc.available_days) ? doc.available_days : [];
      const matchesDay = !selectedDay || days.includes(selectedDay);
      return matchesSearch && matchesDept && matchesDay;
    });
  }, [doctors, searchQuery, selectedDept, selectedDay]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* AI Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-[#008080] to-teal-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-semibold">
            <Bot className="w-3.5 h-3.5 text-emerald-300" />
            <span>UNN AI Triage Assistant</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-white">
            Not sure which doctor to choose?
          </h2>
          <p className="text-teal-100 text-xs sm:text-sm leading-relaxed">
            Let UNN AI recommend the right department and doctor based on your symptoms.
          </p>
        </div>
        <Link
          to="/ai-assistant"
          className="bg-white text-[#008080] hover:bg-teal-50 px-6 py-3.5 rounded-xl font-heading font-bold text-sm shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <Bot className="w-4 h-4 text-[#008080]" />
          <span>Ask AI Health Assistant</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="bg-white brand-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-slate-900">Hospital Medical Faculty</h1>
            <p className="text-xs text-slate-500">
              Browse doctor profiles, verify consultation fees, and inspect slot availability.
            </p>
          </div>
          <span className="text-xs font-bold text-[#008080] bg-[#ebf1f1] px-3 py-1 rounded-full">
            {loading ? '...' : `${filteredDoctors.length} Doctors Available`}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or specialty..."
              className="w-full bg-[#ebf1f1] pl-10 pr-4 py-2.5 rounded-xl text-xs border border-transparent focus:border-[#008080] focus:bg-white focus:outline-none"
            />
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full bg-[#ebf1f1] px-3.5 py-2.5 rounded-xl text-xs border border-transparent focus:border-[#008080] focus:bg-white focus:outline-none text-slate-700"
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="w-full bg-[#ebf1f1] px-3.5 py-2.5 rounded-xl text-xs border border-transparent focus:border-[#008080] focus:bg-white focus:outline-none text-slate-700"
          >
            <option value="">Any Available Day</option>
            {DAYS.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20 gap-3 text-[#008080]">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-sm font-medium">Loading doctors from database...</span>
        </div>
      )}

      {/* Doctor Cards */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => {
            const dept = DEPARTMENTS.find((d) => d.id === doc.department_id);
            const days = Array.isArray(doc.available_days) ? doc.available_days : [];
            const docId = doc.id || doc.doctor_id;

            return (
              <div key={docId} className="brand-card overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all">
                <div>
                  <div className="p-5 flex items-start gap-4 border-b border-slate-100">
                    <img
                      src={doc.avatar_url}
                      alt={doc.name}
                      className="w-18 h-18 rounded-2xl object-cover border-2 border-teal-100 shrink-0"
                      style={{ width: 72, height: 72 }}
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-bold text-[#008080] uppercase tracking-wider block">
                        {dept?.name || doc.department_name}
                      </span>
                      <h3 className="font-heading font-bold text-base text-slate-900 truncate">{doc.name}</h3>
                      <p className="text-xs text-slate-500 font-medium truncate">{doc.title}</p>
                      <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>{doc.experience_years} years exp</span>
                        <span className="mx-1">•</span>
                        <span className="font-bold text-[#008080]">${doc.consultation_fee}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{doc.bio}</p>
                    <div className="bg-[#ebf1f1] p-3 rounded-xl space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="font-medium">Clinic Days:</span>
                        <span className="font-bold text-slate-900">{days.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex gap-2">
                  <Link
                    to={`/doctors/${docId}`}
                    className="flex-1 py-2.5 text-center text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    View Profile
                  </Link>
                  <Link
                    to={`/book?doctorId=${docId}`}
                    className="flex-1 py-2.5 text-center text-xs font-semibold text-white bg-[#008080] hover:bg-[#006666] rounded-xl transition-colors shadow-sm"
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>
            );
          })}

          {filteredDoctors.length === 0 && (
            <div className="col-span-3 text-center py-16 text-slate-400 text-sm">
              No doctors match your search. Try different filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
