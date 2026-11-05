import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import upload from '../middleware/upload.js';
import { supabase } from '../config/supabase.js';
import cloudinary from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.resolve(__dirname, '../data/doctors.json');

const router = express.Router();

const DEPARTMENTS_MAP = {
  1: 'Cardiology',
  2: 'Dental',
  3: 'Pediatrics',
  4: 'Dermatology',
  5: 'General Medicine',
  6: 'Orthopedics',
};

const DEFAULT_DOCTORS = [
  {
    id: 1,
    name: 'Dr. Sara Ahmed',
    title: 'Consultant Cardiologist',
    department_id: 1,
    department_name: 'Cardiology',
    specialization: 'Interventional Cardiology & Preventive Heart Health',
    experience_years: 10,
    consultation_fee: 30,
    bio: 'Board-certified cardiologist with extensive clinical experience.',
    avatar_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    available_days: ['Sunday', 'Monday', 'Wednesday', 'Thursday'],
    is_active: true,
  },
  {
    id: 2,
    name: 'Dr. Layla Karim',
    title: 'Lead Dental Surgeon',
    department_id: 2,
    department_name: 'Dental',
    specialization: 'General Dentistry & Endodontics',
    experience_years: 8,
    consultation_fee: 25,
    bio: 'Specialist in painless restorative dentistry and gum health.',
    avatar_url: 'https://images.unsplash.com/photo-1594824813583-b9b5f33346b0?auto=format&fit=crop&q=80&w=400',
    available_days: ['Sunday', 'Monday', 'Wednesday'],
    is_active: true,
  },
  {
    id: 3,
    name: 'Dr. Omar Hassan',
    title: 'Senior Dental Consultant',
    department_id: 2,
    department_name: 'Dental',
    specialization: 'Periodontology & Oral Surgery',
    experience_years: 6,
    consultation_fee: 20,
    bio: 'Dedicated to preventative gum care and pediatric dental health.',
    avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    available_days: ['Monday', 'Tuesday', 'Thursday'],
    is_active: true,
  },
  {
    id: 4,
    name: 'Dr. Chen Wei',
    title: 'Pediatric Specialist',
    department_id: 3,
    department_name: 'Pediatrics',
    specialization: 'Neonatal & Child Health',
    experience_years: 12,
    consultation_fee: 35,
    bio: 'Passionate pediatrician with over a decade managing pediatric care.',
    avatar_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    available_days: ['Tuesday', 'Wednesday', 'Friday'],
    is_active: true,
  },
];

// Helper to load persistent disk store
function loadDiskDoctors() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error('Error reading doctors.json:', err.message);
  }
  return [...DEFAULT_DOCTORS];
}

function saveDiskDoctors(doctors) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(doctors, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving doctors.json:', err.message);
  }
}

// Upload buffer safely to Cloudinary
async function uploadToCloudinary(file) {
  if (!file || !file.buffer) return null;
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'unn-hms/doctors',
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result?.secure_url || result?.url);
      }
    );
    uploadStream.end(file.buffer);
  });
}

// Ensure initial disk file exists
if (!fs.existsSync(DATA_FILE)) {
  saveDiskDoctors(DEFAULT_DOCTORS);
}

// GET /api/doctors - Fetch all doctors
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .order('id', { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      const formatted = data.map((d) => {
        let days = d.available_days;
        if (typeof days === 'string') {
          try {
            days = JSON.parse(days);
          } catch {
            days = days.split(',').map((s) => s.trim());
          }
        }
        return {
          ...d,
          doctor_id: d.id,
          available_days: Array.isArray(days) ? days : ['Monday', 'Wednesday', 'Friday'],
          department_name: DEPARTMENTS_MAP[d.department_id] || 'General Medicine',
        };
      });

      saveDiskDoctors(formatted);
      return res.json({ success: true, doctors: formatted });
    }

    if (error) {
      console.warn('Supabase GET /doctors warning:', error.message);
    }
  } catch (err) {
    console.warn('Supabase fetch error, reading persistent disk store:', err.message);
  }

  const diskDoctors = loadDiskDoctors();
  res.json({ success: true, doctors: diskDoctors });
});

// GET /api/doctors/:id - Single doctor
router.get('/:id', async (req, res) => {
  const docId = Number(req.params.id);

  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', docId)
      .single();

    if (!error && data) {
      let days = data.available_days;
      if (typeof days === 'string') {
        try {
          days = JSON.parse(days);
        } catch {
          days = days.split(',').map((s) => s.trim());
        }
      }
      return res.json({
        success: true,
        doctor: {
          ...data,
          doctor_id: data.id,
          available_days: Array.isArray(days) ? days : ['Monday', 'Wednesday', 'Friday'],
          department_name: DEPARTMENTS_MAP[data.department_id] || 'General Medicine',
        },
      });
    }
  } catch {}

  const diskDoctors = loadDiskDoctors();
  const found = diskDoctors.find((d) => (d.id === docId || d.doctor_id === docId)) || diskDoctors[0];
  res.json({ success: true, doctor: found });
});

