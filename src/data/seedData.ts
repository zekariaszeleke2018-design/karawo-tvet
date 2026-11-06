/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Department, AcademicTerm, NewsItem, EventItem, GalleryItem, Announcement, LearningMaterial, Assignment, UserProfile } from '../types';

export const INITIAL_DEPARTMENTS: Omit<Department, 'createdAt'>[] = [
  {
    id: 'dept-auto',
    name: 'Automotive Technology & Mechanical',
    code: 'AUTO-MECH',
    description: 'Practical diagnostics, engine overhaul, chassis electrical systems, and modern vehicle maintenance according to national occupational standards.',
    headOfDepartmentId: 'demo-head-auto',
    headOfDepartmentName: 'Ato Daniel Girma',
    programs: [
      'Automotive Servicing Level I - Basic Maintenance',
      'Automotive Servicing Level II - Engine & Powertrain',
      'Automotive Servicing Level III - Advanced Electrical & Electronic Diagnostics',
      'Automotive Servicing Level IV - Fleet Supervision & Workshop Management'
    ],
    active: true,
    icon: 'Wrench',
    enrolledCount: 245,
    facultyCount: 14
  },
  {
    id: 'dept-ict',
    name: 'Information & Communication Technology (ICT)',
    code: 'ICT-COMP',
    description: 'Hardware maintenance, structured networking, full-stack database application development, web systems, and system administration.',
    headOfDepartmentId: 'demo-head-ict',
    headOfDepartmentName: 'W/ro Bethlehem Tadesse',
    programs: [
      'ICT Support Service Level I',
      'Hardware & Network Servicing Level II',
      'Database Administration Level III',
      'Web and Software Application Development Level IV'
    ],
    active: true,
    icon: 'Cpu',
    enrolledCount: 310,
    facultyCount: 18
  },
  {
    id: 'dept-elec',
    name: 'Electrical / Electronics Installation & Power',
    code: 'ELEC-POW',
    description: 'Industrial motor control, solar photovoltaic systems installation, domestic building wiring, PLC automation, and substation maintenance.',
    headOfDepartmentId: 'demo-head-elec',
    headOfDepartmentName: 'Eng. Solomon Worku',
    programs: [
      'Domestic Electrical Installation Level I & II',
      'Industrial Motor & Drive Controls Level III',
      'Renewable Solar PV Engineering Level IV'
    ],
    active: true,
    icon: 'Zap',
    enrolledCount: 220,
    facultyCount: 12
  },
  {
    id: 'dept-const',
    name: 'Building Construction & Wood Technology',
    code: 'CONST-WOOD',
    description: 'Civil drafting, surveying, masonry, reinforced concrete structures, finishing carpentry, and architectural woodwork.',
    headOfDepartmentId: 'demo-head-const',
    headOfDepartmentName: 'Ato Bekele Haile',
    programs: [
      'Masonry & Concreting Works Level I & II',
      'Building Construction Supervision Level III',
      'Surveying & Structural Drafting Level IV'
    ],
    active: true,
    icon: 'Building2',
    enrolledCount: 185,
    facultyCount: 10
  },
  {
    id: 'dept-mfg',
    name: 'Manufacturing & Metal Technology',
    code: 'MFG-METAL',
    description: 'Manual and CNC machining, TIG/MIG welding, sheet metal fabrication, foundry casting, and industrial assembly.',
    headOfDepartmentId: 'demo-head-mfg',
    headOfDepartmentName: 'Ato Mesfin Alemu',
    programs: [
      'General Metal Fabrication Level I & II',
      'Shielded Metal Arc & Gas Welding Level III',
      'Machining & Tool Making Level IV'
    ],
    active: true,
    icon: 'Hammer',
    enrolledCount: 160,
    facultyCount: 9
  },
  {
    id: 'dept-garment',
    name: 'Garment & Apparel Fashion Production',
    code: 'GARM-FASH',
    description: 'Industrial sewing techniques, pattern drafting, textile grading, quality inspection, and apparel manufacturing management.',
    headOfDepartmentId: 'demo-head-garment',
    headOfDepartmentName: 'W/ro Hiwot Mulugeta',
    programs: [
      'Garment Production Operation Level I & II',
      'Pattern Making & Fashion Design Level III',
      'Garment Factory Quality Supervision Level IV'
    ],
    active: true,
    icon: 'Scissors',
    enrolledCount: 140,
    facultyCount: 8
  },
  {
    id: 'dept-acct',
    name: 'Accounting & Budget Service',
    code: 'ACCT-BUDG',
    description: 'Financial accounting, Peachtree/QuickBooks automation, Ethiopian tax compliance, payroll processing, and audit assistance.',
    headOfDepartmentId: 'demo-head-acct',
    headOfDepartmentName: 'Ato Dawit Kebede',
    programs: [
      'Basic Bookkeeping Level I & II',
      'Accounting & Financial Records Level III',
      'Budget Management & Audit Level IV'
    ],
    active: true,
    icon: 'Calculator',
    enrolledCount: 270,
    facultyCount: 11
  }
];

