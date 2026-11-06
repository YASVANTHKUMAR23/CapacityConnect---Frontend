import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CourseItem,
  TrainerCourse,
  TrainerCourseModule,
  TraineeCourseItem,
  UserAccount,
  UserRole,
  PendingApprovalItem,
  UserDirectoryItem,
  TrainerItem,
  TraineeItem,
  RejectedUserRecord,
} from '../types';

export interface SharedCourse {
  id: string;
  code: string;
  title: string;
  category: string;
  trainer: string;
  institution?: string;
  imageUrl?: string;
  enrolled: number;
  completed: number;
  completionRate: number;
  rating: number;
  reviewsCount: number;
  status: 'Active' | 'Draft' | 'Inactive';
  deadline: string;
  lastUpdated: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  modulesCount: number;
  modules: TrainerCourseModule[];
  languages: string[];
  initials: string;
  avatarBg: string;
}

export interface SharedAccount extends UserAccount {
  id: string;
  division?: string;
  designation?: string;
}

export interface MonthData {
  month: string;
  enrolled: number;
  completed: number;
}

export interface DivisionItem {
  id: string;
  name: string;
  count: number;
  change: string;
  isPositive: boolean;
  color: string;
  zone?: string;
  share?: number;
  completionRate?: number;
  avgScore?: number;
  certifiedCount?: number;
  status?: string;
  trend?: string;
  traineesCount?: number;
}

export interface CompetencyGaugeItem {
  id: string;
  subject: string;
  level: number;
  change: string;
  isPositive: boolean;
  ring: {
    r: number;
    val: number;
    color: string;
  };
}

export interface TrainerMonthlyTrend {
  month: string;
  enr: number;
  comp: number;
}

export interface TraineeMonthlyProgressItem {
  m: string;
  mod: number;
  score: string;
  scoreNum: number;
}

export interface TraineeWeeklyEngagementItem {
  d: string;
  h: number;
  topic: string;
}

export interface SubjectScoreItem {
  subject: string;
  score: number;
}

interface UnifiedDataContextType {
  // Accounts & Approvals
  accounts: SharedAccount[];
  pendingApprovals: PendingApprovalItem[];
  userDirectory: UserDirectoryItem[];
  trainersRoster: TrainerItem[];
  traineesRoster: TraineeItem[];
  rejectedRecords: RejectedUserRecord[];

  registerNewProfile: (data: {
    firstName: string;
    lastName: string;
    email: string;
    organization: string;
    role: UserRole;
  }) => SharedAccount;

  approveProfileRequest: (idOrEmail: string) => void;
  rejectProfileRequest: (idOrEmail: string, reason?: string) => void;
  getUserByEmail: (email: string) => SharedAccount | undefined;

  // Unified Courses
  sharedCourses: SharedCourse[];
  publishCourseGlobally: (courseData: {
    title: string;
    category: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    duration: string;
    description: string;
    modulesCount: number;
    languages?: string[];
    imageUrl?: string;
    modules: TrainerCourseModule[];
  }) => SharedCourse;
  updateSharedCourse: (id: string, updates: Partial<SharedCourse>) => void;
  enrollInCourse: (courseId: string, traineeName?: string) => void;
  updateCourseProgress: (courseId: string, progress: number) => void;

  // Dashboard Graphs & Analytics Application Data (Real Seeded Data Store)
  monthlyEnrollmentTrends: MonthData[];
  divisionParticipations: DivisionItem[];
  addDivision: (division: Omit<DivisionItem, 'id'>) => void;
  competencyGaugeData: CompetencyGaugeItem[];
  trainerMonthlyTrends: TrainerMonthlyTrend[];
  traineeMonthlyProgress: TraineeMonthlyProgressItem[];
  traineeWeeklyEngagement: TraineeWeeklyEngagementItem[];
  subjectScores: SubjectScoreItem[];
  recordTraineeStudyActivity: (day: string, hours: number, topic: string) => void;
}

