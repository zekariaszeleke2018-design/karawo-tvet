/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import {
  Department,
  AcademicTerm,
  UserProfile,
  LearningMaterial,
  Assignment,
  Submission,
  Announcement,
  NewsItem,
  EventItem,
  GalleryItem,
  ContactInquiry,
  AdmissionApplication
} from '../types';
import {
  INITIAL_DEPARTMENTS,
  INITIAL_ACADEMIC_TERMS,
  INITIAL_NEWS,
  INITIAL_EVENTS,
  INITIAL_GALLERY,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_MATERIALS,
  INITIAL_ASSIGNMENTS,
  DEMO_PRECONFIGURED_USERS
} from '../data/seedData';

// Flag to track if initial seeding was attempted
let isSeeded = false;

export async function initializeDatabaseIfEmpty(): Promise<void> {
  if (isSeeded) return;
  try {
    const deptsSnap = await getDocs(collection(db, 'departments'));
    if (deptsSnap.empty) {
      console.log('Seeding initial Karawo TVET College data into Firestore...');
      // Seed departments
      for (const d of INITIAL_DEPARTMENTS) {
        await setDoc(doc(db, 'departments', d.id), {
          ...d,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      // Seed academic terms
      for (const t of INITIAL_ACADEMIC_TERMS) {
        await setDoc(doc(db, 'academic_terms', t.id), t);
      }
      // Seed news
      for (const n of INITIAL_NEWS) {
        await setDoc(doc(db, 'news', n.id), n);
      }
      // Seed events
      for (const e of INITIAL_EVENTS) {
        await setDoc(doc(db, 'events', e.id), e);
      }
      // Seed gallery
      for (const g of INITIAL_GALLERY) {
        await setDoc(doc(db, 'gallery', g.id), g);
      }
      // Seed announcements
      for (const a of INITIAL_ANNOUNCEMENTS) {
        await setDoc(doc(db, 'announcements', a.id), a);
      }
      // Seed materials
      for (const m of INITIAL_MATERIALS) {
        await setDoc(doc(db, 'materials', m.id), m);
      }
      // Seed assignments
      for (const asg of INITIAL_ASSIGNMENTS) {
        await setDoc(doc(db, 'assignments', asg.id), asg);
      }
      // Seed demo users
      for (const u of DEMO_PRECONFIGURED_USERS) {
        await setDoc(doc(db, 'users', u.id), u);
      }
      console.log('Database initial seeding completed successfully.');
    }
    isSeeded = true;
  } catch (err) {
    console.warn('Initial seed encountered permission/network boundary or already populated:', err);
    isSeeded = true;
  }
}

// ==================== DEPARTMENTS ====================

export async function getDepartments(): Promise<Department[]> {
  try {
    const snap = await getDocs(collection(db, 'departments'));
    if (snap.empty) {
      return INITIAL_DEPARTMENTS.map(d => ({ ...d, createdAt: new Date().toISOString() }));
    }
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Department));
  } catch (error) {
    console.warn('Fallback to local departments on error:', error);
    return INITIAL_DEPARTMENTS.map(d => ({ ...d, createdAt: new Date().toISOString() }));
  }
}

export async function createDepartment(deptData: Omit<Department, 'id' | 'createdAt'>): Promise<Department> {
  const newId = `dept-${deptData.code.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;
  const now = new Date().toISOString();
  const fullDept: Department = {
    ...deptData,
    id: newId,
    createdAt: now,
    updatedAt: now,
    enrolledCount: 0,
    facultyCount: 0
  };
  try {
    await setDoc(doc(db, 'departments', newId), fullDept);
    return fullDept;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `departments/${newId}`);
  }
}

export async function updateDepartment(id: string, updates: Partial<Department>): Promise<void> {
  try {
    await updateDoc(doc(db, 'departments', id), {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `departments/${id}`);
  }
}

// ==================== USERS & ACCOUNTS ====================

export async function getUsers(): Promise<UserProfile[]> {
  try {
    const snap = await getDocs(collection(db, 'users'));
    if (snap.empty) {
      return DEMO_PRECONFIGURED_USERS;
    }
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserProfile));
  } catch (error) {
    console.warn('Using local demo users fallback on read error:', error);
    return DEMO_PRECONFIGURED_USERS;
  }
}

export async function createUser(userData: Omit<UserProfile, 'id' | 'createdAt'>): Promise<UserProfile> {
  const newId = userData.uid || `user-${Date.now()}`;
  const newUser: UserProfile = {
    ...userData,
    id: newId,
    uid: newId,
    createdAt: new Date().toISOString()
  };
  try {
    await setDoc(doc(db, 'users', newId), newUser);
    return newUser;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `users/${newId}`);
  }
}

export async function updateUser(id: string, updates: Partial<UserProfile>): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', id), {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${id}`);
  }
}