export const INITIAL_ACADEMIC_TERMS: AcademicTerm[] = [
  {
    id: 'term-2026-s1',
    academicYear: '2026/2027 Academic Year (2019 E.C.)',
    semester: 'Semester 1 (Regular)',
    isCurrent: true,
    startDate: '2026-09-15',
    endDate: '2027-02-10'
  },
  {
    id: 'term-2026-s2',
    academicYear: '2026/2027 Academic Year (2019 E.C.)',
    semester: 'Semester 2 (Regular)',
    isCurrent: false,
    startDate: '2027-02-20',
    endDate: '2027-07-15'
  }
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Karawo TVET College Trainees Excel in Regional Skills Competition',
    summary: 'Our Automotive and Electrical trainees secured top honors at the Regional TVET Skills Demonstration Contest.',
    content: 'Trainees from the Automotive Technology and Electrical Power departments at Karawo TVET College showcased exemplary technical proficiency during the annual Regional TVET Skills Competition. Over 28 public and private colleges participated. Karawo trainees demonstrated rapid fault diagnosis on modern common-rail diesel injection systems and automated industrial PLC motor sequencing.',
    category: 'Achievement',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    publishedAt: '2026-10-24',
    author: 'College Academic Affairs'
  },
  {
    id: 'news-2',
    title: 'New Modern Computer Networking & Fiber Optic Lab Commissioned',
    summary: 'State-of-the-art server racks, Cisco testing benches, and fiber optic fusion splicers installed for Level III and IV ICT trainees.',
    content: 'In line with the national Technical and Vocational Education reform, Karawo TVET College has upgraded its primary ICT training facility with enterprise-grade networking switches, structured cabling workstations, and server virtualization clusters. The facility ensures trainees gain direct hands-on industry experience before their cooperative apprenticeship attachments.',
    category: 'Facility Upgrade',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80',
    publishedAt: '2026-10-10',
    author: 'Department of ICT'
  },
  {
    id: 'news-3',
    title: 'Industry Cooperative Training Partnerships Signed with 15 Manufacturing Enterprises',
    summary: 'Expanding dual-training apprenticeships for Level II to Level IV technical scholars across regional industrial clusters.',
    content: 'Dean and College Administration signed formal memorandums of understanding with fifteen leading industrial manufacturing, automotive assembly, and construction enterprises. Under the cooperative TVET training model, students spend 70% of their learning time in practical industry workshops and 30% on theoretical institutional coursework.',
    category: 'Partnership',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80',
    publishedAt: '2026-09-28',
    author: 'Registrar & Industry Linkage'
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'event-1',
    title: 'Center of Competence (COC) Practical Assessment Session',
    date: '2026-11-20',
    time: '08:30 AM - 04:30 PM',
    location: 'Main College Workshops (Auto, Elec, ICT)',
    description: 'Accredited national assessment for graduating Level III and IV trainees across all occupational sectors.',
    category: 'Assessment'
  },
  {
    id: 'event-2',
    title: 'Annual TVET Technology Exhibition & Industry Job Fair',
    date: '2026-12-05',
    time: '09:00 AM - 05:00 PM',
    location: 'Karawo TVET Main Campus Grounds',
    description: 'Graduating students showcase innovative technical prototypes, solar energy projects, and metal craftsmanship to regional employers.',
    category: 'Exhibition'
  },
  {
    id: 'event-3',
    title: 'Orientation & Workshop Safety Seminar for New Trainees',
    date: '2026-11-15',
    time: '10:00 AM - 12:30 PM',
    location: 'Auditorium Hall A',
    description: 'Mandatory occupational health, safety procedures, and workshop protocol briefing for incoming Semester 1 trainees.',
    category: 'Academic'
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Advanced Automotive Diagnostic Workshop',
    category: 'Automotive',
    imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
    description: 'Trainees conducting electrical engine diagnostics and mechanical adjustments.',
    date: '2026-10-18'
  },
  {
    id: 'gal-2',
    title: 'Industrial Electronics & PLC Automation Station',
    category: 'Electrical',
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    description: 'Hands-on ladder logic programming and circuit testing.',
    date: '2026-10-12'
  },
  {
    id: 'gal-3',
    title: 'High-Tech ICT Networking & Systems Lab',
    category: 'ICT',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    description: 'Students configuring VLANs and server infrastructure in hands-on practical class.',
    date: '2026-09-30'
  },
  {
    id: 'gal-4',
    title: 'Precision Metal Turning & CNC Lathe Operations',
    category: 'Manufacturing',
    imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
    description: 'Manufacturing technology trainees fabricating machine components.',
    date: '2026-09-15'
  },
  {
    id: 'gal-5',
    title: 'Apparel Pattern Drafting & Industrial Stitching',
    category: 'Garment',
    imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
    description: 'Garment department students preparing high-grade fashion samples.',
    date: '2026-09-10'
  },
  {
    id: 'gal-6',
    title: 'Surveying & Structural Engineering Fieldwork',
    category: 'Construction',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=800&q=80',
    description: 'Level IV building construction students operating total stations and optical levels.',
    date: '2026-08-25'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Upcoming Center of Competence (COC) Registration Deadline',
    content: 'All prospective graduates for TVET Level III and Level IV across all departments are reminded to submit their assessment application forms and national ID copies to the Registrar Office before November 18, 2026.',
    scope: 'college',
    authorUid: 'demo-admin-1',
    authorName: 'College Administration',
    authorRole: 'Administrator',
    priority: 'urgent',
    createdAt: '2026-11-01T08:00:00Z'
  },
  {
    id: 'ann-2',
    title: 'Mandatory PPE and Safety Equipment in Auto & Metal Workshops',
    content: 'Trainees entering the Automotive and Manufacturing workshops must wear steel-toed boots, protective goggles, and protective overalls. No loose clothing permitted.',
    scope: 'department',
    departmentId: 'dept-auto',
    departmentName: 'Automotive Technology & Mechanical',
    authorUid: 'demo-head-auto',
    authorName: 'Ato Daniel Girma',
    authorRole: 'Department Head',
    priority: 'urgent',
    createdAt: '2026-11-03T09:30:00Z'
  },
  {
    id: 'ann-3',
    title: 'ICT Lab Server Maintenance Window',
    content: 'The campus development server and simulation sandbox will undergo scheduled maintenance this Saturday between 2:00 PM and 6:00 PM.',
    scope: 'department',
    departmentId: 'dept-ict',
    departmentName: 'Information & Communication Technology (ICT)',
    authorUid: 'demo-teacher-ict',
    authorName: 'Ins. Yohannes Mulu',
    authorRole: 'Teacher',
    priority: 'normal',
    createdAt: '2026-11-04T11:00:00Z'
  }
];