const initialSharedCourses: SharedCourse[] = [
  {
    id: 'course-1',
    code: 'MET-402',
    title: 'Cyclone Track Analysis & Forecast Verification',
    category: 'Tropical Meteorology',
    trainer: 'Dr. Ravi Menon',
    institution: 'Cyclone Warning Division, IMD Headquarters',
    imageUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800&auto=format&fit=crop&q=80',
    enrolled: 214,
    completed: 82,
    completionRate: 38,
    rating: 4.8,
    reviewsCount: 1240,
    status: 'Active',
    deadline: '15 Nov 2026',
    lastUpdated: '22 Oct 2026',
    description:
      'Advanced operational techniques for cyclonic vortex localization, steering flow integration, multi-model consensus plotting, and cone-of-uncertainty generation following IMD standard operating procedures.',
    level: 'Advanced',
    duration: '6 Weeks (42 hrs)',
    modulesCount: 4,
    languages: ['English', 'Hindi'],
    initials: 'CT',
    avatarBg: 'bg-blue-100 text-blue-800',
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1: Fundamentals of Tropical Cyclogenesis in the North Indian Ocean',
        description: 'Atmospheric thermodynamic prerequisites, SST thresholds, and Coriolis constraints in BoB and Arabian Sea.',
        duration: '10 hrs',
        status: 'Published',
        lessons: [
          { id: 'les-1', title: '1.1 Oceanic Heat Content and Low-level Relative Vorticity', type: 'video', duration: '45 mins', completedCount: 198 },
          { id: 'les-2', title: '1.2 Vertical Wind Shear Analysis & Pre-monsoon vs Post-monsoon Basins', type: 'document', duration: '30 mins', completedCount: 192 },
          { id: 'les-3', title: '1.3 Self-Assessment: Cyclogenesis Trigger Metrics', type: 'quiz', duration: '20 mins', completedCount: 184 },
        ],
      },
      {
        id: 'mod-2',
        title: 'Module 2: Dvorak Technique & Advanced Satellite Intensity Estimation',
        description: 'Curved band pattern, central cold cover (CCC), embedded center, and eye pattern T-number evaluation.',
        duration: '12 hrs',
        status: 'Published',
        lessons: [
          { id: 'les-4', title: '2.1 INSAT-3D/3DR TIR & Enhanced Infrared Scale Readings', type: 'video', duration: '50 mins', completedCount: 174 },
          { id: 'les-5', title: '2.2 Digital Dvorak Algorithm & Scatterometer Cross-Validation', type: 'presentation', duration: '40 mins', completedCount: 168 },
          { id: 'les-6', title: '2.3 Practical Case Study: Severe Cyclone Fani Reconstruction', type: 'document', duration: '60 mins', completedCount: 156 },
        ],
      },
      {
        id: 'mod-3',
        title: 'Module 3: Numerical Weather Prediction (NWP) Ensemble Guidance',
        description: 'HWRF, GFS, NCMRWF unified model consensus, track divergence, and recurvature diagnosis.',
        duration: '10 hrs',
        status: 'Published',
        lessons: [
          { id: 'les-7', title: '3.1 Dynamical Model Steering Currents & Subtropical Ridge Dynamics', type: 'video', duration: '45 mins', completedCount: 142 },
          { id: 'les-8', title: '3.2 Multi-Model Ensemble (MME) Weighting in BoB Cyclone Landfall', type: 'document', duration: '45 mins', completedCount: 138 },
        ],
      },
      {
        id: 'mod-4',
        title: 'Module 4: Cone of Uncertainty, Rapid Intensification & Warning Protocols',
        description: 'Drafting 3-hourly operational national bulletins, red/orange/yellow cone thresholds, and landfall time estimates.',
        duration: '10 hrs',
        status: 'Published',
        lessons: [
          { id: 'les-9', title: '4.1 Calculating Historical Positional Error Envelopes', type: 'presentation', duration: '35 mins', completedCount: 110 },
          { id: 'les-10', title: '4.2 Rapid Intensification Signatures on Passive Microwave Imagery', type: 'video', duration: '40 mins', completedCount: 94 },
        ],
      },
    ],
  },
  {
    id: 'course-2',
    code: 'MET-301',
    title: 'Doppler Weather Radar Meteorology & Nowcasting',
    category: 'Radar Meteorology',
    trainer: 'Dr. Ravi Menon',
    institution: 'Instruments & Radar Division, IMD Pune',
    imageUrl: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&auto=format&fit=crop&q=80',
    enrolled: 186,
    completed: 119,
    completionRate: 64,
    rating: 4.6,
    reviewsCount: 890,
    status: 'Active',
    deadline: '20 Nov 2026',
    lastUpdated: '18 Oct 2026',
    description:
      'Interpretation of reflectivity (Z), radial velocity (V), and spectrum width (W) products from S-band and C-band DWR networks across coastal and inland observatories.',
    level: 'Intermediate',
    duration: '4 Weeks (28 hrs)',
    modulesCount: 3,
    languages: ['English', 'Hindi'],
    initials: 'RM',
    avatarBg: 'bg-emerald-100 text-emerald-800',
    modules: [
      {
        id: 'mod-201',
        title: 'Module 1: DWR Principles, PPI/RHI Scans & Velocity Folding',
        duration: '8 hrs',
        status: 'Published',
        lessons: [
          { id: 'les-201', title: '1.1 Nyquist Velocity & Doppler Dilemma in High-shear Regimes', type: 'video', duration: '40 mins' },
          { id: 'les-202', title: '1.2 Ground Clutter Rejection & Anomalous Propagation (AP)', type: 'document', duration: '35 mins' },
        ],
      },
    ],
  },
  {
    id: 'course-3',
    code: 'MET-505',
    title: 'Numerical Weather Prediction (NWP) Modeling & HPC Systems',
    category: 'Numerical Models',
    trainer: 'Meera Iyer',
    institution: 'National Centre for Medium Range Weather Forecasting (NCMRWF)',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?w=600&auto=format&fit=crop&q=80',
    enrolled: 198,
    completed: 93,
    completionRate: 47,
    rating: 4.7,
    reviewsCount: 610,
    status: 'Active',
    deadline: '05 Dec 2026',
    lastUpdated: '15 Oct 2026',
    description:
      'Grid-scale dynamics, parameterization of physical processes, data assimilation (4D-Var), and high-resolution ensemble prediction running on IMD supercomputing clusters.',
    level: 'Advanced',
    duration: '5 Weeks (35 hrs)',
    modulesCount: 4,
    languages: ['English'],
    initials: 'NW',
    avatarBg: 'bg-purple-100 text-purple-800',
    modules: [
      {
        id: 'mod-301',
        title: 'Module 1: Primitive Equations & Spatial Discretization Schemes',
        duration: '10 hrs',
        status: 'Published',
        lessons: [
          { id: 'les-301', title: '1.1 Hydrostatic vs Non-hydrostatic Solvers in Mountainous Terrain', type: 'video', duration: '50 mins' },
        ],
      },
    ],
  },
  {
    id: 'course-4',
    code: 'MET-204',
    title: 'Aviation Meteorology & Terminal Aerodrome Forecasts',
    category: 'Aviation Meteorology',
    trainer: 'Dr. Anita Rao',
    institution: 'Aviation Meteorological Division, Palam Airport, Delhi',
    imageUrl: 'https://images.unsplash.com/photo-1514632595-4944383f2737?w=600&auto=format&fit=crop&q=80',
    enrolled: 144,
    completed: 75,
    completionRate: 52,
    rating: 4.8,
    reviewsCount: 420,
    status: 'Active',
    deadline: '12 Nov 2026',
    lastUpdated: '12 Oct 2026',
    description:
      'WMO Annex 3 compliance, METAR/SPECI encoding, low-level wind shear alerts, runway visual range (RVR) assessment, and volcanic ash SIGMET advisory.',
    level: 'Intermediate',
    duration: '3 Weeks (21 hrs)',
    modulesCount: 3,
    languages: ['English'],
    initials: 'AM',
    avatarBg: 'bg-rose-100 text-rose-800',
    modules: [],
  },
  {
    id: 'course-5',
    code: 'MET-102',
    title: 'Satellite Meteorology & INSAT-3DR Multispectral Imagery',
    category: 'Remote Sensing',
    trainer: 'Farah Khan',
    institution: 'Satellite Meteorology Division, Mausam Bhawan',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    enrolled: 242,
    completed: 148,
    completionRate: 61,
    rating: 4.9,
    reviewsCount: 1530,
    status: 'Active',
    deadline: '10 Dec 2026',
    lastUpdated: '20 Oct 2026',
    description:
      'Interpretation of visible, thermal infrared, and water vapor channels from geostationary meteorological satellites for deep convective cloud tracking.',
    level: 'Beginner',
    duration: '4 Weeks (24 hrs)',
    modulesCount: 4,
    languages: ['English', 'Hindi'],
    initials: 'SM',
    avatarBg: 'bg-indigo-100 text-indigo-800',
    modules: [],
  },
  {
    id: 'course-6',
    code: 'MET-108',
    title: 'Agro-Meteorological Advisory Services & District Weather Bulletins',
    category: 'Agrometeorology',
    trainer: 'Dr. Pooja Sen',
    institution: 'Agricultural Meteorology Division, IMD Pune',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
    enrolled: 133,
    completed: 109,
    completionRate: 82,
    rating: 4.7,
    reviewsCount: 340,
    status: 'Active',
    deadline: '28 Oct 2026',
    lastUpdated: '14 Oct 2026',
    description:
      'Preparation of crop-specific meteorological advisories, monsoon onset guidance for farmers, and extreme temperature contingency planning.',
    level: 'Beginner',
    duration: '3 Weeks (18 hrs)',
    modulesCount: 3,
    languages: ['English', 'Hindi', 'Tamil'],
    initials: 'AG',
    avatarBg: 'bg-emerald-100 text-emerald-800',
    modules: [],
  },
];

