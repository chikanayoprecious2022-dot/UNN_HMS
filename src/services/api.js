// UNN HMS — Central API Client
// All data (doctors, appointments, users) flows strictly through Express -> Supabase Database.
// localStorage is ONLY used for holding the active login session.

const BASE = 'http://localhost:5000/api';

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || (data && data.success === false)) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return data;
}

export const api = {
  // Doctors
  getDoctors: () => req('/doctors'),
  getDoctor: (id) => req(`/doctors/${id}`),
  addDoctor: async (formData) => {
    const res = await fetch(`${BASE}/doctors`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.success === false) {
      throw new Error(data.message || 'Failed to add doctor');
    }
    return data;
  },
  toggleDoctor: (id) => req(`/doctors/${id}/toggle`, { method: 'PATCH' }),
  deleteDoctor: (id) => req(`/doctors/${id}`, { method: 'DELETE' }),

  // Appointments
  getAppointments: (patientId) =>
    req(`/appointments${patientId ? `?patient_id=${patientId}` : ''}`),
  bookAppointment: (payload) =>
    req('/appointments', { method: 'POST', body: JSON.stringify(payload) }),
  updateAppointmentStatus: (id, status) =>
    req(`/appointments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // Auth & Departments
  login: (email, password) =>
    req('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (payload) =>
    req('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  getDepartments: () => req('/auth/departments'),
};

// Session storage (only for currently logged-in user)
const USER_KEY = 'unn_hms_current_user';

export const session = {
  get: () => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  set: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  clear: () => localStorage.removeItem(USER_KEY),
};
