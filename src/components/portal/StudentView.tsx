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
  Announcement,
  AcademicTerm
} from '../../types';
import {
  getDepartments,
  getMaterials,
  getAssignments,
  getSubmissions,
  submitAssignment,
  getAnnouncements,
  getAcademicTerms
} from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  FileText,
  Send,
  CheckCircle2,
  Clock,
  Award,
  Bell,
  GraduationCap,
  Download,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export const StudentView: React.FC = () => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'materials' | 'assignments' | 'announcements'>('dashboard');

  const [department, setDepartment] = useState<Department | null>(null);
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [mySubmissions, setMySubmissions] = useState<Submission[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [terms, setTerms] = useState<AcademicTerm[]>([]);
  const [loading, setLoading] = useState(true);

  // Submit Modal
  const [selectedAsgForSubmit, setSelectedAsgForSubmit] = useState<Assignment | null>(null);
  const [solutionText, setSolutionText] = useState('');
  const [solutionUrl, setSolutionUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const deptId = userProfile?.departmentId || 'dept-auto';
  const studentUid = userProfile?.uid || 'student';

  const loadData = async () => {
    setLoading(true);
    try {
      const [allDepts, mats, asgs, subs, anns, allTerms] = await Promise.all([
        getDepartments(),
        getMaterials(deptId),
        getAssignments(deptId),
        // SECURITY ENFORCEMENT: A student can ONLY fetch their own submissions!
        getSubmissions(undefined, studentUid, deptId),
        getAnnouncements(deptId),
        getAcademicTerms()
      ]);

      const d = allDepts.find(dept => dept.id === deptId) || allDepts[0];
      setDepartment(d);
      setMaterials(mats);
      setAssignments(asgs);
      setMySubmissions(subs);
      setAnnouncements(anns);
      setTerms(allTerms);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [deptId, studentUid]);

  const handleSubmitWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsgForSubmit || !solutionText.trim()) return;

    setSubmitting(true);
    try {
      await submitAssignment({
        assignmentId: selectedAsgForSubmit.id,
        assignmentTitle: selectedAsgForSubmit.title,
        studentUid: studentUid,
        studentName: userProfile?.fullName || 'Trainee',
        studentIdNumber: userProfile?.idNumber,
        departmentId: deptId,
        submissionText: solutionText.trim(),
        fileUrl: solutionUrl.trim() || undefined
      });

      setSubmitSuccess(`Your solution for "${selectedAsgForSubmit.title}" was submitted successfully!`);
      setSelectedAsgForSubmit(null);
      setSolutionText('');
      setSolutionUrl('');
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const currentTerm = terms.find(t => t.isCurrent) || terms[0];

  return (
    <div className="space-y-6">
      {/* Trainee Banner */}
      <div className="bg-gradient-to-r from-[#0f2744] to-[#1e3a8a] text-white p-6 sm:p-8 rounded-3xl shadow-md border-2 border-amber-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-950 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Student / Trainee Portal
            </span>
            <span className="text-xs text-amber-300 font-mono">
              ID: {userProfile?.idNumber || 'KTVET/2026/0142'}
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">
            {userProfile?.fullName}
          </h1>
          <p className="text-xs text-slate-300">
            Enrolled in: <strong className="text-white">{department?.name}</strong> •{' '}
            <span>{userProfile?.programLevel || 'Level III TVET Pathway'}</span>
          </p>
        </div>

        <div className="bg-white/10 p-4 rounded-2xl border border-white/20 text-xs text-right space-y-0.5">
          <div className="text-slate-300 font-medium">Current Academic Term:</div>
          <div className="font-bold text-amber-300 font-serif">
            {currentTerm?.semester || 'Semester 1'} ({currentTerm?.academicYear || '2026/2027'})
          </div>
          <div className="text-[10px] text-emerald-400 font-bold flex items-center justify-end gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Active Enrollment
          </div>
        </div>
      </div>

      {submitSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{submitSuccess}</span>
          </div>
          <button onClick={() => setSubmitSuccess(null)} className="text-slate-400 hover:text-slate-700">×</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'dashboard' ? 'bg-[#0f2744] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>My Learning Dashboard</span>
        </button>
        <button
          onClick={() => setActiveTab('materials')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'materials' ? 'bg-[#0f2744] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Lecture Modules & Resources ({materials.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'assignments' ? 'bg-[#0f2744] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Assignments & Homework ({assignments.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'announcements' ? 'bg-[#0f2744] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notices & Advisories ({announcements.length})</span>
        </button>
      </div>

      {/* ================= TAB 1: DASHBOARD ================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Department Materials
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0f2744]">
                {materials.length}
              </div>
              <div className="text-[11px] text-amber-600 font-semibold">Available for Download</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Assigned Tasks
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0f2744]">
                {assignments.length}
              </div>
              <div className="text-[11px] text-blue-600 font-semibold">Current Semester</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                My Submissions
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0f2744]">
                {mySubmissions.length}
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold">
                {mySubmissions.filter(s => typeof s.score === 'number').length} Graded
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Department
              </span>
              <div className="text-base sm:text-lg font-bold text-[#0f2744] truncate">
                {department?.code || 'TVET'}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">Head: {department?.headOfDepartmentName}</div>
            </div>
          </div>

          {/* Recent Submissions & Feedback Status */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#0f2744]">
              My Assignment Submissions & Teacher Feedback
            </h3>
            {mySubmissions.length > 0 ? (
              <div className="space-y-3">
                {mySubmissions.map((sub) => {
                  const asg = assignments.find(a => a.id === sub.assignmentId);
                  const isGraded = typeof sub.score === 'number';
                  return (
                    <div key={sub.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-[#0f2744]">{asg?.title || sub.assignmentTitle || sub.assignmentId}</h4>
                          <span className="text-[11px] text-slate-500 font-medium">Course: {asg?.courseName || 'TVET Practical'}</span>
                        </div>
                        {isGraded ? (
                          <div className="text-right">
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                              Score: {sub.score} / {asg?.maxScore || 30}
                            </span>
                          </div>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold uppercase">
                            Pending Instructor Review
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 block font-bold mb-0.5">My Submitted Answer:</span>
                        {sub.submissionText}
                      </div>

                      {isGraded && sub.feedback && (
                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                          <strong className="block text-[11px] text-emerald-700">Teacher's Feedback:</strong>
                          "{sub.feedback}"
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-400">
                You have not submitted any assignments yet. Check the Assignments tab to submit your homework.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: MATERIALS ================= */}
      {activeTab === 'materials' && (
        <div className="space-y-4">
          <div>
            <h2 className="font-serif font-bold text-xl text-[#0f2744]">
              {department?.name} Learning Resources
            </h2>
            <p className="text-xs text-slate-500">
              Download lecture notes, diagnostic reference guides, and workshop blueprints uploaded by your instructors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {materials.map((m) => (
              <div key={m.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold text-amber-600 uppercase bg-amber-50 px-2 py-0.5 rounded">
                    {m.targetLevel}
                  </span>
                  <span className="text-[10px] uppercase font-mono font-bold text-slate-400">
                    {m.fileType}
                  </span>
                </div>

                <h3 className="font-bold text-base text-[#0f2744]">{m.title}</h3>
                <div className="text-xs font-semibold text-slate-700">{m.courseName}</div>
                <p className="text-xs text-slate-500 leading-relaxed">{m.description}</p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Instructor: <strong>{m.uploadedByName}</strong></span>
                  <a
                    href={m.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-[#0f2744] hover:bg-[#1a385e] text-white rounded-xl font-bold flex items-center gap-1.5 shadow"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: ASSIGNMENTS & HOMEWORK ================= */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div>
            <h2 className="font-serif font-bold text-xl text-[#0f2744]">
              Assignments & Tasks to Complete
            </h2>
            <p className="text-xs text-slate-500">
              Submit your work before the specified deadline. Your submissions are kept private between you and your instructor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map((asg) => {
              const mySub = mySubmissions.find(s => s.assignmentId === asg.id);
              return (
                <div key={asg.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-600 uppercase bg-amber-50 px-2 py-0.5 rounded">
                      {asg.targetLevel}
                    </span>
                    <span className="text-xs font-bold text-slate-500">Max Score: {asg.maxScore} pts</span>
                  </div>

                  <h3 className="font-bold text-base text-[#0f2744]">{asg.title}</h3>
                  <div className="text-xs font-semibold text-slate-700">{asg.courseName}</div>
                  <p className="text-xs text-slate-500 leading-relaxed">{asg.description}</p>

                  <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400">Deadline:</span>{' '}
                      <strong className="text-rose-600 font-bold">{asg.dueDate}</strong>
                    </div>
                    <div>
                      {mySub ? (
                        <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                          ✓ Submitted
                        </span>
                      ) : (
                        <span className="text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded text-[10px]">
                          Not Submitted
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400">By: {asg.createdByName}</span>
                    <button
                      onClick={() => setSelectedAsgForSubmit(asg)}
                      className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow transition"
                    >
                      {mySub ? 'Resubmit Work' : 'Submit Assignment'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 4: ANNOUNCEMENTS ================= */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <h2 className="font-serif font-bold text-xl text-[#0f2744]">
            College & Department Notices
          </h2>
          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                      a.priority === 'urgent' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {a.priority}
                    </span>
                    <span className="text-[10px] font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase">
                      {a.scope === 'college' ? 'College-Wide' : a.departmentName || 'Department'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">{a.createdAt?.split('T')[0]}</span>
                </div>
                <h4 className="font-bold text-sm text-[#0f2744]">{a.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{a.content}</p>
                <div className="text-[10px] text-slate-400">Posted by: {a.authorName} ({a.authorRole})</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODAL: SUBMIT ASSIGNMENT ================= */}
      {selectedAsgForSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif font-bold text-xl text-[#0f2744]">
              Submit Assignment Solution
            </h3>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
              <div className="font-bold text-slate-900 text-sm">{selectedAsgForSubmit.title}</div>
              <div className="text-slate-500">{selectedAsgForSubmit.courseName} • Due: {selectedAsgForSubmit.dueDate}</div>
              <p className="text-slate-600 pt-1 line-clamp-3">{selectedAsgForSubmit.description}</p>
            </div>

            <form onSubmit={handleSubmitWork} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Answer / Diagnostic Analysis *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Type your detailed technical solution, oscilloscope readings, calculations, or report..."
                  value={solutionText}
                  onChange={(e) => setSolutionText(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-amber-400"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Optional File Link (Drive / Document URL)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={solutionUrl}
                  onChange={(e) => setSolutionUrl(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
                <strong>Privacy Guarantee:</strong> In compliance with Karawo TVET security policies, your submission will only be readable by you and your authorized department instructor.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAsgForSubmit(null)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Confirm Submission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
