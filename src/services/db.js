// UNN HMS Database & Data Access Layer
// LocalStorage persistent store mirroring the relational schema from idea.md

const STORAGE_KEYS = {
  USERS: 'unn_hms_users',
  DEPARTMENTS: 'unn_hms_departments',
  DOCTORS: 'unn_hms_doctors',
  AVAILABILITY: 'unn_hms_availability',
  BLOCKED_DATES: 'unn_hms_blocked_dates',
  APPOINTMENTS: 'unn_hms_appointments',
  AI_RECOMMENDATIONS: 'unn_hms_ai_recommendations',
  SYMPTOM_MAPPINGS: 'unn_hms_symptom_mappings',
  CURRENT_USER: 'unn_hms_current_user',
};

export const INITIAL_DEPARTMENTS = [
  {
    department_id: 1,
    name: 'Cardiology',
    description: 'Expert diagnostic & therapeutic cardiac care, ECG, echocardiography, and hypertension management.',
    icon: 'HeartPulse',
    emergency_supported: true,
  },
  {
    department_id: 2,
    name: 'Dental',
    description: 'Comprehensive dental hygiene, oral surgery, cavity fillings, root canals, and teeth alignment.',
    icon: 'Smile',
    emergency_supported: false,
  },
  {
    department_id: 3,
    name: 'Pediatrics',
    description: 'Dedicated healthcare for newborns, children, and adolescents, including routine vaccinations.',
    icon: 'Baby',
    emergency_supported: true,
  },
  {
    department_id: 4,
    name: 'Dermatology',
    description: 'Specialized diagnosis and treatment of skin, hair, and nail disorders, biopsies, and allergies.',
    icon: 'Sparkles',
    emergency_supported: false,
  },
  {
    department_id: 5,
    name: 'General Medicine',
    description: 'Primary care, diagnostic health checkups, viral fevers, chronic illness monitoring, and referrals.',
    icon: 'Stethoscope',
    emergency_supported: true,
  },
  {
    department_id: 6,
    name: 'Orthopedics',
    description: 'Musculoskeletal care, joint repairs, fracture casting, spine health, and physical therapy.',
    icon: 'Activity',
    emergency_supported: true,
  },
];

export const INITIAL_DOCTORS = [
  {
    doctor_id: 1,
    user_id: 101,
    department_id: 1,
    name: 'Dr. Sara Ahmed',
    title: 'Consultant Cardiologist',
    specialization: 'Interventional Cardiology & Preventive Heart Health',
    experience_years: 10,
    consultation_fee: 30,
    bio: 'Board-certified cardiologist with extensive clinical experience in cardiovascular risk assessments and diagnostic imaging.',
    avatar_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    available_days: ['Sunday', 'Monday', 'Wednesday', 'Thursday'],
    is_active: true,
  },
  {
    doctor_id: 2,
    user_id: 102,
    department_id: 2,
    name: 'Dr. Layla Karim',
    title: 'Lead Dental Surgeon',
    specialization: 'General Dentistry & Endodontics',
    experience_years: 8,
    consultation_fee: 25,
    bio: 'Specialist in painless restorative dentistry, toothache relief, gum treatments, and aesthetic smile correction.',
    avatar_url: 'https://images.unsplash.com/photo-1594824813583-b9b5f33346b0?auto=format&fit=crop&q=80&w=400',
    available_days: ['Sunday', 'Monday', 'Wednesday'],
    is_active: true,
  },
  {
    doctor_id: 3,
    user_id: 103,
    department_id: 2,
    name: 'Dr. Omar Hassan',
    title: 'Senior Dental Consultant',
    specialization: 'Periodontology & Oral Surgery',
    experience_years: 6,
    consultation_fee: 20,
    bio: 'Dedicated to preventative gum care, emergency tooth extractions, and pediatric dental maintenance.',
    avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    available_days: ['Monday', 'Tuesday', 'Thursday'],
    is_active: true,
  },
  {
    doctor_id: 4,
    user_id: 104,
    department_id: 3,
    name: 'Dr. Chen Wei',
    title: 'Pediatric Specialist',
    specialization: 'Neonatal & Child Health',
    experience_years: 12,
    consultation_fee: 35,
    bio: 'Passionate pediatrician with over a decade managing pediatric emergencies, infectious diseases, and child growth.',
    avatar_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    available_days: ['Tuesday', 'Wednesday', 'Friday'],
    is_active: true,
  },
  {
    doctor_id: 5,
    user_id: 105,
    department_id: 4,
    name: 'Dr. Amara Okafor',
    title: 'Dermatologist & Cosmetologist',
    specialization: 'Clinical Dermatology & Allergy Care',
    experience_years: 7,
    consultation_fee: 28,
    bio: 'Expert in treating severe eczema, stubborn rashes, acne vulgaris, and systemic dermatological manifestations.',
    avatar_url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400',
    available_days: ['Monday', 'Wednesday', 'Saturday'],
    is_active: true,
  },
  {
    doctor_id: 6,
    user_id: 106,
    department_id: 5,
    name: 'Dr. Marcus Vance',
    title: 'Senior Physician',
    specialization: 'Internal Medicine & Family Health',
    experience_years: 15,
    consultation_fee: 30,
    bio: 'Comprehensive primary care physician skilled in chronic conditions, seasonal fevers, and multi-system diagnostics.',
    avatar_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    available_days: ['Sunday', 'Tuesday', 'Thursday', 'Friday'],
    is_active: true,
  },
];