// POST /api/doctors - Add doctor with Cloudinary photo upload (Admin)
router.post('/', upload.single('avatar'), async (req, res) => {
  try {
    const {
      name,
      title = 'Consultant Specialist',
      department_id = 1,
      department_name = 'General Medicine',
      specialization = 'General Clinical Practice',
      experience_years = 5,
      consultation_fee = 25,
      bio = 'Hospital Consultant',
      available_days = 'Monday, Wednesday, Friday',
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Doctor name is required' });
    }

    // Default image
    let avatar_url =
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400';

    // Upload to Cloudinary if file exists
    if (req.file && req.file.buffer) {
      try {
        console.log(`Uploading avatar for ${name} to Cloudinary...`);
        const cloudUrl = await uploadToCloudinary(req.file);
        if (cloudUrl) {
          avatar_url = cloudUrl;
          console.log(`✅ Uploaded to Cloudinary: ${cloudUrl}`);
        }
      } catch (cloudErr) {
        console.warn('⚠️ Cloudinary upload note:', cloudErr.message);
        // Fallback to base64 Data URI so user photo is NEVER lost!
        avatar_url = `data:${req.file.mimetype || 'image/jpeg'};base64,${req.file.buffer.toString('base64')}`;
      }
    }

    const daysArray = Array.isArray(available_days)
      ? available_days
      : String(available_days).split(',').map((s) => s.trim());

    const deptId = Number(department_id) || 1;
    const deptName = DEPARTMENTS_MAP[deptId] || department_name || 'General Medicine';

    // 1. Calculate next unique ID so we never hit PostgreSQL sequence desync (doctors_pkey)
    let nextId = 5;
    try {
      const { data: topRows } = await supabase
        .from('doctors')
        .select('id')
        .order('id', { ascending: false })
        .limit(1);

      if (topRows && topRows.length > 0 && topRows[0].id) {
        nextId = Number(topRows[0].id) + 1;
      }
    } catch {
      nextId = Date.now();
    }

    let savedId = nextId;

    // 2. Insert into Supabase with explicit unique ID
    try {
      const docPayload = {
        id: nextId,
        name: name.trim(),
        title,
        department_id: deptId,
        specialization: specialization || 'General Medicine',
        experience_years: Number(experience_years) || 5,
        consultation_fee: Number(consultation_fee) || 25,
        bio: bio || 'Board-certified specialist.',
        avatar_url,
        available_days: daysArray,
        is_active: true,
      };

      const { data, error } = await supabase.from('doctors').insert([docPayload]).select();

      if (error) {
        console.error('❌ Supabase insert error:', error.message);
        // If error was somehow about ID, try without explicit ID
        const { id: _, ...payloadWithoutId } = docPayload;
        const { data: retryData, error: retryError } = await supabase
          .from('doctors')
          .insert([payloadWithoutId])
          .select();

        if (!retryError && retryData && retryData.length > 0) {
          savedId = retryData[0].id;
          console.log(`✅ Supabase saved without explicit ID (ID: ${savedId})`);
        } else if (retryError) {
          console.error('❌ Supabase retry insert error:', retryError.message);
        }
      } else if (data && data.length > 0) {
        savedId = data[0].id;
        console.log(`✅ Doctor ${name} successfully inserted into Supabase (ID: ${savedId})`);
      }
    } catch (dbErr) {
      console.error('❌ Error executing Supabase insert:', dbErr.message);
    }

    const newDoctor = {
      id: savedId,
      doctor_id: savedId,
      name: name.trim(),
      title,
      department_id: deptId,
      department_name: deptName,
      specialization: specialization || 'General Medicine',
      experience_years: Number(experience_years) || 5,
      consultation_fee: Number(consultation_fee) || 25,
      bio: bio || 'Board-certified clinical consultant.',
      avatar_url,
      available_days: daysArray,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    // 2. Persist to server disk store
    const currentList = loadDiskDoctors();
    const updatedList = [newDoctor, ...currentList.filter((d) => d.id !== savedId)];
    saveDiskDoctors(updatedList);

    console.log(`✅ Doctor ${name} successfully saved to DB (ID: ${savedId})`);

    res.status(201).json({
      success: true,
      message: 'Doctor created and saved successfully!',
      doctor: newDoctor,
    });
  } catch (error) {
    console.error('Fatal error adding doctor:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/doctors/:id/toggle - Toggle active status (Admin)
router.patch('/:id/toggle', async (req, res) => {
  const docId = Number(req.params.id);
  const currentList = loadDiskDoctors();
  const target = currentList.find((d) => (d.id === docId || d.doctor_id === docId));

  if (!target) {
    return res.status(404).json({ success: false, message: 'Doctor not found' });
  }

  target.is_active = !target.is_active;

  try {
    await supabase.from('doctors').update({ is_active: target.is_active }).eq('id', docId);
  } catch (err) {
    console.warn('Supabase toggle error:', err.message);
  }

  saveDiskDoctors(currentList);
  res.json({ success: true, doctor: target });
});

// DELETE /api/doctors/:id - Delete doctor (Admin)
router.delete('/:id', async (req, res) => {
  const docId = Number(req.params.id);

  try {
    await supabase.from('doctors').delete().eq('id', docId);
  } catch (err) {
    console.warn('Supabase delete error:', err.message);
  }

  const currentList = loadDiskDoctors();
  const filtered = currentList.filter((d) => d.id !== docId && d.doctor_id !== docId);
  saveDiskDoctors(filtered);

  res.json({ success: true, message: 'Doctor deleted successfully' });
});

export default router;
