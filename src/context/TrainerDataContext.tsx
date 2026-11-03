import React, { createContext, useContext, useState } from 'react';
import {
  TrainerCourse,
  TrainerAssessment,
  TrainerTrainee,
  TrainerMaterial,
  TrainerFeedbackItem,
  TrainerNotification,
  TrainerCourseModule,
} from '../types';

export interface TrainerProfileData {
  name: string;
  roleTitle: string;
  specialization: string;
  division: string;
  employeeId: string;
  email: string;
  phone: string;
  officeLocation: string;
  yearsExperience: number;
  profileStrength: number;
  bio: string;
  competencies: { name: string; percentage: number }[];
  qualifications: { degree: string; institution: string; year: string }[];
  certificates: { id: string; title: string; issuer: string; year: string; verified: boolean }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actions?: { label: string; actionKey: string }[];
}

interface TrainerDataContextType {
  // Courses
  courses: TrainerCourse[];
  selectedCourseId: string | null;
  setSelectedCourseId: (id: string | null) => void;
  addCourse: (course: Omit<TrainerCourse, 'id' | 'completionRate'>) => void;
  updateCourse: (id: string, updates: Partial<TrainerCourse>) => void;
  addModuleToCourse: (courseId: string, module: Omit<TrainerCourseModule, 'id'>) => void;

  // Assessments
  assessments: TrainerAssessment[];
  selectedAssessmentId: string | null;
  setSelectedAssessmentId: (id: string | null) => void;
  addAssessment: (assessment: Omit<TrainerAssessment, 'id' | 'submissions' | 'submissionRate' | 'passRate' | 'avgScore' | 'avgTimeMins'>) => void;
  deleteAssessment: (id: string) => void;
  updateAssessment: (id: string, updates: Partial<TrainerAssessment>) => void;

  // Trainees
  trainees: TrainerTrainee[];
  selectedTraineeId: string | null;
  setSelectedTraineeId: (id: string | null) => void;
  sendReminder: (traineeIds: string[], subject: string, message: string, channels: { email: boolean; inApp: boolean }) => void;

  // Library
  materials: TrainerMaterial[];
  addMaterial: (material: Omit<TrainerMaterial, 'id' | 'downloadsCount' | 'status'>) => void;
  deleteMaterial: (id: string) => void;

  // Feedback
  feedbackItems: TrainerFeedbackItem[];
  replyToFeedback: (id: string, replyText: string, markAddressed: boolean) => void;

  // Notifications
  notifications: TrainerNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Profile
  profile: TrainerProfileData;
  updateProfile: (updates: Partial<TrainerProfileData>) => void;
  addCompetency: (name: string, percentage: number) => void;
  addCertificate: (cert: { title: string; issuer: string; year: string }) => void;

  // Chatbot Copilot
  isChatbotOpen: boolean;
  setIsChatbotOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => void;
}

