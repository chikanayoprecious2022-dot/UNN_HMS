import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { session } from '../../services/api';
import { ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function AuthPage({ currentUser, onAuthSuccess }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const isRegister = searchParams.get('mode') === 'register';
  const setIsRegister = (val) => {
    setSearchParams({ mode: val ? 'register' : 'login' });
    setErrorMessage('');
  };
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [serverOffline, setServerOffline] = useState(false);

  const navigate = useNavigate();

  // If already logged in, redirect appropriately
  useEffect(() => {
    if (currentUser) {
      navigate(currentUser.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [currentUser, navigate]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setServerOffline(false);
    setSubmitting(true);

    const endpoint = isRegister ? `${API_BASE}/auth/register` : `${API_BASE}/auth/login`;
    const payload = isRegister
      ? { email, password, full_name: name, phone }
      : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed');
      }

      const activeUser = {
        user_id: data.user.id || data.user.user_id || Date.now(),
        id: data.user.id || data.user.user_id,
        name: data.user.name || name || 'Patient',
        email: data.user.email || email,
        phone: data.user.phone || phone || '',
        role: data.user.role || 'patient',
        token: data.token,
      };

      session.set(activeUser);
      if (onAuthSuccess) onAuthSuccess(activeUser);

      // Route based on role returned by the backend
      navigate(activeUser.role === 'admin' ? '/admin' : redirectUrl);
    } catch (err) {
      const isNetworkError =
        err.message === 'Failed to fetch' ||
        err.name === 'TypeError' ||
        err.message.includes('NetworkError');

      if (isNetworkError) {
        setServerOffline(true);
        setErrorMessage(
          'Cannot reach the Express backend at http://localhost:5000. Please start it: cd server && node index.js'
        );
      } else {
        setErrorMessage(err.message || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Fallback if Express server isn't running
  const handleOfflineBypass = () => {
    const fallbackUser = {
      user_id: isRegister ? Date.now() : 1,
      name: isRegister ? name || 'New Patient' : 'Patient',
      email: email || 'patient@unn.edu',
      phone: phone || '',
      role: 'patient',
    };
    session.set(fallbackUser);
    if (onAuthSuccess) onAuthSuccess(fallbackUser);
    navigate(redirectUrl);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white p-8 rounded-2xl border border-[#008080]/20 shadow-md space-y-6">
        <div className="text-center space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#008080]">
            {isRegister ? 'Patient Registration' : 'Patient Login'}
          </span>
          <h1 className="text-2xl font-heading font-bold text-slate-900">
            {isRegister ? 'Create Your Account' : 'Welcome to UNN HMS'}
          </h1>
          <p className="text-xs text-slate-500">
            {isRegister
              ? 'Sign up to create your patient account and manage your appointments'
              : 'Sign in to access your patient dashboard and appointments'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-[#ebf1f1] p-1 rounded-xl text-xs font-bold border border-[#008080]/15">
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            className={`flex-1 py-2 rounded-lg transition-all ${
              !isRegister ? 'bg-[#008080] text-white shadow-xs' : 'text-slate-600 hover:text-[#008080]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            className={`flex-1 py-2 rounded-lg transition-all ${
              isRegister ? 'bg-[#008080] text-white shadow-xs' : 'text-slate-600 hover:text-[#008080]'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error / Server Offline Alert */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
            <div className="flex items-start gap-2 text-rose-800 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
            {serverOffline && (
              <button
                type="button"
                onClick={handleOfflineBypass}
                className="w-full text-center py-1.5 bg-white border border-rose-300 hover:bg-rose-100 text-rose-700 text-[11px] font-bold rounded-lg transition-colors"
              >
                Continue locally without backend &rarr;
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4 text-xs">
          {isRegister && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sara Cole"
                className="w-full bg-[#ebf1f1] px-3.5 py-2.5 rounded-xl border border-[#008080]/20 focus:border-[#008080] focus:bg-white focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@email.com"
              className="w-full bg-[#ebf1f1] px-3.5 py-2.5 rounded-xl border border-[#008080]/20 focus:border-[#008080] focus:bg-white focus:outline-none"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 803 123 4567"
                className="w-full bg-[#ebf1f1] px-3.5 py-2.5 rounded-xl border border-[#008080]/20 focus:border-[#008080] focus:bg-white focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Password</label>
            <input
              required
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="•••••••• (min. 6 characters)"
              className="w-full bg-[#ebf1f1] px-3.5 py-2.5 rounded-xl border border-[#008080]/20 focus:border-[#008080] focus:bg-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#008080] hover:bg-[#006666] disabled:opacity-60 text-white font-heading font-bold text-xs rounded-xl transition-colors shadow-md flex items-center justify-center gap-1.5"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isRegister ? 'Creating account...' : 'Signing in...'}</span>
              </>
            ) : (
              <>
                <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