export const INITIAL_USERS = [
  {
    user_id: 1,
    name: 'Sara Cole',
    email: 'sara@unn.edu',
    phone: '+234 803 123 4567',
    role: 'patient',
    gender: 'Female',
    age: 26,
    blood_group: 'O+',
  },
  {
    user_id: 102,
    name: 'Dr. Layla Karim',
    email: 'layla.karim@unn-hms.edu',
    phone: '+234 802 987 6543',
    role: 'doctor',
    doctor_id: 2,
  },
  {
    user_id: 999,
    name: 'Dr. K. Eze (Chief Medical Officer)',
    email: 'admin@unn-hms.edu',
    phone: '+234 800 000 1111',
    role: 'admin',
  },
];

export const INITIAL_SYMPTOM_MAPPINGS = [
  // Dental
  { mapping_id: 1, keyword: 'tooth pain', department_id: 2, urgency_level: 'routine', weight: 10 },
  { mapping_id: 2, keyword: 'toothache', department_id: 2, urgency_level: 'routine', weight: 10 },
  { mapping_id: 3, keyword: 'swollen gums', department_id: 2, urgency_level: 'routine', weight: 9 },
  { mapping_id: 4, keyword: 'bleeding gums', department_id: 2, urgency_level: 'routine', weight: 8 },
  { mapping_id: 5, keyword: 'cavity', department_id: 2, urgency_level: 'routine', weight: 8 },
  { mapping_id: 6, keyword: 'broken tooth', department_id: 2, urgency_level: 'urgent', weight: 9 },
  { mapping_id: 7, keyword: 'dental', department_id: 2, urgency_level: 'routine', weight: 10 },

  // Cardiology
  { mapping_id: 10, keyword: 'heart palpitations', department_id: 1, urgency_level: 'urgent', weight: 9 },
  { mapping_id: 11, keyword: 'high blood pressure', department_id: 1, urgency_level: 'routine', weight: 8 },
  { mapping_id: 12, keyword: 'hypertension', department_id: 1, urgency_level: 'routine', weight: 8 },
  { mapping_id: 13, keyword: 'irregular heartbeat', department_id: 1, urgency_level: 'urgent', weight: 9 },
  { mapping_id: 14, keyword: 'cardiologist', department_id: 1, urgency_level: 'routine', weight: 10 },

  // Pediatrics
  { mapping_id: 20, keyword: 'child fever', department_id: 3, urgency_level: 'urgent', weight: 9 },
  { mapping_id: 21, keyword: 'baby cough', department_id: 3, urgency_level: 'routine', weight: 8 },
  { mapping_id: 22, keyword: 'infant vomiting', department_id: 3, urgency_level: 'urgent', weight: 9 },
  { mapping_id: 23, keyword: 'vaccination', department_id: 3, urgency_level: 'routine', weight: 7 },
  { mapping_id: 24, keyword: 'child rash', department_id: 3, urgency_level: 'routine', weight: 8 },

  // Dermatology
  { mapping_id: 30, keyword: 'skin rash', department_id: 4, urgency_level: 'routine', weight: 9 },
  { mapping_id: 31, keyword: 'itching', department_id: 4, urgency_level: 'routine', weight: 7 },
  { mapping_id: 32, keyword: 'eczema', department_id: 4, urgency_level: 'routine', weight: 9 },
  { mapping_id: 33, keyword: 'acne', department_id: 4, urgency_level: 'routine', weight: 8 },
  { mapping_id: 34, keyword: 'hives', department_id: 4, urgency_level: 'urgent', weight: 8 },

  // General Medicine
  { mapping_id: 40, keyword: 'fever', department_id: 5, urgency_level: 'routine', weight: 6 },
  { mapping_id: 41, keyword: 'headache', department_id: 5, urgency_level: 'routine', weight: 6 },
  { mapping_id: 42, keyword: 'fatigue', department_id: 5, urgency_level: 'routine', weight: 5 },
  { mapping_id: 43, keyword: 'cold', department_id: 5, urgency_level: 'routine', weight: 6 },
  { mapping_id: 44, keyword: 'flu', department_id: 5, urgency_level: 'routine', weight: 6 },

  // Orthopedics
  { mapping_id: 50, keyword: 'knee pain', department_id: 6, urgency_level: 'routine', weight: 8 },
  { mapping_id: 51, keyword: 'joint swelling', department_id: 6, urgency_level: 'routine', weight: 8 },
  { mapping_id: 52, keyword: 'back pain', department_id: 6, urgency_level: 'routine', weight: 7 },
  { mapping_id: 53, keyword: 'sprained ankle', department_id: 6, urgency_level: 'urgent', weight: 8 },
];