export const INITIAL_MATERIALS: LearningMaterial[] = [
  {
    id: 'mat-auto-1',
    title: 'Module 1: Electronic Fuel Injection (EFI) Diagnostic Protocols',
    description: 'Comprehensive technical manual covering sensor voltage readings, oscilloscope waveforms, and OBD-II trouble codes for modern common-rail diesel and gasoline engines.',
    departmentId: 'dept-auto',
    courseName: 'Advanced Engine Diagnostics (AUTO-301)',
    fileType: 'pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    uploadedByUid: 'demo-teacher-auto',
    uploadedByName: 'Ins. Henok Assefa',
    uploaderRole: 'Teacher',
    targetLevel: 'Level III & IV',
    createdAt: '2026-10-20T10:00:00Z'
  },
  {
    id: 'mat-auto-2',
    title: 'Hydraulic Braking and ABS System Workshop Guide',
    description: 'Step-by-step disassembly, bleeder valve procedures, and proportional valve calibration guidelines for heavy commercial trucks and light passenger vehicles.',
    departmentId: 'dept-auto',
    courseName: 'Chassis & Braking Systems (AUTO-204)',
    fileType: 'doc',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    uploadedByUid: 'demo-teacher-auto',
    uploadedByName: 'Ins. Henok Assefa',
    uploaderRole: 'Teacher',
    targetLevel: 'Level II',
    createdAt: '2026-10-25T14:30:00Z'
  },
  {
    id: 'mat-ict-1',
    title: 'Network Routing & Switching Lab Manual (VLAN, OSPF, ACL)',
    description: 'Practical lab topology guide for configuring Cisco packet routing, dynamic NAT translation, and enterprise firewall access control lists.',
    departmentId: 'dept-ict',
    courseName: 'Enterprise Networking (ICT-402)',
    fileType: 'pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    uploadedByUid: 'demo-teacher-ict',
    uploadedByName: 'Ins. Yohannes Mulu',
    uploaderRole: 'Teacher',
    targetLevel: 'Level IV',
    createdAt: '2026-10-15T09:15:00Z'
  },
  {
    id: 'mat-ict-2',
    title: 'Relational Database Schema Design & SQL Queries',
    description: 'Normalization rules (1NF to 3NF), PostgreSQL indexing, trigger constraints, and transactional consistency in institutional applications.',
    departmentId: 'dept-ict',
    courseName: 'Database Management Systems (ICT-305)',
    fileType: 'presentation',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    uploadedByUid: 'demo-head-ict',
    uploadedByName: 'W/ro Bethlehem Tadesse',
    uploaderRole: 'Department Head',
    targetLevel: 'Level III',
    createdAt: '2026-10-18T13:45:00Z'
  },
  {
    id: 'mat-elec-1',
    title: 'Solar Photovoltaic Inverter & Battery Bank Sizing Guide',
    description: 'Design calculations for off-grid and grid-tied solar microgrids with battery protection modules and MPPT charge controllers.',
    departmentId: 'dept-elec',
    courseName: 'Renewable Solar Energy Installation (ELEC-401)',
    fileType: 'pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    uploadedByUid: 'demo-head-elec',
    uploadedByName: 'Eng. Solomon Worku',
    uploaderRole: 'Department Head',
    targetLevel: 'Level IV',
    createdAt: '2026-10-22T11:00:00Z'
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'assign-auto-1',
    title: 'Lab Report: Oscilloscope Analysis of Camshaft Position Sensor',
    description: 'Connect the handheld digital oscilloscope to the Hall-effect camshaft position sensor of the test bench engine. Measure the square wave duty cycle, peak voltage, and trigger delay. Submit an analysis detailing causes for engine misfire when the signal drops below 4.5V.',
    departmentId: 'dept-auto',
    courseName: 'Advanced Engine Diagnostics (AUTO-301)',
    dueDate: '2026-11-28',
    maxScore: 25,
    createdByUid: 'demo-teacher-auto',
    createdByName: 'Ins. Henok Assefa',
    targetLevel: 'Level III',
    createdAt: '2026-11-02T10:00:00Z'
  },
  {
    id: 'assign-auto-2',
    title: 'Brake Disc Runout Measurement and Rotor Lathe Refacing',
    description: 'Perform micrometer dial indicator measurement of lateral runout on the Toyota Hilux test axle. Calculate maximum permissible tolerance and explain re-surfacing limit criteria.',
    departmentId: 'dept-auto',
    courseName: 'Chassis & Braking Systems (AUTO-204)',
    dueDate: '2026-12-05',
    maxScore: 20,
    createdByUid: 'demo-teacher-auto',
    createdByName: 'Ins. Henok Assefa',
    targetLevel: 'Level II',
    createdAt: '2026-11-04T08:30:00Z'
  },
  {
    id: 'assign-ict-1',
    title: 'Project Milestone: Campus Network Subnetting & Router Configuration',
    description: 'Given the class C IP block 192.168.10.0/24, create an optimal VLSM subnetting scheme for 4 departments: Administration (30 hosts), Automotive Lab (14 hosts), ICT Lab (60 hosts), and Guest Wi-Fi (12 hosts). Submit your router CLI configuration scripts and diagram.',
    departmentId: 'dept-ict',
    courseName: 'Enterprise Networking (ICT-402)',
    dueDate: '2026-11-25',
    maxScore: 30,
    createdByUid: 'demo-teacher-ict',
    createdByName: 'Ins. Yohannes Mulu',
    targetLevel: 'Level IV',
    createdAt: '2026-11-01T15:00:00Z'
  }
];

