/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Menu, X, Shield, Phone, Mail, MapPin } from 'lucide-react';

interface HeaderProps {
  activePage: string;
  onNavigate: (page: string) => void;
  onOpenLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activePage, onNavigate, onOpenLogin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userProfile } = useAuth();

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'departments', label: 'Departments & Programs' },
    { id: 'admissions', label: 'Admissions' },
    { id: 'news', label: 'News & Announcements' },
    { id: 'events', label: 'Events' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleLinkClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Institutional Top Ribbon */}
      <div className="bg-[#0f2744] text-slate-200 text-[11px] py-1 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400" /> Karawo Main Campus, Ethiopia
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-amber-400" /> +251-11-234-5678
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-amber-400" /> registrar@karawo.edu.et
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-amber-300 font-semibold">
              Accredited TVET Institution • Level I - IV National Occupational Standards
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & College Brand */}
          <button
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0f2744] to-[#1e3a8a] text-white flex items-center justify-center shadow-md border-2 border-amber-400/80 group-hover:scale-105 transition duration-200">
              <GraduationCap className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <div className="font-serif font-extrabold text-lg sm:text-xl text-[#0f2744] tracking-tight leading-tight">
                KARAWO TVET COLLEGE
              </div>
              <div className="text-[11px] text-amber-600 font-bold uppercase tracking-widest flex items-center gap-1">
                <span>Ethiopia</span>
                <span className="text-slate-300">•</span>
                <span>Excellence in Skills & Technology</span>
              </div>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
                  activePage === link.id
                    ? 'text-[#0f2744] bg-amber-500/15 border-b-2 border-amber-500'
                    : 'text-slate-600 hover:text-[#0f2744] hover:bg-slate-100/80'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Portal Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            {userProfile ? (
              <button
                onClick={() => handleLinkClick('portal')}
                className="inline-flex items-center gap-2 bg-[#0f2744] hover:bg-[#1a385e] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md border border-amber-400/40 transition hover:shadow-lg"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Portal Dashboard</span>
                <span className="bg-amber-400 text-[#0f2744] text-[10px] px-1.5 py-0.2 rounded font-mono font-bold uppercase">
                  {userProfile.role.replace('_', ' ')}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenLogin}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition hover:scale-102"
              >
                <Shield className="w-4 h-4 text-slate-950" />
                <span>Academic Portal Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => handleLinkClick('portal')}
              className="text-xs bg-[#0f2744] text-amber-300 font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Portal</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-1 shadow-xl">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                activePage === link.id
                  ? 'bg-amber-50 text-amber-800 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {userProfile ? (
              <button
                onClick={() => handleLinkClick('portal')}
                className="w-full py-2.5 bg-[#0f2744] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                Go to Portal ({userProfile.fullName})
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="w-full py-2.5 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow"
              >
                <Shield className="w-4 h-4" />
                Academic Portal Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
