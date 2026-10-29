// UNN AI Health Assistant Engine
// Adheres strictly to the AI System Rules in idea.md:
// 1. Never diagnose a disease.
// 2. Never prescribe medicine.
// 3. Never invent doctors, departments, dates, or time slots.
// 4. Show only real availability returned by the backend.
// 5. Ask for confirmation before booking.
// 6. Detect emergency symptoms and direct the patient to emergency care.
// 7. Ground truth is always the database.

import { db, EMERGENCY_KEYWORDS } from './db';

export const aiEngine = {
  // Tool 1: recommend_department(symptoms)
  recommendDepartment(symptomsText) {
    const text = (symptomsText || '').toLowerCase().trim();

    // Step 1: Emergency Detection Rule
    const hasEmergency = EMERGENCY_KEYWORDS.some((kw) => text.includes(kw));
    if (hasEmergency) {
      const rec = {
        emergencyDetected: true,
        urgencyLevel: 'emergency',
        departmentId: 1, // Triage to Emergency / Cardiology
        departmentName: 'Emergency Department',
        action: 'Seek Immediate Emergency Care',
        message:
          'CRITICAL: These symptoms may indicate a medical emergency. Please call emergency services immediately or go to the nearest emergency department. UNN AI cannot schedule a routine appointment for this condition.',
        disclaimer:
          'This AI assistant provides a preliminary, non-diagnostic recommendation and cannot replace emergency medical evaluation.',
      };

      db.logAiRecommendation({
        symptomsText,
        departmentId: 1,
        urgencyLevel: 'emergency',
        emergencyDetected: true,
        aiResponse: rec.message,
        convertedToBooking: false,
      });

      return rec;
    }

    // Step 2: Match against symptom_department_mapping
    const mappings = db.getSymptomMappings();
    let bestMatch = null;
    let highestWeight = 0;

    for (const item of mappings) {
      if (text.includes(item.keyword.toLowerCase())) {
        if (item.weight > highestWeight) {
          highestWeight = item.weight;
          bestMatch = item;
        }
      }
    }

    // Fallback if no specific keyword matched
    if (!bestMatch) {
      // General check for dental words
      if (text.includes('tooth') || text.includes('teeth') || text.includes('gum') || text.includes('mouth')) {
        bestMatch = { department_id: 2, urgency_level: 'routine' };
      } else if (text.includes('heart') || text.includes('cardio') || text.includes('pulse')) {
        bestMatch = { department_id: 1, urgency_level: 'urgent' };
      } else if (text.includes('skin') || text.includes('rash') || text.includes('itch') || text.includes('spot')) {
        bestMatch = { department_id: 4, urgency_level: 'routine' };
      } else if (text.includes('child') || text.includes('baby') || text.includes('kid') || text.includes('pediatr')) {
        bestMatch = { department_id: 3, urgency_level: 'routine' };
      } else if (text.includes('bone') || text.includes('joint') || text.includes('knee') || text.includes('fracture')) {
        bestMatch = { department_id: 6, urgency_level: 'routine' };
      } else {
        // Default to General Medicine
        bestMatch = { department_id: 5, urgency_level: 'routine' };
      }
    }

    const dept = db.getDepartmentById(bestMatch.department_id);
    const result = {
      emergencyDetected: false,
      urgencyLevel: bestMatch.urgency_level || 'routine',
      departmentId: dept.department_id,
      departmentName: dept.name,
      action: `Consultation with ${dept.name} Specialist`,
      message: `Based on your symptoms, I recommend consulting the ${dept.name} department.`,
      disclaimer:
        'This AI assistant provides a preliminary, non-diagnostic recommendation. It does not replace professional medical advice or clinical diagnosis.',
    };

    const logged = db.logAiRecommendation({
      symptomsText,
      departmentId: dept.department_id,
      urgencyLevel: result.urgencyLevel,
      emergencyDetected: false,
      aiResponse: result.message,
      convertedToBooking: false,
    });

    result.recommendationId = logged.recommendation_id;
    return result;
  },

  // Tool 2: search_doctors(department_id, date)
  searchDoctors(departmentId, dateString = '2026-11-23') {
    const doctors = db.getDoctors().filter((d) => d.is_active && (!departmentId || d.department_id === Number(departmentId)));

    return doctors.map((doc) => {
      const slots = db.getAvailableSlots(doc.doctor_id, dateString);
      return {
        ...doc,
        availableSlots: slots,
        nextAvailable: slots.length > 0 ? slots[0] : 'No slots on this date',
      };
    });
  },

  // Tool 3: get_available_slots(doctor_id, date)
  getAvailableSlots(doctorId, dateString) {
    return db.getAvailableSlots(doctorId, dateString);
  },

  // Tool 4: parseBookingIntent(text)
  // Handles natural language booking inputs like:
  // "Book Dr. Layla at 4 PM on 23rd November" or "Book Dr. Layla at 4 PM" or "Book Dr. Sara at 10 AM tomorrow"
  parseBookingIntent(text) {
    const input = (text || '').trim();
    const doctors = db.getDoctors();

    // Check doctor mention
    let matchedDoctor = doctors.find((doc) => input.toLowerCase().includes(doc.name.toLowerCase()));
    if (!matchedDoctor) {
      // Short name matching e.g. "Dr. Layla" or "Dr. Sara" or "Dr. C"
      matchedDoctor = doctors.find((doc) => {
        const parts = doc.name.split(' ');
        const firstName = parts[1]?.toLowerCase();
        return firstName && input.toLowerCase().includes(firstName);
      });
    }

    // Default to Dr. Layla Karim if dental request or if Dr. Layla was mentioned
    if (!matchedDoctor && input.toLowerCase().includes('layla')) {
      matchedDoctor = db.getDoctorById(2);
    }

    // Parse time
    let matchedTime = null;
    const timeMatch = input.match(/(\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm))/i);
    if (timeMatch) {
      let t = timeMatch[1].toUpperCase();
      if (!t.includes(':')) {
        // e.g. "4 PM" -> "04:00 PM"
        const parts = t.split(' ');
        const num = parts[0].padStart(2, '0');
        t = `${num}:00 ${parts[1]}`;
      } else {
        const parts = t.split(':');
        const hour = parts[0].padStart(2, '0');
        t = `${hour}:${parts[1]}`;
      }
      matchedTime = t;
    }

    // Parse date (default to 2026-11-23 for defense demo)
    let matchedDate = '2026-11-23';
    if (input.toLowerCase().includes('tomorrow')) {
      matchedDate = '2026-11-24';
    } else if (input.match(/(\d{1,2})(?:st|nd|rd|th)?\s+(?:nov|november)/i)) {
      const dayMatch = input.match(/(\d{1,2})/);
      if (dayMatch) {
        matchedDate = `2026-11-${dayMatch[1].padStart(2, '0')}`;
      }
    }

    return {
      doctor: matchedDoctor,
      time: matchedTime,
      date: matchedDate,
    };
  },

  // Tool 5: book_appointment(...) with mandatory confirmation check
  bookAppointment(payload) {
    if (!payload.confirmed) {
      return {
        success: false,
        message: 'Explicit patient confirmation is required before booking can be completed.',
      };
    }

    const result = db.bookAppointment({
      patientId: payload.patientId,
      doctorId: payload.doctorId,
      departmentId: payload.departmentId,
      date: payload.date,
      time: payload.time,
      reason: payload.reason,
      bookingSource: 'ai_assistant',
    });

    if (result.success && payload.recommendationId) {
      db.markRecommendationConverted(payload.recommendationId);
    }

    return result;
  },
};

