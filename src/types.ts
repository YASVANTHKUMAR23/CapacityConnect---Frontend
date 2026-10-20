export type Screen =
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'check-email'
  | 'reset-password'
  | 'pending-approval'
  | 'access-denied'
  | 'admin-portal';

export type AdminTab =
  | 'dashboard'
  | 'courses'
  | 'trainers'
  | 'trainees'
  | 'role-management'
  | 'announcements'
  | 'analytics'
  | 'competency'
  | 'settings';

export type UserRole = 'trainee' | 'trainer' | 'admin';

export interface UserAccount {
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  role: UserRole;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  submittedDate: string;
}

export interface PendingApprovalItem {
  id: string;
  name: string;
  email: string;
  division: string;
  roleRequested: 'Trainer' | 'Trainee';
  submitted: string;
  avatarBg?: string;
  initials: string;
}

export interface UserDirectoryItem {
  id: string;
  name: string;
  email: string;
  role: 'Trainer' | 'Trainee' | 'Admin';
  status: 'Active' | 'Suspended';
  joined: string;
  avatarBg?: string;
  initials: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  type: 'Announcement' | 'New content' | 'Achievement' | 'Notification';
  status: 'Published' | 'Scheduled' | 'Draft';
  date: string;
  message: string;
  publishOn: string;
  isPinned: boolean;
}

export interface TrainerItem {
  id: string;
  name: string;
  email: string;
  expertise: string;
  coursesCount: number;
  traineesCount: number;
  lastActive: string;
  status: 'Active' | 'Inactive';
  initials: string;
  avatarBg: string;
}

export interface TraineeItem {
  id: string;
  name: string;
  email: string;
  division: string;
  enrolledCount: number;
  avgProgress: number;
  lastActive: string;
  status: 'Active' | 'Inactive';
  initials: string;
  avatarBg: string;
}

export interface CourseItem {
  id: string;
  title: string;
  category: string;
  trainer: string;
  enrolled: number;
  completion: number;
  deadline: string;
  status: 'Active' | 'Inactive';
  initials: string;
  avatarBg: string;
}

export interface PortalSettings {
  portalName: string;
  defaultLanguage: string;
  timeZone: string;
  supportEmail: string;
  requireAdminApproval: boolean;
  restrictOrgEmails: boolean;
  detectTabSwitching: boolean;
  allowRetakes: boolean;
  sendDeadlineReminders: boolean;
}
