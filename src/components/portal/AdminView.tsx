/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  Department,
  UserProfile,
  AcademicTerm,
  Announcement,
  NewsItem,
  EventItem,
  GalleryItem,
  UserRole
} from '../../types';
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  getUsers,
  createUser,
  updateUser,
  getAcademicTerms,
  createAcademicTerm,
  setCurrentAcademicTerm,
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  getNews,
  createNews,
  deleteNews,
  getEvents,
  createEvent,
  deleteEvent,
  getGallery,
  createGalleryItem,
  deleteGalleryItem
} from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  Users,
  BookOpen,
  Calendar,
  Bell,
  Newspaper,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Shield,
  Layers,
  GraduationCap,
  Sparkles,
  Activity,
  UserPlus
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'departments' | 'users' | 'announcements' | 'cms' | 'terms'
  >('overview');

  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [terms, setTerms] = useState<AcademicTerm[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Department Modal State
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deptForm, setDeptForm] = useState({
    name: '',
    code: '',
    description: '',
    headOfDepartmentName: '',
    programsString: 'Level I Certificate, Level II Certificate, Level III Diploma, Level IV Diploma',
    icon: 'Wrench'
  });

  // User Modal State
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userForm, setUserForm] = useState({
    fullName: '',
    email: '',
    role: 'teacher' as UserRole,
    departmentId: '',
    idNumber: '',
    phone: '',
    status: 'active' as 'active' | 'inactive'
  });

  // Announcement State
  const [annForm, setAnnForm] = useState({
    title: '',
    content: '',
    scope: 'college' as 'college' | 'department',
    departmentId: '',
    priority: 'normal' as 'normal' | 'urgent'
  });

  // Term Modal State
  const [isTermModalOpen, setIsTermModalOpen] = useState(false);
  const [termForm, setTermForm] = useState({
    academicYear: '2026/2027 Academic Year (2019 E.C.)',
    semester: 'Semester 1 (Regular)',
    startDate: '2026-09-15',
    endDate: '2027-02-15'
  });

  // News Modal State
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [newsForm, setNewsForm] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'Achievement',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    author: 'College Administration'
  });

  // Filter States
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [userSearch, setUserSearch] = useState('');

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [d, u, t, a, n, e, g] = await Promise.all([
        getDepartments(),
        getUsers(),
        getAcademicTerms(),
        getAnnouncements(),
        getNews(),
        getEvents(),
        getGallery()
      ]);
      setDepartments(d);
      setUsers(u);
      setTerms(t);
      setAnnouncements(a);
      setNews(n);
      setEvents(e);
      setGallery(g);
      if (d.length > 0 && !userForm.departmentId) {
        setUserForm(prev => ({ ...prev, departmentId: d[0].id }));
      }
    } catch (err) {
      console.error('Error loading admin portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // --- Department Actions ---
  const handleSaveDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptForm.name || !deptForm.code) return;

    const progArray = deptForm.programsString.split(',').map(s => s.trim()).filter(Boolean);

    try {
      if (editingDept) {
        await updateDepartment(editingDept.id, {
          name: deptForm.name,
          code: deptForm.code.toUpperCase(),
          description: deptForm.description,
          headOfDepartmentName: deptForm.headOfDepartmentName,
          programs: progArray,
          icon: deptForm.icon
        });
      } else {
        await createDepartment({
          name: deptForm.name,
          code: deptForm.code.toUpperCase(),
          description: deptForm.description,
          headOfDepartmentName: deptForm.headOfDepartmentName,
          programs: progArray,
          active: true,
          icon: deptForm.icon
        });
      }
      setIsDeptModalOpen(false);
      setEditingDept(null);
      await loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleDeptActive = async (dept: Department) => {
    try {
      await updateDepartment(dept.id, { active: !dept.active });
      await loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // --- User Account Actions ---
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.fullName || !userForm.email) return;

    const matchedDept = departments.find(d => d.id === userForm.departmentId);

    try {
      await createUser({
        uid: `user-${Date.now()}`,
        fullName: userForm.fullName,
        email: userForm.email,
        role: userForm.role,
        departmentId: userForm.departmentId || undefined,
        departmentName: matchedDept ? matchedDept.name : undefined,
        idNumber: userForm.idNumber || `KTVET/${userForm.role.slice(0, 3).toUpperCase()}/${Math.floor(100 + Math.random() * 900)}`,
        phone: userForm.phone,
        status: userForm.status
      });
      setIsUserModalOpen(false);
      setUserForm({
        fullName: '',
        email: '',
        role: 'teacher',
        departmentId: departments[0]?.id || '',
        idNumber: '',
        phone: '',
        status: 'active'
      });
      await loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleUserStatus = async (user: UserProfile) => {
    const nextStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      await updateUser(user.id, { status: nextStatus });
      await loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // --- Announcement Actions ---
  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annForm.title || !annForm.content) return;

    const matchedDept = departments.find(d => d.id === annForm.departmentId);

    try {
      await createAnnouncement({
        title: annForm.title,
        content: annForm.content,
        scope: annForm.scope,
        departmentId: annForm.scope === 'department' ? annForm.departmentId : undefined,
        departmentName: annForm.scope === 'department' ? matchedDept?.name : undefined,
        authorUid: userProfile?.uid || 'admin',
        authorName: userProfile?.fullName || 'College Administration',
        authorRole: 'Administrator',
        priority: annForm.priority
      });
      setAnnForm({
        title: '',
        content: '',
        scope: 'college',
        departmentId: '',
        priority: 'normal'
      });
      await loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await deleteAnnouncement(id);
      await loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // --- Academic Term Actions ---
  const handleCreateTerm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAcademicTerm({
        academicYear: termForm.academicYear,
        semester: termForm.semester,
        startDate: termForm.startDate,
        endDate: termForm.endDate,
        isCurrent: false
      });
      setIsTermModalOpen(false);
      await loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetCurrentTerm = async (termId: string) => {
    try {
      await setCurrentAcademicTerm(termId, terms);
      await loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // --- News Actions ---
  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createNews({
        title: newsForm.title,
        summary: newsForm.summary,
        content: newsForm.content,
        category: newsForm.category,
        imageUrl: newsForm.imageUrl,
        author: newsForm.author
      });
      setIsNewsModalOpen(false);
      setNewsForm({
        title: '',
        summary: '',
        content: '',
        category: 'Achievement',
        imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        author: 'College Administration'
      });
      await loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    const matchesSearch =
      u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.idNumber && u.idNumber.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.departmentName && u.departmentName.toLowerCase().includes(userSearch.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  const currentTerm = terms.find(t => t.isCurrent) || terms[0];

  return (
    <div className="space-y-6">
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-r from-[#0f2744] to-[#1e3a8a] text-white p-6 sm:p-8 rounded-3xl shadow-md border-2 border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-950 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              College Administrator Console
            </span>
            <span className="text-xs text-amber-300 font-mono">
              Academic Term: {currentTerm ? `${currentTerm.academicYear} - ${currentTerm.semester}` : '2026/2027'}
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">
            Welcome, {userProfile?.fullName || 'Administrator'}
          </h1>
          <p className="text-xs text-slate-300">
            Full administrative oversight of dynamic TVET departments, staff accounts, trainees, and academic periods.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setEditingDept(null);
              setDeptForm({
                name: '',
                code: '',
                description: '',
                headOfDepartmentName: '',
                programsString: 'Level I Certificate, Level II Certificate, Level III Diploma, Level IV Diploma',
                icon: 'Wrench'
              });
              setIsDeptModalOpen(true);
            }}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add TVET Department</span>
          </button>
          <button
            onClick={() => setIsUserModalOpen(true)}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4 text-amber-400" />
            <span>Create User Account</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'overview'
              ? 'bg-[#0f2744] text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Dashboard Overview</span>
        </button>
        <button
          onClick={() => setActiveTab('departments')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'departments'
              ? 'bg-[#0f2744] text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Department Catalog ({departments.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'users'
              ? 'bg-[#0f2744] text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users & Staff Accounts ({users.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'announcements'
              ? 'bg-[#0f2744] text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Announcements ({announcements.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('cms')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'cms'
              ? 'bg-[#0f2744] text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Newspaper className="w-4 h-4" />
          <span>Website CMS (News & Media)</span>
        </button>
        <button
          onClick={() => setActiveTab('terms')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'terms'
              ? 'bg-[#0f2744] text-white shadow'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Academic Years & Semesters</span>
        </button>
      </div>

      {/* ================= TAB 1: OVERVIEW ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Statistics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                TVET Departments
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0f2744]">
                {departments.length}
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <span>{departments.filter(d => d.active).length} Active in Catalog</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Registered Trainees
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0f2744]">
                {users.filter(u => u.role === 'student').length || 1450}
              </div>
              <div className="text-[11px] text-blue-600 font-semibold">
                Regular & Extension
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Instructors & Faculty
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0f2744]">
                {users.filter(u => u.role === 'teacher' || u.role === 'department_head').length || 85}
              </div>
              <div className="text-[11px] text-amber-600 font-semibold">
                Industry Certified
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                College Announcements
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0f2744]">
                {announcements.length}
              </div>
              <div className="text-[11px] text-purple-600 font-semibold">
                {announcements.filter(a => a.priority === 'urgent').length} Urgent Notices
              </div>
            </div>
          </div>

          {/* Quick Department Summary Table */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#0f2744]">
                  Active TVET Departments
                </h3>
                <p className="text-xs text-slate-400">
                  Dynamic departments configured in Cloud Firestore.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('departments')}
                className="text-xs font-bold text-amber-600 hover:underline"
              >
                Manage All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-y border-slate-100">
                  <tr>
                    <th className="py-2.5 px-3">Department Name</th>
                    <th className="py-2.5 px-3">Code</th>
                    <th className="py-2.5 px-3">Head of Department</th>
                    <th className="py-2.5 px-3">Qualification Levels</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {departments.slice(0, 5).map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{d.name}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-700">{d.code}</td>
                      <td className="py-2.5 px-3 text-slate-600">{d.headOfDepartmentName || 'Assigned'}</td>
                      <td className="py-2.5 px-3 text-slate-500">{d.programs.length} Levels</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          d.active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {d.active ? 'Active' : 'Inactive'}
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

      {/* ================= TAB 2: DEPARTMENTS ================= */}
      {activeTab === 'departments' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif font-bold text-xl text-[#0f2744]">
                Department Management (Dynamic Catalog)
              </h2>
              <p className="text-xs text-slate-500">
                Create new TVET departments, update occupational qualification levels, or deactivate departments.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingDept(null);
                setDeptForm({
                  name: '',
                  code: '',
                  description: '',
                  headOfDepartmentName: '',
                  programsString: 'Level I Certificate, Level II Certificate, Level III Diploma, Level IV Diploma',
                  icon: 'Wrench'
                });
                setIsDeptModalOpen(true);
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Department</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className={`bg-white rounded-3xl border p-6 shadow-xs space-y-4 ${
                  dept.active ? 'border-slate-200' : 'border-rose-200 bg-rose-50/20 opacity-80'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                        {dept.code}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        dept.active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {dept.active ? 'Active' : 'Deactivated'}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-[#0f2744] mt-1">{dept.name}</h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditingDept(dept);
                        setDeptForm({
                          name: dept.name,
                          code: dept.code,
                          description: dept.description,
                          headOfDepartmentName: dept.headOfDepartmentName || '',
                          programsString: dept.programs.join(', '),
                          icon: dept.icon || 'Wrench'
                        });
                        setIsDeptModalOpen(true);
                      }}
                      className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition"
                      title="Edit Department"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleDeptActive(dept)}
                      className={`p-1.5 rounded-lg transition ${
                        dept.active ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'
                      }`}
                      title={dept.active ? 'Deactivate Department' : 'Activate Department'}
                    >
                      {dept.active ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {dept.description}
                </p>

                <div className="border-t border-slate-100 pt-3 space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-700">Qualification Levels:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {dept.programs.map((prog, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md text-slate-700">
                        {prog}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>Head: <strong>{dept.headOfDepartmentName || 'Not Assigned'}</strong></span>
                  <span>ID: <code className="font-mono text-[10px] text-slate-400">{dept.id}</code></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: USERS & STAFF ================= */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif font-bold text-xl text-[#0f2744]">
                Staff & User Account Management
              </h2>
              <p className="text-xs text-slate-500">
                Create user credentials, assign roles, bind to departments, and instantly deactivate departed teachers or students.
              </p>
            </div>
            <button
              onClick={() => setIsUserModalOpen(true)}
              className="px-4 py-2 bg-[#0f2744] hover:bg-[#1a385e] text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5 shrink-0"
            >
              <UserPlus className="w-4 h-4 text-amber-400" />
              <span>Create New User Account</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">Filter Role:</span>
              {['all', 'admin', 'registrar', 'department_head', 'teacher', 'student'].map((r) => (
                <button
                  key={r}
                  onClick={() => setUserRoleFilter(r)}
                  className={`px-3 py-1 rounded-lg uppercase text-[10px] font-bold transition ${
                    userRoleFilter === r
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {r.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-64">
              <input
                type="text"
                placeholder="Search by name, email, ID, or dept..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0f2744] text-white uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">User Name & ID</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Assigned Department</th>
                    <th className="py-3 px-4">Access Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => {
                    const isInactive = u.status === 'inactive';
                    return (
                      <tr key={u.id} className={`hover:bg-slate-50/70 ${isInactive ? 'bg-rose-50/30' : ''}`}>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{u.fullName}</div>
                          <div className="text-[10px] font-mono text-slate-400">{u.idNumber || u.id}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{u.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : u.role === 'registrar'
                              ? 'bg-blue-100 text-blue-800'
                              : u.role === 'department_head'
                              ? 'bg-emerald-100 text-emerald-800'
                              : u.role === 'teacher'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-sky-100 text-sky-800'
                          }`}>
                            {u.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          {u.departmentName || <span className="text-slate-400 italic">None / College-wide</span>}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            u.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleToggleUserStatus(u)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold transition ${
                              u.status === 'active'
                                ? 'bg-rose-100 hover:bg-rose-200 text-rose-800'
                                : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                            }`}
                            title="Immediate deactivation cuts off all portal access"
                          >
                            {u.status === 'active' ? 'Deactivate' : 'Reactivate'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: ANNOUNCEMENTS ================= */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Post Form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#0f2744]">
              Publish College Announcement
            </h3>
            <p className="text-xs text-slate-400">
              Notices broadcast across the entire campus or targeting a specific TVET department.
            </p>

            <form onSubmit={handlePostAnnouncement} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. COC Practical Assessment Schedule"
                  value={annForm.title}
                  onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Scope</label>
                  <select
                    value={annForm.scope}
                    onChange={(e) => setAnnForm({ ...annForm, scope: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="college">College-wide (Public)</option>
                    <option value="department">Department-Specific</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={annForm.priority}
                    onChange={(e) => setAnnForm({ ...annForm, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent / Alert</option>
                  </select>
                </div>
              </div>

              {annForm.scope === 'department' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Department</label>
                  <select
                    value={annForm.departmentId}
                    onChange={(e) => setAnnForm({ ...annForm, departmentId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Content Details *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter notice details for trainees and instructors..."
                  value={annForm.content}
                  onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-amber-400"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0f2744] hover:bg-[#1a385e] text-white font-bold text-xs rounded-xl shadow transition"
              >
                Publish Announcement
              </button>
            </form>
          </div>

          {/* Announcements List */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="font-serif font-bold text-lg text-[#0f2744] mb-2">
              Existing Announcements ({announcements.length})
            </h3>
            {announcements.map((ann) => (
              <div key={ann.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                      ann.priority === 'urgent' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {ann.priority}
                    </span>
                    <span className="text-[10px] font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase">
                      {ann.scope === 'college' ? 'College-Wide' : ann.departmentName || 'Department'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteAnnouncement(ann.id)}
                    className="text-slate-400 hover:text-rose-600 transition"
                    title="Delete Announcement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h4 className="font-bold text-sm text-[#0f2744]">{ann.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
                <div className="text-[10px] text-slate-400 pt-1">
                  By {ann.authorName} ({ann.authorRole}) • {ann.createdAt?.split('T')[0]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 5: CMS (NEWS & MEDIA) ================= */}
      {activeTab === 'cms' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-xl text-[#0f2744]">
                Public Website Content Management
              </h2>
              <p className="text-xs text-slate-500">
                Manage news articles, announcements, and events displayed on the public landing website.
              </p>
            </div>
            <button
              onClick={() => setIsNewsModalOpen(true)}
              className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Publish News Article</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                <div>
                  <img src={item.imageUrl} alt={item.title} className="w-full h-36 object-cover" />
                  <div className="p-4 space-y-1.5">
                    <span className="text-[10px] font-bold text-amber-600 uppercase">{item.category}</span>
                    <h4 className="font-bold text-sm text-[#0f2744] line-clamp-2">{item.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{item.summary}</p>
                  </div>
                </div>
                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>{item.publishedAt}</span>
                  <button
                    onClick={() => deleteNews(item.id).then(loadAllData)}
                    className="text-rose-500 hover:text-rose-700 font-bold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 6: TERMS ================= */}
      {activeTab === 'terms' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-xl text-[#0f2744]">
                Academic Years & Semesters
              </h2>
              <p className="text-xs text-slate-500">
                Manage Ethiopian TVET academic calendar periods and mark the active operating semester.
              </p>
            </div>
            <button
              onClick={() => setIsTermModalOpen(true)}
              className="px-4 py-2 bg-[#0f2744] text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Add Academic Term</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {terms.map((term) => (
              <div
                key={term.id}
                className={`p-6 rounded-2xl border transition ${
                  term.isCurrent
                    ? 'bg-amber-50/50 border-amber-500 shadow-md ring-1 ring-amber-400'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">
                      {term.semester}
                    </span>
                    <h3 className="font-bold text-base text-[#0f2744] mt-0.5">{term.academicYear}</h3>
                    <div className="text-xs text-slate-500 mt-2">
                      Duration: {term.startDate} to {term.endDate}
                    </div>
                  </div>

                  {term.isCurrent ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                      Current Active Term
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSetCurrentTerm(term.id)}
                      className="px-3 py-1 bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-700 font-bold text-xs rounded-lg transition"
                    >
                      Set as Active
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD/EDIT DEPARTMENT ================= */}
      {isDeptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif font-bold text-xl text-[#0f2744]">
              {editingDept ? 'Edit TVET Department' : 'Create New TVET Department'}
            </h3>
            <p className="text-xs text-slate-500">
              Department names and occupational levels are not hardcoded. Administrators can dynamically add any technical program.
            </p>

            <form onSubmit={handleSaveDept} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Renewable Energy & Solar Technology"
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SOLAR-TECH"
                    value={deptForm.code}
                    onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs uppercase focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Icon Style</label>
                  <select
                    value={deptForm.icon}
                    onChange={(e) => setDeptForm({ ...deptForm, icon: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Wrench">Wrench (Mechanical/Auto)</option>
                    <option value="Cpu">Cpu (ICT/Computing)</option>
                    <option value="Zap">Zap (Electrical/Power)</option>
                    <option value="Building2">Building (Construction)</option>
                    <option value="Hammer">Hammer (Manufacturing/Metal)</option>
                    <option value="Scissors">Scissors (Garment/Fashion)</option>
                    <option value="Calculator">Calculator (Accounting/Finance)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Head of Department Name</label>
                <input
                  type="text"
                  placeholder="e.g. Eng. Daniel Girma"
                  value={deptForm.headOfDepartmentName}
                  onChange={(e) => setDeptForm({ ...deptForm, headOfDepartmentName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Programs / Levels (Comma-separated) *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Level I Certificate, Level II Certificate, Level III Diploma, Level IV Diploma"
                  value={deptForm.programsString}
                  onChange={(e) => setDeptForm({ ...deptForm, programsString: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-amber-400"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe workshop focus, vocational standards, and occupational competencies..."
                  value={deptForm.description}
                  onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-amber-400"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsDeptModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0f2744] hover:bg-[#1a385e] text-white text-xs font-bold rounded-xl shadow"
                >
                  {editingDept ? 'Update Department' : 'Save Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE USER ================= */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif font-bold text-xl text-[#0f2744]">
              Create User / Staff Account
            </h3>
            <p className="text-xs text-slate-500">
              Provision verified credentials for teachers, students, department heads, or registrars.
            </p>

            <form onSubmit={handleSaveUser} className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ins. Yohannes Bekele"
                    value={userForm.fullName}
                    onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. yohannes@karawo.edu.et"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Role *</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="teacher">Teacher / Instructor</option>
                    <option value="department_head">Department Head</option>
                    <option value="student">Student / Trainee</option>
                    <option value="registrar">Registrar Officer</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Department</label>
                  <select
                    value={userForm.departmentId}
                    onChange={(e) => setUserForm({ ...userForm, departmentId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="">None (College-Wide)</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Staff / Trainee ID</label>
                  <input
                    type="text"
                    placeholder="e.g. KTVET-TCH-048"
                    value={userForm.idNumber}
                    onChange={(e) => setUserForm({ ...userForm, idNumber: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="+251 91 234 5678"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0f2744] hover:bg-[#1a385e] text-white text-xs font-bold rounded-xl shadow"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ACADEMIC TERM ================= */}
      {isTermModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#0f2744]">Add Academic Term</h3>
            <form onSubmit={handleCreateTerm} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Academic Year</label>
                <input
                  type="text"
                  required
                  value={termForm.academicYear}
                  onChange={(e) => setTermForm({ ...termForm, academicYear: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Semester</label>
                <input
                  type="text"
                  required
                  value={termForm.semester}
                  onChange={(e) => setTermForm({ ...termForm, semester: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={termForm.startDate}
                    onChange={(e) => setTermForm({ ...termForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={termForm.endDate}
                    onChange={(e) => setTermForm({ ...termForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTermModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0f2744] text-white text-xs font-bold rounded-xl"
                >
                  Save Term
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: NEWS ================= */}
      {isNewsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif font-bold text-lg text-[#0f2744]">Publish News Story</h3>
            <form onSubmit={handleCreateNews} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Trainees Awarded Regional TVET Trophy"
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newsForm.category}
                    onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                  >
                    <option value="Achievement">Achievement</option>
                    <option value="Facility Upgrade">Facility Upgrade</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Academic">Academic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Author Byline</label>
                  <input
                    type="text"
                    value={newsForm.author}
                    onChange={(e) => setNewsForm({ ...newsForm, author: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Summary (1-2 sentences) *</label>
                <input
                  type="text"
                  required
                  value={newsForm.summary}
                  onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Article Content *</label>
                <textarea
                  rows={4}
                  required
                  value={newsForm.content}
                  onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                ></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={newsForm.imageUrl}
                  onChange={(e) => setNewsForm({ ...newsForm, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewsModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0f2744] text-white text-xs font-bold rounded-xl"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