const initialAccounts: SharedAccount[] = [
  {
    id: 'acc-admin',
    firstName: 'Directorate',
    lastName: 'Admin',
    email: 'admin@imd.gov.in',
    organization: 'IMD Headquarters, New Delhi',
    role: 'admin',
    status: 'approved',
    submittedDate: '10 Oct 2026',
  },
  {
    id: 'acc-trainer-1',
    firstName: 'Dr. Ravi',
    lastName: 'Menon',
    email: 'ravi.menon@imd.gov.in',
    organization: 'Cyclone Warning Division, IMD Headquarters',
    role: 'trainer',
    status: 'approved',
    submittedDate: '12 Oct 2026',
  },
  {
    id: 'acc-trainee-1',
    firstName: 'Asha',
    lastName: 'Verma',
    email: 'asha.verma@imd.gov.in',
    organization: 'Regional Meteorological Centre, New Delhi',
    role: 'trainee',
    status: 'approved',
    profileComplete: true,
    submittedDate: '15 Oct 2026',
  },
  {
    id: 'acc-trainee-2',
    firstName: 'Rohit',
    lastName: 'Sharma',
    email: 'rohit.sharma@imd.gov.in',
    organization: 'Regional Meteorological Centre, Mumbai',
    role: 'trainee',
    status: 'approved',
    profileComplete: false,
    submittedDate: '18 Oct 2026',
  },
  {
    id: 'p-1',
    firstName: 'Kiran',
    lastName: 'Joshi',
    email: 'kiran.joshi@imd.gov.in',
    organization: 'Regional Meteorological Centre, Bengaluru',
    role: 'trainer',
    status: 'pending',
    submittedDate: 'Today',
  },
  {
    id: 'p-2',
    firstName: 'Sana',
    lastName: 'Ahmed',
    email: 'sana.ahmed@imd.gov.in',
    organization: 'Meteorological Centre, Hyderabad',
    role: 'trainee',
    status: 'pending',
    submittedDate: 'Today',
  },
  {
    id: 'p-3',
    firstName: 'Vikram',
    lastName: 'Patel',
    email: 'vikram.p@imd.gov.in',
    organization: 'Meteorological Centre, Ahmedabad',
    role: 'trainee',
    status: 'pending',
    submittedDate: 'Yesterday',
  },
  {
    id: 'p-4',
    firstName: 'Rhea',
    lastName: 'Menon',
    email: 'rhea.menon@imd.gov.in',
    organization: 'Coastal Radar Observatory, Kochi',
    role: 'trainer',
    status: 'pending',
    submittedDate: '2 days ago',
  },
];