const initialCourses: TrainerCourse[] = [
  {
    id: 'course-1',
    code: 'MET-402',
    title: 'Cyclone Track Analysis & Forecast Verification',
    category: 'Tropical Meteorology',
    enrolled: 214,
    completed: 82,
    completionRate: 38,
    rating: 4.8,
    status: 'Active',
    lastUpdated: '22 Oct 2026',
    description:
      'Advanced operational techniques for cyclonic vortex localization, steering flow integration, multi-model consensus plotting, and cone-of-uncertainty generation following IMD standard operating procedures.',
    level: 'Advanced',
    duration: '6 Weeks (42 hrs)',
    modulesCount: 4,
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
    category: 'Observational Meteorology',
    enrolled: 186,
    completed: 119,
    completionRate: 64,
    rating: 4.5,
    status: 'Active',
    lastUpdated: '18 Oct 2026',
    description:
      'Interpretation of reflectivity (Z), radial velocity (V), and spectrum width (W) products from S-band and C-band DWR networks across coastal and inland observatories.',
    level: 'Intermediate',
    duration: '4 Weeks (28 hrs)',
    modulesCount: 3,
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
      {
        id: 'mod-202',
        title: 'Module 2: Mesocyclone Signatures & Microburst Detection',
        duration: '10 hrs',
        status: 'Published',
        lessons: [
          { id: 'les-203', title: '2.1 Bow Echoes, Rear Inflow Jets & Tornadic Vortex Signatures (TVS)', type: 'video', duration: '50 mins' },
        ],
      },
      {
        id: 'mod-203',
        title: 'Module 3: Dual-Polarization Hydrometeor Classification',
        duration: '10 hrs',
        status: 'Published',
        lessons: [
          { id: 'les-204', title: '3.1 Differential Reflectivity (Zdr) and Specific Differential Phase (Kdp)', type: 'presentation', duration: '45 mins' },
        ],
      },
    ],
  },
  {
    id: 'course-3',
    code: 'MET-504',
    title: 'Monsoon Synoptic Dynamics & Extended Range Forecasting',
    category: 'Synoptic Meteorology',
    enrolled: 142,
    completed: 116,
    completionRate: 82,
    rating: 4.9,
    status: 'Active',
    lastUpdated: '15 Oct 2026',
    description:
      'Large-scale teleconnections, Madden-Julian Oscillation (MJO), Boreal Summer Intra-Seasonal Oscillation (BSISO), and monsoon low-pressure systems over central India.',
    level: 'Advanced',
    duration: '5 Weeks (35 hrs)',
    modulesCount: 4,
    modules: [
      {
        id: 'mod-301',
        title: 'Module 1: Somali Jet & Cross-Equatorial Flow Dynamics',
        duration: '8 hrs',
        status: 'Published',
        lessons: [
          { id: 'les-301', title: '1.1 Low-Level Jet (LLJ) Momentum Transport & Marine Boundary Layer', type: 'video', duration: '50 mins' },
        ],
      },
    ],
  },
  {
    id: 'course-4',
    code: 'MET-202',
    title: 'Satellite Imagery Interpretation & Remote Sensing',
    category: 'Remote Sensing',
    enrolled: 198,
    completed: 115,
    completionRate: 58,
    rating: 4.4,
    status: 'Active',
    lastUpdated: '10 Oct 2026',
    description:
      'Operational decoding of INSAT-3D, 3DR, and Meteosat multi-spectral data for fog, convection, jet streams, and dust storm tracking.',
    level: 'Beginner',
    duration: '4 Weeks (24 hrs)',
    modulesCount: 3,
    modules: [
      {
        id: 'mod-401',
        title: 'Module 1: Multi-Channel Radiometer Basics',
        duration: '8 hrs',
        status: 'Published',
        lessons: [
          { id: 'les-401', title: '1.1 Water Vapor (6.7 um) Jet Stream Delineation', type: 'video', duration: '40 mins' },
        ],
      },
    ],
  },
  {
    id: 'course-5',
    code: 'MET-410',
    title: 'Numerical Weather Prediction (NWP) Post-Processing & AI Post-Calibration',
    category: 'Computational Met',
    enrolled: 0,
    completed: 0,
    completionRate: 0,
    rating: 0,
    status: 'Draft',
    lastUpdated: '19 Oct 2026',
    description:
      'Statistical downscaling, neural network bias correction, and spatial verification techniques for heavy precipitation events.',
    level: 'Advanced',
    duration: '6 Weeks (36 hrs)',
    modulesCount: 2,
    modules: [],
  },
  {
    id: 'course-6',
    code: 'MET-418',
    title: 'Storm Surge & Coastal Inundation Warning Systems',
    category: 'Marine Meteorology',
    enrolled: 0,
    completed: 0,
    completionRate: 0,
    rating: 0,
    status: 'Draft',
    lastUpdated: '21 Oct 2026',
    description:
      'IITD & INCOIS storm surge models, bathymetry coupling, and astronomical tide coincidence analysis for east coast deltas.',
    level: 'Intermediate',
    duration: '3 Weeks (20 hrs)',
    modulesCount: 2,
    modules: [],
  },
  {
    id: 'course-7',
    code: 'MET-105',
    title: 'Aviation Meteorological Observations (METAR & TAF Verification)',
    category: 'Aeronautical Meteorology',
    enrolled: 98,
    completed: 91,
    completionRate: 93,
    rating: 4.6,
    status: 'Inactive',
    lastUpdated: '30 Sep 2026',
    description:
      'Standardized ICAO code generation, runway visual range (RVR) monitoring, and low-level windshear alerting protocols.',
    level: 'Beginner',
    duration: '3 Weeks (18 hrs)',
    modulesCount: 3,
    modules: [],
  },
];

