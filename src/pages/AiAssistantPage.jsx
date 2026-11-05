import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { aiEngine } from '../services/aiEngine';
import {
  Bot,
  Send,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  PanelLeft,
  PanelLeftClose,
  Plus,
  MessageSquare,
  Trash2,
} from 'lucide-react';

const STORAGE_CHATS_KEY = 'unn_hms_ai_chat_sessions';

const INITIAL_GREETING = {
  id: 1,
  sender: 'ai',
  type: 'greeting',
  text: 'Hello! I am the UNN AI Health Assistant. Describe your symptoms or tell me which doctor and time you would like to book. I will recommend the right department and help you schedule an appointment.',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

export default function AiAssistantPage({ currentUser }) {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || searchParams.get('symptoms') || '';

  // Sidebar closed by default on mobile, open on desktop
  const [sidebarOpen, setSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);

  // Multi-session state in brand theme
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CHATS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'session-default',
        title: 'New Consultation',
        messages: [INITIAL_GREETING],
      },
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState(sessions[0]?.id || 'session-default');
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState(null);

  const messagesEndRef = useRef(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const messages = activeSession?.messages || [INITIAL_GREETING];

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CHATS_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.error(e);
    }
  }, [sessions]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickStartPrompts = [
    'I have tooth pain and swollen gums.',
    'Book Dr. Layla at 4 PM on 23rd November.',
    'I have severe chest pain and difficulty breathing.',
    'I have a skin rash on my arms.',
  ];

  const handleNewChat = () => {
    const newId = `session-${Date.now()}`;
    const newSession = {
      id: newId,
      title: 'New Consultation',
      messages: [
        {
          id: Date.now(),
          sender: 'ai',
          type: 'greeting',
          text: 'Hello! What symptoms are you experiencing today? I can help you find the right hospital doctor and book your appointment.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newId);
    setPendingConfirmation(null);
  };

  const handleDeleteSession = (e, sessionId) => {
    e.stopPropagation();
    if (sessions.length === 1) {
      handleNewChat();
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      return;
    }
    const updated = sessions.filter((s) => s.id !== sessionId);
    setSessions(updated);
    if (activeSessionId === sessionId) {
      setActiveSessionId(updated[0]?.id);
    }
  };

  const updateSessionMessages = (newMsg) => {
    setSessions((prevSessions) =>
      prevSessions.map((sess) => {
        if (sess.id === activeSessionId) {
          const updatedMessages = [...sess.messages, newMsg];
          let newTitle = sess.title;
          if (sess.title === 'New Consultation' && newMsg.sender === 'user') {
            newTitle = newMsg.text.length > 25 ? newMsg.text.slice(0, 25) + '...' : newMsg.text;
          }
          return {
            ...sess,
            title: newTitle,
            messages: updatedMessages,
          };
        }
        return sess;
      })
    );
  };

  const handleUserSubmit = (textToSubmit) => {
    const text = (textToSubmit || inputValue).trim();
    if (!text) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    updateSessionMessages(userMsg);
    if (!textToSubmit) setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      processAiResponse(text);
      setIsTyping(false);
    }, 500);
  };

  useEffect(() => {
    if (initialQuery) {
      handleUserSubmit(initialQuery);
    }
  }, [initialQuery]);

  const processAiResponse = (userInput) => {
    const text = userInput.toLowerCase();

    // 1. Confirm pending booking
    if (pendingConfirmation && (text === 'confirm' || text.includes('confirm') || text === 'yes')) {
      const bookingResult = aiEngine.bookAppointment({
        patientId: currentUser?.user_id || 1,
        doctorId: pendingConfirmation.doctorId,
        departmentId: pendingConfirmation.departmentId,
        date: pendingConfirmation.date,
        time: pendingConfirmation.time,
        reason: pendingConfirmation.reason,
        confirmed: true,
      });

      if (bookingResult.success) {
        const successMsg = {
          id: Date.now() + 1,
          sender: 'ai',
          type: 'booking_success',
          text: 'Your appointment has been booked successfully!',
          appointment: bookingResult.appointment,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        updateSessionMessages(successMsg);
        setPendingConfirmation(null);
      }
      return;
    }

    // 2. Emergency Check
    const recommendation = aiEngine.recommendDepartment(userInput);
    if (recommendation.emergencyDetected) {
      const emergencyMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        type: 'emergency',
        recommendation,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      updateSessionMessages(emergencyMsg);
      setPendingConfirmation(null);
      return;
    }

    // 3. Direct booking intent
    if (text.startsWith('book') || (text.includes('book') && text.includes('at'))) {
      const parsed = aiEngine.parseBookingIntent(userInput);
      if (parsed.doctor) {
        const timeToBook = parsed.time || '04:00 PM';
        const dateToBook = parsed.date || '2026-11-23';

        const confirmationPayload = {
          doctorId: parsed.doctor.doctor_id || parsed.doctor.id,
          doctorName: parsed.doctor.name,
          departmentId: parsed.doctor.department_id,
          departmentName: parsed.doctor.department_name || 'General Clinic',
          date: dateToBook,
          time: timeToBook,
          reason: 'Symptom consultation',
        };

        setPendingConfirmation(confirmationPayload);

        const confirmRequestMsg = {
          id: Date.now() + 1,
          sender: 'ai',
          type: 'confirmation_required',
          text: `Please confirm your appointment details:`,
          details: confirmationPayload,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        updateSessionMessages(confirmRequestMsg);
        return;
      }
    }

    // 4. Symptom-based triage & show doctor cards
    const matchingDoctors = aiEngine.searchDoctors(recommendation.departmentId, '2026-11-23');

    const triageMsg = {
      id: Date.now() + 1,
      sender: 'ai',
      type: 'triage_result',
      recommendation,
      doctors: matchingDoctors,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    updateSessionMessages(triageMsg);
  };

  const handleSelectSlot = (doctor, slotTime) => {
    const confirmationPayload = {
      doctorId: doctor.doctor_id || doctor.id,
      doctorName: doctor.name,
      departmentId: doctor.department_id,
      departmentName: doctor.department_name || 'General Clinic',
      date: '2026-11-23',
      time: slotTime,
      reason: 'Clinical appointment',
    };

    setPendingConfirmation(confirmationPayload);

    const confirmRequestMsg = {
      id: Date.now(),
      sender: 'ai',
      type: 'confirmation_required',
      text: 'Please confirm your appointment details:',
      details: confirmationPayload,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    updateSessionMessages(confirmRequestMsg);
  };

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4">
      {/* Brand-Themed Chat Container */}
      <div className="bg-white shadow-lg border border-[#008080]/20 rounded-2xl flex h-[calc(100vh-140px)] min-h-[500px] overflow-hidden relative">

        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-slate-900/40 z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ================= SIDEBAR ================= */}
        <aside
          className={`${
            sidebarOpen ? 'flex' : 'hidden md:hidden'
          } w-64 sm:w-72 bg-[#ebf1f1] text-slate-700 flex-col shrink-0 border-r border-[#008080]/20
          absolute md:relative inset-y-0 left-0 z-30 md:z-auto transition-all duration-300`}
        >
          {/* New Chat Button */}
          <div className="p-3 border-b border-[#008080]/15">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#008080] hover:bg-[#006666] text-white font-heading font-bold text-xs shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 text-emerald-200" />
              <span>New Chat</span>
            </button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs">
            <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#008080] block">
              Recent Consultations
            </span>

            {sessions.map((sess) => {
              const isActive = sess.id === activeSessionId;
              return (
                <div
                  key={sess.id}
                  onClick={() => {
                    setActiveSessionId(sess.id);
                    setPendingConfirmation(null);
                  }}
                  className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                    isActive
                      ? 'bg-white text-[#008080] font-bold border-l-4 border-[#008080] shadow-xs'
                      : 'text-slate-600 hover:text-[#008080] hover:bg-white/60'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 pr-1">
                    <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#008080]' : 'text-slate-400'}`} />
                    <span className="truncate text-xs">{sess.title}</span>
                  </div>

                  <button
                    onClick={(e) => handleDeleteSession(e, sess.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Patient Profile Card */}
          <div className="p-3 border-t border-[#008080]/15 bg-white flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#008080] text-white flex items-center justify-center font-bold text-xs shrink-0">
              {currentUser?.name?.charAt(0) || 'P'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">{currentUser?.name || 'Patient'}</p>
              <Link to="/dashboard" className="text-[10px] text-[#008080] font-semibold hover:underline block">
                Go to Dashboard →
              </Link>
            </div>
          </div>
        </aside>

        {/* ================= MAIN CHAT ================= */}
        <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
          {/* Header */}
          <div className="h-13 border-b border-[#008080]/15 px-4 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-[#008080] hover:bg-[#ebf1f1]"
                title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
              >
                {sidebarOpen ? <PanelLeftClose className="w-4 h-4 text-[#008080]" /> : <PanelLeft className="w-4 h-4 text-[#008080]" />}
              </button>
              <h2 className="font-heading font-bold text-xs sm:text-sm text-slate-900 truncate">
                UNN AI Assistant
              </h2>
            </div>

            <Link
              to="/dashboard"
              className="text-xs font-bold text-[#008080] hover:underline flex items-center gap-1"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#ebf1f1]/40">
            <div className="max-w-2xl mx-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-7 h-7 rounded-lg bg-[#008080] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-4 h-4 text-emerald-200" />
                    </div>
                  )}

                  <div
                    className={`space-y-2.5 max-w-xl ${
                      msg.sender === 'user'
                        ? 'bg-[#008080] text-white p-3.5 rounded-2xl rounded-tr-xs shadow-xs'
                        : 'bg-white text-slate-800 p-4 rounded-2xl rounded-tl-xs border border-[#008080]/15 shadow-xs'
                    }`}
                  >
                    {msg.text && (
                      <p className={`text-xs sm:text-sm leading-relaxed ${msg.sender === 'user' ? 'text-white' : 'text-slate-800'}`}>
                        {msg.text}
                      </p>
                    )}

                    {/* Emergency Alert */}
                    {msg.type === 'emergency' && (
                      <div className="p-3.5 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-950 space-y-2 text-xs">
                        <div className="flex items-center gap-1.5 text-rose-700 font-bold uppercase">
                          <AlertTriangle className="w-4 h-4 text-rose-600 animate-bounce" />
                          <span>Emergency Medical Warning</span>
                        </div>
                        <p className="font-semibold leading-relaxed">
                          These may be emergency symptoms. Please call hospital emergency immediately:
                        </p>
                        <p className="font-bold text-rose-800">Casualty Hotline: +234 800-UNN-911</p>
                        <p className="text-[11px] text-slate-500">
                          Routine appointments are blocked for severe symptoms for your safety.
                        </p>
                      </div>
                    )}

                    {/* Triage recommendation */}
                    {msg.type === 'triage_result' && (
                      <div className="space-y-3 pt-1">
                        <div className="p-3 rounded-xl bg-[#ebf1f1] border border-[#008080]/20 space-y-1 text-xs">
                          <span className="text-[10px] font-bold text-[#008080] uppercase tracking-wider block">
                            Recommended Department
                          </span>
                          <p className="font-bold text-slate-900 text-sm">{msg.recommendation.departmentName}</p>
                          <p className="text-slate-600 text-xs">{msg.recommendation.action}</p>
                        </div>

                        {/* Available Doctors */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#008080] block">
                            Available Specialists:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {msg.doctors.map((doc) => (
                              <div
                                key={doc.doctor_id}
                                className="p-2.5 rounded-xl border border-[#008080]/20 bg-[#ebf1f1]/50 space-y-1.5 text-xs"
                              >
                                <div className="flex items-center gap-2">
                                  <img src={doc.avatar_url} alt="" className="w-8 h-8 rounded-lg object-cover" />
                                  <div className="min-w-0">
                                    <h5 className="font-bold text-slate-900 truncate">{doc.name}</h5>
                                    <span className="text-[10px] text-[#008080] font-semibold">${doc.consultation_fee} / visit</span>
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <span className="text-[10px] text-slate-400 font-medium block">Choose slot:</span>
                                  <div className="flex flex-wrap gap-1">
                                    {doc.availableSlots.map((slot, sIdx) => (
                                      <button
                                        key={sIdx}
                                        onClick={() => handleSelectSlot(doc, slot)}
                                        className="px-2 py-0.5 bg-white hover:bg-[#008080] text-slate-700 hover:text-white border border-[#008080]/30 rounded text-[10px] font-bold transition-colors"
                                      >
                                        {slot}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Confirmation Prompt */}
                    {msg.type === 'confirmation_required' && (
                      <div className="p-3.5 rounded-xl bg-[#ebf1f1] border-2 border-[#008080] space-y-2.5 text-xs">
                        <span className="font-bold text-[#008080] uppercase tracking-wider text-[11px] block">
                          Appointment Summary
                        </span>
                        <div className="bg-white p-2.5 rounded-lg border border-[#008080]/20 space-y-1 text-slate-700">
                          <p><strong>Doctor:</strong> {msg.details.doctorName}</p>
                          <p><strong>Date & Time:</strong> {msg.details.date} at {msg.details.time}</p>
                          <p><strong>Department:</strong> {msg.details.departmentName}</p>
                        </div>
                        <button
                          onClick={() => handleUserSubmit('Confirm')}
                          className="w-full py-2 bg-[#008080] hover:bg-[#006666] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                          <span>Confirm & Book</span>
                        </button>
                      </div>
                    )}

                    {/* Booking Success */}
                    {msg.type === 'booking_success' && (
                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-2 text-xs animate-fadeIn">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Appointment Booked!</span>
                        </div>
                        <p className="text-slate-700">
                          Booked with <strong>{msg.appointment.doctor_name}</strong> on{' '}
                          <strong>{msg.appointment.appointment_date} at {msg.appointment.appointment_time}</strong>.
                        </p>
                        <Link
                          to="/dashboard"
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#008080] text-white rounded-lg font-bold text-xs hover:bg-[#006666]"
                        >
                          <span>View in Dashboard</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-white text-[#008080] border border-[#008080] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      S
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2 items-center text-xs text-[#008080] font-medium p-2 bg-white rounded-xl border border-[#008080]/15 w-fit">
                  <Bot className="w-4 h-4 animate-spin" />
                  <span>UNN AI is analyzing...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="px-3 sm:px-4 py-2 bg-white border-t border-[#008080]/15 shrink-0 overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
              <span className="text-[10px] font-bold text-[#008080] uppercase tracking-wider shrink-0">
                Quick:
              </span>
              {quickStartPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleUserSubmit(p)}
                  className="text-xs bg-[#ebf1f1] hover:bg-[#008080] text-slate-700 hover:text-white border border-[#008080]/20 px-2.5 py-1 rounded-full transition-colors shrink-0 font-medium"
                >
                  “{p}”
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-[#008080]/15 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUserSubmit();
              }}
              className="max-w-2xl mx-auto relative flex items-center"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Describe your symptoms (e.g. tooth pain, skin rash) or doctor to book..."
                className="w-full bg-[#ebf1f1] text-xs sm:text-sm pl-4 pr-12 py-3 rounded-xl border border-[#008080]/20 focus:border-[#008080] focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="absolute right-2 p-2 bg-[#008080] hover:bg-[#006666] disabled:opacity-40 text-white rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
