import React, { createContext, useContext, useState } from 'react';
import {
  AnnouncementItem,
  CourseItem,
  PendingApprovalItem,
  PortalSettings,
  TraineeItem,
  TrainerItem,
  UserDirectoryItem,
} from '../types';

interface AdminDataContextType {
  announcements: AnnouncementItem[];
  addAnnouncement: (item: Omit<AnnouncementItem, 'id'>) => void;
  updateAnnouncement: (id: string, updates: Partial<AnnouncementItem>) => void;
  deleteAnnouncement: (id: string) => void;
  selectedAnnouncementId: string;
  setSelectedAnnouncementId: (id: string) => void;
  pinnedAnnouncement: AnnouncementItem | undefined;

  pendingApprovals: PendingApprovalItem[];
  approveUser: (id: string) => void;
  rejectUser: (id: string) => void;

  userDirectory: UserDirectoryItem[];
  updateUserRole: (id: string, role: 'Trainer' | 'Trainee' | 'Admin') => void;

  trainers: TrainerItem[];
  updateTrainer: (id: string, updates: Partial<TrainerItem>) => void;
  trainees: TraineeItem[];
  updateTrainee: (id: string, updates: Partial<TraineeItem>) => void;
  courses: CourseItem[];
  updateCourse: (id: string, updates: Partial<CourseItem>) => void;

  settings: PortalSettings;
  updateSettings: (updates: Partial<PortalSettings>) => void;

  isChatbotOpen: boolean;
  setIsChatbotOpen: (open: boolean) => void;
}

