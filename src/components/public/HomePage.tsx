/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Department, NewsItem, EventItem } from '../../types';
import { getDepartments, getNews, getEvents } from '../../services/dataService';
import {
  GraduationCap,
  Wrench,
  Cpu,
  Zap,
  Building2,
  Hammer,
  Scissors,
  Calculator,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Award,
  Users,
  Compass,
  Briefcase,
  Shield,
  Clock
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onOpenLogin: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenLogin }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [eventsList, setEventsList] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [depts, news, events] = await Promise.all([
          getDepartments(),
          getNews(),
          getEvents()
        ]);
        setDepartments(depts.filter(d => d.active).slice(0, 6));
        setNewsList(news.slice(0, 3));
        setEventsList(events.slice(0, 3));
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getDeptIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Wrench': return <Wrench className="w-6 h-6 text-amber-500" />;
      case 'Cpu': return <Cpu className="w-6 h-6 text-amber-500" />;
      case 'Zap': return <Zap className="w-6 h-6 text-amber-500" />;
      case 'Building2': return <Building2 className="w-6 h-6 text-amber-500" />;
      case 'Hammer': return <Hammer className="w-6 h-6 text-amber-500" />;
      case 'Scissors': return <Scissors className="w-6 h-6 text-amber-500" />;
      case 'Calculator': return <Calculator className="w-6 h-6 text-amber-500" />;
      default: return <GraduationCap className="w-6 h-6 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0a192f] via-[#0f2744] to-[#172554] text-white pt-16 pb-24 overflow-hidden border-b-4 border-amber-500">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Pioneering TVET Excellence in Ethiopia</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
                Transforming Ambition into <span className="text-amber-400 underline decoration-amber-500/60 decoration-4">Technical Mastery</span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-light">
                Karawo TVET College provides rigorous, competency-based vocational training across
                automotive, information technology, industrial electrical power, construction, and manufacturing.
                Equipping graduates for immediate employment and national Center of Competence (COC) certification.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => onNavigate('admissions')}
                  className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition duration-200 flex items-center gap-2 transform hover:-translate-y-0.5"
                >
                  <span>Apply for Admission</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('departments')}
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 backdrop-blur-sm transition duration-200 flex items-center gap-2"
                >
                  <span>Explore TVET Departments</span>
                </button>

                <button
                  onClick={onOpenLogin}
                  className="px-5 py-3.5 bg-slate-900/80 hover:bg-slate-900 text-amber-300 font-semibold text-sm rounded-xl border border-amber-400/30 transition duration-200 flex items-center gap-2"
                >
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>Academic Portal</span>
                </button>
              </div>

              {/* Key Trust Badges */}
              <div className="pt-6 border-t border-slate-700/60 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>National TVET Standard</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>70% Practical Dual Training</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Direct Industry Placement</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/20 to-blue-500/20 rounded-3xl blur-xl"></div>
                <div className="relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80"
                    alt="Technical Workshop Trainees"
                    className="w-full h-80 object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-1">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                      Hands-on Occupational Training
                    </span>
                    <h3 className="font-serif font-bold text-lg text-white">
                      Modern Workshop Facilities & Diagnostic Labs
                    </h3>
                    <p className="text-xs text-slate-300">
                      Trainees working with state-of-the-art diagnostic testbenches and computerized tooling.
                    </p>
                  </div>
                </div>

                {/* Floating Stat Card */}
                <div className="absolute -bottom-6 -left-6 bg-white text-slate-900 p-4 rounded-xl shadow-2xl border border-slate-100 hidden sm:flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center font-bold text-amber-600">
                    <Award className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-[#0f2744]">98.4%</div>
                    <div className="text-xs text-slate-500 font-medium">COC Assessment Pass Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* College Statistics Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="pt-2 md:pt-0">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0f2744] font-serif">7+</div>
            <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mt-1">TVET Departments</div>
            <div className="text-xs text-slate-400 mt-0.5">Level I to Level IV Programs</div>
          </div>
          <div className="pt-4 md:pt-0">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0f2744] font-serif">1,450+</div>
            <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mt-1">Active Trainees</div>
            <div className="text-xs text-slate-400 mt-0.5">Regular and Extension Shifts</div>
          </div>
          <div className="pt-4 md:pt-0">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0f2744] font-serif">48+</div>
            <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mt-1">Industry Partners</div>
            <div className="text-xs text-slate-400 mt-0.5">Dual Apprenticeship MoUs</div>
          </div>
          <div className="pt-4 md:pt-0">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0f2744] font-serif">85+</div>
            <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mt-1">Certified Trainers</div>
            <div className="text-xs text-slate-400 mt-0.5">Industry Experienced Faculty</div>
          </div>
        </div>
      </section>

      {/* Dual TVET Training Model (70/30) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                Our Educational Philosophy
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744]">
                Competency-Based Training: 70% Practical, 30% Theory
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                In strict alignment with the Ethiopian National TVET Strategy, Karawo TVET College
                immerses trainees in industry-standard workshops and real-world company apprenticeships.
                Theory supports practical application, ensuring every student graduates job-ready and COC-certified.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">National Occupational Standards (NOS)</h4>
                    <p className="text-xs text-slate-500">Every module matches verified industry competency benchmarks.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Cooperative Apprenticeship Linkage</h4>
                    <p className="text-xs text-slate-500">Trainees spend designated weeks training directly inside regional enterprise factories.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Center of Competence (COC) Preparation</h4>
                    <p className="text-xs text-slate-500">Dedicated mock practical trials to guarantee high certification success.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-[#0f2744] text-sm">Industrial Apprenticeship</h4>
                <p className="text-xs text-slate-500">Over 48 regional factories and technology companies host Karawo trainees.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Wrench className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-[#0f2744] text-sm">Dedicated Workshops</h4>
                <p className="text-xs text-slate-500">Automotive bays, CNC machines, electrical motor stations, and server racks.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-[#0f2744] text-sm">Level I - IV Pathways</h4>
                <p className="text-xs text-slate-500">Structured progression from basic skills to technician and supervisor credentials.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-[#0f2744] text-sm">Digital Academic Portal</h4>
                <p className="text-xs text-slate-500">Online course notes, assignments, gradebooks, and instant department notices.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured TVET Departments */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
              Core Academic Disciplines
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] mt-1">
              Featured TVET Departments & Programs
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Programs dynamically managed by college administration, reflecting current economic and technical manpower demands.
            </p>
          </div>
          <button
            onClick={() => onNavigate('departments')}
            className="mt-4 md:mt-0 text-xs font-bold text-[#0f2744] hover:text-amber-600 flex items-center gap-1.5 transition"
          >
            <span>View All Departments</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-amber-400/50 transition duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 group-hover:bg-amber-50 group-hover:border-amber-200 flex items-center justify-center transition">
                    {getDeptIcon(dept.icon)}
                  </div>
                  <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full">
                    {dept.code}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-[#0f2744] group-hover:text-amber-600 transition">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 mt-1.5 leading-relaxed">
                    {dept.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-700 mb-1.5">
                    Programs Offered (Level I - IV):
                  </div>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {dept.programs.slice(0, 2).map((prog, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        <span className="truncate">{prog}</span>
                      </li>
                    ))}
                    {dept.programs.length > 2 && (
                      <li className="text-[11px] text-amber-600 font-medium">
                        + {dept.programs.length - 2} more programs
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Head: <span className="font-semibold text-slate-700">{dept.headOfDepartmentName || 'Assigned Faculty'}</span>
                </span>
                <button
                  onClick={() => onNavigate('departments')}
                  className="text-amber-600 font-bold hover:underline flex items-center gap-1"
                >
                  Details <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest News & Upcoming Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* News Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-widest">
                  Official Bulletins
                </span>
                <h3 className="font-serif text-xl font-bold text-[#0f2744]">
                  Latest News & Announcements
                </h3>
              </div>
              <button
                onClick={() => onNavigate('news')}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
              >
                All News <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {newsList.map((item) => (
                <article
                  key={item.id}
                  onClick={() => onNavigate('news')}
                  className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row gap-4"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full sm:w-36 h-28 object-cover rounded-xl shrink-0"
                  />
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-[10px]">
                        {item.category}
                      </span>
                      <span>•</span>
                      <span>{item.publishedAt}</span>
                    </div>
                    <h4 className="font-bold text-sm text-[#0f2744] hover:text-amber-600 transition leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {item.summary}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Events Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-widest">
                  Calendar
                </span>
                <h3 className="font-serif text-xl font-bold text-[#0f2744]">
                  Upcoming Events & Assessments
                </h3>
              </div>
              <button
                onClick={() => onNavigate('events')}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
              >
                All Events <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {eventsList.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-amber-400 transition space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-600">
                      <Calendar className="w-4 h-4" />
                      <span>{evt.date}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {evt.category}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-[#0f2744]">
                    {evt.title}
                  </h4>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{evt.time}</span>
                    <span>•</span>
                    <span className="truncate">{evt.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Admissions Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0f2744] to-[#1e3a8a] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl border-2 border-amber-500/40">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider">
              Enrolling for 2026/2027 Academic Year
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
              Launch Your Technical Career at Karawo TVET College
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Applications are officially open for Level I through Level IV TVET certificate and diploma programs.
              Submit your credentials online or visit the campus admissions office today.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('admissions')}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition"
              >
                Apply Online Now
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition"
              >
                Contact Admissions Office
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
