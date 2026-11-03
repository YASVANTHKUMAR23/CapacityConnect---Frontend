# Capacity Connect — System Architecture & Component Instruction Manual

## 1. Executive Summary & Purpose

**Capacity Connect** is an institutional-grade, web-based Learning Management and Capacity Building Platform tailored for the **India Meteorological Department (IMD)** under the **Ministry of Earth Sciences (MoES)**.

The application serves three distinct organizational personas:
1. **Admin Portal**: Executive oversight, course publishing approvals, trainer/trainee rosters, role-based access control (RBAC), departmental announcements, competency frameworks, system settings, and analytics.
2. **Trainer Portal** (Persona: *Dr. Ravi Menon, Senior Trainer & Meteorologist*): Multi-step course creation wizard, module & lesson curriculum builder, course-organized educational library, assessment creator & grading table, trainee performance tracking, and feedback management.
3. **Trainee Portal** (Persona: *Asha Verma, Scientist B / Duty Officer*): Gated 4-step onboarding diagnostic wizard, interactive course catalog, multimedia course player with expandable syllabus and embedded video dialoger, assessment runner, personal competency gap radar, digital certificates, mentor directory, and progress-gated course library.

---

## 2. Technology Stack & Runtime Configuration

- **Frontend Framework**: React 19 (`react`, `react-dom`) with TypeScript.
- **Build Tool**: Vite 8 with `@vitejs/plugin-react`.
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`, `@import "tailwindcss"` in `src/index.css`) with custom `@theme` configuring `font-sans: 'Plus Jakarta Sans'`.
- **Iconography**: Lucide React (`lucide-react`).
- **Animations & Effects**: Motion (`motion`), CSS keyframe animations (`animate-in`, `fade-in`, `slide-in-from-top-3`).
- **Backend / Dev Server**: Express on Node.js / Vite dev server (`port 3000`).
- **No Mock Stubs**: All data is managed live in memory via React Context stores with bidirectional updates, realistic mock datasets, and persistence during active sessions.

---

## 3. Directory Structure

```text
/
├── index.html                   # HTML entry point with Plus Jakarta Sans webfont & meta tags
├── package.json                 # Project dependencies and script configurations
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite bundler configuration with Tailwind plugin
├── instruction.md               # This comprehensive architectural documentation
├── public/                      # Static assets & attachments
│   └── assets/aistudio/         # Official reference images and design attachments
└── src/
    ├── main.tsx                 # Application mount point (React 19 createRoot)
    ├── App.tsx                  # Root State Machine, router, and global layout controller
    ├── index.css                # Global styles, Tailwind v4 theme, font family definitions
    ├── types.ts                 # Centralized TypeScript definitions, models, and enums
    ├── context/                 # Global Context Stores & Providers
    │   ├── AdminDataContext.tsx    # Admin domain state (courses, users, roles, announcements)
    │   ├── TrainerDataContext.tsx  # Trainer domain state (courses, modules, library, tests)
    │   └── TraineeDataContext.tsx  # Trainee domain state (enrollments, quiz attempts, evidence)
    └── components/
        ├── Header.tsx           # Public / Auth header with MoES and IMD branding
        ├── Footer.tsx           # Institutional footer with copyright and legal links
        ├── EmailModal.tsx       # Simulated email client modal for verification & reset links
        ├── common/
        │   ├── DashboardAnnouncementCard.tsx # Unified announcement card (7 cols) with carousel, indicators & actions
        │   └── LibraryAnnouncementBanner.tsx # Large official announcement hero banner
        ├── magicui/
        │   └── hero-video-dialog.tsx         # Modal video player with thumbnail & backdrop
        ├── screens/             # Public & Authentication Screens
        │   ├── SignInScreen.tsx         # Role-aware login with instant demo switcher
        │   ├── SignUpScreen.tsx         # Trainee/Trainer account registration
        │   ├── ForgotPasswordScreen.tsx # Email submission for password reset
        │   ├── CheckEmailScreen.tsx     # Email delivery confirmation & modal trigger
        │   ├── ResetPasswordScreen.tsx  # Password reset with validation checklist
        │   ├── PendingApprovalScreen.tsx# State screen for accounts awaiting approval
        │   └── AccessDeniedScreen.tsx   # Unauthorized navigation guard screen
        ├── admin/               # Administrator Portal Module
        │   ├── AdminLayout.tsx          # Admin sidebar, header bar, and profile menu
        │   ├── DashboardPage.tsx        # Executive KPIs, live activity feed, quick actions
        │   ├── CoursesPage.tsx          # Course catalog directory & publishing controls
        │   ├── TrainersPage.tsx         # Trainer roster & performance records
        │   ├── TraineesPage.tsx         # Trainee directory & division filter
        │   ├── RoleManagementPage.tsx   # RBAC permissions matrix and role assignments
        │   ├── AnnouncementsPage.tsx    # Official bulletin publisher & scheduler
        │   ├── AnalyticsPage.tsx        # Engagement, completion rate, and scoring charts
        │   ├── CompetencyPage.tsx       # National meteorological skill framework
        │   ├── SettingsPage.tsx         # System settings, notifications, and security
        │   ├── ScrollDrivenTable.tsx    # Reusable virtualized/scrollable data table
        │   └── ChatbotDrawer.tsx        # Admin AI assistant drawer
        ├── trainer/             # Trainer Portal Module (Dr. Ravi Menon)
        │   ├── TrainerLayout.tsx        # Trainer navigation sidebar & top status bar
        │   ├── TrainerDashboardPage.tsx # Trainer course summaries, grading alerts, stats
        │   ├── TrainerCoursesPage.tsx   # Course cards with "+ Create course" wizard launch
        │   ├── TrainerCreateCourseWizard.tsx # 3-step full-width course creator
        │   ├── TrainerLibraryPage.tsx   # Educational files categorized under Course Cards
        │   ├── TrainerAssessmentsPage.tsx# Quiz builder, test manager & grading table
        │   ├── TrainerTraineesPage.tsx  # Student progress tracker & competency gaps
        │   ├── TrainerFeedbackPage.tsx  # Student course reviews & sentiment breakdown
        │   ├── TrainerProfilePage.tsx   # Dr. Ravi Menon's qualifications & credentials
        │   ├── TrainerNotificationsPage.tsx # Category-filtered notification center
        │   └── TrainerChatbotDrawer.tsx # Trainer AI assistant for curriculum design
        └── trainee/             # Trainee Portal Module (Asha Verma)
            ├── TraineeLayout.tsx        # Trainee sidebar, status bar, and floating chatbot
            ├── TraineeSetupModal.tsx    # 4-step onboarding wizard (Profile, Certs, Quiz, Result)
            ├── TraineeDashboardPage.tsx # Enrolled courses, upcoming quizzes, announcements
            ├── TraineeCourseCatalogPage.tsx # Searchable course directory with "Enroll" button
            ├── TraineeCourseDetailPage.tsx  # Syllabus, module list & pre-enrollment review
            ├── TraineeMyCoursesPage.tsx # Active courses in progress & completed courses
            ├── TraineeCoursePlayerPage.tsx # Video player, notes, expandable syllabus sidebar
            ├── TraineeCourseFeedbackPage.tsx# 5-star course evaluation form
            ├── TraineeAssessmentsPage.tsx# Upcoming & completed tests with "Start" button
            ├── TraineeTakeAssessmentPage.tsx# Fullscreen timed test-taking environment
            ├── TraineeAssessmentResultPage.tsx# Score breakdown, question review & explanations
            ├── TraineeCompetencyPage.tsx# Personal radar chart & baseline competency gap index
            ├── TraineeMentorsPage.tsx   # Directory of IMD senior mentors & session booking
            ├── TraineeCertificatesPage.tsx# Verified digital certificates & PDF downloader
            ├── TraineeLibraryPage.tsx   # Progress-gated library files (unlocked upon starting)
            ├── TraineeProfilePage.tsx   # Asha Verma's personal details, station, and skills
            ├── TraineeNotificationsPage.tsx # Trainee alerts (reminders, grades, announcements)
            └── TraineeChatbotDrawer.tsx # Trainee study assistant with domain prompt chips
