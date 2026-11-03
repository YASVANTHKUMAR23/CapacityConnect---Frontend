import React, { createContext, useContext, useState } from 'react';
import {
  TraineeCourseItem,
  TraineeAssessmentItem,
  TraineeSubjectCompetency,
  TraineeMentorItem,
  TraineeSessionRequest,
  TraineeEarnedCertificate,
  TraineeUploadedEvidence,
  TraineeNotificationItem,
  TraineeProfileData,
} from '../types';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  quickAction?: { label: string; action: string };
  links?: { title: string; date?: string; score?: string }[];
}

interface TraineeDataContextType {
  profile: TraineeProfileData;
  updateProfile: (updated: Partial<TraineeProfileData>) => void;
  courses: TraineeCourseItem[];
  enrollCourse: (courseId: string) => void;
  updateCourseProgress: (courseId: string, progress: number, nextMod?: string) => void;
  assessments: TraineeAssessmentItem[];
  submitAssessment: (assessmentId: string, score: number, timeTaken: number) => void;
  competencies: TraineeSubjectCompetency[];
  mentors: TraineeMentorItem[];
  sessionRequests: TraineeSessionRequest[];
  requestMentorSession: (mentorName: string, topic: string) => void;
  earnedCertificates: TraineeEarnedCertificate[];
  uploadedEvidence: TraineeUploadedEvidence[];
  addEvidence: (fileName: string, provider: string, year: string) => void;
  notifications: TraineeNotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  activeLanguage: 'English' | 'Hindi';
  setActiveLanguage: (lang: 'English' | 'Hindi') => void;
  isChatbotOpen: boolean;
  setIsChatbotOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => void;
  // Feedback
  submitCourseFeedback: (courseId: string, rating: number, metrics: Record<string, number>, comment: string) => void;
}

const TraineeDataContext = createContext<TraineeDataContextType | undefined>(undefined);

