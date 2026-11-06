# Unified Portal Data Architecture & Admin Profile Approval Gating

Build a synchronized, shared data foundation across the entire Capacity Connect platform so that all courses, trainees, trainers, and registration requests remain 100% consistent across Admin, Trainer, and Trainee portals, while enforcing strict Admin approval gating before newly registered Trainers and Trainees can access dashboards and learning resources.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during clarification:
> - **Gating Policy**: Newly registered Trainer and Trainee profiles must require explicit Admin approval before gaining access to their dashboards and learning resources. Unapproved accounts remain in the pending state.
> - **Data Synchronization**: Implement a real-time synchronized data store connecting Admin, Trainer, and Trainee portals so courses created by trainers immediately appear in Admin and Trainee course catalogs, and approved profiles populate relevant rosters.

- **Confirmed Decision 1**: Both Trainer and Trainee registration requests map directly to the Admin `RoleManagementPage` and Admin `DashboardPage` approval queue.
- **Confirmed Decision 2**: Courses created in the Trainer Wizard (`TrainerCreateCourseWizard`) propagate instantly to the Admin Course Directory (`CoursesPage`) and the Trainee Course Catalog (`TraineeCourseCatalogPage`).

---

## 1. Overview & Core Concept

- **What It Does**: Unifies the disparate context data layers (`AdminDataContext`, `TrainerDataContext`, `TraineeDataContext`) into a synchronized common state engine. Enforces administrative verification as a hard gatekeeper for all newly registered officers (Trainers and Trainees).
- **Target Audience / Personas**:
  - **Administrators**: Review and 1-click approve/reject incoming Trainer and Trainee registration requests with full role, station, and credential visibility.
  - **Trainers (e.g. Dr. Ravi Menon)**: Author new specialized courses and modules that instantly sync to the Directorate course catalog.
  - **Trainees (e.g. Asha Verma)**: Undergo onboarding verification; discover real-time courses published by faculty.
- **Key Value**: Eliminates data discrepancies between portals, establishes operational security with mandatory government identity approval, and ensures seamless data consistency without page reloads.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Registration & Gatekeeping Flow**:
   - User navigates to Sign Up (`SignUpScreen.tsx`) and selects role: **Trainee** (Officer) or **Trainer** (Faculty).
   - Upon submitting registration details (Name, Official Email `@imd.gov.in`, Station/Division), account is created with `status: 'Pending'`.
   - The user is automatically transitioned to `PendingApprovalScreen.tsx` with a live visual badge stating `"Under Review by IMD Training Directorate"`.
   - If an unapproved user attempts to sign in via `SignInScreen.tsx`, the system detects their pending status and halts navigation at `pending-approval`, preventing unauthorized dashboard entry.

2. **Admin Verification & 1-Click Activation Flow**:
   - In `AdminPortal` (`DashboardPage.tsx` quick approval widget and `RoleManagementPage.tsx`), the incoming request appears with role badge (`Trainer` vs `Trainee`), station, email, and submission timestamp.
   - Admin reviews and clicks **Approve** (or **Reject**):
     - On approval, the user's status transitions to `'Approved'`.
     - The user is added to the active `Trainers` or `Trainees` roster automatically.
     - The pending user can now log in immediately; Trainees are routed to setup/dashboard, and Trainers are routed to the Trainer Dashboard.

3. **Unified Course Lifecycle Flow**:
   - Dr. Ravi Menon builds a course in `TrainerCreateCourseWizard.tsx` and clicks "Publish Course".
   - The course immediately appears in:
     - **Trainer Courses Page**: with status `Active`, 0 enrolled, full module count.
     - **Admin Courses Page**: under active courses catalog with publishing metrics.
     - **Trainee Course Catalog**: available for student enrollment and syllabus review.
   - Trainee enrollments in the course immediately increment active counts on Trainer and Admin metric cards.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Centralized Bridge Store (`UnifiedDataContext`)**
  - *Chosen Approach*: Create a shared state hub that coordinates between Admin, Trainer, and Trainee contexts, ensuring single-source-of-truth semantics while preserving existing component prop interfaces.
  - *Why*: Guarantees zero regressions to existing specialized sub-features (radar charts, drag-and-drop course wizard, simulated email client) while keeping shared records (courses, users, approvals) strictly synchronized.
  - *Alternatives Considered*: Complete rewrite of all 3 contexts into one monolithic 3,000-line file (risk of breaking persona-specific UI features).

