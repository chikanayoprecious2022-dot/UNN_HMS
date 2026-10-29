import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bot, Calendar, Menu, X, Activity, User } from 'lucide-react';

export default function Navbar({ currentUser }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'AI Assistant', path: '/ai-assistant', highlight: true },
    { name: 'Book Appointment', path: '/book' },
    { name: 'My Appointments', path: '/my-appointments' },
  ];

  return (
    <header className="bg-white sticky top-0 z-40 border-b border-[#008080]/15 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#008080] flex items-center justify-center text-white shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading text-lg font-bold tracking-tight text-[#008080]">UNN HMS</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold bg-[#ebf1f1] text-[#008080] px-2 py-0.5 rounded">
                Hospital System
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              if (link.highlight) {
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      active
                        ? 'bg-[#008080] text-white shadow-xs'
                        : 'bg-[#ebf1f1] text-[#008080] hover:bg-[#008080] hover:text-white'
                    }`}
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>{link.name}</span>
                  </Link>
                );
              }
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    active
                      ? 'text-[#008080] font-bold bg-[#ebf1f1]'
                      : 'text-slate-600 hover:text-[#008080] hover:bg-[#ebf1f1]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Auth / Patient CTA */}
          <div className="hidden sm:flex items-center gap-2">
            <Link
              to="/auth"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#008080] px-3 py-1.5 rounded-lg hover:bg-[#ebf1f1]"
            >
              <User className="w-3.5 h-3.5 text-[#008080]" />
              <span>{currentUser?.name ? currentUser.name : 'Sign In'}</span>
            </Link>
            <Link
              to="/book"
              className="px-3.5 py-1.5 bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold rounded-lg shadow-xs"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-[#ebf1f1]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#008080]/15 px-4 py-3 space-y-1.5 shadow-md">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-xs font-semibold ${
                isActive(link.path) ? 'bg-[#008080] text-white' : 'text-slate-700 hover:bg-[#ebf1f1]'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/auth"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-[#ebf1f1] border-t border-slate-100 mt-2"
          >
            {currentUser?.name ? `Signed in as ${currentUser.name}` : 'Sign In / Register'}
          </Link>
        </div>
      )}
    </header>
  );
}
