/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { UserProfile, Department, AdmissionApplication } from '../../types';
import {
  getUsers,
  createUser,
  updateUser,
  getDepartments,
  getAdmissionApplications,
  updateAdmissionStatus
} from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  UserPlus,
  GraduationCap,
  FileCheck,
  Search,
  Filter,
  Printer,
  CheckCircle2,
  XCircle,
  Building2,
  Clock,
  Sparkles
} from 'lucide-react';

export const RegistrarView: React.FC = () => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'students' | 'register' | 'admissions' | 'reports'>('students');

  const [students, setStudents] = useState<UserProfile[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [loading, setLoading] = useState(true);

  // Registration Form State
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    departmentId: '',
    programLevel: 'Level I Certificate',
    phone: '',
    idNumber: ''
  });
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');

  const loadData = async () => {
    setLoading(true);
    try {
      const [u, d, a] = await Promise.all([
        getUsers(),
        getDepartments(),
        getAdmissionApplications()
      ]);
      setStudents(u.filter(user => user.role === 'student'));
      setDepartments(d);
      setApplications(a);
      if (d.length > 0 && !form.departmentId) {
        setForm(prev => ({ ...prev, departmentId: d[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRegisterStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.departmentId) return;

    const matchedDept = departments.find(d => d.id === form.departmentId);
    const generatedId = form.idNumber || `KTVET/2026/${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      await createUser({
        uid: `student-${Date.now()}`,
        fullName: form.fullName,
        email: form.email,
        role: 'student',
        departmentId: form.departmentId,
        departmentName: matchedDept ? matchedDept.name : undefined,
        programLevel: form.programLevel,
        phone: form.phone,
        idNumber: generatedId,
        status: 'active'
      });

      setRegSuccess(`Trainee ${form.fullName} successfully registered! ID: ${generatedId}`);
      setForm({
        fullName: '',
        email: '',
        departmentId: departments[0]?.id || '',
        programLevel: 'Level I Certificate',
        phone: '',
        idNumber: ''
      });
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdmitApplicant = async (app: AdmissionApplication) => {
    try {
      await updateAdmissionStatus(app.id, 'admitted');
      // Create student user account
      const generatedId = `KTVET/2026/${Math.floor(1000 + Math.random() * 9000)}`;
      await createUser({
        uid: `student-${Date.now()}`,
        fullName: app.fullName,
        email: app.email,
        role: 'student',
        departmentId: app.departmentId,
        departmentName: app.departmentName,
        programLevel: app.preferredProgram,
        phone: app.phone,
        idNumber: generatedId,
        status: 'active'
      });
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesDept = selectedDeptFilter === 'all' || s.departmentId === selectedDeptFilter;
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.idNumber && s.idNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0f2744] to-[#1e3a8a] text-white p-6 sm:p-8 rounded-3xl shadow-md border-2 border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="bg-blue-500 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Office of the Registrar
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">
            Trainee Records & Enrollment Management
          </h1>
          <p className="text-xs text-slate-300">
            Admissions processing, departmental assignment, student directories, and certification rosters.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('register')}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Trainee</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'students' ? 'bg-[#0f2744] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Directory ({students.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('register')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'register' ? 'bg-[#0f2744] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Student Registration</span>
        </button>
        <button
          onClick={() => setActiveTab('admissions')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'admissions' ? 'bg-[#0f2744] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Online Applications ({applications.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'reports' ? 'bg-[#0f2744] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>Department Enrollment Reports</span>
        </button>
      </div>

      {/* ================= TAB 1: STUDENT DIRECTORY ================= */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">Department:</span>
              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:border-amber-400"
              >
                <option value="all">All TVET Departments</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-64">
              <input
                type="text"
                placeholder="Search trainee by name, ID, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0f2744] text-white uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Trainee Name & ID</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Qualification Level</th>
                    <th className="py-3 px-4">Contact (Email / Phone)</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{s.fullName}</div>
                        <div className="text-[10px] font-mono text-amber-600 font-bold">{s.idNumber || s.id}</div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {s.departmentName || 'General TVET'}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {s.programLevel || 'Level I'}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        <div>{s.email}</div>
                        <div className="text-[10px]">{s.phone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          s.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: REGISTRATION FORM ================= */}
      {activeTab === 'register' && (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6">
          <div>
            <h2 className="font-serif font-bold text-xl text-[#0f2744]">
              Official Student Registration
            </h2>
            <p className="text-xs text-slate-500">
              Register an accepted trainee into the academic database and assign to their TVET occupational department.
            </p>
          </div>

          {regSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{regSuccess}</span>
            </div>
          )}

          <form onSubmit={handleRegisterStudent} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Student Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dawit Hailemariam"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. dawit@student.karawo.edu.et"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assign TVET Department *</label>
                <select
                  value={form.departmentId}
                  onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:outline-none focus:border-amber-400"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Qualification Level</label>
                <select
                  value={form.programLevel}
                  onChange={(e) => setForm({ ...form, programLevel: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Level I - Certificate">Level I - Basic Craftsman</option>
                  <option value="Level II - Certificate">Level II - Intermediate Technician</option>
                  <option value="Level III - Diploma">Level III - Advanced Technician</option>
                  <option value="Level IV - Diploma">Level IV - Professional Diploma</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Custom Student ID (Optional)</label>
                <input
                  type="text"
                  placeholder="Auto-generated if blank (e.g. KTVET/2026/0481)"
                  value={form.idNumber}
                  onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+251 91 123 4567"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0f2744] hover:bg-[#1a385e] text-white font-bold text-xs rounded-xl shadow transition"
            >
              Complete Registration & Issue Student Record
            </button>
          </form>
        </div>
      )}

      {/* ================= TAB 3: ADMISSIONS APPLICATIONS ================= */}
      {activeTab === 'admissions' && (
        <div className="space-y-4">
          <div>
            <h2 className="font-serif font-bold text-xl text-[#0f2744]">
              Public Online Applications
            </h2>
            <p className="text-xs text-slate-500">
              Applications received via the public portal. Click "Admit & Register" to automatically enroll.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0f2744] text-white uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Applicant</th>
                    <th className="py-3 px-4">Applied Department</th>
                    <th className="py-3 px-4">Target Program</th>
                    <th className="py-3 px-4">Prior Education</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{app.fullName}</div>
                        <div className="text-[10px] text-slate-500">{app.email} • {app.phone}</div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{app.departmentName}</td>
                      <td className="py-3 px-4 text-slate-600">{app.preferredProgram}</td>
                      <td className="py-3 px-4 text-slate-500">{app.previousEducation}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          app.status === 'admitted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'declined'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        {app.status !== 'admitted' && (
                          <button
                            onClick={() => handleAdmitApplicant(app)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg transition"
                          >
                            Admit & Register
                          </button>
                        )}
                        {app.status !== 'declined' && app.status !== 'admitted' && (
                          <button
                            onClick={() => updateAdmissionStatus(app.id, 'declined').then(loadData)}
                            className="px-2 py-1 text-rose-600 hover:bg-rose-50 text-[10px] font-bold rounded-lg transition"
                          >
                            Decline
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {applications.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No online admission applications submitted yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: REPORTS ================= */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-xl text-[#0f2744]">
                Department Enrollment Roster & COC Pass Metrics
              </h2>
              <p className="text-xs text-slate-500">
                Official institutional summary for regional Ministry of Labor and Skills compliance.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Print Official Roster</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => {
              const enrolledInDept = students.filter(s => s.departmentId === dept.id).length;
              return (
                <div key={dept.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded">
                      {dept.code}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {dept.programs.length} TVET Levels
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-[#0f2744]">{dept.name}</h3>
                    <div className="text-xs text-slate-400 mt-1">Head: {dept.headOfDepartmentName}</div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-extrabold text-[#0f2744]">
                        {enrolledInDept || dept.enrolledCount || 180}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Total Trainees</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-emerald-600">98.2%</div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">COC Pass Rate</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