const initialPending: PendingApprovalItem[] = [
  {
    id: 'p-1',
    name: 'Kiran Joshi',
    email: 'kiran.joshi@imd.gov.in',
    division: 'Bengaluru',
    roleRequested: 'Trainer',
    submitted: 'Today',
    initials: 'KJ',
    avatarBg: 'bg-rose-100 text-rose-800',
  },
  {
    id: 'p-2',
    name: 'Sana Ahmed',
    email: 'sana.ahmed@imd.gov.in',
    division: 'Hyderabad',
    roleRequested: 'Trainee',
    submitted: 'Today',
    initials: 'SA',
    avatarBg: 'bg-purple-100 text-purple-800',
  },
  {
    id: 'p-3',
    name: 'Vikram Patel',
    email: 'vikram.p@imd.gov.in',
    division: 'Ahmedabad',
    roleRequested: 'Trainee',
    submitted: 'Yesterday',
    initials: 'VP',
    avatarBg: 'bg-amber-100 text-amber-800',
  },
  {
    id: 'p-4',
    name: 'Rhea Menon',
    email: 'rhea.menon@imd.gov.in',
    division: 'Kochi',
    roleRequested: 'Trainer',
    submitted: '2 days ago',
    initials: 'RM',
    avatarBg: 'bg-orange-100 text-orange-800',
  },
];

const initialUserDirectory: UserDirectoryItem[] = [
  {
    id: 'u-1',
    name: 'Dr. Ravi Menon',
    email: 'ravi.menon@imd.gov.in',
    role: 'Trainer',
    status: 'Active',
    joined: 'Jul 2026',
    initials: 'RM',
    avatarBg: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'u-2',
    name: 'Asha Verma',
    email: 'asha.verma@imd.gov.in',
    role: 'Trainee',
    status: 'Active',
    joined: 'Aug 2026',
    initials: 'AV',
    avatarBg: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'u-3',
    name: 'Directorate Admin',
    email: 'admin@imd.gov.in',
    role: 'Admin',
    status: 'Active',
    joined: 'May 2026',
    initials: 'DA',
    avatarBg: 'bg-purple-100 text-purple-800',
  },
  {
    id: 'u-4',
    name: 'Prof. Sunil Das',
    email: 'sunil.das@imd.gov.in',
    role: 'Trainer',
    status: 'Active',
    joined: 'Jun 2026',
    initials: 'SD',
    avatarBg: 'bg-indigo-100 text-indigo-800',
  },
  {
    id: 'u-5',
    name: 'Dr. Anita Rao',
    email: 'anita.rao@imd.gov.in',
    role: 'Trainer',
    status: 'Active',
    joined: 'Jun 2026',
    initials: 'AR',
    avatarBg: 'bg-rose-100 text-rose-800',
  },
];

