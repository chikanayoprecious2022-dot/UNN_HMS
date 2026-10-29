UNN HMS: Final Project Plan
Project Title
UNN HMS: AI-Assisted Hospital Appointment Booking and Management System

UNN HMS = University Hospital Management System

Project definition
UNN HMS is a web-based hospital appointment system for one hospital. Patients can browse doctors manually or use the visible UNN AI Assistant to describe symptoms, find the right department, view real available time slots, and book an appointment through natural language. Hospital staff manage doctors, departments, availability, and appointments through a secure dashboard.

1. Core Design Principle
Use this rule across the whole website:

AI should be impossible to miss, but manual booking should never be hidden.

The website will offer two equal booking paths:

Booking Path	Best for	User Action
Manual booking	Patients who already know the doctor or department	Browse Doctors → select doctor → choose slot → book
AI-assisted booking	Patients who know symptoms but not the right doctor	Describe symptoms → AI recommends department/doctor → choose slot → book
This avoids making AI feel like a small optional chat icon. The AI becomes part of the main patient journey.

2. AI Visibility Plan
AI will appear in six places:

Location	AI Element	Purpose
Homepage hero	Large “Ask UNN AI” button	First thing visitors see
Main navbar	“AI Assistant” menu link	Available from every page
Doctors page	AI banner above doctor list	Helps unsure patients
Doctor profile	“Ask AI Before Booking” button	Confirms suitable department
Booking page	“Let AI Help You Choose” option	Integrates AI into booking
Floating widget	Labeled “UNN AI Assistant”	Persistent help across pages
Patient dashboard	“Ask AI Health Assistant” quick action	Easy access after login
The AI should have one clear name and one clear purpose. Do not call it simply “Chat.” Use UNN AI Assistant or AI Health Assistant.

3. Updated Homepage Design
The homepage should make AI obvious immediately.

text
UNN HMS
University Hospital Management System

Book your appointment in two ways.

[ Book Appointment Manually ]      [ Ask UNN AI Assistant ]

Not sure which doctor you need?
Describe your symptoms and UNN AI will recommend
the right department, doctor, and available time.

Examples:
“I have tooth pain and swollen gums.”
“I need a cardiologist tomorrow.”
“Book Dr. C at 4 PM on 23rd November.”

[ Start AI Booking ]

Featured Departments
Cardiology | Dental | Pediatrics | Dermatology

Featured Doctors
Dr. Sara Ahmed | Dr. Omar Hassan | Dr. Layla Karim

[ View All Doctors ]
The homepage should have one main action—booking—and repeat it at natural decision points. A prominent AI button should sit above the fold, next to the normal booking button.

4. Updated Navigation Bar
Use this navbar on every public page:

text
UNN HMS        Home | Departments | Doctors | AI Assistant | Contact Us

                                    [ Book Appointment ]  [ AI Assistant ]
On mobile:

text
UNN HMS                    ☰

AI Assistant button remains visible.
The AI Assistant should be a top-level navigation item, not buried inside a menu.

5. Updated Doctors Page
Keep the Doctors page, but add an AI banner at the top.

text
Not sure which doctor to choose?

Let UNN AI recommend the right department and doctor
based on your symptoms.

[ Ask AI Health Assistant ]
Below the banner:

text
Search Doctors
[ Search by doctor name ]

Filter by:
[ Department ] [ Specialty ] [ Available Day ]

Doctor Cards:
- Dr. Sara Ahmed
  Cardiology | 10 years experience | $30
  Next available: Tomorrow, 10:00 AM
  [ View Profile ] [ Book Appointment ]

- Dr. Layla Karim
  Dental | 8 years experience | $25
  Next available: 23 Nov, 4:00 PM
  [ View Profile ] [ Book Appointment ]
This keeps manual browsing available while guiding uncertain patients to AI.

6. Updated Doctor Profile Page
Each doctor profile will include an AI section.

text
Dr. Layla Karim
Department: Dental
Specialization: General Dentistry
Experience: 8 years
Consultation Fee: $25

Available Days:
Sunday, Monday, Wednesday

Available Slots:
10:00 AM | 12:30 PM | 4:00 PM

[ Book Appointment ]

Not sure if this doctor is right for you?
Describe your symptoms and UNN AI will check whether
this department is suitable and suggest other options.

[ Ask AI Before Booking ]
If the patient describes dental pain, the AI confirms Dental is suitable. If the patient describes chest pain, the AI recommends Cardiology instead.

7. Updated Booking Page
The booking page should offer two clear paths.

text
Book an Appointment

How would you like to book?

Option 1: Choose Manually
Select department → doctor → date → time slot.

[ Start Manual Booking ]

