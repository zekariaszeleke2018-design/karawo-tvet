/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GraduationCap, Shield, Phone, Mail, MapPin, Award, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
  onOpenLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLogin }) => {
  const handleNav = (p: string) => {
    onNavigate(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0a192f] text-slate-300 border-t-4 border-amber-500 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: About Institution */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow">
                <GraduationCap className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-white text-base tracking-wide">
                  KARAWO TVET COLLEGE
                </h3>
                <span className="text-[10px] text-amber-400 uppercase tracking-widest font-semibold block">
                  Federal TVET Institution • Ethiopia
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering Ethiopian youth and professionals with competency-based technical training,
              practical workshop mastery, and Center of Competence (COC) certification across core industrial sectors.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-amber-300">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Level I - IV TVET National Standard</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-amber-400 transition">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-amber-400 transition">
                  About the College
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('departments')} className="hover:text-amber-400 transition">
                  Departments & TVET Programs
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('admissions')} className="hover:text-amber-400 transition">
                  Admissions & Enrollment
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('news')} className="hover:text-amber-400 transition">
                  News & Official Bulletins
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('events')} className="hover:text-amber-400 transition">
                  Academic Calendar & Events
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('gallery')} className="hover:text-amber-400 transition">
                  Campus & Workshop Gallery
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-amber-400 transition">
                  Contact Registrar & Campus
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: TVET Departments */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              TVET Departments
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Automotive Technology & Mechanical</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Information & Comm. Technology (ICT)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Electrical & Renewable Solar Power</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Building Construction & Woodwork</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Manufacturing & Precision Metal Work</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Garment & Apparel Fashion Production</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Accounting & Financial Budget Service</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Campus Contact & Portal Access */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Academic Portal Access
            </h4>
            <p className="text-xs text-slate-400">
              Authorized login for College Administrators, Registrars, Department Heads, Teachers, and Enrolled Trainees.
            </p>
            <button
              onClick={onOpenLogin}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Enter Management Portal</span>
            </button>
            <div className="pt-2 space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Karawo TVET Main Campus, Ethiopia</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>+251-11-234-5678 (Registrar)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>info@karawo.edu.et</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Karawo TVET College, Ethiopia. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Competency-Based Education (CBE)</span>
            <span>•</span>
            <span>Center of Competence (COC) Qualified</span>
            <span>•</span>
            <span className="text-amber-400 font-medium">Demo Verified Edition</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