export const EMERGENCY_KEYWORDS = [
  'chest pain',
  'severe chest pain',
  'difficulty breathing',
  'shortness of breath',
  'severe bleeding',
  'unconscious',
  'stroke',
  'heavy chest pressure',
  'choking',
  'seizure',
  'paralysis',
  'coughing blood',
];

export const INITIAL_APPOINTMENTS = [
  {
    appointment_id: 1001,
    patient_id: 1,
    patient_name: 'Sara Cole',
    doctor_id: 1,
    department_id: 1,
    appointment_date: '2026-11-20',
    appointment_time: '10:00 AM',
    status: 'confirmed',
    reason: 'Follow-up ECG consultation and blood pressure review',
    booking_source: 'manual',
    created_at: '2026-10-25T14:30:00Z',
    updated_at: '2026-10-25T15:00:00Z',
  },
  {
    appointment_id: 1002,
    patient_id: 1,
    patient_name: 'Sara Cole',
    doctor_id: 5,
    department_id: 4,
    appointment_date: '2026-10-15',
    appointment_time: '02:00 PM',
    status: 'completed',
    reason: 'Dermatological allergy test and topical ointment prescription review',
    booking_source: 'ai_assistant',
    created_at: '2026-10-12T09:15:00Z',
    updated_at: '2026-10-15T15:00:00Z',
  },
];

// Helper to initialize storage
function loadFromStorage(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    if (!item || item === 'null' || item === 'undefined') return fallback;
    return JSON.parse(item);
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage write error:', e);
  }
}