export const DEMO_PRECONFIGURED_USERS: UserProfile[] = [
  {
    id: 'demo-admin-1',
    uid: 'demo-admin-1',
    email: 'admin@karawo.edu.et',
    fullName: 'Dr. Kassahun Tefera (Dean)',
    role: 'admin',
    status: 'active',
    idNumber: 'KTVET-ADM-001',
    phone: '+251-911-234567',
    createdAt: '2026-09-01T08:00:00Z'
  },
  {
    id: 'demo-registrar-1',
    uid: 'demo-registrar-1',
    email: 'registrar@karawo.edu.et',
    fullName: 'Ato Mesfin Wolde (Head Registrar)',
    role: 'registrar',
    status: 'active',
    idNumber: 'KTVET-REG-002',
    phone: '+251-911-345678',
    createdAt: '2026-09-01T08:00:00Z'
  },
  {
    id: 'demo-head-auto',
    uid: 'demo-head-auto',
    email: 'head.auto@karawo.edu.et',
    fullName: 'Ato Daniel Girma (Dept. Head)',
    role: 'department_head',
    departmentId: 'dept-auto',
    departmentName: 'Automotive Technology & Mechanical',
    status: 'active',
    idNumber: 'KTVET-DH-010',
    phone: '+251-911-456789',
    createdAt: '2026-09-01T08:00:00Z'
  },
  {
    id: 'demo-teacher-auto',
    uid: 'demo-teacher-auto',
    email: 'henok.assefa@karawo.edu.et',
    fullName: 'Ins. Henok Assefa (Senior Instructor)',
    role: 'teacher',
    departmentId: 'dept-auto',
    departmentName: 'Automotive Technology & Mechanical',
    status: 'active',
    idNumber: 'KTVET-TCH-021',
    phone: '+251-912-567890',
    createdAt: '2026-09-05T08:00:00Z'
  },
  {
    id: 'demo-student-auto',
    uid: 'demo-student-auto',
    email: 'amanuel.kebede@student.karawo.edu.et',
    fullName: 'Amanuel Kebede (Trainee)',
    role: 'student',
    departmentId: 'dept-auto',
    departmentName: 'Automotive Technology & Mechanical',
    status: 'active',
    idNumber: 'KTVET/2026/0142',
    programLevel: 'Level III - Advanced Diagnostics',
    phone: '+251-913-678901',
    createdAt: '2026-09-15T08:00:00Z'
  },
  {
    id: 'demo-teacher-ict',
    uid: 'demo-teacher-ict',
    email: 'yohannes.mulu@karawo.edu.et',
    fullName: 'Ins. Yohannes Mulu',
    role: 'teacher',
    departmentId: 'dept-ict',
    departmentName: 'Information & Communication Technology (ICT)',
    status: 'active',
    idNumber: 'KTVET-TCH-035',
    phone: '+251-914-789012',
    createdAt: '2026-09-05T08:00:00Z'
  },
  {
    id: 'demo-student-ict',
    uid: 'demo-student-ict',
    email: 'samrawit.alemu@student.karawo.edu.et',
    fullName: 'Samrawit Alemu',
    role: 'student',
    departmentId: 'dept-ict',
    departmentName: 'Information & Communication Technology (ICT)',
    status: 'active',
    idNumber: 'KTVET/2026/0204',
    programLevel: 'Level IV - Software & Systems',
    phone: '+251-915-890123',
    createdAt: '2026-09-15T08:00:00Z'
  }
];