const initialTrainers: TrainerItem[] = [
  {
    id: 'tr-1',
    name: 'Dr. Ravi Menon',
    email: 'ravi.menon@imd.gov.in',
    expertise: 'Tropical Cyclones & Radar Meteorology',
    coursesCount: 4,
    traineesCount: 312,
    lastActive: 'Today, 09:30',
    status: 'Active',
    initials: 'RM',
    avatarBg: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'tr-2',
    name: 'Prof. Sunil Das',
    email: 'sunil.das@imd.gov.in',
    expertise: 'Climate Data & Climatology',
    coursesCount: 3,
    traineesCount: 298,
    lastActive: 'Yesterday',
    status: 'Active',
    initials: 'SD',
    avatarBg: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'tr-3',
    name: 'Dr. Anita Rao',
    email: 'anita.rao@imd.gov.in',
    expertise: 'Aviation Meteorology & SIGMET',
    coursesCount: 2,
    traineesCount: 215,
    lastActive: '2 days ago',
    status: 'Active',
    initials: 'AR',
    avatarBg: 'bg-purple-100 text-purple-800',
  },
];

const initialTrainees: TraineeItem[] = [
  {
    id: 'te-1',
    name: 'Asha Verma',
    email: 'asha.verma@imd.gov.in',
    division: 'Regional Met Centre, New Delhi',
    enrolledCount: 3,
    avgProgress: 53,
    lastActive: 'Just now',
    status: 'Active',
    initials: 'AV',
    avatarBg: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'te-2',
    name: 'Rohit Sharma',
    email: 'rohit.sharma@imd.gov.in',
    division: 'RMC Mumbai',
    enrolledCount: 2,
    avgProgress: 38,
    lastActive: 'Yesterday',
    status: 'Active',
    initials: 'RS',
    avatarBg: 'bg-amber-100 text-amber-800',
  },
  {
    id: 'te-3',
    name: 'Priya Das',
    email: 'priya.das@imd.gov.in',
    division: 'RMC Kolkata',
    enrolledCount: 4,
    avgProgress: 72,
    lastActive: '3 hours ago',
    status: 'Active',
    initials: 'PD',
    avatarBg: 'bg-emerald-100 text-emerald-800',
  },
];

const initialMonthlyEnrollments: MonthData[] = [
  { month: 'May', enrolled: 320, completed: 210 },
  { month: 'Jun', enrolled: 410, completed: 280 },
  { month: 'Jul', enrolled: 380, completed: 300 },
  { month: 'Aug', enrolled: 520, completed: 390 },
  { month: 'Sep', enrolled: 600, completed: 440 },
  { month: 'Oct', enrolled: 680, completed: 510 },
];

const initialDivisions: DivisionItem[] = [
  {
    id: 'div-1',
    name: 'Delhi HQ',
    count: 417,
    change: '+8%',
    isPositive: true,
    color: '#3b41e3',
    zone: 'North',
    traineesCount: 417,
    share: 38.6,
    completionRate: 82,
    avgScore: 79,
    certifiedCount: 342,
    status: 'On Track',
    trend: '+8%',
  },
  {
    id: 'div-2',
    name: 'Pune Met Centre',
    count: 281,
    change: '+5%',
    isPositive: true,
    color: '#5157ea',
    zone: 'West',
    traineesCount: 281,
    share: 26.0,
    completionRate: 74,
    avgScore: 75,
    certifiedCount: 208,
    status: 'On Track',
    trend: '+5%',
  },
  {
    id: 'div-3',
    name: 'Chennai Coastal',
    count: 212,
    change: '-2%',
    isPositive: false,
    color: '#8e93f3',
    zone: 'South',
    traineesCount: 212,
    share: 19.6,
    completionRate: 68,
    avgScore: 71,
    certifiedCount: 144,
    status: 'Attention',
    trend: '-2%',
  },
  {
    id: 'div-4',
    name: 'Regional Satellites',
    count: 168,
    change: '+4%',
    isPositive: true,
    color: '#a3a8f6',
    zone: 'Central',
    traineesCount: 168,
    share: 15.8,
    completionRate: 65,
    avgScore: 68,
    certifiedCount: 109,
    status: 'On Track',
    trend: '+4%',
  },
  {
    id: 'div-5',
    name: 'Kolkata Doppler Unit',
    count: 310,
    change: '+6%',
    isPositive: true,
    color: '#6366f1',
    zone: 'East',
    traineesCount: 310,
    share: 28.5,
    completionRate: 78,
    avgScore: 76,
    certifiedCount: 241,
    status: 'On Track',
    trend: '+6%',
  },
  {
    id: 'div-6',
    name: 'Mumbai Western Met Hub',
    count: 350,
    change: '+9%',
    isPositive: true,
    color: '#4338ca',
    zone: 'West',
    traineesCount: 350,
    share: 32.1,
    completionRate: 80,
    avgScore: 78,
    certifiedCount: 280,
    status: 'On Track',
    trend: '+9%',
  },
];

const initialCompetencyGauge: CompetencyGaugeItem[] = [
  {
    id: 'comp-1',
    subject: 'Forecasting',
    level: 72,
    change: '+1.8%',
    isPositive: true,
    ring: { r: 88, val: 72, color: '#3b41e3' },
  },
  {
    id: 'comp-2',
    subject: 'Radar analysis',
    level: 58,
    change: '+2.3%',
    isPositive: true,
    ring: { r: 68, val: 58, color: '#f0525b' },
  },
  {
    id: 'comp-3',
    subject: 'Cyclone tracking',
    level: 49,
    change: '-1.0%',
    isPositive: false,
    ring: { r: 48, val: 49, color: '#9fa4f6' },
  },
];