Option 2: Let UNN AI Help You
Describe your symptoms or preferred doctor/time.

Example:
“I have a skin rash.”
“Book Dr. Sara at 10 AM tomorrow.”
“Book Dr. C at 4 PM on 23rd November.”

[ Start AI Booking ]
This makes AI part of the booking flow rather than a separate tool.

8. AI Health Assistant Page
Create a dedicated, prominent page called:

AI Health Assistant
It should not look like a basic support chat. It should look like a smart hospital booking tool.

Page layout
text
UNN AI Health Assistant

Describe your symptoms or booking request:

[ I have tooth pain and swollen gums ]

[ Analyze Symptoms ]

AI Recommendation:
Recommended Department: Dental
Urgency: Routine
Recommended Action: Book an appointment with a dentist.

Available Dentists:
- Dr. Layla Karim: 10:00 AM, 12:30 PM, 4:00 PM
- Dr. Omar Hassan: 11:00 AM, 3:30 PM

[ Book Dr. Layla at 4:00 PM ]

Disclaimer:
This AI assistant provides a preliminary, non-diagnostic
recommendation. It does not replace professional medical advice.
Quick-start buttons
Show clickable examples so users immediately understand the AI:

“I have tooth pain.”

“My child has fever and cough.”

“I have a skin rash.”

“Show available cardiologists tomorrow.”

“Book Dr. Sara at 10 AM.”

“Book Dr. C at 4 PM on 23rd November.”

Clear starter prompts help users understand what the assistant can do.

9. AI Booking Conversation
Example 1: Symptom-based booking
text
Patient: I have tooth pain and swollen gums.

AI: Based on your symptoms, I recommend the Dental department.
    Would you like to see available dentists?

Patient: Yes.

AI: I found these available dentists:
    1. Dr. Layla Karim — 10:00 AM, 12:30 PM, 4:00 PM
    2. Dr. Omar Hassan — 11:00 AM, 3:30 PM

    Which doctor and time would you like?

Patient: Book Dr. Layla at 4 PM on 23rd November.

AI: Please confirm your appointment:
    Doctor: Dr. Layla Karim
    Department: Dental
    Date: 23 November 2026
    Time: 4:00 PM
    Reason: Dental consultation

    Reply “Confirm” to book.

Patient: Confirm.

AI: Your appointment has been booked successfully.
    Status: Pending
    A confirmation email has been sent to you.
Example 2: Direct doctor booking
text
Patient: Book Dr. C at 4 PM on 23rd November.

AI: Let me check Dr. C’s availability.

AI: Dr. C is available on 23 November at 4:00 PM.
    Please confirm:
    Doctor: Dr. C
    Department: Cardiology
    Date: 23 November 2026
    Time: 4:00 PM

    Reply “Confirm” to book.

Patient: Confirm.

AI: Your appointment with Dr. C has been booked successfully.
    Status: Pending.
Example 3: Slot conflict
text
Patient: Book Dr. C at 4 PM on 23rd November.

AI: Dr. C is available at 4:00 PM.
    Shall I book it?

Patient: Confirm.

AI: Sorry, the 4:00 PM slot was just taken.
    Dr. C still has:
    - 4:30 PM
    - 5:00 PM

    Would you like one of these instead?
Example 4: Emergency case
text
Patient: I have severe chest pain and difficulty breathing.

AI: These may be emergency symptoms.
    Please call emergency services or go to the nearest
    emergency department immediately.

    I cannot book a routine appointment for this situation.
10. AI System Rules
The AI must follow these rules:

Never diagnose a disease.

Never prescribe medicine.

Never invent doctors, departments, dates, or time slots.

Show only real availability returned by the backend.

Ask for confirmation before booking.

Repeat doctor name, department, date, time, and reason before booking.

Never book unless the patient explicitly confirms.

Detect emergency symptoms and direct the patient to emergency care.

Allow the patient to ignore AI and book manually.

Keep working normally if the AI service fails.

The AI must not decide availability itself; the hospital scheduling system remains the source of truth.

11. AI Tools
Give the AI access to these backend functions:

Tool	Purpose
recommend_department(symptoms)	Analyze symptoms and recommend department
search_doctors(department, date)	Find active doctors and available slots
get_available_slots(doctor_id, date)	Return real available time slots
book_appointment(patient_id, doctor_id, date, time, reason, confirmed)	Book only after confirmation
cancel_appointment(appointment_id, confirmed)	Cancel patient’s appointment
reschedule_appointment(appointment_id, new_date, new_time, confirmed)	Move appointment
The AI must call these tools; it must not directly modify the database.

12. Updated Pages: 24 Total
Public Website — 8 pages
Home — with large AI booking section

About Hospital

Departments