const initialAssessments: TrainerAssessment[] = [
  {
    id: 'asmt-1',
    title: 'Cyclone Mid-Term Test',
    courseId: 'course-1',
    courseTitle: 'Cyclone Track Analysis & Forecast Verification',
    moduleTitle: 'Module 2: Dvorak Technique & Satellite Estimates',
    type: 'Mid-term',
    submissions: 168,
    totalEnrolled: 214,
    submissionRate: 78.5,
    passRate: 72,
    avgScore: 71.4,
    avgTimeMins: 24,
    deadline: '31 Oct 2026, 23:59',
    status: 'Live',
    timeLimitMinutes: 30,
    totalMarks: 100,
    passMarks: 60,
    questionsCount: 20,
    questions: [
      {
        id: 'q-1',
        prompt: 'In Dvorak analysis, what does a Data T-number (DT) of 4.5 correspond to in terms of estimated sustained wind speed in the North Indian Ocean?',
        options: ['45 to 55 knots (Deep Depression)', '65 to 75 knots (Very Severe Cyclonic Storm)', '85 to 95 knots (Extremely Severe Cyclonic Storm)', '115+ knots (Super Cyclonic Storm)'],
        correctIndex: 1,
        points: 5,
        explanation: 'DT 4.5 corresponds to approximately 77 knots (approx 65-80 knots operational class) characterizing a Very Severe Cyclonic Storm.',
      },
      {
        id: 'q-2',
        prompt: 'Which vertical wind shear value (200-850 hPa) is most favorable for rapid intensification of a tropical depression in the Bay of Bengal?',
        options: ['Greater than 35 knots', 'Between 25 and 35 knots', 'Less than 10 to 12 knots', 'Shear direction exactly perpendicular to heading irrespective of magnitude'],
        correctIndex: 2,
        points: 5,
        explanation: 'Low vertical wind shear (< 10-12 kts) prevents ventilation of latent heat from the warm core, supporting rapid intensification.',
      },
      {
        id: 'q-3',
        prompt: 'When evaluating steering currents for a system at 16°N over the Bay of Bengal, which atmospheric layer provides the predominant deep-layer steering?',
        options: ['850-700 hPa', '500-200 hPa deep layer mean', 'Surface to 1000 hPa boundary flow', '300-100 hPa upper tropopause outflow'],
        correctIndex: 1,
        points: 5,
        explanation: 'For mature storms with deep vertical vortex columns, the 500-200 hPa or 850-200 hPa deep-layer mean steering flow governs track translation.',
      },
      {
        id: 'q-4',
        prompt: 'Calculate the expected 24-hour track error cone radius (70% probability envelope) for day-2 forecast as per IMD operational benchmark:',
        options: ['15 to 25 km', '40 to 60 km', '80 to 110 km', '250 to 300 km'],
        correctIndex: 2,
        points: 5,
        explanation: 'The current IMD 5-year average 24-hr track error radius is ~80 km and 48-hr is ~110-125 km.',
      },
    ],
  },
  {
    id: 'asmt-2',
    title: 'Doppler Velocity Analysis Quiz 2',
    courseId: 'course-2',
    courseTitle: 'Doppler Weather Radar Meteorology & Nowcasting',
    moduleTitle: 'Module 1: DWR Principles & Radial Velocity',
    type: 'Quiz',
    submissions: 142,
    totalEnrolled: 186,
    submissionRate: 76.3,
    passRate: 81,
    avgScore: 78.2,
    avgTimeMins: 15,
    deadline: '28 Oct 2026, 18:00',
    status: 'Live',
    timeLimitMinutes: 20,
    totalMarks: 50,
    passMarks: 30,
    questionsCount: 10,
  },
  {
    id: 'asmt-3',
    title: 'Synoptic Monsoon Diagnostics Assessment',
    courseId: 'course-3',
    courseTitle: 'Monsoon Synoptic Dynamics & Extended Range Forecasting',
    moduleTitle: 'Module 2: Intra-Seasonal Oscillations',
    type: 'Final',
    submissions: 0,
    totalEnrolled: 142,
    submissionRate: 0,
    passRate: 0,
    avgScore: 0,
    avgTimeMins: 0,
    deadline: '10 Nov 2026, 12:00',
    status: 'Scheduled',
    timeLimitMinutes: 60,
    totalMarks: 100,
    passMarks: 65,
    questionsCount: 30,
  },
  {
    id: 'asmt-4',
    title: 'Satellite Cloud Pattern Interpretation',
    courseId: 'course-4',
    courseTitle: 'Satellite Imagery Interpretation & Remote Sensing',
    moduleTitle: 'Module 1: Multi-Channel Radiometer Basics',
    type: 'Quiz',
    submissions: 0,
    totalEnrolled: 198,
    submissionRate: 0,
    passRate: 0,
    avgScore: 0,
    avgTimeMins: 0,
    deadline: '05 Nov 2026, 20:00',
    status: 'Scheduled',
    timeLimitMinutes: 25,
    totalMarks: 60,
    passMarks: 36,
    questionsCount: 15,
  },
  {
    id: 'asmt-5',
    title: 'NWP Domain Grid Resolution Exercise',
    courseId: 'course-5',
    courseTitle: 'Numerical Weather Prediction Essentials',
    moduleTitle: 'Module 1: Finite Differencing',
    type: 'Assignment',
    submissions: 0,
    totalEnrolled: 0,
    submissionRate: 0,
    passRate: 0,
    avgScore: 0,
    avgTimeMins: 0,
    deadline: '20 Nov 2026, 23:59',
    status: 'Draft',
    timeLimitMinutes: 90,
    totalMarks: 50,
    passMarks: 30,
    questionsCount: 5,
  },
  {
    id: 'asmt-6',
    title: 'Tropical Cyclogenesis Pre-Screening Quiz',
    courseId: 'course-1',
    courseTitle: 'Cyclone Track Analysis & Forecast Verification',
    moduleTitle: 'Module 1: Fundamentals of Cyclogenesis',
    type: 'Quiz',
    submissions: 204,
    totalEnrolled: 214,
    submissionRate: 95.3,
    passRate: 88,
    avgScore: 82.5,
    avgTimeMins: 18,
    deadline: '15 Oct 2026, 23:59',
    status: 'Closed',
    timeLimitMinutes: 20,
    totalMarks: 50,
    passMarks: 30,
    questionsCount: 15,
  },
];