const initialTrainerMonthlyTrends: TrainerMonthlyTrend[] = [
  { month: 'Jun', enr: 120, comp: 72 },
  { month: 'Jul', enr: 145, comp: 94 },
  { month: 'Aug', enr: 180, comp: 110 },
  { month: 'Sep', enr: 195, comp: 135 },
  { month: 'Oct', enr: 214, comp: 148 },
  { month: 'Nov (Proj)', enr: 238, comp: 172 },
];

const initialTraineeMonthlyProgress: TraineeMonthlyProgressItem[] = [
  { m: 'May', mod: 2, score: '68%', scoreNum: 68 },
  { m: 'Jun', mod: 4, score: '72%', scoreNum: 72 },
  { m: 'Jul', mod: 6, score: '74%', scoreNum: 74 },
  { m: 'Aug', mod: 9, score: '76%', scoreNum: 76 },
  { m: 'Sep', mod: 12, score: '79%', scoreNum: 79 },
  { m: 'Oct', mod: 16, score: '84%', scoreNum: 84 },
];

const initialTraineeWeeklyEngagement: TraineeWeeklyEngagementItem[] = [
  { d: 'Mon', h: 1.8, topic: 'Atmospheric Physics Video' },
  { d: 'Tue', h: 2.4, topic: 'Cyclone Track Simulator' },
  { d: 'Wed', h: 2.8, topic: 'Dvorak Technique Practice' },
  { d: 'Thu', h: 2.1, topic: 'Doppler Radar Assessment' },
  { d: 'Fri', h: 1.9, topic: 'Monsoon Synoptic Case Study' },
  { d: 'Sat', h: 2.2, topic: 'Satellite Data Analysis' },
  { d: 'Sun', h: 1.0, topic: 'Weekly Practice Quiz' },
];

const initialSubjectScores: SubjectScoreItem[] = [
  { subject: 'Forecast', score: 82 },
  { subject: 'Climate', score: 76 },
  { subject: 'Radar', score: 71 },
  { subject: 'Satellite', score: 68 },
  { subject: 'NWP', score: 74 },
];

const UnifiedDataContext = createContext<UnifiedDataContextType | undefined>(undefined);