Doctors — with AI banner

Doctor Profile — with “Ask AI Before Booking”

AI Health Assistant — main AI page

Book Appointment — manual and AI options

Contact Us

Patient Dashboard — 5 pages
Patient Register

Patient Login

Patient Dashboard — includes AI quick action

My Appointments

Patient Profile

Doctor Dashboard — 3 pages
Doctor Login

Doctor Dashboard

Doctor Appointments and Availability

Hospital Dashboard — 6 pages
Hospital Login

Hospital Dashboard

Manage Doctors

Manage Departments

Manage Availability

Manage Appointments

AI Recommendations Report

Hospital Settings — optional

13. Updated Database Design
Use these main tables:

users

departments

doctors

availability

blocked_dates

appointments

notifications

ai_recommendations

symptom_department_mapping

appointments
sql
CREATE TABLE appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    department_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('pending','confirmed','completed','cancelled','no_show') DEFAULT 'pending',
    reason TEXT,
    booking_source ENUM('manual','ai_assistant') DEFAULT 'manual',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(user_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);
ai_recommendations
sql
CREATE TABLE ai_recommendations (
    recommendation_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NULL,
    symptoms_text TEXT NOT NULL,
    recommended_department_id INT NULL,
    urgency_level ENUM('routine','urgent','emergency') NOT NULL,
    emergency_detected TINYINT(1) DEFAULT 0,
    ai_response TEXT,
    converted_to_booking TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(user_id),
    FOREIGN KEY (recommended_department_id) REFERENCES departments(department_id)
);
symptom_department_mapping
sql
CREATE TABLE symptom_department_mapping (
    mapping_id INT AUTO_INCREMENT PRIMARY KEY,
    keyword VARCHAR(100) NOT NULL,
    department_id INT NOT NULL,
    urgency_level ENUM('routine','urgent','emergency') DEFAULT 'routine',
    weight INT DEFAULT 1,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);
14. Updated AI Flow
text
Patient opens UNN HMS
        |
        v
Sees large AI button on homepage
        |
        v
Opens AI Health Assistant
        |
        v
Types symptoms or booking request
        |
        v
AI analyzes request
        |
        +-----------------------------+
        |                             |
        v                             v
Emergency detected?          Routine / urgent request
        |                             |
        v                             v
Show emergency warning      AI recommends department
Do not book routine slot            |
                                    v
                         AI shows real available doctors
                                    |
                                    v
                         Patient selects doctor and slot
                                    |
                                    v
                         AI repeats appointment details
                                    |
                                    v
                         Patient replies “Confirm”
                                    |
                                    v
                         Backend rechecks availability
                                    |
                       +------------+-------------+
                       |                          |
                       v                          v
                 Slot available              Slot taken
                       |                          |
                       v                          v
              Save as Pending             Show alternatives
              Send confirmation email
15. Updated Demo Script
Use this sequence during the defense:

Open UNN HMS Home.

Point to the large Ask UNN AI Assistant button.

Explain: “Patients can book manually or ask AI for help.”

Click Ask UNN AI Assistant.

Type: “I have tooth pain and swollen gums.”

Show AI recommendation: Dental, Routine.

Click View Available Dentists.

Show real dentists and available slots.

Type: “Book Dr. Layla at 4 PM on 23rd November.”

Show AI confirmation summary.

Type: “Confirm.”

Show successful booking.

Open My Appointments and show the new Pending appointment.

Log in as hospital admin.

Open Manage Appointments.

Confirm the appointment.

Log in as patient and show Confirmed status.

Return to AI Assistant.

Type: “I have severe chest pain and difficulty breathing.”

Show emergency warning.

Explain that AI does not book routine appointments in emergencies.

Open the Doctors page.

Explain that patients can also browse and book manually.

16. Updated Defense Answer
If the panel asks:

“Why do you have a Doctors page if AI can book appointments?”

Answer:

“The Doctors page is for patients who already know which doctor or department they need. The AI Assistant is for patients who only know their symptoms or want to book using natural language. Both options use the same real-time availability and booking system. AI is a visible assistance layer, not a replacement for manual booking.”

17. Final Recommendation
Build UNN HMS with:

A normal Doctors page for manual browsing.

A large AI Health Assistant button on the homepage.

AI Assistant in the navbar.

An AI banner on the Doctors page.

An Ask AI Before Booking button on doctor profiles.

An AI booking option on the Book Appointment page.

A labeled floating UNN AI Assistant widget.

AI symptom recommendation.

AI doctor and slot search.

AI conversational booking with confirmation.

Emergency detection.

Manual booking fallback.

This makes AI a clear, central feature of UNN HMS while keeping the system simple, safe, and easy to defend.