const initialTrainees: TrainerTrainee[] = [
  {
    id: 'tr-1',
    name: 'Rohit Sharma',
    email: 'rohit.sharma@imd.gov.in',
    division: 'Regional Met Centre, Pune',
    designation: 'Forecaster Gr. II',
    avatarBg: 'bg-amber-100 text-amber-800',
    initials: 'RS',
    enrolledCourseId: 'course-1',
    enrolledCourseTitle: 'Cyclone Track Analysis & Forecast Verification',
    courseProgress: 28,
    avgScore: 48,
    attemptsCount: 3,
    lastActive: '4 days ago',
    status: 'Needs attention',
    skillGaps: [
      { skill: 'Dvorak Band Curve Measurement', score: 38 },
      { skill: 'Doppler Velocity Dealiasing', score: 45 },
      { skill: 'Steering Current Vector Addition', score: 52 },
      { skill: 'Synoptic Ridge Identification', score: 64 },
    ],
    attempts: [
      { assessmentTitle: 'Cyclone Mid-Term Test', date: '21 Oct 2026', score: 48, status: 'Failed' },
      { assessmentTitle: 'Tropical Cyclogenesis Pre-Screening Quiz', date: '14 Oct 2026', score: 52, status: 'Passed' },
      { assessmentTitle: 'Diagnostic Skill Test 1', date: '05 Oct 2026', score: 44, status: 'Failed' },
    ],
  },
  {
    id: 'tr-2',
    name: 'Priya Das',
    email: 'priya.das@imd.gov.in',
    division: 'Regional Met Centre, Kolkata',
    designation: 'Scientific Assistant',
    avatarBg: 'bg-rose-100 text-rose-800',
    initials: 'PD',
    enrolledCourseId: 'course-1',
    enrolledCourseTitle: 'Cyclone Track Analysis & Forecast Verification',
    courseProgress: 34,
    avgScore: 52,
    attemptsCount: 2,
    lastActive: '3 days ago',
    status: 'Needs attention',
    skillGaps: [
      { skill: 'Satellite Eye Pattern Analysis', score: 42 },
      { skill: 'Track Consensus Plotting', score: 56 },
    ],
    attempts: [
      { assessmentTitle: 'Cyclone Mid-Term Test', date: '20 Oct 2026', score: 52, status: 'Failed' },
    ],
  },
  {
    id: 'tr-3',
    name: 'Amit Patel',
    email: 'amit.patel@imd.gov.in',
    division: 'Meteorological Centre, Ahmedabad',
    designation: 'Meteorologist Gr. II',
    avatarBg: 'bg-orange-100 text-orange-800',
    initials: 'AP',
    enrolledCourseId: 'course-2',
    enrolledCourseTitle: 'Doppler Weather Radar Meteorology & Nowcasting',
    courseProgress: 41,
    avgScore: 54,
    attemptsCount: 2,
    lastActive: '5 days ago',
    status: 'Needs attention',
    skillGaps: [
      { skill: 'Radial Velocity Folding', score: 40 },
      { skill: 'Hydrometeor Classification', score: 55 },
    ],
    attempts: [
      { assessmentTitle: 'Doppler Velocity Analysis Quiz 2', date: '19 Oct 2026', score: 54, status: 'Failed' },
    ],
  },
  {
    id: 'tr-4',
    name: 'Kavita Krishnan',
    email: 'kavita.k@imd.gov.in',
    division: 'Regional Met Centre, Chennai',
    designation: 'Senior Forecaster',
    avatarBg: 'bg-emerald-100 text-emerald-800',
    initials: 'KK',
    enrolledCourseId: 'course-1',
    enrolledCourseTitle: 'Cyclone Track Analysis & Forecast Verification',
    courseProgress: 92,
    avgScore: 89,
    attemptsCount: 5,
    lastActive: '2 hours ago',
    status: 'On track',
    skillGaps: [
      { skill: 'Cone of Uncertainty Synthesis', score: 92 },
      { skill: 'Microwave Convective Signatures', score: 86 },
    ],
    attempts: [
      { assessmentTitle: 'Cyclone Mid-Term Test', date: '21 Oct 2026', score: 92, status: 'Passed' },
      { assessmentTitle: 'Tropical Cyclogenesis Pre-Screening Quiz', date: '14 Oct 2026', score: 88, status: 'Passed' },
    ],
  },
  {
    id: 'tr-5',
    name: 'Siddharth Verma',
    email: 'siddharth.v@imd.gov.in',
    division: 'IMD Headquarters, New Delhi',
    designation: 'Scientist C',
    avatarBg: 'bg-blue-100 text-blue-800',
    initials: 'SV',
    enrolledCourseId: 'course-3',
    enrolledCourseTitle: 'Monsoon Synoptic Dynamics & Extended Range Forecasting',
    courseProgress: 85,
    avgScore: 86,
    attemptsCount: 4,
    lastActive: 'Today',
    status: 'On track',
    skillGaps: [
      { skill: 'Madden-Julian Oscillation Phases', score: 88 },
      { skill: 'Low-Level Jet Momentum Budgets', score: 84 },
    ],
    attempts: [
      { assessmentTitle: 'Synoptic Monsoon Diagnostics Pre-test', date: '12 Oct 2026', score: 86, status: 'Passed' },
    ],
  },
  {
    id: 'tr-6',
    name: 'Ananya Sen',
    email: 'ananya.sen@imd.gov.in',
    division: 'Regional Met Centre, Guwahati',
    designation: 'Research Officer',
    avatarBg: 'bg-purple-100 text-purple-800',
    initials: 'AS',
    enrolledCourseId: 'course-4',
    enrolledCourseTitle: 'Satellite Imagery Interpretation & Remote Sensing',
    courseProgress: 78,
    avgScore: 82,
    attemptsCount: 4,
    lastActive: '1 day ago',
    status: 'On track',
    skillGaps: [
      { skill: 'Water Vapor Channel Analysis', score: 85 },
      { skill: 'Orographic Convective Clustering', score: 80 },
    ],
    attempts: [
      { assessmentTitle: 'Satellite Cloud Pattern Interpretation', date: '18 Oct 2026', score: 82, status: 'Passed' },
    ],
  },
  {
    id: 'tr-7',
    name: 'Manish Chhabra',
    email: 'manish.c@imd.gov.in',
    division: 'Meteorological Centre, Jaipur',
    designation: 'Trainee Forecaster',
    avatarBg: 'bg-slate-100 text-slate-800',
    initials: 'MC',
    enrolledCourseId: 'course-2',
    enrolledCourseTitle: 'Doppler Weather Radar Meteorology & Nowcasting',
    courseProgress: 12,
    avgScore: 40,
    attemptsCount: 1,
    lastActive: '14 days ago',
    status: 'Inactive',
    skillGaps: [
      { skill: 'PPI Reflectivity Calibration', score: 35 },
    ],
    attempts: [
      { assessmentTitle: 'Doppler Velocity Analysis Quiz 1', date: '02 Oct 2026', score: 40, status: 'Failed' },
    ],
  },
];

