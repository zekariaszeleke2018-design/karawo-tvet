/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Department } from '../../types';
import { getDepartments } from '../../services/dataService';
import {
  Wrench,
  Cpu,
  Zap,
  Building2,
  Hammer,
  Scissors,
  Calculator,
  GraduationCap,
  Users,
  Award,
  Search,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface DepartmentsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const DepartmentsPage: React.FC<DepartmentsPageProps> = ({ onNavigate }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const list = await getDepartments();
        setDepartments(list);
        if (list.length > 0) {
          setSelectedDept(list[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = departments.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDeptIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Wrench': return <Wrench className="w-5 h-5 text-amber-500" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-amber-500" />;
      case 'Zap': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'Building2': return <Building2 className="w-5 h-5 text-amber-500" />;
      case 'Hammer': return <Hammer className="w-5 h-5 text-amber-500" />;
      case 'Scissors': return <Scissors className="w-5 h-5 text-amber-500" />;
      case 'Calculator': return <Calculator className="w-5 h-5 text-amber-500" />;
      default: return <GraduationCap className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Banner */}
      <section className="bg-gradient-to-r from-[#0a192f] to-[#0f2744] text-white py-16 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Academic Catalog
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white">
            Departments & TVET Programs
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            All programs are strictly benchmarked against Ethiopian National Occupational Standards (NOS),
            covering Level I through Level IV vocational certificates and advanced technician diplomas.
          </p>

          {/* Search Box */}
          <div className="pt-4 max-w-md">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search department, code, or program..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 text-white rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid & Department Inspector */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Department Cards List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Showing {filtered.length} Active TVET Departments
            </div>

            {filtered.map((dept) => {
              const isSelected = selectedDept?.id === dept.id;
              return (
                <div
                  key={dept.id}
                  onClick={() => setSelectedDept(dept)}
                  className={`p-5 rounded-2xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50/40 border-amber-500 shadow-md ring-1 ring-amber-400/50'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                        {getDeptIcon(dept.icon)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-[#0f2744] text-base">{dept.name}</h3>
                          <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                            {dept.code}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                          {dept.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-4">
                      <span>Head: <strong>{dept.headOfDepartmentName || 'Assigned'}</strong></span>
                      <span>•</span>
                      <span>{dept.programs.length} TVET Levels</span>
                    </div>
                    <span className="text-amber-600 font-bold flex items-center gap-1">
                      View Details <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Department Detail Side Panel */}
          <div className="lg:col-span-5">
            {selectedDept ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-lg sticky top-28 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center font-bold">
                      {getDeptIcon(selectedDept.icon)}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-amber-600 uppercase">
                        {selectedDept.code}
                      </span>
                      <h3 className="font-serif font-bold text-lg text-[#0f2744] leading-tight">
                        {selectedDept.name}
                      </h3>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Department Overview
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedDept.description}
                  </p>
                </div>

                {/* Programs and TVET Levels */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Accredited Qualification Pathways
                  </h4>
                  <div className="space-y-2">
                    {selectedDept.programs.map((prog, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex items-center gap-2.5 text-slate-700"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="font-medium">{prog}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Department Metadata */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Department Head</div>
                    <div className="font-semibold text-slate-900 mt-0.5">
                      {selectedDept.headOfDepartmentName || 'Ato Daniel Girma'}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Training Model</div>
                    <div className="font-semibold text-slate-900 mt-0.5">70% Practical / 30% Theory</div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('admissions', { preferredDept: selectedDept.name })}
                    className="w-full py-3 bg-[#0f2744] hover:bg-[#1a385e] text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2"
                  >
                    <span>Apply for {selectedDept.name}</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center text-slate-400 text-xs">
                Select a department to view full syllabus and programs.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