// ==================== ACADEMIC TERMS ====================

export async function getAcademicTerms(): Promise<AcademicTerm[]> {
  try {
    const snap = await getDocs(collection(db, 'academic_terms'));
    if (snap.empty) return INITIAL_ACADEMIC_TERMS;
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as AcademicTerm));
  } catch (error) {
    console.warn('Error reading academic terms:', error);
    return INITIAL_ACADEMIC_TERMS;
  }
}

export async function createAcademicTerm(term: Omit<AcademicTerm, 'id'>): Promise<AcademicTerm> {
  const id = `term-${Date.now()}`;
  const newTerm: AcademicTerm = { ...term, id };
  try {
    await setDoc(doc(db, 'academic_terms', id), newTerm);
    return newTerm;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `academic_terms/${id}`);
  }
}

export async function setCurrentAcademicTerm(termId: string, allTerms: AcademicTerm[]): Promise<void> {
  try {
    for (const t of allTerms) {
      await updateDoc(doc(db, 'academic_terms', t.id), { isCurrent: t.id === termId });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `academic_terms/${termId}`);
  }
}

// ==================== LEARNING MATERIALS ====================

export async function getMaterials(departmentId?: string): Promise<LearningMaterial[]> {
  try {
    let q = collection(db, 'materials');
    const snap = await getDocs(q);
    const all = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as LearningMaterial));
    if (all.length === 0) {
      return departmentId ? INITIAL_MATERIALS.filter(m => m.departmentId === departmentId) : INITIAL_MATERIALS;
    }
    return departmentId ? all.filter(m => m.departmentId === departmentId) : all;
  } catch (error) {
    console.warn('Error reading materials:', error);
    return departmentId ? INITIAL_MATERIALS.filter(m => m.departmentId === departmentId) : INITIAL_MATERIALS;
  }
}

export async function createMaterial(data: Omit<LearningMaterial, 'id' | 'createdAt'>): Promise<LearningMaterial> {
  const id = `mat-${Date.now()}`;
  const newMat: LearningMaterial = {
    ...data,
    id,
    createdAt: new Date().toISOString()
  };
  try {
    await setDoc(doc(db, 'materials', id), newMat);
    return newMat;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `materials/${id}`);
  }
}

export async function deleteMaterial(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'materials', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `materials/${id}`);
  }
}

// ==================== ASSIGNMENTS & SUBMISSIONS ====================

export async function getAssignments(departmentId?: string): Promise<Assignment[]> {
  try {
    const snap = await getDocs(collection(db, 'assignments'));
    const all = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Assignment));
    if (all.length === 0) {
      return departmentId ? INITIAL_ASSIGNMENTS.filter(a => a.departmentId === departmentId) : INITIAL_ASSIGNMENTS;
    }
    return departmentId ? all.filter(a => a.departmentId === departmentId) : all;
  } catch (error) {
    console.warn('Error reading assignments:', error);
    return departmentId ? INITIAL_ASSIGNMENTS.filter(a => a.departmentId === departmentId) : INITIAL_ASSIGNMENTS;
  }
}

export async function createAssignment(data: Omit<Assignment, 'id' | 'createdAt'>): Promise<Assignment> {
  const id = `asg-${Date.now()}`;
  const newAsg: Assignment = {
    ...data,
    id,
    createdAt: new Date().toISOString()
  };
  try {
    await setDoc(doc(db, 'assignments', id), newAsg);
    return newAsg;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `assignments/${id}`);
  }
}

export async function deleteAssignment(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'assignments', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `assignments/${id}`);
  }
}

export async function getSubmissions(assignmentId?: string, studentUid?: string, departmentId?: string): Promise<Submission[]> {
  try {
    const snap = await getDocs(collection(db, 'submissions'));
    let list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Submission));
    if (assignmentId) list = list.filter(s => s.assignmentId === assignmentId);
    if (studentUid) list = list.filter(s => s.studentUid === studentUid);
    if (departmentId) list = list.filter(s => s.departmentId === departmentId);
    return list;
  } catch (error) {
    console.warn('Error reading submissions:', error);
    return [];
  }
}

export async function submitAssignment(data: Omit<Submission, 'id' | 'submittedAt'>): Promise<Submission> {
  const id = `sub-${Date.now()}`;
  const newSub: Submission = {
    ...data,
    id,
    submittedAt: new Date().toISOString()
  };
  try {
    await setDoc(doc(db, 'submissions', id), newSub);
    return newSub;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `submissions/${id}`);
  }
}

export async function gradeSubmission(id: string, score: number, feedback: string, gradedByUid: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'submissions', id), {
      score,
      feedback,
      gradedAt: new Date().toISOString(),
      gradedByUid
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `submissions/${id}`);
  }
}