const initialMaterials: TrainerMaterial[] = [
  {
    id: 'mat-1',
    title: 'IMD Standard Operating Procedure for Cyclone Warning in India',
    category: 'Manuals & SOPs',
    format: 'PDF',
    size: '14.2 MB',
    courseAttached: 'Cyclone Track Analysis & Forecast Verification',
    uploadedDate: '19 Oct 2026',
    version: 'v4.2',
    downloadsCount: 312,
    status: 'Approved',
    tags: ['SOP', 'BoB', 'Cyclone', 'Warning'],
  },
  {
    id: 'mat-2',
    title: 'Dvorak Enhanced Infrared Pattern Recognition Atlas',
    category: 'Reference Guides',
    format: 'PDF',
    size: '28.5 MB',
    courseAttached: 'Cyclone Track Analysis & Forecast Verification',
    uploadedDate: '14 Oct 2026',
    version: 'v3.0',
    downloadsCount: 245,
    status: 'Approved',
    tags: ['Dvorak', 'IR', 'Satellite', 'Atlas'],
  },
  {
    id: 'mat-3',
    title: 'Doppler Radar Radial Velocity Dealiasing Case Studies (Video)',
    category: 'Video Lectures',
    format: 'MP4',
    size: '340 MB',
    courseAttached: 'Doppler Weather Radar Meteorology & Nowcasting',
    uploadedDate: '11 Oct 2026',
    version: 'v1.1',
    downloadsCount: 188,
    status: 'Approved',
    tags: ['Radar', 'Doppler', 'Video', 'Velocity'],
  },
  {
    id: 'mat-4',
    title: 'Numerical Multi-Model Ensemble Guidance Deck for Monsoon 2026',
    category: 'Presentations',
    format: 'PPTX',
    size: '42.1 MB',
    courseAttached: 'Monsoon Synoptic Dynamics & Extended Range Forecasting',
    uploadedDate: '08 Oct 2026',
    version: 'v2.0',
    downloadsCount: 172,
    status: 'Approved',
    tags: ['Monsoon', 'NWP', 'Ensemble', 'Slides'],
  },
  {
    id: 'mat-5',
    title: 'High-Resolution Satellite Eye Dynamics Masterclass',
    category: 'Video Lectures',
    format: 'MP4',
    size: '410 MB',
    courseAttached: 'Cyclone Track Analysis & Forecast Verification',
    uploadedDate: '21 Oct 2026',
    version: 'v1.0',
    downloadsCount: 19,
    status: 'Pending',
    tags: ['Video', 'Eye dynamics', 'INSAT-3D'],
  },
  {
    id: 'mat-6',
    title: 'Draft Lecture on Coastal Storm Surge Inundation Grids',
    category: 'Manuals & SOPs',
    format: 'PDF',
    size: '9.8 MB',
    courseAttached: 'Storm Surge & Coastal Inundation Warning Systems',
    uploadedDate: '23 Oct 2026',
    version: 'v0.9',
    downloadsCount: 4,
    status: 'Needs edit',
    tags: ['Storm surge', 'Draft', 'Coastal'],
  },
];

