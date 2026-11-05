import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, X, Sparkles, AlertTriangle, ArrowRight, Send } from 'lucide-react';
import { aiEngine } from '../services/aiEngine';

export default function FloatingAiWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleQuickAnalyze = (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setTimeout(() => {
      const res = aiEngine.recommendDepartment(input);
      setResponse(res);
      setLoading(false);
    }, 400);
  };

  const handleQuickPrompt = (promptText) => {
    setInput(promptText);
    setLoading(true);
    setTimeout(() => {
      const res = aiEngine.recommendDepartment(promptText);
      setResponse(res);
      setLoading(false);
    }, 400);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Popup */}
      {isOpen && (
        <div className="mb-4 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-teal-200 overflow-hidden flex flex-col transition-all duration-300 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-[#008080] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm leading-tight">UNN AI Health Assistant</h4>
                <p className="text-[11px] text-teal-100">Symptom check & instant appointment help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 max-h-[420px] overflow-y-auto space-y-3 bg-[#ebf1f1]/40">
            {/* Quick explanation */}
            <div className="p-3 bg-white rounded-xl border border-teal-100 text-xs text-slate-600 space-y-1.5 shadow-sm">
              <div className="flex items-center gap-1.5 text-[#008080] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tell me your symptoms</span>
              </div>
              <p>I will triage your condition, suggest the best hospital department, and show real available slots.</p>
            </div>

            {/* Quick Prompts */}
            {!response && (
              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Example queries:</p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'I have tooth pain and swollen gums',
                    'Skin rash on my arms',
                    'Severe chest pain',
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickPrompt(p)}
                      className="text-[11px] text-left bg-white hover:bg-teal-50 text-slate-700 hover:text-[#008080] border border-slate-200 hover:border-teal-300 px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      "{p}"
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Response Card */}
            {response && (
              <div
                className={`p-3.5 rounded-xl border text-xs space-y-2.5 ${
                  response.emergencyDetected
                    ? 'bg-rose-50 border-rose-300 text-rose-900'
                    : 'bg-white border-teal-200 text-slate-800 shadow-sm'
                }`}
              >
                {response.emergencyDetected ? (
                  <>
                    <div className="flex items-center gap-2 text-rose-700 font-bold uppercase tracking-wider text-[11px]">
                      <AlertTriangle className="w-4 h-4 text-rose-600 animate-bounce" />
                      <span>Medical Emergency Detected</span>
                    </div>
                    <p className="font-medium leading-relaxed">{response.message}</p>
                    <div className="p-2.5 bg-rose-100 rounded-lg text-[11px] text-rose-900 font-semibold text-center border border-rose-200">
                      Emergency Ambulance Hotline: 0800-UNN-911
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase font-bold text-[#008080] tracking-wider">
                        AI Recommendation
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-teal-100 text-[#008080]">
                        {response.urgencyLevel}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-900 text-sm">
                      Recommended Department: {response.departmentName}
                    </p>
                    <p className="text-slate-600 leading-relaxed text-[11px]">{response.message}</p>

                    <button
                      onClick={() => {
                        setIsOpen(false);
                        navigate(`/ai-assistant?symptoms=${encodeURIComponent(input)}`);
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-[#008080] hover:bg-[#006666] text-white py-2 rounded-lg font-semibold transition-colors mt-2"
                    >
                      <span>Proceed to Book with AI</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Input Footer */}
          <form onSubmit={handleQuickAnalyze} className="p-2.5 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. toothache, headache..."
              className="flex-1 text-xs bg-[#ebf1f1] px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#008080]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-[#008080] hover:bg-[#006666] disabled:opacity-50 text-white p-2 rounded-xl transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[#008080] hover:bg-[#006666] text-white px-4 py-3 rounded-full shadow-lg shadow-teal-900/25 border-2 border-white transition-all transform hover:scale-105 active:scale-95 group"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-emerald-300" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        </div>
        <span className="font-heading font-semibold text-sm tracking-wide">UNN AI Assistant</span>
      </button>
    </div>
  );
}