// ==================== ANNOUNCEMENTS ====================

export async function getAnnouncements(departmentId?: string): Promise<Announcement[]> {
  try {
    const snap = await getDocs(collection(db, 'announcements'));
    const all = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement));
    if (all.length === 0) {
      return INITIAL_ANNOUNCEMENTS;
    }
    if (departmentId) {
      return all.filter(a => a.scope === 'college' || a.departmentId === departmentId);
    }
    return all;
  } catch (error) {
    console.warn('Error reading announcements:', error);
    return INITIAL_ANNOUNCEMENTS;
  }
}

export async function createAnnouncement(data: Omit<Announcement, 'id' | 'createdAt'>): Promise<Announcement> {
  const id = `ann-${Date.now()}`;
  const newAnn: Announcement = {
    ...data,
    id,
    createdAt: new Date().toISOString()
  };
  try {
    await setDoc(doc(db, 'announcements', id), newAnn);
    return newAnn;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `announcements/${id}`);
  }
}

export async function deleteAnnouncement(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'announcements', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `announcements/${id}`);
  }
}

// ==================== PUBLIC WEBSITE CONTENT ====================

export async function getNews(): Promise<NewsItem[]> {
  try {
    const snap = await getDocs(collection(db, 'news'));
    if (snap.empty) return INITIAL_NEWS;
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem));
  } catch (error) {
    return INITIAL_NEWS;
  }
}

export async function createNews(data: Omit<NewsItem, 'id' | 'publishedAt'>): Promise<NewsItem> {
  const id = `news-${Date.now()}`;
  const newItem: NewsItem = {
    ...data,
    id,
    publishedAt: new Date().toISOString().split('T')[0]
  };
  try {
    await setDoc(doc(db, 'news', id), newItem);
    return newItem;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `news/${id}`);
  }
}

export async function deleteNews(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'news', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `news/${id}`);
  }
}

export async function getEvents(): Promise<EventItem[]> {
  try {
    const snap = await getDocs(collection(db, 'events'));
    if (snap.empty) return INITIAL_EVENTS;
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as EventItem));
  } catch (error) {
    return INITIAL_EVENTS;
  }
}

export async function createEvent(data: Omit<EventItem, 'id'>): Promise<EventItem> {
  const id = `event-${Date.now()}`;
  const newItem: EventItem = { ...data, id };
  try {
    await setDoc(doc(db, 'events', id), newItem);
    return newItem;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `events/${id}`);
  }
}

export async function deleteEvent(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'events', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `events/${id}`);
  }
}

export async function getGallery(): Promise<GalleryItem[]> {
  try {
    const snap = await getDocs(collection(db, 'gallery'));
    if (snap.empty) return INITIAL_GALLERY;
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryItem));
  } catch (error) {
    return INITIAL_GALLERY;
  }
}

export async function createGalleryItem(data: Omit<GalleryItem, 'id'>): Promise<GalleryItem> {
  const id = `gal-${Date.now()}`;
  const newItem: GalleryItem = { ...data, id };
  try {
    await setDoc(doc(db, 'gallery', id), newItem);
    return newItem;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `gallery/${id}`);
  }
}

export async function deleteGalleryItem(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'gallery', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `gallery/${id}`);
  }
}

// ==================== INQUIRIES & ADMISSIONS ====================

export async function submitContactInquiry(inquiry: Omit<ContactInquiry, 'id' | 'status' | 'createdAt'>): Promise<void> {
  const id = `inq-${Date.now()}`;
  const item: ContactInquiry = {
    ...inquiry,
    id,
    status: 'new',
    createdAt: new Date().toISOString()
  };
  try {
    await setDoc(doc(db, 'inquiries', id), item);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `inquiries/${id}`);
  }
}

export async function getContactInquiries(): Promise<ContactInquiry[]> {
  try {
    const snap = await getDocs(collection(db, 'inquiries'));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactInquiry));
  } catch (error) {
    return [];
  }
}

export async function submitAdmissionApplication(app: Omit<AdmissionApplication, 'id' | 'status' | 'createdAt'>): Promise<void> {
  const id = `app-${Date.now()}`;
  const item: AdmissionApplication = {
    ...app,
    id,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  try {
    await setDoc(doc(db, 'admissions_applications', id), item);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `admissions_applications/${id}`);
  }
}

export async function getAdmissionApplications(): Promise<AdmissionApplication[]> {
  try {
    const snap = await getDocs(collection(db, 'admissions_applications'));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdmissionApplication));
  } catch (error) {
    return [];
  }
}

export async function updateAdmissionStatus(id: string, status: AdmissionApplication['status']): Promise<void> {
  try {
    await updateDoc(doc(db, 'admissions_applications', id), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `admissions_applications/${id}`);
  }
}