const initialAnnouncements: AnnouncementItem[] = [
  {
    id: 'ann-1',
    title: 'Cyclone season training begins',
    type: 'Announcement',
    status: 'Published',
    date: '18 Oct',
    message:
      'New cyclone tracking modules open to all trainees on 1 November. Enroll before 30 November to receive your certificate.',
    publishOn: '25 Oct 2026, 09:00',
    isPinned: true,
  },
  {
    id: 'ann-2',
    title: 'Radar course update released',
    type: 'New content',
    status: 'Published',
    date: '16 Oct',
    message:
      'S-band radar interpretation lessons have been refreshed with the latest Doppler dataset from Chennai and Kolkata radars.',
    publishOn: '16 Oct 2026, 11:30',
    isPinned: false,
  },
  {
    id: 'ann-3',
    title: '500 certifications crossed',
    type: 'Achievement',
    status: 'Published',
    date: '12 Oct',
    message:
      'Over 500 meteorologists across all IMD Regional Centres have completed the INSAT-3DR satellite imagery interpretation track.',
    publishOn: '12 Oct 2026, 14:00',
    isPinned: false,
  },
  {
    id: 'ann-4',
    title: 'Server maintenance Sunday',
    type: 'Notification',
    status: 'Scheduled',
    date: '25 Oct',
    message:
      'Portal services will undergo routine database optimization and backup between 02:00 AM and 05:00 AM IST on Sunday.',
    publishOn: '25 Oct 2026, 02:00',
    isPinned: false,
  },
  {
    id: 'ann-5',
    title: 'Winter module preview',
    type: 'New content',
    status: 'Draft',
    date: '—',
    message:
      'Early preview of Western Disturbances forecasting and fog density detection modules for northern plain divisions.',
    publishOn: '28 Oct 2026, 10:00',
    isPinned: false,
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

const initialDirectory: UserDirectoryItem[] = [
  {
    id: 'u-1',
    name: 'Asha Verma',
    email: 'asha.verma@imd.gov.in',
    role: 'Trainee',
    status: 'Active',
    joined: 'Aug 2026',
    initials: 'AV',
    avatarBg: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'u-2',
    name: 'Dr. Ravi Menon',
    email: 'ravi.menon@imd.gov.in',
    role: 'Trainer',
    status: 'Active',
    joined: 'Jun 2026',
    initials: 'DR',
    avatarBg: 'bg-amber-100 text-amber-800',
  },
  {
    id: 'u-3',
    name: 'Meera Iyer',
    email: 'meera.iyer@imd.gov.in',
    role: 'Trainer',
    status: 'Active',
    joined: 'Jun 2026',
    initials: 'MI',
    avatarBg: 'bg-amber-100 text-amber-800',
  },
  {
    id: 'u-4',
    name: 'Imran Sheikh',
    email: 'imran.sheikh@imd.gov.in',
    role: 'Trainee',
    status: 'Suspended',
    joined: 'Jul 2026',
    initials: 'IS',
    avatarBg: 'bg-blue-100 text-blue-800',
  },
];

const initialTrainers: TrainerItem[] = [
  {
    id: 'tr-1',
    name: 'Dr. Ravi Menon',
    email: 'ravi.menon@imd.gov.in',
    expertise: 'Cyclone tracking',
    coursesCount: 4,
    traineesCount: 214,
    lastActive: 'Today',
    status: 'Active',
    initials: 'DR',
    avatarBg: 'bg-amber-100 text-amber-800',
  },
  {
    id: 'tr-2',
    name: 'Dr. Anita Rao',
    email: 'anita.rao@imd.gov.in',
    expertise: 'Numerical models',
    coursesCount: 6,
    traineesCount: 356,
    lastActive: 'Today',
    status: 'Active',
    initials: 'DA',
    avatarBg: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'tr-3',
    name: 'Prof. Sunil Das',
    email: 'sunil.das@imd.gov.in',
    expertise: 'Climate data',
    coursesCount: 3,
    traineesCount: 298,
    lastActive: 'Yesterday',
    status: 'Active',
    initials: 'PS',
    avatarBg: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'tr-4',
    name: 'Meera Iyer',
    email: 'meera.iyer@imd.gov.in',
    expertise: 'Instrumentation',
    coursesCount: 2,
    traineesCount: 187,
    lastActive: '2 days ago',
    status: 'Active',
    initials: 'MI',
    avatarBg: 'bg-amber-100 text-amber-800',
  },
  {
    id: 'tr-5',
    name: 'Karthik Nair',
    email: 'karthik.nair@imd.gov.in',
    expertise: 'Agromet advisory',
    coursesCount: 0,
    traineesCount: 0,
    lastActive: '64 days ago',
    status: 'Inactive',
    initials: 'KN',
    avatarBg: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'tr-6',
    name: 'Farah Khan',
    email: 'farah.khan@imd.gov.in',
    expertise: 'Radar analysis',
    coursesCount: 3,
    traineesCount: 142,
    lastActive: 'Today',
    status: 'Active',
    initials: 'FK',
    avatarBg: 'bg-teal-100 text-teal-800',
  },
  {
    id: 'tr-7',
    name: 'Dr. Pooja Sen',
    email: 'pooja.sen@imd.gov.in',
    expertise: 'Ocean forecasting',
    coursesCount: 0,
    traineesCount: 0,
    lastActive: '91 days ago',
    status: 'Inactive',
    initials: 'DP',
    avatarBg: 'bg-rose-100 text-rose-800',
  },
];

const initialTrainees: TraineeItem[] = [
  {
    id: 'tn-1',
    name: 'Asha Verma',
    email: 'asha.verma@imd.gov.in',
    division: 'New Delhi',
    enrolledCount: 3,
    avgProgress: 72,
    lastActive: 'Today',
    status: 'Active',
    initials: 'AV',
    avatarBg: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'tn-2',
    name: 'Rohit Sharma',
    email: 'rohit.sharma@imd.gov.in',
    division: 'Pune',
    enrolledCount: 2,
    avgProgress: 54,
    lastActive: 'Today',
    status: 'Active',
    initials: 'RS',
    avatarBg: 'bg-rose-100 text-rose-800',
  },
  {
    id: 'tn-3',
    name: 'Divya Pillai',
    email: 'divya.pillai@imd.gov.in',
    division: 'Thiruvananthapuram',
    enrolledCount: 4,
    avgProgress: 88,
    lastActive: 'Yesterday',
    status: 'Active',
    initials: 'DP',
    avatarBg: 'bg-pink-100 text-pink-800',
  },
  {
    id: 'tn-4',
    name: 'Imran Sheikh',
    email: 'imran.sheikh@imd.gov.in',
    division: 'Mumbai',
    enrolledCount: 1,
    avgProgress: 12,
    lastActive: '48 days ago',
    status: 'Inactive',
    initials: 'IS',
    avatarBg: 'bg-sky-100 text-sky-800',
  },
  {
    id: 'tn-5',
    name: 'Lakshmi Narayan',
    email: 'lakshmi.n@imd.gov.in',
    division: 'Chennai',
    enrolledCount: 3,
    avgProgress: 65,
    lastActive: 'Today',
    status: 'Active',
    initials: 'LN',
    avatarBg: 'bg-indigo-100 text-indigo-800',
  },
  {
    id: 'tn-6',
    name: 'Arjun Bose',
    email: 'arjun.bose@imd.gov.in',
    division: 'Kolkata',
    enrolledCount: 2,
    avgProgress: 31,
    lastActive: '3 days ago',
    status: 'Active',
    initials: 'AB',
    avatarBg: 'bg-amber-100 text-amber-800',
  },
  {
    id: 'tn-7',
    name: 'Neha Kulkarni',
    email: 'neha.k@imd.gov.in',
    division: 'Nagpur',
    enrolledCount: 1,
    avgProgress: 0,
    lastActive: '72 days ago',
    status: 'Inactive',
    initials: 'NK',
    avatarBg: 'bg-purple-100 text-purple-800',
  },
];

const initialCourses: CourseItem[] = [
  {
    id: 'c-1',
    title: 'Cyclone Track Analysis',
    category: 'Meteorology',
    trainer: 'Dr. Ravi Menon',
    enrolled: 214,
    completion: 38,
    deadline: '30 Nov 2026',
    status: 'Active',
    initials: 'CT',
    avatarBg: 'bg-amber-100 text-amber-800',
  },
  {
    id: 'c-2',
    title: 'Numerical Weather Models',
    category: 'Forecasting',
    trainer: 'Dr. Anita Rao',
    enrolled: 356,
    completion: 47,
    deadline: '15 Dec 2026',
    status: 'Active',
    initials: 'NW',
    avatarBg: 'bg-purple-100 text-purple-800',
  },
  {
    id: 'c-3',
    title: 'Climate Data Handling',
    category: 'Climatology',
    trainer: 'Prof. Sunil Das',
    enrolled: 298,
    completion: 76,
    deadline: '05 Nov 2026',
    status: 'Active',
    initials: 'CD',
    avatarBg: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'c-4',
    title: 'Radar Data Quality',
    category: 'Instrumentation',
    trainer: 'Meera Iyer',
    enrolled: 187,
    completion: 44,
    deadline: '20 Nov 2026',
    status: 'Active',
    initials: 'RD',
    avatarBg: 'bg-rose-100 text-rose-800',
  },
  {
    id: 'c-5',
    title: 'Satellite Imagery Basics',
    category: 'Remote sensing',
    trainer: 'Farah Khan',
    enrolled: 242,
    completion: 61,
    deadline: '10 Dec 2026',
    status: 'Active',
    initials: 'SI',
    avatarBg: 'bg-indigo-100 text-indigo-800',
  },
  {
    id: 'c-6',
    title: 'Agromet Advisory Services',
    category: 'Agrometeorology',
    trainer: 'Dr. Pooja Sen',
    enrolled: 133,
    completion: 82,
    deadline: '28 Oct 2026',
    status: 'Active',
    initials: 'AA',
    avatarBg: 'bg-emerald-100 text-emerald-800',
  },
];

const initialSettings: PortalSettings = {
  portalName: 'Capacity Connect',
  defaultLanguage: 'English',
  timeZone: 'India Standard Time (UTC+5:30)',
  supportEmail: 'support@imd.gov.in',
  requireAdminApproval: true,
  restrictOrgEmails: true,
  detectTabSwitching: true,
  allowRetakes: false,
  sendDeadlineReminders: true,
};

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const AdminDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(initialAnnouncements);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<string>('ann-1');
  const [pendingApprovals, setPendingApprovals] = useState<PendingApprovalItem[]>(initialPending);
  const [userDirectory, setUserDirectory] = useState<UserDirectoryItem[]>(initialDirectory);
  const [trainers, setTrainers] = useState<TrainerItem[]>(initialTrainers);
  const [trainees, setTrainees] = useState<TraineeItem[]>(initialTrainees);
  const [courses, setCourses] = useState<CourseItem[]>(initialCourses);
  const [settings, setSettings] = useState<PortalSettings>(initialSettings);
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);

  const pinnedAnnouncement = announcements.find((a) => a.isPinned) || announcements[0];

  const addAnnouncement = (item: Omit<AnnouncementItem, 'id'>) => {
    const newId = `ann-${Date.now()}`;
    const newAnn: AnnouncementItem = { ...item, id: newId };
    if (newAnn.isPinned) {
      setAnnouncements((prev) => [
        newAnn,
        ...prev.map((a) => ({ ...a, isPinned: false })),
      ]);
    } else {
      setAnnouncements((prev) => [newAnn, ...prev]);
    }
    setSelectedAnnouncementId(newId);
  };

  const updateAnnouncement = (id: string, updates: Partial<AnnouncementItem>) => {
    setAnnouncements((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return { ...a, ...updates };
        }
        if (updates.isPinned) {
          return { ...a, isPinned: false };
        }
        return a;
      })
    );
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    if (selectedAnnouncementId === id) {
      const remaining = announcements.filter((a) => a.id !== id);
      if (remaining.length > 0) {
        setSelectedAnnouncementId(remaining[0].id);
      }
    }
  };

  const approveUser = (id: string) => {
    const item = pendingApprovals.find((p) => p.id === id);
    if (!item) return;

    setPendingApprovals((prev) => prev.filter((p) => p.id !== id));
    setUserDirectory((prev) => [
      {
        id: `dir-${Date.now()}`,
        name: item.name,
        email: item.email,
        role: item.roleRequested,
        status: 'Active',
        joined: 'Today',
        initials: item.initials,
        avatarBg: item.avatarBg || 'bg-blue-100 text-blue-800',
      },
      ...prev,
    ]);
  };

  const rejectUser = (id: string) => {
    setPendingApprovals((prev) => prev.filter((p) => p.id !== id));
  };

  const updateUserRole = (id: string, newRole: 'Trainer' | 'Trainee' | 'Admin') => {
    setUserDirectory((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );
  };

  const updateCourse = (id: string, updates: Partial<CourseItem>) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const updateTrainer = (id: string, updates: Partial<TrainerItem>) => {
    setTrainers((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const updateTrainee = (id: string, updates: Partial<TraineeItem>) => {
    setTrainees((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const updateSettings = (updates: Partial<PortalSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AdminDataContext.Provider
      value={{
        announcements,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        selectedAnnouncementId,
        setSelectedAnnouncementId,
        pinnedAnnouncement,

        pendingApprovals,
        approveUser,
        rejectUser,

        userDirectory,
        updateUserRole,

        trainers,
        updateTrainer,
        trainees,
        updateTrainee,
        courses,
        updateCourse,

        settings,
        updateSettings,

        isChatbotOpen,
        setIsChatbotOpen,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};