export const UnifiedDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<SharedAccount[]>(initialAccounts);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApprovalItem[]>(initialPending);
  const [userDirectory, setUserDirectory] = useState<UserDirectoryItem[]>(initialUserDirectory);
  const [trainersRoster, setTrainersRoster] = useState<TrainerItem[]>(initialTrainers);
  const [traineesRoster, setTraineesRoster] = useState<TraineeItem[]>(initialTrainees);
  const [rejectedRecords, setRejectedRecords] = useState<RejectedUserRecord[]>([]);
  const [sharedCourses, setSharedCourses] = useState<SharedCourse[]>(initialSharedCourses);

  // Application Data & Graph Analytics state
  const [monthlyEnrollmentTrends, setMonthlyEnrollmentTrends] = useState<MonthData[]>(initialMonthlyEnrollments);
  const [divisionParticipations, setDivisionParticipations] = useState<DivisionItem[]>(initialDivisions);
  const [competencyGaugeData, setCompetencyGaugeData] = useState<CompetencyGaugeItem[]>(initialCompetencyGauge);
  const [trainerMonthlyTrends, setTrainerMonthlyTrends] = useState<TrainerMonthlyTrend[]>(initialTrainerMonthlyTrends);
  const [traineeMonthlyProgress, setTraineeMonthlyProgress] = useState<TraineeMonthlyProgressItem[]>(initialTraineeMonthlyProgress);
  const [traineeWeeklyEngagement, setTraineeWeeklyEngagement] = useState<TraineeWeeklyEngagementItem[]>(initialTraineeWeeklyEngagement);
  const [subjectScores, setSubjectScores] = useState<SubjectScoreItem[]>(initialSubjectScores);

  const addDivision = (division: Omit<DivisionItem, 'id'>) => {
    const newItem: DivisionItem = {
      ...division,
      id: `div-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setDivisionParticipations((prev) => [...prev, newItem]);
  };

  const recordTraineeStudyActivity = (day: string, hours: number, topic: string) => {
    setTraineeWeeklyEngagement((prev) =>
      prev.map((item) =>
        item.d.toLowerCase() === day.toLowerCase()
          ? { ...item, h: parseFloat((item.h + hours).toFixed(1)), topic: topic || item.topic }
          : item
      )
    );
  };

  // Register a new profile (both Trainer and Trainee)
  const registerNewProfile = (data: {
    firstName: string;
    lastName: string;
    email: string;
    organization: string;
    role: UserRole;
  }): SharedAccount => {
    const id = `user-${Date.now()}`;
    const initials = `${data.firstName.charAt(0)}${data.lastName.charAt(0)}`.toUpperCase() || 'CC';
    const avatarBg =
      data.role === 'trainer' ? 'bg-orange-100 text-orange-800' : 'bg-purple-100 text-purple-800';

    const newAcc: SharedAccount = {
      id,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      organization: data.organization.trim() || 'Regional Meteorological Centre',
      role: data.role,
      status: 'pending',
      submittedDate: 'Today',
      profileComplete: false,
    };

    const newPendingItem: PendingApprovalItem = {
      id,
      name: `${data.firstName.trim()} ${data.lastName.trim()}`,
      email: data.email.trim().toLowerCase(),
      division: data.organization.trim() || 'Regional Centre',
      roleRequested: data.role === 'trainer' ? 'Trainer' : 'Trainee',
      submitted: 'Today',
      initials,
      avatarBg,
    };

    setAccounts((prev) => [newAcc, ...prev.filter((a) => a.email !== newAcc.email)]);
    setPendingApprovals((prev) => [newPendingItem, ...prev.filter((p) => p.email !== newAcc.email)]);

    return newAcc;
  };

  // Admin approves a profile request
  const approveProfileRequest = (idOrEmail: string) => {
    // Locate in pending or accounts
    const pendingItem = pendingApprovals.find(
      (p) => p.id === idOrEmail || p.email.toLowerCase() === idOrEmail.toLowerCase()
    );

    const targetEmail = pendingItem?.email || idOrEmail;

    // 1. Update account status to approved
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === idOrEmail || acc.email.toLowerCase() === targetEmail.toLowerCase()) {
          return { ...acc, status: 'approved' };
        }
        return acc;
      })
    );

    // 2. Remove from pending approvals list
    setPendingApprovals((prev) =>
      prev.filter((p) => p.id !== idOrEmail && p.email.toLowerCase() !== targetEmail.toLowerCase())
    );

    // 3. Add to User Directory
    const fullName = pendingItem
      ? pendingItem.name
      : idOrEmail.split('@')[0].replace('.', ' ').toUpperCase();
    const role = pendingItem?.roleRequested || 'Trainee';
    const initials = pendingItem?.initials || fullName.slice(0, 2).toUpperCase();

    setUserDirectory((prev) => {
      if (prev.some((u) => u.email.toLowerCase() === targetEmail.toLowerCase())) {
        return prev.map((u) =>
          u.email.toLowerCase() === targetEmail.toLowerCase() ? { ...u, status: 'Active' } : u
        );
      }
      return [
        {
          id: `dir-${Date.now()}`,
          name: fullName,
          email: targetEmail,
          role,
          status: 'Active',
          joined: 'Today',
          initials,
          avatarBg: role === 'Trainer' ? 'bg-orange-100 text-orange-800' : 'bg-purple-100 text-purple-800',
        },
        ...prev,
      ];
    });

    // 4. Update corresponding roster
    if (role === 'Trainer') {
      setTrainersRoster((prev) => {
        if (prev.some((t) => t.email.toLowerCase() === targetEmail.toLowerCase())) return prev;
        return [
          {
            id: `tr-${Date.now()}`,
            name: fullName,
            email: targetEmail,
            expertise: 'Meteorological Science & Operational Forecasting',
            coursesCount: 0,
            traineesCount: 0,
            lastActive: 'Just now',
            status: 'Active',
            initials,
            avatarBg: 'bg-orange-100 text-orange-800',
          },
          ...prev,
        ];
      });
    } else {
      setTraineesRoster((prev) => {
        if (prev.some((t) => t.email.toLowerCase() === targetEmail.toLowerCase())) return prev;
        return [
          {
            id: `te-${Date.now()}`,
            name: fullName,
            email: targetEmail,
            division: pendingItem?.division || 'Regional Centre',
            enrolledCount: 0,
            avgProgress: 0,
            lastActive: 'Just now',
            status: 'Active',
            initials,
            avatarBg: 'bg-purple-100 text-purple-800',
          },
          ...prev,
        ];
      });
    }
  };

  // Admin rejects a profile request
  const rejectProfileRequest = (idOrEmail: string, reason?: string) => {
    const pendingItem = pendingApprovals.find(
      (p) => p.id === idOrEmail || p.email.toLowerCase() === idOrEmail.toLowerCase()
    );
    const targetEmail = pendingItem?.email || idOrEmail;

    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === idOrEmail || acc.email.toLowerCase() === targetEmail.toLowerCase()) {
          return { ...acc, status: 'rejected' };
        }
        return acc;
      })
    );

    if (pendingItem) {
      setRejectedRecords((prev) => [
        {
          id: `rej-${Date.now()}`,
          name: pendingItem.name,
          email: pendingItem.email,
          division: pendingItem.division,
          roleRequested: pendingItem.roleRequested,
          rejectedDate: 'Today',
          reason: reason || 'Administrative verification requirement not met per MoES guidelines.',
        },
        ...prev,
      ]);
    }

    setPendingApprovals((prev) =>
      prev.filter((p) => p.id !== idOrEmail && p.email.toLowerCase() !== targetEmail.toLowerCase())
    );
  };

  const getUserByEmail = (email: string) => {
    return accounts.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
  };

  // Trainer publishes a course -> instantly propagates across website
  const publishCourseGlobally = (courseData: {
    title: string;
    category: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    duration: string;
    description: string;
    modulesCount: number;
    languages?: string[];
    imageUrl?: string;
    modules: TrainerCourseModule[];
  }): SharedCourse => {
    const id = `course-${Date.now()}`;
    const codeWords = courseData.title.split(' ');
    const code = `${codeWords[0]?.slice(0, 3).toUpperCase() || 'MET'}-${Math.floor(100 + Math.random() * 899)}`;
    const initials = courseData.title
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase() || 'CC';

    const newCourse: SharedCourse = {
      id,
      code,
      title: courseData.title,
      category: courseData.category,
      trainer: 'Dr. Ravi Menon',
      institution: 'Cyclone Warning Division, IMD Headquarters',
      imageUrl:
        courseData.imageUrl ||
        'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800&auto=format&fit=crop&q=80',
      enrolled: 0,
      completed: 0,
      completionRate: 0,
      rating: 5.0,
      reviewsCount: 1,
      status: 'Active',
      deadline: '30 Dec 2026',
      lastUpdated: 'Today',
      description: courseData.description,
      level: courseData.level,
      duration: courseData.duration,
      modulesCount: courseData.modulesCount || courseData.modules.length || 1,
      modules: courseData.modules,
      languages: courseData.languages || ['English'],
      initials,
      avatarBg: 'bg-blue-100 text-blue-800',
    };

    setSharedCourses((prev) => [newCourse, ...prev]);
    return newCourse;
  };

  const updateSharedCourse = (id: string, updates: Partial<SharedCourse>) => {
    setSharedCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const enrollInCourse = (courseId: string, _traineeName?: string) => {
    setSharedCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, enrolled: c.enrolled + 1 } : c))
    );
    // Real-time synchronization for graphs
    setMonthlyEnrollmentTrends((prev) => {
      const updated = [...prev];
      if (updated.length > 0) {
        const lastIdx = updated.length - 1;
        updated[lastIdx] = { ...updated[lastIdx], enrolled: updated[lastIdx].enrolled + 1 };
      }
      return updated;
    });
    setTrainerMonthlyTrends((prev) => {
      const updated = [...prev];
      if (updated.length > 0) {
        const lastIdx = Math.max(0, updated.length - 2);
        updated[lastIdx] = { ...updated[lastIdx], enr: updated[lastIdx].enr + 1 };
      }
      return updated;
    });
  };

  const updateCourseProgress = (courseId: string, progress: number) => {
    setSharedCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, completionRate: Math.max(c.completionRate, progress) } : c))
    );
    if (progress >= 100) {
      setMonthlyEnrollmentTrends((prev) => {
        const updated = [...prev];
        if (updated.length > 0) {
          const lastIdx = updated.length - 1;
          updated[lastIdx] = { ...updated[lastIdx], completed: updated[lastIdx].completed + 1 };
        }
        return updated;
      });
      setTrainerMonthlyTrends((prev) => {
        const updated = [...prev];
        if (updated.length > 0) {
          const lastIdx = Math.max(0, updated.length - 2);
          updated[lastIdx] = { ...updated[lastIdx], comp: updated[lastIdx].comp + 1 };
        }
        return updated;
      });
      setTraineeMonthlyProgress((prev) => {
        const updated = [...prev];
        if (updated.length > 0) {
          const lastIdx = updated.length - 1;
          updated[lastIdx] = {
            ...updated[lastIdx],
            mod: updated[lastIdx].mod + 1,
            scoreNum: Math.min(100, updated[lastIdx].scoreNum + 1),
            score: `${Math.min(100, updated[lastIdx].scoreNum + 1)}%`,
          };
        }
        return updated;
      });
    }
  };

  return (
    <UnifiedDataContext.Provider
      value={{
        accounts,
        pendingApprovals,
        userDirectory,
        trainersRoster,
        traineesRoster,
        rejectedRecords,
        registerNewProfile,
        approveProfileRequest,
        rejectProfileRequest,
        getUserByEmail,
        sharedCourses,
        publishCourseGlobally,
        updateSharedCourse,
        enrollInCourse,
        updateCourseProgress,
        monthlyEnrollmentTrends,
        divisionParticipations,
        addDivision,
        competencyGaugeData,
        trainerMonthlyTrends,
        traineeMonthlyProgress,
        traineeWeeklyEngagement,
        subjectScores,
        recordTraineeStudyActivity,
      }}
    >
      {children}
    </UnifiedDataContext.Provider>
  );
};

export const useUnifiedData = () => {
  const context = useContext(UnifiedDataContext);
  if (!context) {
    throw new Error('useUnifiedData must be used within a UnifiedDataProvider');
  }
  return context;
};
