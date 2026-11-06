/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'admin' | 'registrar' | 'department_head' | 'teacher' | 'student';

export type UserStatus = 'active' | 'inactive';

export interface UserProfile {
  id: string;
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
  departmentId?: string;
  departmentName?: string;
  status: UserStatus;
  idNumber?: string;
  phone?: string;
  programLevel?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  headOfDepartmentId?: string;
  headOfDepartmentName?: string;
  programs: string[];
  active: boolean;
  icon?: string;
  enrolledCount?: number;
  facultyCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface AcademicTerm {
  id: string;
  academicYear: string;
  semester: string;
  isCurrent: boolean;
  startDate: string;
  endDate: string;
}

export interface LearningMaterial {
  id: string;
  title: string;
  description: string;
  departmentId: string;
  courseName: string;
  fileType: 'pdf' | 'doc' | 'presentation' | 'video' | 'link';
  fileUrl: string;
  uploadedByUid: string;
  uploadedByName: string;
  uploaderRole: string;
  targetLevel: string;
  createdAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  departmentId: string;
  courseName: string;
  dueDate: string;
  maxScore: number;
  createdByUid: string;
  createdByName: string;
  targetLevel: string;
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle?: string;
  studentUid: string;
  studentName: string;
  studentIdNumber?: string;
  departmentId: string;
  submissionText: string;
  fileUrl?: string;
  submittedAt: string;
  score?: number;
  feedback?: string;
  gradedAt?: string;
  gradedByUid?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  scope: 'college' | 'department';
  departmentId?: string;
  departmentName?: string;
  authorUid: string;
  authorName: string;
  authorRole: string;
  priority: 'normal' | 'urgent';
  createdAt: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  imageUrl: string;
  publishedAt: string;
  author: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  date: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'resolved';
  createdAt: string;
}

export interface AdmissionApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  departmentId: string;
  departmentName: string;
  preferredProgram: string;
  previousEducation: string;
  status: 'pending' | 'reviewed' | 'admitted' | 'declined';
  createdAt: string;
}