export const TraineeDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeLanguage, setActiveLanguage] = useState<'English' | 'Hindi'>('English');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const [profile, setProfile] = useState<TraineeProfileData>({
    name: 'Asha Verma',
    email: 'asha.verma@imd.gov.in',
    location: 'New Delhi',
    role: 'Trainee',
    employeeId: 'IMD-TR-8821',
    qualifications: [
      { degree: 'M.Sc Meteorology', institution: 'Pune University', year: '2016' },
      { degree: 'B.Sc Physics', institution: 'Delhi University', year: '2014' },
    ],
    workExperience: [
      { role: 'Scientist B', organization: 'Regional Met Centre', duration: '6 years' },
      { role: 'Junior Analyst', organization: 'IMD Pune', duration: '2 years' },
    ],
    interests: ['Cyclone tracking', 'Numerical models', 'Radar analysis'],
    skills: ['Forecasting', 'Python', 'Satellite imagery', 'Data analysis'],
  });

  const updateProfile = (updated: Partial<TraineeProfileData>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const [courses, setCourses] = useState<TraineeCourseItem[]>([
    {
      id: 'course-1',
      code: 'CT',
      title: 'Cyclone Track Analysis & Dvorak Technique',
      subject: 'Meteorology',
      trainer: 'Dr. Ravi Menon',
      institution: 'Cyclone Warning Division, IMD New Delhi',
      imageUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=600&auto=format&fit=crop&q=80',
      modulesCount: 5,
      languages: ['English', 'Hindi'],
      enrolled: true,
      progress: 38,
      deadline: '30 Nov',
      status: 'Enrolled',
      nextModule: 'M3 · Track forecasting',
      rating: 4.8,
      reviewsCount: 1240,
      level: 'Intermediate',
      hours: '28 hrs',
      description: 'Advanced track forecasting, Doppler radar signature analysis, vortex modeling, and Dvorak cyclone classification.',
    },
    {
      id: 'course-2',
      code: 'CD',
      title: 'Climate Data Handling & NetCDF Workflows',
      subject: 'Climatology',
      trainer: 'Prof. Sunil Das',
      institution: 'National Climate Centre, IMD Pune',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
      modulesCount: 6,
      languages: ['English'],
      enrolled: true,
      progress: 76,
      deadline: '05 Nov',
      status: 'Enrolled',
      nextModule: 'M5 · Final quiz',
      rating: 4.7,
      reviewsCount: 890,
      level: 'Intermediate',
      hours: '32 hrs',
      description: 'Techniques for climate data homogenization, NetCDF spatial query patterns, grid aggregation, and time-series extraction.',
    },
    {
      id: 'course-3',
      code: 'RD',
      title: 'Radar Data Quality & Clutter Rejection',
      subject: 'Instrumentation',
      trainer: 'Meera Iyer',
      institution: 'Instruments & Radar Division, IMD Pune',
      imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?w=600&auto=format&fit=crop&q=80',
      modulesCount: 4,
      languages: ['English'],
      enrolled: true,
      progress: 44,
      deadline: '20 Nov',
      status: 'Enrolled',
      nextModule: 'M2 · QC methods',
      rating: 4.6,
      reviewsCount: 610,
      level: 'Advanced',
      hours: '20 hrs',
      description: 'Quality checks for radar velocity dealiasing, ground clutter rejection, attenuation correction, and dual-pol hydrometeor classification.',
    },
    {
      id: 'course-4',
      code: 'MO',
      title: 'Monsoon Onset Review & Synoptic Indicators',
      subject: 'Meteorology',
      trainer: 'Dr. Ravi Menon',
      institution: 'Indian Institute of Tropical Meteorology & IMD',
      imageUrl: 'https://images.unsplash.com/photo-1514632595-4944383f2737?w=600&auto=format&fit=crop&q=80',
      modulesCount: 4,
      languages: ['English', 'Hindi'],
      enrolled: true,
      progress: 100,
      deadline: 'Done',
      status: 'Completed',
      nextModule: 'Completed',
      rating: 4.9,
      reviewsCount: 2150,
      level: 'Beginner',
      hours: '18 hrs',
      description: 'Synoptic indicators, cross-equatorial flow assessment, outgoing longwave radiation (OLR), and official onset declaration protocols.',
    },
    {
      id: 'course-5',
      code: 'NW',
      title: 'Numerical Weather Models & Ensembles (WRF/GFS)',
      subject: 'Forecasting',
      trainer: 'Dr. Anita Rao',
      institution: 'Regional Meteorological Centre, Chennai',
      imageUrl: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?w=600&auto=format&fit=crop&q=80',
      modulesCount: 8,
      languages: ['English', 'Tamil'],
      enrolled: false,
      status: 'Available',
      rating: 4.8,
      reviewsCount: 1420,
      level: 'Advanced',
      hours: '36 hrs',
      description: 'Operational NWP models (WRF, GFS, UM), boundary condition ingestion, ensemble prediction systems, and probabilistic post-processing.',
    },
    {
      id: 'course-6',
      code: 'SS',
      title: 'Storm Surge Basics & Coastal Inundation',
      subject: 'Oceanography',
      trainer: 'Dr. Pooja Sen',
      institution: 'Coastal Ocean Alert Centre, Kolkata',
      imageUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&auto=format&fit=crop&q=80',
      modulesCount: 3,
      languages: ['English', 'Hindi'],
      enrolled: false,
      status: 'Available',
      rating: 4.5,
      reviewsCount: 540,
      level: 'Beginner',
      hours: '16 hrs',
      description: 'Bathymetric interactions, astronomical tide superposition, shallow-water equations, and coastal vulnerability mapping for cyclone alerts.',
    },
    {
      id: 'course-7',
      code: 'SI',
      title: 'Satellite Imagery Interpretation (INSAT-3D/3DR)',
      subject: 'Meteorology',
      trainer: 'Farah Khan',
      institution: 'Satellite Meteorology Division, New Delhi',
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
      modulesCount: 6,
      languages: ['English', 'Marathi'],
      enrolled: false,
      status: 'Available',
      rating: 4.6,
      reviewsCount: 780,
      level: 'Intermediate',
      hours: '24 hrs',
      description: 'INSAT-3D/3DR multi-spectral interpretation, water vapour channels, convection initiation, and rapid scan operational products.',
    },
    {
      id: 'course-8',
      code: 'AA',
      title: 'Agromet Advisory Services & Crop Analytics',
      subject: 'Forecasting',
      trainer: 'Dr. Pooja Sen',
      institution: 'Agricultural Meteorology Division, Pune',
      imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80',
      modulesCount: 5,
      languages: ['English', 'Hindi'],
      enrolled: false,
      status: 'Available',
      rating: 4.7,
      reviewsCount: 930,
      level: 'Beginner',
      hours: '22 hrs',
      description: 'District and block level agrometeorological forecasting, soil moisture modeling, and crop weather calendar integration.',
    },
  ]);

  const enrollCourse = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? { ...c, enrolled: true, progress: 0, status: 'Enrolled', nextModule: 'M1 · Overview' }
          : c
      )
    );
  };

  const updateCourseProgress = (courseId: string, progress: number, nextMod?: string) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? {
              ...c,
              progress,
              status: progress >= 100 ? 'Completed' : 'Enrolled',
              nextModule: nextMod || c.nextModule,
            }
          : c
      )
    );
  };

  const [assessments, setAssessments] = useState<TraineeAssessmentItem[]>([
    {
      id: 'asmt-1',
      title: 'Cyclone Track mid-term',
      courseTitle: 'Cyclone Track Analysis',
      courseId: 'course-1',
      deadline: '24 Oct',
      attemptsUsed: 0,
      maxAttempts: 2,
      status: 'Live',
      timeLimitMinutes: 40,
      questionsCount: 20,
      passMark: 50,
      classAvgScore: 68,
    },
    {
      id: 'asmt-2',
      title: 'Radar QC quiz',
      courseTitle: 'Radar Data Quality',
      courseId: 'course-3',
      deadline: '28 Oct',
      attemptsUsed: 0,
      maxAttempts: 2,
      status: 'Upcoming',
      timeLimitMinutes: 30,
      questionsCount: 15,
      passMark: 50,
      classAvgScore: 64,
    },
    {
      id: 'asmt-3',
      title: 'Climate data final',
      courseTitle: 'Climate Data Handling',
      courseId: 'course-2',
      deadline: '05 Nov',
      attemptsUsed: 0,
      maxAttempts: 1,
      status: 'Upcoming',
      timeLimitMinutes: 45,
      questionsCount: 25,
      passMark: 60,
      classAvgScore: 71,
    },
    {
      id: 'asmt-4',
      title: 'Monsoon review test',
      courseTitle: 'Monsoon Onset Review',
      courseId: 'course-4',
      deadline: '10 Sep',
      attemptsUsed: 1,
      maxAttempts: 1,
      status: 'Completed',
      score: 72,
      passMark: 50,
      timeLimitMinutes: 40,
      timeTakenMinutes: 31,
      completedDate: '10 Sep',
      classAvgScore: 66,
      questionsCount: 25,
    },
  ]);

  const submitAssessment = (assessmentId: string, score: number, timeTaken: number) => {
    setAssessments((prev) =>
      prev.map((a) =>
        a.id === assessmentId
          ? {
              ...a,
              status: 'Completed',
              score,
              attemptsUsed: a.attemptsUsed + 1,
              completedDate: 'Today',
              timeTakenMinutes: timeTaken,
            }
          : a
      )
    );
  };

  const [competencies] = useState<TraineeSubjectCompetency[]>([
    { subject: 'Forecasting', currentScore: 72, targetScore: 70, status: 'Meets target' },
    { subject: 'Radar analysis', currentScore: 58, targetScore: 70, status: 'Gap' },
    { subject: 'Climate data', currentScore: 66, targetScore: 70, status: 'Gap' },
    { subject: 'Cyclone tracking', currentScore: 49, targetScore: 70, status: 'Gap' },
    { subject: 'Instrumentation', currentScore: 81, targetScore: 70, status: 'Meets target' },
  ]);

  const [mentors] = useState<TraineeMentorItem[]>([
    {
      id: 'mentor-1',
      name: 'Dr. Ravi Menon',
      specialization: 'Cyclone tracking & Dvorak technique',
      domain: 'Tropical Meteorology',
      designation: 'Senior Scientist & Cyclone Specialist',
      division: 'Cyclone Warning Division (HQ, New Delhi)',
      gapMatched: 'Cyclone tracking',
      matchScore: 98,
      rating: 4.9,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      matchRationale: 'Directly addresses your Cyclone Track Analysis competency gap (Score: 49%). 18+ years leading Bay of Bengal & Arabian Sea cyclone tracking operations.',
      availableSlot: 'Tomorrow, 3:30 PM',
      coursesCount: 4,
      traineesCount: 214,
      initials: 'RM',
      available: true,
    },
    {
      id: 'mentor-2',
      name: 'Dr. Anita Rao',
      specialization: 'Numerical Weather Prediction & Ensembles',
      domain: 'Numerical Modeling',
      designation: 'Head of NWP Operations',
      division: 'Regional Meteorological Centre (Chennai)',
      gapMatched: 'Forecasting',
      matchScore: 95,
      rating: 4.9,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      matchRationale: 'Matches your interest in High-Resolution NWP and WRF parameterization. Led national storm simulation exercises for Southern Peninsula.',
      availableSlot: 'Thursday, 11:00 AM',
      coursesCount: 6,
      traineesCount: 356,
      initials: 'AR',
      available: true,
    },
    {
      id: 'mentor-3',
      name: 'Meera Iyer',
      specialization: 'Doppler Radar QC & Dual-Polarization',
      domain: 'Radar Meteorology',
      designation: 'Principal Radar Meteorologist',
      division: 'Instruments & Radar Division (Pune)',
      gapMatched: 'Radar analysis',
      matchScore: 92,
      rating: 4.8,
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      matchRationale: 'Directly targeted to resolve your Radar Analysis score (58%). Expert in dual-pol hydrometeor classification and velocity dealiasing.',
      availableSlot: 'Friday, 2:00 PM',
      coursesCount: 2,
      traineesCount: 187,
      initials: 'MI',
      available: true,
    },
    {
      id: 'mentor-4',
      name: 'Prof. Sunil Das',
      specialization: 'Climate Data Homogenization & NetCDF',
      domain: 'Climatology & Extremes',
      designation: 'Senior Director (Climatology)',
      division: 'National Climate Centre (Pune)',
      gapMatched: 'Climate data',
      matchScore: 89,
      rating: 4.7,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      matchRationale: 'Mapped to your Climate Data Handling course. Guides research officers on historical homogenization algorithms and IPCC projections.',
      availableSlot: 'Next Monday, 4:00 PM',
      coursesCount: 5,
      traineesCount: 298,
      initials: 'SD',
      available: true,
    },
    {
      id: 'mentor-5',
      name: 'Dr. Pooja Sen',
      specialization: 'Storm Surge & Ocean Coastal Inundation',
      domain: 'Oceanography',
      designation: 'Lead Ocean Modeling Scientist',
      division: 'Coastal Ocean Alert Centre (Kolkata)',
      gapMatched: 'Cyclone tracking',
      matchScore: 87,
      rating: 4.8,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      matchRationale: 'Provides hands-on guidance on shallow water surge modeling and coupling atmospheric pressure drops with coastal tide gauges.',
      availableSlot: 'Friday, 11:30 AM',
      coursesCount: 3,
      traineesCount: 165,
      initials: 'PS',
      available: true,
    },
    {
      id: 'mentor-6',
      name: 'Farah Khan',
      specialization: 'INSAT-3D/3DR Satellite Interpretation',
      domain: 'Satellite Meteorology',
      designation: 'Joint Director of Satellite Analysis',
      division: 'Satellite Meteorology Division (New Delhi)',
      gapMatched: 'Forecasting',
      matchScore: 84,
      rating: 4.7,
      avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
      matchRationale: 'Specializes in multispectral RGB cloud composite analysis, moisture soundings, and rapid-scan convective tracking.',
      availableSlot: 'Next Tuesday, 2:30 PM',
      coursesCount: 4,
      traineesCount: 210,
      initials: 'FK',
      available: true,
    },
  ]);

  const [sessionRequests, setSessionRequests] = useState<TraineeSessionRequest[]>([
    {
      id: 'sr-1',
      mentorName: 'Dr. Ravi Menon',
      topic: 'Track forecasting',
      requestedDate: 'Today',
      status: 'Pending',
    },
    {
      id: 'sr-2',
      mentorName: 'Meera Iyer',
      topic: 'Radar QC',
      requestedDate: '12 Oct',
      status: 'Completed',
    },
  ]);

  const requestMentorSession = (mentorName: string, topic: string) => {
    const newReq: TraineeSessionRequest = {
      id: `sr-${Date.now()}`,
      mentorName,
      topic,
      requestedDate: 'Today',
      status: 'Pending',
    };
    setSessionRequests((prev) => [newReq, ...prev]);
  };

  const [earnedCertificates] = useState<TraineeEarnedCertificate[]>([
    {
      id: 'cert-1',
      title: 'Monsoon Onset Review',
      issueDate: '10 Sep 2026',
      score: 72,
      verificationCode: 'IMD-CERT-MO26-8812',
    },
    {
      id: 'cert-2',
      title: 'Climate Data Basics',
      issueDate: '02 Jun 2026',
      score: 84,
      verificationCode: 'IMD-CERT-CD26-4409',
    },
    {
      id: 'cert-3',
      title: 'Radar Fundamentals',
      issueDate: '14 Feb 2026',
      score: 90,
      verificationCode: 'IMD-CERT-RF26-1934',
    },
    {
      id: 'cert-4',
      title: 'Cyclone Workshop',
      issueDate: '20 Nov 2025',
      score: 88,
      verificationCode: 'IMD-CERT-CW25-0552',
    },
  ]);

  const [uploadedEvidence, setUploadedEvidence] = useState<TraineeUploadedEvidence[]>([
    {
      id: 'ev-1',
      fileName: 'Radar Meteorology Certificate.pdf',
      provider: 'IMD Training Institute',
      year: '2021',
      uploadedDate: '12 Sep',
      evidenceCheck: 'Verified',
      notes: 'Issued by Meteorological Training Institute (MTI), Pune. Verified against MoES register.',
    },
    {
      id: 'ev-2',
      fileName: 'NWP Basics.pdf',
      provider: 'Online provider',
      year: '2022',
      uploadedDate: '12 Sep',
      evidenceCheck: 'Pending',
      notes: 'Pending curriculum equivalence verification by IMD Training Directorate.',
    },
    {
      id: 'ev-3',
      fileName: 'Cyclone Workshop.jpg',
      provider: 'Unrecognised provider',
      year: '2020',
      uploadedDate: '12 Sep',
      evidenceCheck: 'Rejected',
      notes: 'Provider not accredited under MoES or WMO-RTC guidelines.',
    },
  ]);

  const addEvidence = (fileName: string, provider: string, year: string) => {
    // Mock verifier checking issuer against MoES/IMD linked providers
    const isApprovedProvider =
      provider.toLowerCase().includes('imd') ||
      provider.toLowerCase().includes('moes') ||
      provider.toLowerCase().includes('iitm') ||
      provider.toLowerCase().includes('incois') ||
      provider.toLowerCase().includes('wmo');

    const status: 'Verified' | 'Pending' | 'Rejected' = isApprovedProvider
      ? 'Verified'
      : provider.toLowerCase().includes('unrecognised') || provider.toLowerCase().includes('fake')
      ? 'Rejected'
      : 'Pending';

    const newEvidence: TraineeUploadedEvidence = {
      id: `ev-${Date.now()}`,
      fileName,
      provider,
      year: year || '2026',
      uploadedDate: 'Today',
      evidenceCheck: status,
      notes: isApprovedProvider
        ? 'Verified against MoES Institute database.'
        : 'Submitted for committee verification.',
    };
    setUploadedEvidence((prev) => [newEvidence, ...prev]);
  };

  const [notifications, setNotifications] = useState<TraineeNotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Cyclone season training begins 1 Nov',
      meta: 'Admin · Today',
      category: 'Announcements',
      tag: 'Announcement',
      read: false,
      timestamp: 'Today',
      detail: 'Complete pending modules before the pre-cyclone operational review.',
    },
    {
      id: 'notif-2',
      title: 'Cyclone Track mid-term closes in 2 days',
      meta: 'System · Today',
      category: 'Deadlines',
      tag: 'Deadline',
      read: false,
      timestamp: 'Today',
      detail: 'Your mid-term MCQ assessment deadline is 24 Oct, 23:59 IST.',
    },
    {
      id: 'notif-3',
      title: 'New content: Track forecast handbook',
      meta: 'Trainer · Yesterday',
      category: 'Content',
      tag: 'New content',
      read: false,
      timestamp: 'Yesterday',
      detail: 'Dr. Ravi Menon uploaded updated handbook slides for Module 3.',
    },
    {
      id: 'notif-4',
      title: 'Radar QC quiz opens on 28 Oct',
      meta: 'System · 2 days ago',
      category: 'Assessments',
      tag: 'Assessment',
      read: true,
      timestamp: '2 days ago',
      detail: 'Assessment covering Radar reflectivity and Doppler velocity QC will go live.',
    },
    {
      id: 'notif-5',
      title: 'Dr. Menon accepted your session request',
      meta: 'Mentor · 3 days ago',
      category: 'Sessions',
      tag: 'Session',
      read: true,
      timestamp: '3 days ago',
      detail: 'Session confirmed for Friday at 15:00 IST on Track Forecasting Techniques.',
    },
  ]);

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: 'Hi Asha. Ask me about your courses, deadlines or skills.',
      time: '10:14 AM',
    },
    {
      id: 'm-2',
      sender: 'user',
      text: 'What is due this week?',
      time: '10:15 AM',
    },
    {
      id: 'm-3',
      sender: 'assistant',
      text: 'You have 2 items due:',
      time: '10:15 AM',
      links: [
        { title: 'Cyclone mid-term', date: '24 Oct' },
        { title: 'Radar QC quiz', date: '28 Oct' },
      ],
    },
    {
      id: 'm-4',
      sender: 'user',
      text: 'Which skills should I work on?',
      time: '10:16 AM',
    },
    {
      id: 'm-5',
      sender: 'assistant',
      text: 'Cyclone tracking (49%) is your largest gap. I suggest the Cyclone Track Analysis course next.',
      time: '10:16 AM',
      quickAction: { label: 'Resume Cyclone Course', action: 'resume-cyclone' },
    },
  ]);

  const sendChatMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      let reply = 'I am here to assist with your IMD training schedule, assessments, and learning modules.';
      const lower = text.toLowerCase();

      if (lower.includes('due') || lower.includes('deadline')) {
        reply = 'You have 2 assessments due this cycle: Cyclone Track mid-term on 24 Oct and Radar QC quiz on 28 Oct.';
      } else if (lower.includes('skill') || lower.includes('gap') || lower.includes('competency')) {
        reply = 'Your lowest competency score is in Cyclone Tracking (49%), followed by Radar Analysis (58%). Completing Module 3 of Cyclone Track Analysis will bridge this gap.';
      } else if (lower.includes('course') || lower.includes('progress')) {
        reply = 'You are enrolled in 3 active courses: Cyclone Track Analysis (38%), Climate Data Handling (76%), and Radar Data Quality (44%). Overall completion is 53%.';
      } else if (lower.includes('mentor') || lower.includes('ravi') || lower.includes('session')) {
        reply = 'Dr. Ravi Menon is your recommended mentor for Cyclone Tracking. You have 1 pending session request submitted today.';
      } else if (lower.includes('certificate')) {
        reply = 'You have earned 4 accredited certificates and uploaded 3 evidence documents (1 verified, 1 pending review, 1 rejected).';
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, botMsg]);
    }, 450);
  };

  const submitCourseFeedback = (
    courseId: string,
    rating: number,
    metrics: Record<string, number>,
    comment: string
  ) => {
    // In production, posts feedback to backend.
    console.log('Feedback submitted:', { courseId, rating, metrics, comment });
  };

  return (
    <TraineeDataContext.Provider
      value={{
        profile,
        updateProfile,
        courses,
        enrollCourse,
        updateCourseProgress,
        assessments,
        submitAssessment,
        competencies,
        mentors,
        sessionRequests,
        requestMentorSession,
        earnedCertificates,
        uploadedEvidence,
        addEvidence,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        activeLanguage,
        setActiveLanguage,
        isChatbotOpen,
        setIsChatbotOpen,
        chatMessages,
        sendChatMessage,
        submitCourseFeedback,
      }}
    >
      {children}
    </TraineeDataContext.Provider>
  );
};

export const useTraineeData = (): TraineeDataContextType => {
  const context = useContext(TraineeDataContext);
  if (!context) {
    throw new Error('useTraineeData must be used within a TraineeDataProvider');
  }
  return context;
};