- **Decision 2: Strict Login Authentication & Navigation Guard in `App.tsx`**
  - *Chosen Approach*: Enforce status check in root router `App.tsx` before allowing navigation to `trainer-portal` or `trainee-portal`. If user `status === 'Pending'`, strictly retain on `pending-approval`.
  - *Why*: Meets the user's explicit requirement that unapproved profiles cannot access dashboards or resources.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                      Unified Central Data Hub                          │
│        (Shared Courses, Common Users, Global Approval Queue)           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Bidirectional Synchronization
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│ AdminDataContext │       │TrainerDataContext│       │TraineeDataContext│
│  - User Approval │       │  - Course Wizard │       │  - Course Catalog│
│  - Roster Table  │       │  - Lesson Editor │       │  - Assessments   │
│  - Catalog Audit │       │  - Trainee Roster│       │  - Competency    │
└────────┬─────────┘       └────────┬─────────┘       └────────┬─────────┘
         │                          │                          │
         ▼                          ▼                          ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Root Router Guard                               │
│  • Trainee/Trainer SignUp  --> Stored as 'Pending' in Shared Queue     │
│  • Admin Approval Action   --> Updates Shared State to 'Approved'      │
│  • Access Check            --> Blocks Dashboard until Approved         │
└────────────────────────────────────────────────────────────────────────┘
```

## 5. Dynamic Dashboard Graphs & Application Data Integration (Completed)

1. **Unified Application Data Layer (`UnifiedDataContext.tsx`)**:
   - Seeded comprehensive, realistic institutional data models matching meteorological training specifications:
     - `monthlyEnrollmentTrends`: May through Oct historical enrollment and completion velocity.
     - `divisionParticipations`: Multi-station regional metrics (Delhi HQ, Pune Met Centre, Chennai Coastal, Regional Satellites, Kolkata Doppler Unit, Mumbai Western Met Hub) with zone, share, completion rate, average score, and certified counts.
     - `competencyGaugeData`: Triple concentric rings for Forecasting (72%), Radar Analysis (58%), Cyclone Tracking (49%).
     - `trainerMonthlyTrends`: June through November monthly enrolled and completed cohorts.
     - `traineeMonthlyProgress`: May through October cumulative modules cleared and average scores.
     - `traineeWeeklyEngagement`: Monday through Sunday daily active learning hours (target: 2.0 hrs/day) and specific module topics.
     - `subjectScores`: Benchmark percent scores across key disciplines (Forecast, Climate, Radar, Satellite, NWP).

2. **Admin Portal Data Visualization (`AnalyticsPage.tsx` & `DashboardPage.tsx`)**:
   - Replaced all hardcoded SVG points, static bar heights, and isolated numbers with reactive computations.
   - Dual-line SVG curve in Analytics computed dynamically from `monthlyEnrollments`.
   - Subject score bars rendered dynamically from `subjectScores`.
   - Priority Hubs and Complete Division Metrics tables mapped dynamically over `divisions`.
   - Triple concentric competency gauge in Admin Dashboard computed from `competencyGauge` with dynamic average capacity readout.
   - Monthly enrollment bar chart and Course monitoring table mapped from live application stores.

3. **Trainer Portal Data Visualization (`TrainerDashboardPage.tsx`)**:
   - Monthly dual-column SVG bar visualizer rendered dynamically from `monthlyTrends`.
   - Dynamic hover badge calculating live completion rates for each selected cohort.
   - Performance by Course list dynamically mapped over `courses` with live progress bars and trainee counts.
   - Top 4 KPI metric cards calculated from active courses and trainee roster.

4. **Trainee Portal Data Visualization (`TraineeDashboardPage.tsx`)**:
   - Graph 1: High-modern curved spline line chart with smooth cubic bezier curves and shaded area fill dynamically generated from `monthlyProgress`.
   - Graph 2: Weekly study hours capsule bar chart with 2.0h target line and hover topics calculated from `weeklyEngagement`.
   - Continue Learning table and top metric cards (Completion %, Avg Score %, Active Courses, Due Assessments, Certificates) connected directly to live trainee context.

5. **Verification**:
   - `tsc --noEmit` and Vite build compile cleanly with 0 errors.
   - Strict adherence to existing frontend designs, responsive layouts, and Tailwind design tokens.
