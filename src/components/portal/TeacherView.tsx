/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  Department,
  LearningMaterial,
  Assignment,
  Submission,
  Announcement
} from '../../types';
import {
  getDepartments,
  getMaterials,
  createMaterial,
  deleteMaterial,
  getAssignments,
  createAssignment,
  deleteAssignment,
  getSubmissions,
  gradeSubmission,
  getAnnouncements,
  createAnnouncement
} from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  FileText,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Award,
  Bell,
  Send,
  User,
  ExternalLink
} from 'lucide-react';

export const TeacherView: React.FC = () => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'materials' | 'assignments' | 'submissions' | 'announcements'>('materials');

  const [department, setDepartment] = useState<Department | null>(null);
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload Material Modal
  const [isMatModalOpen, setIsMatModalOpen] = useState(false);
  const [matForm, setMatForm] = useState({
    title: '',
    courseName: '',
    targetLevel: 'Level III',
    fileType: 'pdf' as 'pdf' | 'doc' | 'presentation' | 'video' | 'link',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    description: ''
  });

  // Create Assignment Modal
  const [isAsgModalOpen, setIsAsgModalOpen] = useState(false);
  const [asgForm, setAsgForm] = useState({
    title: '',
    courseName: '',
    targetLevel: 'Level III',
    dueDate: '2026-12-10',
    maxScore: 25,
    description: ''
  });

  // Grade Modal State
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [gradeScore, setGradeScore] = useState<number>(20);
  const [gradeFeedback, setGradeFeedback] = useState<string>('Excellent technical execution and diagnostic reasoning.');

  // Announcement State
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');

  const deptId = userProfile?.departmentId || 'dept-auto';

  const loadData = async () => {
    setLoading(true);
    try {
      const [allDepts, mats, asgs, subs, anns] = await Promise.all([
        getDepartments(),
        getMaterials(deptId),
        getAssignments(deptId),
        getSubmissions(undefined, undefined, deptId),
        getAnnouncements(deptId)
      ]);

      const d = allDepts.find(dept => dept.id === deptId) || allDepts[0];
      setDepartment(d);
      setMaterials(mats);
      setAssignments(asgs);
      setSubmissions(subs);
      setAnnouncements(anns);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [deptId]);

  // Upload Material
  const handleUploadMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matForm.title || !matForm.courseName) return;

    try {
      await createMaterial({
        title: matForm.title,
        courseName: matForm.courseName,
        targetLevel: matForm.targetLevel,
        fileType: matForm.fileType,
        fileUrl: matForm.fileUrl,
        description: matForm.description,
        departmentId: deptId,
        uploadedByUid: userProfile?.uid || 'teacher',
        uploadedByName: userProfile?.fullName || 'Teacher',
        uploaderRole: 'Teacher'
      });
      setIsMatModalOpen(false);
      setMatForm({
        title: '',
        courseName: '',
        targetLevel: 'Level III',
        fileType: 'pdf',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        description: ''
      });
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // Create Assignment
  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!asgForm.title || !asgForm.courseName) return;

    try {
      await createAssignment({
        title: asgForm.title,
        courseName: asgForm.courseName,
        targetLevel: asgForm.targetLevel,
        dueDate: asgForm.dueDate,
        maxScore: Number(asgForm.maxScore),
        description: asgForm.description,
        departmentId: deptId,
        createdByUid: userProfile?.uid || 'teacher',
        createdByName: userProfile?.fullName || 'Teacher'
      });
      setIsAsgModalOpen(false);
      setAsgForm({
        title: '',
        courseName: '',
        targetLevel: 'Level III',
        dueDate: '2026-12-10',
        maxScore: 25,
        description: ''
      });
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Grade
  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    try {
      await gradeSubmission(selectedSub.id, Number(gradeScore), gradeFeedback, userProfile?.uid || 'teacher');
      setSelectedSub(null);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // Department Notice
  const handlePostNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;

    try {
      await createAnnouncement({
        title: annTitle,
        content: annContent,
        scope: 'department',
        departmentId: deptId,
        departmentName: department?.name,
        authorUid: userProfile?.uid || 'teacher',
        authorName: userProfile?.fullName || 'Teacher',
        authorRole: 'Teacher',
        priority: 'normal'
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
      <div className="bg-gradient-to-r from-[#0f2744] to-[#1e3a8a] text-white p-6 sm:p-8 rounded-3xl shadow-md border-2 border-amber-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-950 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Instructor Portal
            </span>
            <span className="text-xs text-amber-300 font-mono">
              {department?.name} ({department?.code})
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">
            {userProfile?.fullName}
          </h1>
          <p className="text-xs text-slate-300">
            Publish workshop resources, assignments, review student submissions, and assign competency grades.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsMatModalOpen(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Learning Material</span>
          </button>
          <button
            onClick={() => setIsAsgModalOpen(true)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Create Assignment</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('materials')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'materials' ? 'bg-[#0f2744] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>My Learning Materials ({materials.length})</span>
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
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'submissions' ? 'bg-[#0f2744] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Student Submissions & Grading ({submissions.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'announcements' ? 'bg-[#0f2744] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Department Notices</span>
        </button>
      </div>

      {/* ================= TAB 1: MATERIALS ================= */}
      {activeTab === 'materials' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-xl text-[#0f2744]">
                Department Learning Materials & Workshop Manuals
              </h2>
              <p className="text-xs text-slate-500">
                Course notes, diagrams, and video resources visible to students in {department?.name}.
              </p>
            </div>
            <button
              onClick={() => setIsMatModalOpen(true)}
              className="px-4 py-2 bg-[#0f2744] text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Upload New Material</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {materials.map((m) => {
              const isOwner = m.uploadedByUid === userProfile?.uid || userProfile?.role === 'admin';
              return (
                <div key={m.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-amber-600 uppercase bg-amber-50 px-2 py-0.5 rounded">
                        {m.targetLevel}
                      </span>
                      <h3 className="font-bold text-base text-[#0f2744] mt-1">{m.title}</h3>
                      <div className="text-xs font-semibold text-slate-700">{m.courseName}</div>
                    </div>
                    {isOwner && (
                      <button
                        onClick={() => deleteMaterial(m.id).then(loadData)}
                        className="text-slate-400 hover:text-rose-600 transition p-1"
                        title="Delete Material"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">{m.description}</p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>Uploaded by: <strong>{m.uploadedByName}</strong></span>
                    <a
                      href={m.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Open Document</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 2: ASSIGNMENTS ================= */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-xl text-[#0f2744]">
                Coursework Tasks & Deadlines
              </h2>
              <p className="text-xs text-slate-500">
                Practical lab reports and theory assignments for trainees in {department?.name}.
              </p>
            </div>
            <button
              onClick={() => setIsAsgModalOpen(true)}
              className="px-4 py-2 bg-[#0f2744] text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Create Assignment</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map((asg) => {
              const asgSubs = submissions.filter(s => s.assignmentId === asg.id);
              const isOwner = asg.createdByUid === userProfile?.uid || userProfile?.role === 'admin';
              return (
                <div key={asg.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-amber-600 uppercase bg-amber-50 px-2 py-0.5 rounded">
                        {asg.targetLevel}
                      </span>
                      <h3 className="font-bold text-base text-[#0f2744] mt-1">{asg.title}</h3>
                      <div className="text-xs font-semibold text-slate-700">{asg.courseName}</div>
                    </div>
                    {isOwner && (
                      <button
                        onClick={() => deleteAssignment(asg.id).then(loadData)}
                        className="text-slate-400 hover:text-rose-600 transition p-1"
                        title="Delete Assignment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">{asg.description}</p>

                  <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400">Due Deadline:</span>{' '}
                      <strong className="text-rose-600 font-bold">{asg.dueDate}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Max Score:</span>{' '}
                      <strong className="text-[#0f2744]">{asg.maxScore} pts</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Submissions: <strong>{asgSubs.length} trainees</strong></span>
                    <button
                      onClick={() => setActiveTab('submissions')}
                      className="text-amber-600 font-bold hover:underline"
                    >
                      View & Grade Submissions
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 3: SUBMISSIONS & GRADING ================= */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          <div>
            <h2 className="font-serif font-bold text-xl text-[#0f2744]">
              Student Submissions & Competency Grading
            </h2>
            <p className="text-xs text-slate-500">
              Review submitted lab reports and solutions from trainees in {department?.name}. Enter scores and feedback.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0f2744] text-white uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Trainee Name & ID</th>
                    <th className="py-3 px-4">Assignment / Course</th>
                    <th className="py-3 px-4">Submitted Solution</th>
                    <th className="py-3 px-4">Submitted Date</th>
                    <th className="py-3 px-4">Score & Feedback</th>
                    <th className="py-3 px-4 text-right">Grading Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map((sub) => {
                    const asg = assignments.find(a => a.id === sub.assignmentId);
                    const isGraded = typeof sub.score === 'number';
                    return (
                      <tr key={sub.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{sub.studentName}</div>
                          <div className="text-[10px] font-mono text-slate-400">{sub.studentIdNumber || sub.studentUid}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">{asg?.title || sub.assignmentId}</div>
                          <div className="text-[10px] text-amber-600 font-bold">{asg?.courseName}</div>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <p className="text-slate-600 line-clamp-2">{sub.submissionText}</p>
                          {sub.fileUrl && (
                            <a
                              href={sub.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-blue-600 font-bold underline flex items-center gap-1 mt-0.5"
                            >
                              Attached File Link <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                          {sub.submittedAt ? sub.submittedAt.split('T')[0] : 'Today'}
                        </td>
                        <td className="py-3 px-4">
                          {isGraded ? (
                            <div>
                              <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                                {sub.score} / {asg?.maxScore || 30}
                              </span>
                              <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1 italic">
                                "{sub.feedback}"
                              </div>
                            </div>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold uppercase">
                              Ungraded
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedSub(sub);
                              setGradeScore(sub.score ?? 20);
                              setGradeFeedback(sub.feedback || 'Good practical application of standard operating procedures.');
                            }}
                            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] rounded-lg shadow"
                          >
                            {isGraded ? 'Update Grade' : 'Grade Submission'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {submissions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No submissions received from trainees yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: ANNOUNCEMENTS ================= */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#0f2744]">
              Publish Course Notice to Trainees
            </h3>
            <form onSubmit={handlePostNotice} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next Week Diagnostic Lab Preparation"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notice Details *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Instructions for students regarding tools, safety, or assignments..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-[#0f2744] text-white font-bold text-xs rounded-xl shadow"
              >
                Post Notice
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 space-y-3">
            <h3 className="font-serif font-bold text-lg text-[#0f2744]">
              Current Department Notices ({announcements.length})
            </h3>
            {announcements.map((a) => (
              <div key={a.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#0f2744]">{a.title}</h4>
                  <span className="text-[10px] text-slate-400">{a.createdAt?.split('T')[0]}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{a.content}</p>
                <div className="text-[10px] text-slate-400">By {a.authorName}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODAL: UPLOAD MATERIAL ================= */}
      {isMatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif font-bold text-lg text-[#0f2744]">Upload Learning Material</h3>
            <form onSubmit={handleUploadMaterial} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Module / Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Common-Rail Diesel Diagnostics Manual"
                  value={matForm.title}
                  onChange={(e) => setMatForm({ ...matForm, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course Name & Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Engine Diagnostics (AUTO-301)"
                  value={matForm.courseName}
                  onChange={(e) => setMatForm({ ...matForm, courseName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Level</label>
                  <select
                    value={matForm.targetLevel}
                    onChange={(e) => setMatForm({ ...matForm, targetLevel: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                  >
                    <option value="Level I">Level I</option>
                    <option value="Level II">Level II</option>
                    <option value="Level III">Level III</option>
                    <option value="Level IV">Level IV</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Resource Type</label>
                  <select
                    value={matForm.fileType}
                    onChange={(e) => setMatForm({ ...matForm, fileType: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                  >
                    <option value="pdf">PDF Manual</option>
                    <option value="doc">Word / Text Document</option>
                    <option value="presentation">Presentation Slides</option>
                    <option value="video">Practical Video Link</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">File URL / Download Link</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={matForm.fileUrl}
                  onChange={(e) => setMatForm({ ...matForm, fileUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Resource Summary</label>
                <textarea
                  rows={3}
                  placeholder="Brief synopsis of what skills trainees will acquire..."
                  value={matForm.description}
                  onChange={(e) => setMatForm({ ...matForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMatModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0f2744] text-white text-xs font-bold rounded-xl"
                >
                  Publish Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE ASSIGNMENT ================= */}
      {isAsgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif font-bold text-lg text-[#0f2744]">Create Assignment / Task</h3>
            <form onSubmit={handleCreateAssignment} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lab Exercise: Camshaft Sensor Oscilloscope Waveform"
                  value={asgForm.title}
                  onChange={(e) => setAsgForm({ ...asgForm, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Engine Diagnostics"
                  value={asgForm.courseName}
                  onChange={(e) => setAsgForm({ ...asgForm, courseName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Due Deadline *</label>
                  <input
                    type="date"
                    required
                    value={asgForm.dueDate}
                    onChange={(e) => setAsgForm({ ...asgForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Max Score (pts)</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    required
                    value={asgForm.maxScore}
                    onChange={(e) => setAsgForm({ ...asgForm, maxScore: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Qualification Level</label>
                <select
                  value={asgForm.targetLevel}
                  onChange={(e) => setAsgForm({ ...asgForm, targetLevel: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                >
                  <option value="Level I">Level I</option>
                  <option value="Level II">Level II</option>
                  <option value="Level III">Level III</option>
                  <option value="Level IV">Level IV</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Instructions & Problem Statement *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe step-by-step required practical procedure, expected measurements, and report questions..."
                  value={asgForm.description}
                  onChange={(e) => setAsgForm({ ...asgForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAsgModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0f2744] text-white text-xs font-bold rounded-xl"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: GRADE SUBMISSION ================= */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif font-bold text-xl text-[#0f2744]">
              Grade Trainee Submission
            </h3>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Trainee:</span>
                <strong className="text-slate-900">{selectedSub.studentName} ({selectedSub.studentIdNumber || 'ID'})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assignment ID:</span>
                <span className="font-mono text-slate-700">{selectedSub.assignmentId}</span>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-400 block mb-1 font-bold">Trainee Solution Text:</span>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-800 text-xs leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap">
                  {selectedSub.submissionText}
                </div>
              </div>
              {selectedSub.fileUrl && (
                <div className="pt-1">
                  <a
                    href={selectedSub.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 font-bold underline flex items-center gap-1"
                  >
                    Open Student Attachment File <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Awarded Score (Points) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={gradeScore}
                  onChange={(e) => setGradeScore(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-xl text-xs font-bold text-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Instructor Evaluative Feedback & Comments *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide constructive feedback on technical accuracy and practical methodology..."
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSub(null)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow"
                >
                  Save Grade & Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