// Database API Controller
export const db = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.DEPARTMENTS)) {
      saveToStorage(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.DOCTORS)) {
      saveToStorage(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      saveToStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SYMPTOM_MAPPINGS)) {
      saveToStorage(STORAGE_KEYS.SYMPTOM_MAPPINGS, INITIAL_SYMPTOM_MAPPINGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
      saveToStorage(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.AI_RECOMMENDATIONS)) {
      saveToStorage(STORAGE_KEYS.AI_RECOMMENDATIONS, []);
    }
  },

  resetAll() {
    saveToStorage(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
    saveToStorage(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
    saveToStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
    saveToStorage(STORAGE_KEYS.SYMPTOM_MAPPINGS, INITIAL_SYMPTOM_MAPPINGS);
    saveToStorage(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    saveToStorage(STORAGE_KEYS.AI_RECOMMENDATIONS, []);
    saveToStorage(STORAGE_KEYS.CURRENT_USER, null);
    return true;
  },

  // Users & Auth
  getCurrentUser() {
    return loadFromStorage(STORAGE_KEYS.CURRENT_USER, null);
  },

  setCurrentUser(user) {
    saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
  },

  logout() {
    saveToStorage(STORAGE_KEYS.CURRENT_USER, null);
  },

  switchUserByRole(role) {
    const users = loadFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
    const target = users.find((u) => u.role === role) || users[0];
    this.setCurrentUser(target);
    return target;
  },

  // Departments
  getDepartments() {
    return loadFromStorage(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
  },

  getDepartmentById(id) {
    return this.getDepartments().find((d) => d.department_id === Number(id));
  },

  saveDepartment(dept) {
    const list = this.getDepartments();
    if (dept.department_id) {
      const idx = list.findIndex((d) => d.department_id === dept.department_id);
      if (idx !== -1) list[idx] = dept;
    } else {
      dept.department_id = Date.now();
      list.push(dept);
    }
    saveToStorage(STORAGE_KEYS.DEPARTMENTS, list);
    return dept;
  },

  // Doctors
  getDoctors() {
    return loadFromStorage(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
  },

  getDoctorById(id) {
    return this.getDoctors().find((d) => d.doctor_id === Number(id));
  },

  saveDoctor(doc) {
    const list = this.getDoctors();
    if (doc.doctor_id) {
      const idx = list.findIndex((d) => d.doctor_id === doc.doctor_id);
      if (idx !== -1) list[idx] = doc;
    } else {
      doc.doctor_id = Date.now();
      list.push(doc);
    }
    saveToStorage(STORAGE_KEYS.DOCTORS, list);
    return doc;
  },

  // Availability & Slots
  getAvailableSlots(doctorId, dateString) {
    const doctor = this.getDoctorById(doctorId);
    if (!doctor) return [];

    // Parse day of week
    const dateObj = new Date(dateString + 'T00:00:00');
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[dateObj.getDay()];

    // Check if doctor works on this day
    if (!doctor.available_days.includes(dayName)) {
      return [];
    }

    // Standard clinical slots
    let standardSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:30 PM', '02:00 PM', '03:30 PM', '04:00 PM', '05:00 PM'];
    
    // Doctor specific default slots (as defined in idea.md for Dr. Layla Karim & Dr. Omar Hassan)
    if (doctor.doctor_id === 2) { // Dr. Layla Karim
      standardSlots = ['10:00 AM', '12:30 PM', '04:00 PM'];
    } else if (doctor.doctor_id === 3) { // Dr. Omar Hassan
      standardSlots = ['11:00 AM', '03:30 PM'];
    }

    // Filter out already booked slots for this doctor on this date
    const appointments = this.getAppointments().filter(
      (a) => a.doctor_id === Number(doctorId) && a.appointment_date === dateString && a.status !== 'cancelled'
    );

    const bookedTimes = appointments.map((a) => a.appointment_time);
    return standardSlots.filter((slot) => !bookedTimes.includes(slot));
  },

  // Appointments
  getAppointments() {
    return loadFromStorage(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
  },

  getAppointmentsByPatient(patientId) {
    return this.getAppointments().filter((a) => a.patient_id === Number(patientId));
  },

  getAppointmentsByDoctor(doctorId) {
    return this.getAppointments().filter((a) => a.doctor_id === Number(doctorId));
  },

  bookAppointment({ patientId, doctorId, departmentId, date, time, reason, bookingSource = 'manual' }) {
    // Concurrency check: verify slot is still available
    const available = this.getAvailableSlots(doctorId, date);
    if (!available.includes(time)) {
      return {
        success: false,
        conflict: true,
        message: `The ${time} slot on ${date} was just taken. Please choose another slot.`,
        availableAlternatives: available,
      };
    }

    const doctor = this.getDoctorById(doctorId);
    const department = this.getDepartmentById(departmentId || doctor?.department_id);
    const currentUser = this.getCurrentUser();

    const newAppointment = {
      appointment_id: Math.floor(1000 + Math.random() * 9000),
      patient_id: patientId || currentUser.user_id,
      patient_name: currentUser.name || 'Sara Cole',
      doctor_id: Number(doctorId),
      doctor_name: doctor?.name || 'Assigned Doctor',
      department_id: Number(departmentId || doctor?.department_id),
      department_name: department?.name || 'General',
      appointment_date: date,
      appointment_time: time,
      status: 'pending', // Starts as Pending per idea.md
      reason: reason || 'General clinical consultation',
      booking_source: bookingSource,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const appointments = this.getAppointments();
    appointments.unshift(newAppointment);
    saveToStorage(STORAGE_KEYS.APPOINTMENTS, appointments);

    return {
      success: true,
      appointment: newAppointment,
    };
  },

  updateAppointmentStatus(appointmentId, newStatus) {
    const list = this.getAppointments();
    const idx = list.findIndex((a) => a.appointment_id === Number(appointmentId));
    if (idx !== -1) {
      list[idx].status = newStatus;
      list[idx].updated_at = new Date().toISOString();
      saveToStorage(STORAGE_KEYS.APPOINTMENTS, list);
      return list[idx];
    }
    return null;
  },

  cancelAppointment(appointmentId) {
    return this.updateAppointmentStatus(appointmentId, 'cancelled');
  },

  rescheduleAppointment(appointmentId, newDate, newTime) {
    const list = this.getAppointments();
    const idx = list.findIndex((a) => a.appointment_id === Number(appointmentId));
    if (idx !== -1) {
      list[idx].appointment_date = newDate;
      list[idx].appointment_time = newTime;
      list[idx].status = 'pending';
      list[idx].updated_at = new Date().toISOString();
      saveToStorage(STORAGE_KEYS.APPOINTMENTS, list);
      return list[idx];
    }
    return null;
  },

  // AI Audit Logging
  getAiRecommendations() {
    return loadFromStorage(STORAGE_KEYS.AI_RECOMMENDATIONS, []);
  },

  logAiRecommendation(rec) {
    const list = this.getAiRecommendations();
    const item = {
      recommendation_id: Math.floor(5000 + Math.random() * 5000),
      patient_id: rec.patientId || this.getCurrentUser()?.user_id,
      symptoms_text: rec.symptomsText,
      recommended_department_id: rec.departmentId,
      department_name: this.getDepartmentById(rec.departmentId)?.name || 'General',
      urgency_level: rec.urgencyLevel,
      emergency_detected: rec.emergencyDetected ? 1 : 0,
      ai_response: rec.aiResponse,
      converted_to_booking: rec.convertedToBooking ? 1 : 0,
      created_at: new Date().toISOString(),
    };
    list.unshift(item);
    saveToStorage(STORAGE_KEYS.AI_RECOMMENDATIONS, list);
    return item;
  },

  markRecommendationConverted(recommendationId) {
    const list = this.getAiRecommendations();
    const idx = list.findIndex((r) => r.recommendation_id === Number(recommendationId));
    if (idx !== -1) {
      list[idx].converted_to_booking = 1;
      saveToStorage(STORAGE_KEYS.AI_RECOMMENDATIONS, list);
    }
  },

  getSymptomMappings() {
    return loadFromStorage(STORAGE_KEYS.SYMPTOM_MAPPINGS, INITIAL_SYMPTOM_MAPPINGS);
  },
};

// Initialize on file load
db.init();

