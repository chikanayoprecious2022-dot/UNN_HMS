import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bot, Menu, X, Activity, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar({ currentUser, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'AI Assistant', path: '/ai-assistant', highlight: true },
  ];

  return (
    <header className="bg-white sticky top-0 z-40 border-b border-[#008080]/15 shadow-sm w-full">
      {/* Inner container — constrained width, never wider than viewport */}
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* ── Brand Logo ── */}
          <Link to="/" className="flex items-center gap-2 shrink-0 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#008080] flex items-center justify-center text-white shadow-sm shrink-0">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="font-heading text-base sm:text-lg font-bold tracking-tight text-[#008080] whitespace-nowrap">
              UNN HMS
            </span>
          </Link>

          {/* ── Desktop Nav Links (md+) ── */}
          <nav className="hidden md:flex items-center gap-1 mx-4">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              if (link.highlight) {
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${active
                        ? 'bg-[#008080] text-white'
                        : 'bg-[#ebf1f1] text-[#008080] hover:bg-[#008080] hover:text-white'
                      }`}
                  >
                    <Bot className="w-3.5 h-3.5 shrink-0" />
                    <span>{link.name}</span>
                  </Link>
                );
              }
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${active
                      ? 'text-[#008080] font-bold bg-[#ebf1f1]'
                      : 'text-slate-600 hover:text-[#008080] hover:bg-[#ebf1f1]'
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* ── Right side: auth controls (desktop md+) + hamburger (mobile) ── */}
          <div className="flex items-center gap-2 shrink-0">

            {/* Auth controls — desktop only (md+) */}
            <div className="hidden md:flex items-center gap-2">
              {currentUser ? (
                <>
                  <Link
                    to={currentUser.role === 'admin' ? '/admin' : '/dashboard'}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold rounded-lg shadow-sm transition-colors whitespace-nowrap"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
                    <span>{currentUser.role === 'admin' ? 'Admin' : 'Dashboard'}</span>
                  </Link>
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-1 p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth?mode=login"
                    className="px-3 py-1.5 text-slate-700 hover:text-[#008080] hover:bg-[#ebf1f1] text-xs font-bold rounded-lg transition-colors whitespace-nowrap"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth?mode=register"
                    className="px-3 py-1.5 bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold rounded-lg shadow-sm transition-colors whitespace-nowrap"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Hamburger — mobile only (< md) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-[#ebf1f1] transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* ── Mobile Drawer (< md) ── */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#008080]/10 px-3 py-3 space-y-1.5 shadow-md">
          {/* Nav links */}
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${isActive(link.path)
                  ? 'bg-[#008080] text-white'
                  : 'text-slate-700 hover:bg-[#ebf1f1] hover:text-[#008080]'
                }`}
            >
              {link.highlight && <Bot className="w-4 h-4 shrink-0" />}
              {link.name}
            </Link>
          ))}

          {/* Auth section */}
          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            {currentUser ? (
              <>
                <Link
                  to={currentUser.role === 'admin' ? '/admin' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-[#008080] text-white text-xs font-bold rounded-xl"
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span>{currentUser.role === 'admin' ? 'Admin Portal' : 'My Dashboard'}</span>
                </Link>
                <button
                  onClick={() => { setMobileMenuOpen(false); onLogout(); }}
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 text-rose-600 bg-rose-50 hover:bg-rose-100 text-xs font-semibold rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/auth?mode=login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 text-xs font-bold border border-[#008080]/40 text-[#008080] rounded-xl hover:bg-[#ebf1f1]"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?mode=register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 text-xs font-bold bg-[#008080] text-white rounded-xl shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