const initialFeedback: TrainerFeedbackItem[] = [
  {
    id: 'fb-1',
    traineeName: 'Kavita Krishnan',
    traineeDivision: 'RMC Chennai',
    courseTitle: 'Cyclone Track Analysis & Forecast Verification',
    rating: 5,
    date: '21 Oct 2026',
    comment:
      'Dr. Menon’s breakdown of the Dvorak curved-band technique using real INSAT-3DR loops of Cyclone Vardah was exceptionally practical. The step-by-step 10-knot rule explanation clarified years of textbook ambiguity.',
    sentiment: 'Positive',
    addressed: true,
    replyText: 'Thank you Kavita. Next week we will add microwave scatterometer wind validation examples.',
  },
  {
    id: 'fb-2',
    traineeName: 'Rohit Sharma',
    traineeDivision: 'RMC Pune',
    courseTitle: 'Cyclone Track Analysis & Forecast Verification',
    rating: 4,
    date: '19 Oct 2026',
    comment:
      'The course material is very rich and authentic, but Module 2 pace is slightly fast for forecasters who are new to polar coordinate interpolation. Could we have 2 additional practice worksheets with hints before the final test?',
    sentiment: 'Constructive',
    addressed: false,
  },
  {
    id: 'fb-3',
    traineeName: 'Siddharth Verma',
    traineeDivision: 'IMD HQ New Delhi',
    courseTitle: 'Monsoon Synoptic Dynamics & Extended Range Forecasting',
    rating: 5,
    date: '18 Oct 2026',
    comment:
      'Outstanding synthesis of BSISO wave propagation and its correlation with rainfall active-break spells over the central Indian belt. Excellent graphical explanations.',
    sentiment: 'Positive',
    addressed: true,
    replyText: 'Much appreciated Siddharth. We are publishing the ensemble verification notebook next Tuesday.',
  },
  {
    id: 'fb-4',
    traineeName: 'Amit Patel',
    traineeDivision: 'MC Ahmedabad',
    courseTitle: 'Doppler Weather Radar Meteorology & Nowcasting',
    rating: 3,
    date: '16 Oct 2026',
    comment:
      'The DWR slides are informative, but the audio in the second Nyquist velocity lecture had an echo around the 22-minute mark. Also hoping for more Gujarat coastal DWR Bhuj radar examples.',
    sentiment: 'Neutral',
    addressed: false,
  },
  {
    id: 'fb-5',
    traineeName: 'Priya Das',
    traineeDivision: 'RMC Kolkata',
    courseTitle: 'Cyclone Track Analysis & Forecast Verification',
    rating: 5,
    date: '14 Oct 2026',
    comment:
      'The cone of uncertainty simulation was brilliant. It really helped us understand how the 70% probability envelope is drawn during live operational shifts.',
    sentiment: 'Positive',
    addressed: false,
  },
];

const initialNotifications: TrainerNotification[] = [
  {
    id: 'notif-1',
    title: 'Cycle 4 Assessment Question Bank Deadline',
    description: 'Deadline for submitting assessment question banks for Cycle 4 is 31 Oct. Please review your drafted quizzes.',
    type: 'Announcements',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: 'notif-2',
    title: '3 Trainees scored below 50% in Cyclone Mid-Term Test',
    description: 'Intervention recommended for Rohit Sharma, Priya Das, and Amit Patel on Module 2 concepts.',
    type: 'Trainee Activity',
    timestamp: '4 hours ago',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Assessment Window Opens on 1 November',
    description: 'National training portal assessment window for Winter Batch 2026 opens across all 6 RMCs.',
    type: 'Announcements',
    timestamp: '1 day ago',
    read: false,
  },
  {
    id: 'notif-4',
    title: 'Learning Material Approved: SOP v4.2',
    description: 'Your uploaded document "IMD Standard Operating Procedure for Cyclone Warning" was approved by Training Directorate.',
    type: 'System Alerts',
    timestamp: '2 days ago',
    read: true,
  },
  {
    id: 'notif-5',
    title: 'New Feedback Comment from Rohit Sharma',
    description: 'Trainee submitted constructive feedback on Cyclone Track Analysis course.',
    type: 'Trainee Activity',
    timestamp: '3 days ago',
    read: true,
  },
];

