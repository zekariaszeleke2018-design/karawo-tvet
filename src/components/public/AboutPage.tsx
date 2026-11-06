/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, CheckCircle2, Target, Eye, Shield, Users, Wrench, Building2, BookOpen } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#0a192f] to-[#0f2744] text-white py-16 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Institutional Profile
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
            About Karawo TVET College
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            A premier Ethiopian technical and vocational training institution dedicated to producing
            highly competent, ethically grounded, and industry-certified technical specialists.
          </p>
        </div>
      </section>

      {/* Dean's Welcome & Mandate */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border-2 border-slate-100 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                  alt="Dean and Administration"
                  className="w-full h-96 object-cover object-top"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 p-4 text-white">
                  <div className="font-bold text-sm">Dr. Kassahun Tefera</div>
                  <div className="text-xs text-amber-400">Dean, Karawo TVET College</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                Dean's Address
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744]">
                Bridging Skill Gaps Through Occupational Competence
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Welcome to Karawo TVET College. In an era of rapid technological advancement and national industrialization,
                technical skills are the backbone of economic transformation. Our mission is to provide trainees with
                hands-on mastery, critical problem-solving skills, and deep familiarity with occupational health and safety.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every department at Karawo operates in direct partnership with leading manufacturing, automotive,
                and construction firms. Our dual-training framework guarantees that our scholars master both theoretical
                science and real production workflows before undergoing national Center of Competence (COC) assessments.
              </p>

              <div className="pt-2 grid grid-cols-2 gap-4 border-t border-slate-100 text-xs">
                <div>
                  <div className="font-bold text-[#0f2744]">Federal TVET Institute</div>
                  <div className="text-slate-500">Accredited Level I-IV Curricula</div>
                </div>
                <div>
                  <div className="font-bold text-[#0f2744]">Dual-Apprenticeship</div>
                  <div className="text-slate-500">Industry Integrated Training</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision, Mission, and Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-4 hover:border-amber-400 transition">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#0f2744]">Our Vision</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              To be recognized as a leading center of technical and vocational excellence in Ethiopia, renowned
              for world-class workshop pedagogy, enterprise innovation, and high-employability graduates.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-4 hover:border-amber-400 transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0f2744] flex items-center justify-center font-bold">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#0f2744]">Our Mission</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              To deliver demand-driven, competency-based technical education that equips citizens with practical skills,
              entrepreneurial mindset, and technological adaptability to foster sustainable national growth.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-4 hover:border-amber-400 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#0f2744]">Core Values</h3>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                <span><strong>Competence:</strong> Mastery over mere theory</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                <span><strong>Integrity:</strong> Unwavering professional ethics</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                <span><strong>Safety:</strong> Zero compromise in workshop protocols</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                <span><strong>Innovation:</strong> Technology that solves local challenges</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Campus Facilities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
            Training Infrastructure
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744]">
            World-Class Technical Workshops & Laboratories
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Purpose-built practical facilities designed to mirror real automotive assembly, industrial plants, and IT server rooms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm group">
            <img
              src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80"
              alt="Automotive Workshop"
              className="w-full h-44 object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="p-5 space-y-2">
              <h4 className="font-bold text-sm text-[#0f2744]">Automotive Diagnostic Bays</h4>
              <p className="text-xs text-slate-500">
                Hydraulic lifts, wheel alignment benches, EFI analyzers, and computerized fault code scanners.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm group">
            <img
              src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80"
              alt="ICT Data Lab"
              className="w-full h-44 object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="p-5 space-y-2">
              <h4 className="font-bold text-sm text-[#0f2744]">ICT Systems & Network Lab</h4>
              <p className="text-xs text-slate-500">
                Fiber optic splicing tools, enterprise Cisco racks, database servers, and modern workstation benches.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm group">
            <img
              src="https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80"
              alt="Electrical Automation"
              className="w-full h-44 object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="p-5 space-y-2">
              <h4 className="font-bold text-sm text-[#0f2744]">Electrical Machine & Solar Lab</h4>
              <p className="text-xs text-slate-500">
                Industrial motor benches, PLC automation panels, and renewable photovoltaic solar test stands.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm group">
            <img
              src="https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80"
              alt="Manufacturing & Metalwork"
              className="w-full h-44 object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="p-5 space-y-2">
              <h4 className="font-bold text-sm text-[#0f2744]">Manufacturing & Lathe Shop</h4>
              <p className="text-xs text-slate-500">
                Precision manual and CNC lathes, TIG/MIG welding booths, sheet metal shears, and drill presses.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
