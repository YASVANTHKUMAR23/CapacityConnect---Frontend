export type Screen =
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'check-email'
  | 'reset-password'
  | 'pending-approval'
  | 'access-denied'
  | 'admin-portal'
  | 'trainer-portal'
  | 'trainee-portal'
  | 'trainee-setup'
  | 'trainee-take-assessment';

export type TraineeTab =
  | 'dashboard'
  | 'my-courses'
  | 'course-catalog'
  | 'course-detail'
  | 'assessments'
  | 'my-competency'
  | 'mentors'
  | 'course-player'
  | 'course-feedback'
  | 'assessment-result'
  | 'notifications'
  | 'profile'
  | 'certificates'
  | 'library';

export type TrainerTab =
  | 'dashboard'
  | 'my-courses'
  | 'trainer-library'
  | 'assessments'
  | 'trainees'
  | 'feedback'
  | 'profile'
  | 'notifications';

export interface TrainerCourse {
  id: string;
  code: string;
  title: string;
  category: string;
  enrolled: number;
  completed: number;
  completionRate: number;
  rating: number;
  status: 'Active' | 'Draft' | 'Inactive';
  lastUpdated: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  modulesCount: number;
  modules: TrainerCourseModule[];
}

export interface TrainerCourseModule {
  id: string;
  title: string;
  description?: string;
  duration: string;
  status: 'Published' | 'Draft';
  lessons: {
    id: string;
    title: string;
    type: 'video' | 'document' | 'presentation' | 'quiz';
    duration: string;
    completedCount?: number;
  }[];
}

export interface TrainerAssessment {
  id: string;
  title: string;
  courseId: string;
  courseTitle: string;
  moduleTitle: string;
  type: 'Quiz' | 'Mid-term' | 'Final' | 'Assignment';
  submissions: number;
  totalEnrolled: number;
  submissionRate: number;
  passRate: number;
  avgScore: number;
  avgTimeMins: number;
  deadline: string;
  status: 'Live' | 'Scheduled' | 'Closed' | 'Draft';
  timeLimitMinutes: number;
  totalMarks: number;
  passMarks: number;
  questionsCount: number;
  questions?: {
    id: string;
    prompt: string;
    options: string[];
    correctIndex: number;
    points: number;
    explanation?: string;
  }[];
}

export interface TrainerSubmission {
  id: string;
  traineeName: string;
  traineeEmail: string;
  division: string;
  submittedAt: string;
  timeSpent: string;
  score: number;
  totalMarks: number;
  status: 'Passed' | 'Failed';
  answers: {
    questionId: string;
    traineeAnswerIndex: number;
    isCorrect: boolean;
  }[];
}

export interface TrainerTrainee {
  id: string;
  name: string;
  email: string;
  division: string;
  designation: string;
  avatarBg: string;
  initials: string;
  enrolledCourseId: string;
  enrolledCourseTitle: string;
  courseProgress: number;
  avgScore: number;
  attemptsCount: number;
  lastActive: string;
  status: 'On track' | 'Needs attention' | 'Inactive';
  skillGaps: { skill: string; score: number }[];
  attempts: {
    assessmentTitle: string;
    date: string;
    score: number;
    status: 'Passed' | 'Failed';
  }[];
}

export interface TrainerMaterial {
  id: string;
  title: string;
  category: string;
  format: 'MP4' | 'PDF' | 'PPTX' | 'ZIP';
  size: string;
  courseAttached: string;
  uploadedDate: string;
  version: string;
  downloadsCount: number;
  status: 'Approved' | 'Pending' | 'Needs edit';
  tags: string[];
}

export interface TrainerFeedbackItem {
  id: string;
  traineeName: string;
  traineeDivision: string;
  courseTitle: string;
  rating: number;
  date: string;
  comment: string;
  sentiment: 'Positive' | 'Neutral' | 'Constructive';
  addressed: boolean;
  replyText?: string;
}

export interface TrainerNotification {
  id: string;
  title: string;
  description: string;
  type: 'Announcements' | 'Trainee Activity' | 'System Alerts';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

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
  profileComplete?: boolean;
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
  role: 'Trainer' | 'Trainee' | 'Admin' | 'Editor' | 'Viewer' | string;
  status: 'Active' | 'Suspended' | 'Inactive';
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
  imageUrl?: string;
}

export interface RejectedUserRecord {
  id: string;
  name: string;
  email: string;
  division: string;
  roleRequested: 'Trainer' | 'Trainee';
  rejectedDate: string;
  reason: string;
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

// Trainee Portal Interfaces
export interface TraineeCourseItem {
  id: string;
  code: string;
  title: string;
  subject: string;
  trainer: string;
  modulesCount: number;
  languages: string[];
  enrolled: boolean;
  progress?: number;
  deadline?: string;
  status?: 'Enrolled' | 'Completed' | 'Available';
  nextModule?: string;
  rating?: number;
  reviewsCount?: number;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  hours?: string;
  institution?: string;
  imageUrl?: string;
  description?: string;
}

export interface TraineeAssessmentItem {
  id: string;
  title: string;
  courseTitle: string;
  courseId: string;
  deadline: string;
  attemptsUsed: number;
  maxAttempts: number;
  status: 'Live' | 'Upcoming' | 'Completed';
  score?: number;
  passMark?: number;
  timeLimitMinutes: number;
  completedDate?: string;
  timeTakenMinutes?: number;
  classAvgScore?: number;
  questionsCount?: number;
}

export interface TraineeSubjectCompetency {
  subject: string;
  currentScore: number;
  targetScore: number;
  status: 'Meets target' | 'Gap';
}

export interface TraineeMentorItem {
  id: string;
  name: string;
  specialization: string;
  gapMatched: string;
  coursesCount: number;
  traineesCount: number;
  initials: string;
  available: boolean;
  matchScore?: number;
  rating?: number;
  avatarUrl?: string;
  matchRationale?: string;
  availableSlot?: string;
  domain?: string;
  designation?: string;
  division?: string;
}

export interface TraineeSessionRequest {
  id: string;
  mentorName: string;
  topic: string;
  requestedDate: string;
  status: 'Pending' | 'Completed' | 'Approved';
}

export interface TraineeEarnedCertificate {
  id: string;
  title: string;
  issueDate: string;
  score: number;
  verificationCode: string;
  downloadUrl?: string;
}

export interface TraineeUploadedEvidence {
  id: string;
  fileName: string;
  provider: string;
  year: string;
  uploadedDate: string;
  evidenceCheck: 'Verified' | 'Pending' | 'Rejected';
  notes?: string;
}

export interface TraineeNotificationItem {
  id: string;
  title: string;
  meta: string;
  category: 'Announcements' | 'Deadlines' | 'Content' | 'Assessments' | 'Sessions';
  tag: 'Announcement' | 'Deadline' | 'New content' | 'Assessment' | 'Session';
  read: boolean;
  timestamp: string;
  detail?: string;
}

export interface TraineeProfileData {
  name: string;
  email: string;
  location: string;
  role: string;
  employeeId: string;
  qualifications: { degree: string; institution: string; year: string }[];
  workExperience: { role: string; organization: string; duration: string }[];
  interests: string[];
  skills: string[];
}

