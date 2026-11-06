/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  Department,
  UserProfile,
  LearningMaterial,
  Assignment,
  Announcement
} from '../../types';
import {
  getDepartments,
  getUsers,
  getMaterials,
  getAssignments,
  getAnnouncements,
  createAnnouncement
} from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  Users,
  BookOpen,
  FileText,
  Bell,
  Shield,
  GraduationCap,
  CheckCircle2,
  Plus,
  Send
} from 'lucide-react';

export const DeptHeadView: React.FC = () => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'teachers' | 'students' | 'materials' | 'assignments' | 'announcements'>('overview');

  const [department, setDepartment] = useState<Department | null>(null);
  const [teachers, setTeachers] = useState<UserProfile[]>([]);
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  // Department Announcement state
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annPriority, setAnnPriority] = useState<'normal' | 'urgent'>('normal');

  const deptId = userProfile?.departmentId || 'dept-auto';

  const loadData = async () => {
    setLoading(true);
    try {
      const [allDepts, allUsers, allMats, allAsgs, allAnns] = await Promise.all([
        getDepartments(),
        getUsers(),
        getMaterials(deptId),
        getAssignments(deptId),
        getAnnouncements(deptId)
      ]);

      const matchedDept = allDepts.find(d => d.id === deptId) || allDepts[0];
      setDepartment(matchedDept);
      setTeachers(allUsers.filter(u => u.departmentId === deptId && (u.role === 'teacher' || u.role === 'department_head')));
      setStudents(allUsers.filter(u => u.departmentId === deptId && u.role === 'student'));
      setMaterials(allMats);
      setAssignments(allAsgs);
      setAnnouncements(allAnns);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [deptId]);

  const handlePostDeptAnn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;

    try {
      await createAnnouncement({
        title: annTitle,
        content: annContent,
        scope: 'department',
        departmentId: deptId,
        departmentName: department?.name,
        authorUid: userProfile?.uid || 'head',
        authorName: userProfile?.fullName || 'Department Head',
        authorRole: 'Department Head',
        priority: annPriority
      });
      setAnnTitle('');
      setAnnContent('');
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0f2744] to-[#1e3a8a] text-white p-6 sm:p-8 rounded-3xl shadow-md border-2 border-emerald-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500 text-slate-950 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Department Head Console
            </span>
            <span className="text-xs text-amber-300 font-mono">
              {department?.code || 'DEPT'}
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">
            {department?.name || 'Assigned TVET Department'}
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            {department?.description}
          </p>
        </div>

        <div className="text-right shrink-0 bg-white/10 p-4 rounded-2xl border border-white/20">
          <div className="text-xs text-slate-300">Department Head:</div>
          <div className="font-bold text-sm text-white">{userProfile?.fullName}</div>
          <div className="text-[10px] text-amber-400 font-mono">{userProfile?.email}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'overview' ? 'bg-[#0f2744] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Department Overview</span>
        </button>
        <button
          onClick={() => setActiveTab('teachers')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'teachers' ? 'bg-[#0f2744] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Instructors ({teachers.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'students' ? 'bg-[#0f2744] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Enrolled Trainees ({students.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('materials')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'materials' ? 'bg-[#0f2744] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Curriculum Resources ({materials.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'assignments' ? 'bg-[#0f2744] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Assignments ({assignments.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'announcements' ? 'bg-[#0f2744] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Announcements ({announcements.length})</span>
        </button>
      </div>

      {/* ================= TAB 1: OVERVIEW ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Instructors in Dept
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0f2744]">
                {teachers.length}
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold">Active Trainers</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Enrolled Trainees
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0f2744]">
                {students.length || department?.enrolledCount || 240}
              </div>
              <div className="text-[11px] text-blue-600 font-semibold">Level I - IV</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Learning Modules
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0f2744]">
                {materials.length}
              </div>
              <div className="text-[11px] text-amber-600 font-semibold">Uploaded by Faculty</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Active Courseworks
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0f2744]">
                {assignments.length}
              </div>
              <div className="text-[11px] text-purple-600 font-semibold">Homework & Tasks</div>
            </div>
          </div>

          {/* Department Programs List */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#0f2744]">
              Occupational Qualification Pathways ({department?.programs.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {department?.programs.map((prog, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-xs font-semibold text-slate-800">{prog}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: INSTRUCTORS ================= */}
      {activeTab === 'teachers' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#0f2744]">Department Faculty & Instructors</h3>
              <p className="text-xs text-slate-400">Assigned teachers providing vocational training in {department?.name}.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0f2744] text-white uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Instructor Name</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Staff ID</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teachers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900">{t.fullName}</td>
                    <td className="py-3 px-4 capitalize font-semibold text-amber-700">{t.role.replace('_', ' ')}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{t.idNumber || 'KTVET-TCH'}</td>
                    <td className="py-3 px-4 text-slate-600">{t.email}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: STUDENTS ================= */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-serif font-bold text-lg text-[#0f2744]">Enrolled Trainees</h3>
            <p className="text-xs text-slate-400">Trainees assigned exclusively to {department?.name}.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0f2744] text-white uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Trainee Name</th>
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Qualification Level</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900">{s.fullName}</td>
                    <td className="py-3 px-4 font-mono text-amber-600 font-bold">{s.idNumber || s.id}</td>
                    <td className="py-3 px-4 text-slate-700">{s.programLevel || 'Level I'}</td>
                    <td className="py-3 px-4 text-slate-500">{s.email}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 4: MATERIALS ================= */}
      {activeTab === 'materials' && (
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#0f2744]">Curriculum Modules & Reading Materials</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {materials.map((m) => (
              <div key={m.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-600 uppercase bg-amber-50 px-2 py-0.5 rounded">
                    {m.targetLevel}
                  </span>
                  <span className="text-[10px] uppercase font-mono font-bold text-slate-400">{m.fileType}</span>
                </div>
                <h4 className="font-bold text-sm text-[#0f2744]">{m.title}</h4>
                <div className="text-xs font-semibold text-slate-700">{m.courseName}</div>
                <p className="text-xs text-slate-500 line-clamp-2">{m.description}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Uploaded by: {m.uploadedByName}</span>
                  <a
                    href={m.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-600 font-bold hover:underline"
                  >
                    Download Resource
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 5: ASSIGNMENTS ================= */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#0f2744]">Department Homework & Coursework Tasks</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map((asg) => (
              <div key={asg.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-600 uppercase bg-amber-50 px-2 py-0.5 rounded">
                    {asg.targetLevel}
                  </span>
                  <span className="text-xs font-bold text-slate-500">Max Score: {asg.maxScore} pts</span>
                </div>
                <h4 className="font-bold text-sm text-[#0f2744]">{asg.title}</h4>
                <div className="text-xs font-semibold text-slate-700">{asg.courseName}</div>
                <p className="text-xs text-slate-500 line-clamp-3">{asg.description}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Due: <strong className="text-rose-600">{asg.dueDate}</strong></span>
                  <span>By: {asg.createdByName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 6: ANNOUNCEMENTS ================= */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#0f2744]">
              Post Notice to Department
            </h3>
            <p className="text-xs text-slate-400">
              Broadcast a bulletin specifically for {department?.name} trainees and faculty.
            </p>

            <form onSubmit={handlePostDeptAnn} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Workshop Tool Inspection Friday"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                <select
                  value={annPriority}
                  onChange={(e) => setAnnPriority(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent / Alert</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notice Details *</label>
                <textarea
                  rows={4}
                  required
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0f2744] hover:bg-[#1a385e] text-white font-bold text-xs rounded-xl shadow transition"
              >
                Post Department Notice
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 space-y-3">
            <h3 className="font-serif font-bold text-lg text-[#0f2744]">
              Department Bulletins ({announcements.length})
            </h3>
            {announcements.map((a) => (
              <div key={a.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                    a.priority === 'urgent' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {a.priority}
                  </span>
                  <span className="text-[10px] text-slate-400">{a.createdAt?.split('T')[0]}</span>
                </div>
                <h4 className="font-bold text-sm text-[#0f2744]">{a.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{a.content}</p>
                <div className="text-[10px] text-slate-400">By {a.authorName} ({a.authorRole})</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