const initialProfile: TrainerProfileData = {
  name: 'Dr. Ravi Menon',
  roleTitle: 'Senior Trainer · Severe Weather & Cyclone Tracking',
  specialization: 'Tropical Cyclogenesis, NWP Track Verification, Doppler Radar Nowcasting',
  division: 'Cyclone Warning Division, IMD Headquarters, New Delhi',
  employeeId: 'IMD-TR-0428',
  email: 'ravi.menon@imd.gov.in',
  phone: '+91 11 2461 8241',
  officeLocation: 'Room 304, Satmet Building, Mausam Bhawan, Lodhi Road, New Delhi - 110003',
  yearsExperience: 14,
  profileStrength: 86,
  bio: 'Meteorologist and Senior Instructional Trainer at India Meteorological Department with over 14 years of operational forecasting experience in the Bay of Bengal and Arabian Sea basins. Appointed WMO Regional Training Centre Expert for South Asia Tropical Cyclone Forecasting.',
  competencies: [
    { name: 'Tropical Cyclone Track Forecasting', percentage: 98 },
    { name: 'Dvorak Satellite Intensity Evaluation', percentage: 95 },
    { name: 'Doppler Weather Radar (DWR) Analysis', percentage: 90 },
    { name: 'NWP Ensemble Verification & MME', percentage: 85 },
    { name: 'Severe Weather Warning Dissemination', percentage: 92 },
  ],
  qualifications: [
    { degree: 'Ph.D. in Atmospheric Sciences', institution: 'Indian Institute of Technology Delhi (IITD)', year: '2016' },
    { degree: 'M.Sc. in Meteorology & Physical Oceanography', institution: 'Andhra University, Visakhapatnam', year: '2010' },
    { degree: 'WMO Basic Instruction Package for Meteorologists (BIP-M)', institution: 'WMO Regional Training Centre, Pune', year: '2012' },
  ],
  certificates: [
    { id: 'c-1', title: 'WMO South Asia Senior Cyclone Forecaster Certification', issuer: 'World Meteorological Organization', year: '2024', verified: true },
    { id: 'c-2', title: 'Advanced Dual-Polarimetric Doppler Radar Specialist', issuer: 'National Radar Centre, New Delhi', year: '2023', verified: true },
    { id: 'c-3', title: 'Operational Marine & Storm Surge Modeling Credential', issuer: 'INCOIS & IMD Joint Board', year: '2022', verified: true },
  ],
};

const initialChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    text: 'Good morning Dr. Menon. I am your Capacity Assistant. Here is your quick operational summary:\n\n• 3 trainees need attention in "Cyclone Mid-Term Test" (scores below 50%)\n• "Cyclone Mid-Term Test" deadline closes on 31 October\n• 5 pending uploads are awaiting Directorate approval\n\nHow can I help you today?',
    timestamp: '09:00 AM',
    actions: [
      { label: 'View low scorers', actionKey: 'VIEW_LOW_SCORERS' },
      { label: 'Summarize feedback', actionKey: 'SUMMARIZE_FEEDBACK' },
      { label: 'Upcoming deadlines', actionKey: 'UPCOMING_DEADLINES' },
    ],
  },
];

const TrainerDataContext = createContext<TrainerDataContextType | undefined>(undefined);