```

---

## 4. Global State & Routing State Machine (`src/App.tsx`)

The root component manages single-page application routing without external page reloads:

```typescript
// Active Screen Types
type Screen =
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
```

### Route Guard & Navigation Flow
1. **Public Authentication**: `/` loads `login`. Users can switch between Sign In, Sign Up, Forgot Password, and Simulated Email verification.
2. **One-Click Quick Login Selectors**: On `SignInScreen.tsx`, clicking the badge shortcuts switches user role seamlessly:
   - **Admin**: Routes to `admin-portal` (`currentAdminTab = 'dashboard'`).
   - **Trainer** (Dr. Ravi Menon): Routes to `trainer-portal` (`currentTrainerTab = 'dashboard'`).
   - **Trainee** (Asha Verma):
     - If `profileComplete === false`, routes directly to `trainee-setup` (Gated 4-Step Onboarding).
     - Once setup is finished, routes to `trainee-portal` (`currentTraineeTab = 'dashboard'`).
3. **Assessment Runner Guard**: In `TraineeAssessmentsPage`, clicking "Start Assessment" routes to `trainee-take-assessment` (a distraction-free fullscreen mode without sidebar or navigation bar). Finishing the test returns to `trainee-portal` with tab `'assessment-result'`.
4. **Global Toast System**: Any page can call `showToast(message: string)`. A floating dark slate pill with an emerald checkmark appears at the top center with auto-dismiss after 4 seconds.

---

## 5. Detailed Component & Section Specifications

### 5.1 Public & Authentication Module (`src/components/screens/`)

#### `SignInScreen.tsx`
- **Purpose**: Authenticate administrative officers, trainers, and trainee meteorologists.
- **Key Elements**:
  - Interactive **Quick Demo Login** selector buttons for instant role switching without typing.
  - Email & Password input fields with password visibility toggle.
  - "Remember me" checkbox and "Forgot password?" navigation link.
  - Validation feedback for empty fields or unauthorized credentials.

#### `SignUpScreen.tsx`
- **Purpose**: Register new personnel into the IMD training ecosystem.
- **Key Elements**:
  - Role selection toggle: **Trainee** (Officer) vs. **Trainer** (Faculty).
  - First name, Last name, Official government email (`@imd.gov.in`), Station/Office location.
  - Password creation with client-side strength checks.
  - On submit, creates a pending account record and redirects to `pending-approval`.

#### `PendingApprovalScreen.tsx`
- **Purpose**: Awaiting administrative verification for newly registered government personnel.
- **Key Elements**:
  - Real-time status indicator showing "Under Review by IMD Training Directorate".
  - "Simulate Admin Instant Approval" shortcut button for seamless prototype testing.
  - Helpdesk contact links and Return to Login action.

#### `ForgotPasswordScreen.tsx`, `CheckEmailScreen.tsx`, `ResetPasswordScreen.tsx`
- **Purpose**: End-to-end self-service password recovery flow.
- **Key Elements**:
  - Sends a secure token simulation to `EmailModal.tsx`.
  - Check email screen provides an "Open Simulated Email Inbox" button.
  - Reset password screen enforces 8+ character password standards with live checkmarks.

#### `EmailModal.tsx`
- **Purpose**: In-browser virtual email client to inspect transactional notifications, OTPs, and password reset links without needing a third-party SMTP server.

---

### 5.2 Trainee Module (`src/components/trainee/`)

#### `TraineeSetupModal.tsx` (Gated 4-Step Onboarding)
- **Container**: Sized at `max-w-[680px] mx-auto` on desktop for visibility and alignment.
- **Step 1: Profile Details**:
  - User icon header, title, and account summary card (Name, Email, Station).
  - Highest qualification input, Work experience input.
  - Interactive chips for meteorological **Interests** (e.g. Cyclone tracking, Radar analysis) and **Skills** (e.g. Forecasting, Python, Satellite imagery) with an "+ Add" inline pill.
- **Step 2: Certificate Evidence Verification**:
  - Drag-and-drop file upload dropzone supporting PDF/PNG/JPG.
  - Evidence list verified against MoES and IMD training partners with status tags (`Verified`, `Pending`).
- **Step 3: Diagnostic Pre-assessment**:
  - Countdown timer (e.g., 14:32 left) and progress bar.
  - Multiple choice meteorological question card with animated radio options.
- **Step 4: Competency Results & Gap Analysis**:
  - Diagnostic score banner (e.g. **66%**).
  - Baseline Competency Index with animated progress bars (Forecasting 72%, Radar analysis 58%, Cyclone tracking 49%, Instrumentation 81%).
  - Recommended courses tailored to the lowest competency score with "View syllabus" preview modals.
  - "Complete profile & enter portal" button which unlocks the full Trainee Portal.

#### `TraineeDashboardPage.tsx`
- **Purpose**: Central hub for the trainee officer.
- **Top Section (image_f1e6357e.png layout)**:
  - **Left (`lg:col-span-7`)**: Unified `DashboardAnnouncementCard` with official announcement badge, pin indicator, carousel counter (e.g. "2 of 5"), prev/next loop buttons, publish date, Doppler satellite preview, headline, summary text, duty officer highlights ("Duty Officers Enrolled", "Divisional Readiness"), and action buttons ("View full announcement", "Next announcement", "Operational Bulletin (PDF)").
  - **Right (`lg:col-span-5`)**: 4 Metric Cards in a 2x2 grid (Completion 53%, Average score 71%, Competency level 66%, Study streak 9 days) with 30-day delta indicators.
- **Middle Section**: 3 Summary KPI Cards (My courses: 3 in progress, Assessments due: 2 pending, Certificates: 4 earned).
- **Lower Section**: 2 High-Modern Visual Spline Line Charts (Mastery curve & weekly study hours), In-Progress Course rail, and Recent Activities stream.

#### `TraineeCourseCatalogPage.tsx` & `TraineeCourseDetailPage.tsx`
- **Catalog Page**: Filterable grid of all IMD training modules by category (Meteorology, Radar, Satellite, Numerical Models) and difficulty level.
- **Enrollment Flow**:
  - Clicking "Enroll" redirects to `TraineeCourseDetailPage.tsx` first to review syllabus, prerequisites, instructor bio, and estimated hours.
  - Clicking "Confirm Enrollment" officially assigns the course to Asha Verma and unlocks the course player.

#### `TraineeCoursePlayerPage.tsx`
- **Purpose**: Immersive learning player for course modules.
- **Key Elements**:
  - **HeroVideoDialog**: MagicUI modal video player component with thumbnail preview, play button animation, and YouTube embed.
  - **Collapsible Course Syllabus Sidebar**:
    - Includes an **"X" close button** that shrinks the sidebar into a minimal horizontal/vertical trigger bar.
    - When closed, the video/reading area expands dynamically to take up the full available width for optimal readability.
  - **Resource Bar**: "Course Library" button that jumps directly to the relevant course documents in `TraineeLibraryPage.tsx`.
  - Tabbed lesson notes, discussion forum, and "Mark Lesson Complete" toggle.

#### `TraineeLibraryPage.tsx`
- **Purpose**: Student access to course handouts, slide decks, and Doppler radar datasets.
- **Gating Mechanism**:
  - Only courses that the trainee has **started learning** (progress > 0%) or **completed** (progress = 100%) display unlocked files.
  - Unenrolled or unstarted courses are marked with a lock icon and an "Enroll / Start course to unlock materials" prompt.
- **Official Announcement Banner**: Embeds `LibraryAnnouncementBanner.tsx` at the top in full-width format, matching the admin and trainer library layouts.

#### `TraineeAssessmentsPage.tsx` & `TraineeTakeAssessmentPage.tsx`
- **Assessments List**: Filter between Pending, In-Progress, and Completed quizzes.
- **Take Assessment Runner**:
  - Dedicated fullscreen mode (`Screen = 'trainee-take-assessment'`).
  - Active countdown timer, question palette sidebar (1 to 20), question bookmarking, radio selections, and "Submit Test" confirmation dialog.

#### `TraineeAssessmentResultPage.tsx`
- **Purpose**: Post-test performance debrief.
- **Key Elements**: Score summary, percentage grade, pass/fail status, detailed question breakdown with correct answers and meteorological explanations.

#### `TraineeCompetencyPage.tsx`
- **Purpose**: Visual radar spider chart and skill matrix comparing the officer's current proficiency vs. IMD departmental benchmarks.

#### `TraineeMentorsPage.tsx`
- **Purpose**: Connect with senior faculty (such as Dr. Ravi Menon) for 1-on-1 consultations and review sessions.

#### `TraineeCertificatesPage.tsx`
- **Purpose**: Digital repository of verified certificates of completion with downloadable PDF simulation and unique verification hash codes.

#### `TraineeChatbotDrawer.tsx`
- **Purpose**: Floating study assistant in the bottom right corner with quick prompts for cyclone track analysis, radar reflectivity, and NWP guidance.

---

### 5.3 Trainer Module (`src/components/trainer/`)

#### `TrainerLayout.tsx`
- **Purpose**: Master navigation shell for faculty.
- **Navigation Items**: Dashboard, My Courses, Course Library, Assessments, Trainees, Feedback, Profile, Notifications.
- **Header**: Active notification counter, Dr. Ravi Menon's profile menu, and quick portal switcher.

#### `TrainerDashboardPage.tsx`
- **Purpose**: Faculty mission control.
- **Top Section (image_f1e6357e.png layout)**:
  - **Left (`lg:col-span-7`)**: Unified `DashboardAnnouncementCard` with official announcement badge, pin indicator, carousel counter, prev/next arrows, publish date, Doppler satellite preview, headline, highlights, and action buttons.
  - **Right (`lg:col-span-5`)**: 4 Stat Cards arranged in a 2x2 grid (Total enrollments: 312, Completion rate: 78.4%, Avg. assessment score: 84.2%, Feedback rating: 4.8 / 5.0) with monthly trend badges.
- **Lower Section**: Quick actions, urgent trainee attention drawer with 1-click reminders, active course performance overview, and trainee submission grading queue.

#### `TrainerCoursesPage.tsx` & `TrainerCreateCourseWizard.tsx`
- **Courses Page**:
  - List of created courses with category badges, enrollment counts, completion rates, and status (`Active`, `Draft`).
  - **"+ Create course" button** launches the full-width creation wizard without polluting the sidebar.
- **3-Step Course Creation Wizard (`TrainerCreateCourseWizard.tsx`)**:
  - **Step 1: Basic Details**: Course title, category, level, language, short description, 16:9 thumbnail image preview & upload, learning objectives list, duration, modules count, and tag chips.
  - **Step 2: Course Structure & Content**:
    - Left column: Modular tree view with "+ Add Module", lesson drag handle, lesson type selector (`video`, `document`, `quiz`).
    - Right column: Rich lesson title, content editor with formatting toolbar (Bold, Italic, Bullet lists, Links, Code), and lesson resources manager (`.pdf`, `.pptx`, `.xlsx` file attachments with download and delete controls).
  - **Step 3: Review & Publish**: Complete curriculum overview, thumbnail summary, and "Publish Course" / "Save as Draft" action buttons.

#### `TrainerLibraryPage.tsx`
- **Purpose**: Repository of training assets organized **by Course Card**.
- **Key Elements**:
  - **LibraryAnnouncementBanner**: Full-width official announcement card at the top.
  - **Course Card File Containers**: Files are grouped directly beneath their parent course card (e.g. *Cyclone Track Analysis*, *Radar Meteorology*, *Numerical Weather Prediction*).
  - **File Operations**: View file format (`PDF`, `PPTX`, `MP4`, `ZIP`), size, upload date, download counter, and "Upload New Material" modal allowing assignment to a specific course.

#### `TrainerAssessmentsPage.tsx`
- **Purpose**: Test authoring and student grading.
- **Key Elements**:
  - Assessment cards with submission rate, pass rate, average score, and status (`Live`, `Draft`).
  - "+ Create Assessment" modal with question builder and point allocation.
  - Submissions review drawer with trainee answers, automated score calculation, and feedback input.

#### `TrainerTraineesPage.tsx`
- **Purpose**: Roster of trainees enrolled across the trainer's courses.
- **Key Elements**: Trainee avatar, station/division, course progress bar, average score, last active date, and flagged skill gaps.

#### `TrainerFeedbackPage.tsx`
- **Purpose**: Trainee sentiment tracking.
- **Key Elements**: Ratings (1 to 5 stars), student comments, automated sentiment tag (`Positive`, `Neutral`, `Constructive`), and inline reply composer.

#### `TrainerProfilePage.tsx` & `TrainerNotificationsPage.tsx`
- **Profile**: Faculty biography, department, specialization (Tropical Cyclones, Radar Meteorology), and academic credentials.
- **Notifications**: Tabbed notifications for Announcements, Trainee Submissions, and System Alerts.

---

### 5.4 Admin Module (`src/components/admin/`)

#### `AdminLayout.tsx`
- **Purpose**: Administrative master shell with navigation tabs: Dashboard, Courses, Trainers, Trainees, Role Management, Announcements, Analytics, Competency, Settings.

#### `DashboardPage.tsx`
- **Purpose**: Central executive overview for IMD Directorate.
- **Top Section**:
  - **Left (`lg:col-span-7`)**: Unified `DashboardAnnouncementCard` with carousel controls and radar highlights.
  - **Right (`lg:col-span-5`)**:
    - **Role Management Updates Card (Top)**: Dedicated card for faster access control approvals showing pending officer elevation requests with 1-click **Approve** and **Reject** buttons, pending count badge, and quick jump to `role-management`.
    - **Course, Trainer & Trainee Management Cards**: 3 progress cards tracking active course ratios, certified trainer counts, and active trainee coverage.
- **KTG Metric Cards**: 4 high-priority capacity building metrics (Active Trainee Officers: 1,096; Certified Competency Rate: 84.6%; Evaluations Cleared: 348; Operational Radar Network Readiness: 98.4%) engineered to be fully responsive across mobile, tablet (`sm:grid-cols-2`), and desktop (`lg:grid-cols-4`).
- **Middle & Lower Sections**: Monthly enrollments & completions dual-bar SVG chart with interactive hover tooltips, concentric circular skill mastery gauges, scroll-driven course monitoring table, and organic regional participation bubbles.

#### `CoursesPage.tsx`, `TrainersPage.tsx`, `TraineesPage.tsx`
- **Courses**: Admin catalog view to approve trainer drafts, change course visibility, and review platform-wide enrollments.
- **Trainers**: Faculty directory with credentials verification, assigned divisions, and performance ratings.
- **Trainees**: Full trainee roster across all Regional Meteorological Centres (RMCs) with progress filters and certificate statuses.

#### `RoleManagementPage.tsx`
- **Purpose**: Role-Based Access Control (RBAC).
- **Key Elements**:
  - Comprehensive permissions matrix for roles: **Admin**, **Trainer**, **Trainee**, **Editor**, **Viewer**.
  - Capability toggles for Course Creation, Grading, User Management, Announcements, and System Config.
  - Active user role reassignment modal.

#### `AnnouncementsPage.tsx`
- **Purpose**: Author and manage institutional announcements displayed to Trainers and Trainees.
- **Key Elements**:
  - Create Announcement dialog with title, target audience (`All`, `Trainers`, `Trainees`), priority tag (`Official Announcement`, `Operational Update`), publishing date, and image banner upload.
  - Pinned announcement controls and status toggles (`Published`, `Scheduled`, `Draft`).

#### `AnalyticsPage.tsx` & `CompetencyPage.tsx`
- **Analytics**: Completion rates over time, division-by-division training compliance, and assessment score distributions.
- **Competency Framework**: National competency mapping matrix covering World Meteorological Organization (WMO) and IMD standards.

#### `SettingsPage.tsx` & `ChatbotDrawer.tsx`
- **Settings**: Email server settings, session expiry policies, and audit log downloads.
- **Chatbot**: Directorate-level assistant with quick queries on compliance numbers and division readiness.

---

### 5.5 Common & UI Primitives

#### `src/components/common/LibraryAnnouncementBanner.tsx`
- **Purpose**: Institutional hero announcement banner displayed in full-width format inside both Trainer Library and Trainee Library.
- **Features**:
  - Official badge (`● Official Announcement`), publication date, and announcement counter (`2 of 5`).
  - Next/Previous cycling buttons.
  - Atmospheric cloud hero image banner.
  - Highlighted metrics: **Duty Officers Enrolled** (142 Class-I & II Meteorologists) and **Divisional Readiness** (98% National Radar Network).
  - Action buttons: "View full announcement", "Next announcement", and "Operational Bulletin (PDF)" download.

#### `src/components/magicui/hero-video-dialog.tsx`
- **Purpose**: Video dialog modal utilizing responsive animation.
- **Features**:
  - Video thumbnail with hover zoom and circular play button.
  - Smooth modal backdrop with close button (`X`) and keyboard escape handler.
  - Embedded YouTube video iframe with responsive 16:9 aspect ratio.

---

## 6. Context Stores & Data State Architecture (`src/context/`)

### 6.1 `AdminDataContext.tsx`
- **State**:
  - `pendingApprovals`: Queue of users awaiting admin verification.
  - `userDirectory`: All registered system users with roles and statuses.
  - `announcements`: List of departmental announcements with pin status.
  - `trainers`: Trainer directory with assigned courses and rating metrics.
  - `trainees`: Trainee directory with progress, scores, and station details.
  - `courses`: Master courses catalog.
- **Actions**: `approveUser`, `rejectUser`, `createAnnouncement`, `deleteAnnouncement`, `togglePinAnnouncement`, `updateUserRole`.

### 6.2 `TrainerDataContext.tsx`
- **State**:
  - `courses`: Courses owned by Dr. Ravi Menon.
  - `materials`: Educational files with course association, size, format, and download counts.
  - `assessments`: Created quizzes and assignments with deadlines and submission stats.
  - `submissions`: Trainee test submissions awaiting review.
  - `trainees`: Trainees assigned to Dr. Ravi Menon's classes.
  - `feedback`: Student reviews with ratings and sentiments.
  - `notifications`: Alerts for submissions and announcements.
- **Actions**: `addCourse`, `updateCourse`, `deleteCourse`, `addMaterial`, `deleteMaterial`, `createAssessment`, `gradeSubmission`, `replyFeedback`.

### 6.3 `TraineeDataContext.tsx`
- **State**:
  - `enrolledCourses`: Courses enrolled by Asha Verma with progress percentages and completed lesson IDs.
  - `assessmentAttempts`: Quiz submissions with scores and pass/fail states.
  - `uploadedEvidence`: Certificates uploaded during onboarding or profile editing.
  - `competencies`: Personal score ratings across meteorological domains.
  - `completedCourses`: Courses finished with certificate issuance.
- **Actions**: `enrollCourse`, `markLessonComplete`, `submitAssessment`, `addEvidence`, `updateProfile`.

---

## 7. Styling, Typography & Design Tokens

### Typography
- **Primary Font**: `Plus Jakarta Sans` imported via Google Fonts in `index.html` across weights 300, 400, 500, 600, 700, 800.
- **Tailwind v4 Integration**:
  ```css
  @theme {
    --font-sans: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  ```

### Color Palette
- **Deep Navy / Charcoal Accent**: `#181c24` (used for primary action buttons, dark pill badges, active stepper steps).
- **Surface Neutral**: `#ffffff` (cards, dialogs), `#fafbfc` (page background), `#f1f5f9` (subtle dividers).
- **Border Neutral**: `border-slate-200/90`, `border-slate-300`.
- **Status Colors**:
  - Verified / Active: `bg-[#e7f7ee] text-[#15803d]` (emerald green).
  - In Progress / Pending: `bg-[#fff1e0] text-[#b45309]` (amber).
  - Flagged / Failed: `bg-[#fde8ea] text-[#b91c1c]` (ruby red).

---

## 8. Development & Maintenance Guidelines for Agents

1. **Strict Non-Destructive Editing**:
   - Never remove or overwrite existing functional tabs, role switchers, or contextual state stores.
   - Do not add new buttons to the sidebar unless explicitly instructed; contextual actions (e.g., "+ Create course") should reside within their respective page headers.
2. **Layout Consistency**:
   - Multi-step modal or wizard flows (such as `TraineeSetupModal.tsx`) must preserve a centered, expanded desktop width (e.g. `max-w-[680px]`) with unified left and right alignment.
   - Avoid applying raw asymmetric inline negative margins (`marginLeft: -50px`); use responsive Tailwind container widths (`w-full`, `max-w-*`) with uniform auto margins (`mx-auto`).
3. **Verification**:
   - Always run `npm run lint` (`tsc --noEmit`) and `npm run build` (`vite build`) after introducing changes to ensure 100% clean type compilation and asset resolution.
