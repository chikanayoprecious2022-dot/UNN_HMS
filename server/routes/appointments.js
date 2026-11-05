import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabase } from '../config/supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const APPOINTMENTS_FILE = path.resolve(__dirname, '../data/appointments.json');

const router = express.Router();

const DEFAULT_APPOINTMENTS = [
  {
    id: 1001,
    appointment_id: 1001,
    patient_id: '1',
    patient_name: 'Sara Cole',
    doctor_id: 1,
    doctor_name: 'Dr. Sara Ahmed',
    department_id: 1,
    department_name: 'Cardiology',
    appointment_date: '2026-11-20',
    appointment_time: '10:00 AM',
    status: 'confirmed',
    reason: 'Follow-up ECG consultation and blood pressure review',
    booking_source: 'manual',
    created_at: new Date().toISOString(),
  },
  {
    id: 1002,
    appointment_id: 1002,
    patient_id: '1',
    patient_name: 'Sara Cole',
    doctor_id: 2,
    doctor_name: 'Dr. Layla Karim',
    department_id: 2,
    department_name: 'Dental',
    appointment_date: '2026-11-23',
    appointment_time: '04:00 PM',
    status: 'pending',
    reason: 'Severe tooth pain and swollen gums',
    booking_source: 'ai_assistant',
    created_at: new Date().toISOString(),
  },
];

function loadDiskAppointments() {
  try {
    if (fs.existsSync(APPOINTMENTS_FILE)) {
      const raw = fs.readFileSync(APPOINTMENTS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Error reading appointments.json:', err.message);
  }
  return [...DEFAULT_APPOINTMENTS];
}

function saveDiskAppointments(data) {
  try {
    fs.writeFileSync(APPOINTMENTS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving appointments.json:', err.message);
  }
}

if (!fs.existsSync(APPOINTMENTS_FILE)) {
  saveDiskAppointments(DEFAULT_APPOINTMENTS);
}

// GET /api/appointments - List all appointments
router.get('/', async (req, res) => {
  const { patient_id } = req.query;

  try {
    let query = supabase.from('appointments').select('*').order('created_at', { ascending: false });
    if (patient_id) {
      query = query.eq('patient_id', String(patient_id));
    }
    const { data, error } = await query;

    if (!error && Array.isArray(data) && data.length > 0) {
      saveDiskAppointments(data);
      return res.json({ success: true, appointments: data });
    }
  } catch (err) {
    console.warn('Supabase fetch appointments error:', err.message);
  }

  const diskAppointments = loadDiskAppointments();
  if (patient_id) {
    const filtered = diskAppointments.filter(
      (a) => String(a.patient_id) === String(patient_id) || a.patient_id === 1
    );
    return res.json({ success: true, appointments: filtered });
  }

  res.json({ success: true, appointments: diskAppointments });
});

// POST /api/appointments - Book new appointment
router.post('/', async (req, res) => {
  const {
    patient_id = '1',
    patient_name = 'Sara Cole',
    doctor_id,
    doctor_name,
    department_id,
    department_name,
    appointment_date,
    appointment_time,
    reason,
    booking_source = 'manual',
  } = req.body;

  const generatedId = Math.floor(1000 + Math.random() * 9000);

  const newApp = {
    id: generatedId,
    appointment_id: generatedId,
    patient_id: String(patient_id),
    patient_name: patient_name || 'Sara Cole',
    doctor_id: Number(doctor_id) || 1,
    doctor_name: doctor_name || 'Assigned Specialist',
    department_id: Number(department_id) || 1,
    department_name: department_name || 'General Clinic',
    appointment_date,
    appointment_time,
    status: 'pending',
    reason: reason || 'General clinical consultation',
    booking_source,
    created_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase.from('appointments').insert([newApp]).select();
    if (!error && data && data.length > 0) {
      newApp.id = data[0].id;
      newApp.appointment_id = data[0].appointment_id || data[0].id;
    }
  } catch (err) {
    console.warn('Supabase appointment insert error:', err.message);
  }

  const currentList = loadDiskAppointments();
  currentList.unshift(newApp);
  saveDiskAppointments(currentList);

  res.status(201).json({ success: true, appointment: newApp });
});

// PATCH /api/appointments/:id/status - Approve or Cancel appointment
router.patch('/:id/status', async (req, res) => {
  const appId = Number(req.params.id);
  const { status } = req.body;

  const currentList = loadDiskAppointments();
  const app = currentList.find(
    (a) => Number(a.appointment_id) === appId || Number(a.id) === appId
  );

  if (app) {
    app.status = status;

    try {
      await supabase.from('appointments').update({ status }).eq('id', appId);
    } catch {}

    saveDiskAppointments(currentList);
    return res.json({ success: true, appointment: app });
  }

  res.status(404).json({ success: false, message: 'Appointment not found' });
});

export default router;