export const TrainerDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<TrainerCourse[]>(initialCourses);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>('course-1');

  const [assessments, setAssessments] = useState<TrainerAssessment[]>(initialAssessments);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>('asmt-1');

  const [trainees, setTrainees] = useState<TrainerTrainee[]>(initialTrainees);
  const [selectedTraineeId, setSelectedTraineeId] = useState<string | null>('tr-1');

  const [materials, setMaterials] = useState<TrainerMaterial[]>(initialMaterials);
  const [feedbackItems, setFeedbackItems] = useState<TrainerFeedbackItem[]>(initialFeedback);
  const [notifications, setNotifications] = useState<TrainerNotification[]>(initialNotifications);
  const [profile, setProfile] = useState<TrainerProfileData>(initialProfile);

  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);

  const addCourse = (courseData: Omit<TrainerCourse, 'id' | 'completionRate'>) => {
    const id = `course-${Date.now()}`;
    const newCourse: TrainerCourse = {
      ...courseData,
      id,
      completionRate: courseData.enrolled > 0 ? Math.round((courseData.completed / courseData.enrolled) * 100) : 0,
    };
    setCourses((prev) => [newCourse, ...prev]);
  };

  const updateCourse = (id: string, updates: Partial<TrainerCourse>) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const addModuleToCourse = (courseId: string, moduleData: Omit<TrainerCourseModule, 'id'>) => {
    const newModule: TrainerCourseModule = {
      ...moduleData,
      id: `mod-${Date.now()}`,
    };
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const updatedModules = [...c.modules, newModule];
          return {
            ...c,
            modulesCount: updatedModules.length,
            modules: updatedModules,
          };
        }
        return c;
      })
    );
  };

  const addAssessment = (asmtData: Omit<TrainerAssessment, 'id' | 'submissions' | 'submissionRate' | 'passRate' | 'avgScore' | 'avgTimeMins'>) => {
    const id = `asmt-${Date.now()}`;
    const newAsmt: TrainerAssessment = {
      ...asmtData,
      id,
      submissions: 0,
      submissionRate: 0,
      passRate: 0,
      avgScore: 0,
      avgTimeMins: 0,
    };
    setAssessments((prev) => [newAsmt, ...prev]);
  };

  const deleteAssessment = (id: string) => {
    setAssessments((prev) => prev.filter((a) => a.id !== id));
  };

  const updateAssessment = (id: string, updates: Partial<TrainerAssessment>) => {
    setAssessments((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const sendReminder = (traineeIds: string[], subject: string, message: string, channels: { email: boolean; inApp: boolean }) => {
    // Add notification item
    const notif: TrainerNotification = {
      id: `notif-${Date.now()}`,
      title: `Reminder Sent: ${subject}`,
      description: `Dispatched to ${traineeIds.length} trainees via ${channels.email ? 'Email' : ''}${channels.email && channels.inApp ? ' & ' : ''}${channels.inApp ? 'In-App' : ''}.`,
      type: 'Trainee Activity',
      timestamp: 'Just now',
      read: true,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const addMaterial = (materialData: Omit<TrainerMaterial, 'id' | 'downloadsCount' | 'status'>) => {
    const id = `mat-${Date.now()}`;
    const newMat: TrainerMaterial = {
      ...materialData,
      id,
      downloadsCount: 0,
      status: 'Pending',
    };
    setMaterials((prev) => [newMat, ...prev]);
  };

  const deleteMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  const replyToFeedback = (id: string, replyText: string, markAddressed: boolean) => {
    setFeedbackItems((prev) =>
      prev.map((fb) =>
        fb.id === id
          ? {
              ...fb,
              replyText,
              addressed: markAddressed ? true : fb.addressed,
            }
          : fb
      )
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const updateProfile = (updates: Partial<TrainerProfileData>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const addCompetency = (name: string, percentage: number) => {
    setProfile((prev) => ({
      ...prev,
      competencies: [...prev.competencies, { name, percentage }],
    }));
  };

  const addCertificate = (cert: { title: string; issuer: string; year: string }) => {
    setProfile((prev) => ({
      ...prev,
      certificates: [
        ...prev.certificates,
        { id: `c-${Date.now()}`, ...cert, verified: true },
      ],
    }));
  };

  const sendChatMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      let reply = 'I have noted your request. Would you like me to compile a comprehensive report or notify the concerned trainees?';
      let actions: { label: string; actionKey: string }[] | undefined = undefined;

      const lower = text.toLowerCase();
      if (lower.includes('low') || lower.includes('behind') || lower.includes('attention')) {
        reply =
          'Found 3 trainees currently scoring below the passing threshold in "Cyclone Mid-Term Test":\n\n1. Rohit Sharma (48% - RMC Pune)\n2. Priya Das (52% - RMC Kolkata)\n3. Amit Patel (54% - MC Ahmedabad)\n\nRecommendation: Send them the Dvorak Curved Band Practice Guide before the test deadline on 31 October.';
        actions = [
          { label: 'Send reminder to all 3', actionKey: 'REMIND_ALL_3' },
          { label: 'View Rohit Sharma profile', actionKey: 'VIEW_ROHIT' },
        ];
      } else if (lower.includes('feedback') || lower.includes('sentiment') || lower.includes('rating')) {
        reply =
          'Recent Feedback Summary across all 4 courses:\n\n• Overall Rating: 4.6 / 5.0 (92% positive sentiment)\n• Strongest Praise: Practical real-storm radar loops and cyclone landfall SOP walk-throughs.\n• Area for Improvement: Request for more time on Doppler dealiasing and hands-on coordinate exercises.';
      } else if (lower.includes('deadline') || lower.includes('upcoming') || lower.includes('schedule')) {
        reply =
          'Upcoming Deadlines on your calendar:\n\n• 28 Oct (18:00): Doppler Velocity Analysis Quiz 2 closes\n• 31 Oct (23:59): Cyclone Mid-Term Test deadline\n• 31 Oct: Cycle 4 Question Bank submission to Training Directorate\n• 01 Nov: National Assessment Window opens';
      }

      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions,
      };

      setChatMessages((prev) => [...prev, botMsg]);
    }, 400);
  };

  return (
    <TrainerDataContext.Provider
      value={{
        courses,
        selectedCourseId,
        setSelectedCourseId,
        addCourse,
        updateCourse,
        addModuleToCourse,
        assessments,
        selectedAssessmentId,
        setSelectedAssessmentId,
        addAssessment,
        deleteAssessment,
        updateAssessment,
        trainees,
        selectedTraineeId,
        setSelectedTraineeId,
        sendReminder,
        materials,
        addMaterial,
        deleteMaterial,
        feedbackItems,
        replyToFeedback,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        profile,
        updateProfile,
        addCompetency,
        addCertificate,
        isChatbotOpen,
        setIsChatbotOpen,
        chatMessages,
        sendChatMessage,
      }}
    >
      {children}
    </TrainerDataContext.Provider>
  );
};

export const useTrainerData = () => {
  const context = useContext(TrainerDataContext);
  if (!context) {
    throw new Error('useTrainerData must be used within a TrainerDataProvider');
  }
  return context;
};
