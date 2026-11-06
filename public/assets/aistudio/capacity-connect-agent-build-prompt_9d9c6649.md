# MASTER BUILD PROMPT: Capacity Connect (Browser-Only, SQLite, Production-Grade)

> Paste this whole document to the AI coding agent. Read `instruction.md` (architecture manual) and view the images in `public/assets/aistudio/` (design boards) before writing code.

---

## 0. ROLE AND MISSION

You are a senior full-stack engineer. Take the existing **Capacity Connect** front-end (React 19 + TypeScript + Vite 8 + Tailwind v4, described in `instruction.md`) and make it a **fully functional, production-behaving application that runs entirely in the browser**, with **no server and no backend**.

- All data lives in a real **SQLite 3 database running in the browser** (WebAssembly), persisted durably in the browser's private file system.
- **Do NOT use `localStorage` or `sessionStorage` for any application data.** Zero. All state, sessions, preferences, drafts and files go in SQLite.
- **Do NOT ship fake or mock business data.** KPI cards, charts, tables, feeds and badges must show **real values computed from the database**. A fresh install shows honest empty states and zeros. (See section 6 for the only data allowed at bootstrap.)
- The app must behave like a real production LMS: validation, permissions, transactions, audit trail, error handling, loading and empty states, accessibility and responsiveness.

---

## 1. NON-NEGOTIABLE RULES

1. **Non-destructive**: keep every existing screen, tab, sidebar item, role switcher, `Screen` state machine entry, and the three Context stores (`AdminDataContext`, `TrainerDataContext`, `TraineeDataContext`). Keep their exported hook names and action names (`approveUser`, `addCourse`, `enrollCourse`, etc.). Re-implement them on top of the database layer.
2. **No new sidebar buttons.** Contextual actions live in page headers (for example "+ Create course").
3. **Layout consistency**: multi-step flows stay centered (`max-w-[680px] mx-auto` for the trainee setup). No negative inline margins.
4. **Design tokens**: keep IMD styling (`#181c24` navy, Plus Jakarta Sans, status colors from the manual). The LearnHub design boards are used **only** as reference for the *course player / reading experience* (lesson types, notes, bookmarks, discussion, progress, certificate). Do not copy their purple branding. **Do not build payments or checkout**; enrollment is free.
5. **Every phase must end with `npm run lint` (tsc --noEmit) and `npm run build` passing with zero errors**, plus the phase's tests green.
6. No external network calls at runtime (no CDNs for data, no analytics, no AI APIs). Fonts may stay on Google Fonts, with a system-font fallback.
7. All SQL is **parameterized**. Never concatenate user input into SQL.
8. Never claim a feature is done without running it. Include tests (section 14).

---

## 2. TECHNOLOGY ADDITIONS

| Concern | Choice |
|---|---|
| SQLite engine | `@sqlite.org/sqlite-wasm` (official SQLite 3 WASM build, includes FTS5, JSON1, window functions) |
| Persistence | **OPFS SAHPool VFS** (`installOpfsSAHPoolVfs`), which needs no COOP/COEP headers. Fallback described in section 3.4 |
| Execution model | **One dedicated Web Worker owns the DB.** The domain/service layer also runs **inside the worker** so multi-statement transactions are atomic and synchronous |
| UI to worker RPC | `comlink` (typed proxy) |
| Client cache | `@tanstack/react-query`, with query keys per entity, invalidated by worker-emitted change events |
| Validation | `zod` (shared schemas used by the forms and the worker services) |
| Crypto | WebCrypto: PBKDF2-SHA256 (210k iterations, per-user 16-byte salt) for passwords, SHA-256 for certificate hashes, `crypto.randomUUID()` for IDs |
| Rich text sanitizing | `dompurify` |
| Charts | `recharts` |
| PDF | `jspdf` (certificates, exports) |
| CSV | `papaparse` (export and import) |
| Dates | `date-fns` |
| Drag and drop | `@dnd-kit/core` + `@dnd-kit/sortable` |
| Tests | `vitest` (services against in-memory SQLite in Node), `@testing-library/react`, `playwright` (E2E) |

Vite config: exclude `@sqlite.org/sqlite-wasm` from `optimizeDeps`, set `worker.format = 'es'`, and make sure the `.wasm` asset is copied by `vite build`. Keep Tailwind v4 plugin as is.

---

## 3. DATABASE ARCHITECTURE

### 3.1 Layers (all inside `src/db/` and `src/services/`)

```
src/
  db/
    worker.ts            # worker entry: opens DB, exposes API via Comlink
    client.ts            # main-thread proxy + React Query integration
    connection.ts        # open/close, PRAGMAs, VFS selection, fallback
    migrations/          # 0001_init.sql, 0002_*.sql ... applied by PRAGMA user_version
    migrate.ts           # ordered, transactional, idempotent migration runner
    sql.ts               # helpers: run, get, all, tx(fn), placeholders
    backup.ts            # export/import .sqlite, auto snapshots
    bootstrap.ts         # first-run reference data only (section 6)
  services/              # domain logic, runs in worker, one file per aggregate
    auth.service.ts  users.service.ts  courses.service.ts  enrollments.service.ts
    lessons.service.ts  assessments.service.ts  grading.service.ts
    materials.service.ts  feedback.service.ts  announcements.service.ts
    notifications.service.ts  competency.service.ts  certificates.service.ts
    mentors.service.ts  discussions.service.ts  analytics.service.ts
    rbac.service.ts  audit.service.ts  outbox.service.ts  chatbot.service.ts
    settings.service.ts
  shared/                # zod schemas, types, constants shared by UI and worker
```

### 3.2 PRAGMAs on every open

`PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL` (or `DELETE` if the VFS rejects WAL; detect and log); `PRAGMA synchronous=NORMAL; PRAGMA busy_timeout=5000; PRAGMA user_version` for migrations. Run `PRAGMA integrity_check` at startup in the background and surface a failure through the recovery flow (3.5).

### 3.3 Schema (create as migration `0001_init.sql`)

Use `TEXT` UUID primary keys, `INTEGER` unix-ms timestamps (`created_at`, `updated_at`), `CHECK` constraints for enums, `ON DELETE` rules chosen deliberately (cascade for owned children, restrict/set-null for references), and indexes on every foreign key and every filter or sort column.

| Table | Key columns and constraints |
|---|---|
| `users` | id, role CHECK(admin/trainer/trainee), first_name, last_name, email UNIQUE COLLATE NOCASE, password_hash, password_salt, station, division, designation, status CHECK(pending/active/rejected/suspended), email_verified_at, profile_complete INT, avatar_file_id, last_login_at |
| `trainee_profiles` | user_id PK/FK, highest_qualification, experience_years, interests JSON, skills JSON, diagnostic_score, diagnostic_completed_at |
| `trainer_profiles` | user_id PK/FK, bio, specializations JSON, credentials JSON, department |
| `sessions` | id, user_id, created_at, expires_at, last_seen_at, remember INT, revoked INT. The active session id lives in `app_kv` |
| `app_kv` | key PK, value JSON, for current_session_id, db_installed_at, feature flags |
| `user_preferences` | user_id, key, value JSON (sidebar collapsed, reader font size/theme, etc.) |
| `password_resets` | id, user_id, token_hash, expires_at, used_at |
| `roles`, `permissions`, `role_permissions` | RBAC matrix (roles: admin, trainer, trainee, editor, viewer). `users.role` is the base role, and `user_extra_roles(user_id, role_id)` allows additional roles |
| `categories` | id, name UNIQUE, slug |
| `courses` | id, owner_id FK users, title, slug, category_id, level CHECK, language, short_description, description, thumbnail_file_id, objectives JSON, tags JSON, duration_minutes, status CHECK(draft/pending_review/published/rejected/archived), visibility CHECK(public/hidden), rejection_reason, published_at, reviewed_by, reviewed_at, prerequisites JSON |
| `modules` | id, course_id FK CASCADE, title, position (unique per course) |
| `lessons` | id, module_id FK CASCADE, title, type CHECK(video/reading/code_lab/document/quiz/assignment), content_html, video_url, code_starter, duration_minutes, position, competency_tag_id |
| `lesson_resources` | id, lesson_id FK CASCADE, file_id FK |
| `files` | id, owner_id, name, mime, size, sha256, created_at |
| `file_blobs` | file_id PK/FK CASCADE, data BLOB. Cap 10 MB per file, enforced in the service |
| `materials` | id, course_id FK, file_id FK, uploaded_by, download_count, created_at (the Course Library) |
| `enrollments` | id, trainee_id, course_id, UNIQUE(trainee_id, course_id), status CHECK(active/completed/dropped), started_at, last_lesson_id, completed_at |
| `lesson_progress` | enrollment_id, lesson_id, completed_at, PK(enrollment_id, lesson_id) |
| `lesson_notes` | id, enrollment_id, lesson_id, body, updated_at |
| `bookmarks` | id, enrollment_id, lesson_id, label, created_at |
| `discussions`, `discussion_replies`, `discussion_likes` | per-lesson Q&A threads, with an instructor flag and an "answered" flag |
| `assessments` | id, course_id, title, description, time_limit_minutes, pass_mark_percent, attempts_allowed, opens_at, due_at, status CHECK(draft/live/closed), is_final INT, shuffle INT |
| `questions` | id, assessment_id FK CASCADE, type CHECK(mcq/multi/true_false/short_answer), prompt, points, position, explanation, competency_tag_id, `options` and `correct_answers` as JSON |
| `attempts` | id, assessment_id, trainee_id, attempt_no, status CHECK(in_progress/submitted/graded), started_at, ends_at, submitted_at, auto_score, manual_score, total_score, passed INT, feedback |
| `attempt_answers` | attempt_id, question_id, answer JSON, flagged INT, awarded_points, trainer_comment, PK(attempt_id, question_id) |
| `diagnostic_questions` | the onboarding diagnostic bank (reference data) |
| `competency_frameworks`, `competencies` | WMO and IMD framework: id, code, name, description, benchmark_percent |
| `trainee_competency` | trainee_id, competency_id, score_percent, source, updated_at |
| `certificates` | id, trainee_id, course_id UNIQUE together, certificate_no UNIQUE, verification_hash UNIQUE, issued_at |
| `feedback` | id, enrollment_id UNIQUE, rating 1..5, comment, sentiment CHECK(positive/neutral/constructive), reply, replied_at |
| `announcements` | id, title, body, audience CHECK(all/trainers/trainees), priority CHECK(official/operational), publish_at, status CHECK(draft/scheduled/published), pinned INT, banner_file_id, created_by |
| `mentors`, `mentor_slots`, `mentor_bookings` | slot UNIQUE for a booking, so double-booking is blocked by the DB |
| `notifications` | id, user_id, category, title, body, link_screen, link_params JSON, read_at, created_at |
| `outbox` | id, to_email, subject, body_html, kind, created_at, opened_at (the simulated inbox) |
| `audit_log` | id, actor_id, action, entity, entity_id, meta JSON, created_at (append-only, with triggers blocking UPDATE and DELETE) |
| `settings` | key PK, value JSON (session timeout, email footer, institution name, etc.) |
| `search_index` | FTS5 virtual table over courses, lessons, materials and announcements, kept in sync by triggers |

Create **views** for aggregations used by dashboards (`v_course_stats`, `v_trainee_progress`, `v_assessment_stats`) and **triggers** for: `updated_at` maintenance, FTS sync, audit append-only protection, and keeping `enrollments.status` consistent when the last lesson is completed.

### 3.4 Persistence and fallback

1. On boot the worker tries OPFS SAHPool. Call `navigator.storage.persist()` and show a one-time prompt explaining why.
2. **Fallback** if OPFS is unavailable: run in-memory SQLite and snapshot the whole DB (`sqlite3_js_db_export`) into **IndexedDB** after each committed mutation (debounced 1s and on `visibilitychange`). Show a persistent non-blocking banner: "Running in compatibility mode."
3. **Single-writer rule**: SAHPool allows one connection. Use **Web Locks** (`cc-db-owner`). A second tab shows a clear full-screen notice ("Capacity Connect is already open in another tab") with a "Retry" button, and takes over automatically when the lock frees. Use `BroadcastChannel` so the owning tab can tell other tabs to refresh.
4. **Backups**: Admin to Settings has "Export database (.sqlite)", "Import database" (validates the file header and `user_version`, takes an automatic backup snapshot first, then swaps), and an automatic rolling snapshot (last 3) before each migration.

### 3.5 Recovery and errors

If open, migration or integrity check fails, show a recovery screen with options: retry, export raw file if possible, restore the last automatic snapshot, or wipe and start fresh (typed confirmation). Wrap the app in an Error Boundary with a "Copy diagnostics" action. Every service call returns `{ok:true,data}` or `{ok:false,error:{code,message,fields?}}`. Never throw raw errors to the UI.

---

## 4. CROSS-CUTTING ENGINES (implement first, in `src/services/` and `src/shared/`)

1. **Auth and session**: PBKDF2 hashing. Login rate limiting (5 failures leads to a 5-minute lockout, tracked in DB). Sessions in the `sessions` table with idle timeout from `settings` (default 30 min, warn 60s before) and absolute expiry (24h, or 30 days if "Remember me"). Revoke on logout and on password change.
2. **RBAC**: `can(userId, permission)` and `assertCan()` enforced **in the service layer**, never UI-only. The UI uses a `usePermission()` hook to hide or disable controls. Permissions: `course.create`, `course.approve`, `grading.grade`, `user.manage`, `announcement.manage`, `system.config`, `analytics.view`, `library.upload`, `role.manage`. Guard: the last active admin cannot be demoted, suspended or deleted.
3. **Route guard**: `canAccess(screen, user)`. Pending goes to `pending-approval`, wrong role goes to `access-denied`, trainee with `profile_complete=0` is forced to `trainee-setup`, and `trainee-take-assessment` requires a live in-progress attempt. Keep the `Screen` state machine and **mirror it to `location.hash`** so refresh and deep links restore the position.
4. **Audit**: every mutation writes `audit_log` in the same transaction.
5. **Notifications**: written by services inside the transaction, with unread counts and mark-one and mark-all-read.
6. **Outbox (simulated email)**: verification, approval, rejection and reset emails are inserted into `outbox`. `EmailModal` reads it. The reset token appears only inside the email link, and only its hash is stored.
7. **Scheduler**: a worker interval (every 30s while the app is open, and once on boot) that publishes `scheduled` announcements whose `publish_at` has passed, closes assessments past `due_at`, auto-submits expired attempts, and generates deadline reminders (24h before).
8. **Search**: FTS5 queries with prefix matching and ranking, used by catalog and library search.
9. **Toast**: `showToast()` exactly as specified in the manual, with types (success, error, info), stacked, dismissible.
10. **Files**: upload via `File.arrayBuffer()` to `files` + `file_blobs`. Validate MIME and extension against an allowlist (pdf, png, jpg, pptx, xlsx, docx, zip, mp4, csv). Cap 10 MB each and show a total storage meter (use `navigator.storage.estimate()`). Downloads via `Blob` and object URL, and revoke the URL afterward.
11. **Competency engine**: each question and lesson can carry a competency tag. Diagnostic results seed `trainee_competency`. Each graded assessment updates affected competencies by a weighted moving average (new = 0.7*old + 0.3*assessment_score for that tag, clamped 0..100). Gap = benchmark minus score.
12. **Recommendation engine**: rank published, unenrolled courses by overlap with the trainee's lowest-scoring competencies, then by level fit.
13. **Certificate engine**: issue exactly once per (trainee, course) when every lesson is complete AND the final assessment (if any) is passed. `certificate_no` format `IMD-CC-YYYY-000001` (sequence from DB). `verification_hash` = SHA-256 of `certificate_no|trainee_id|course_id|issued_at`. A "Verify certificate" modal accepts a hash and checks the DB. PDF generated with jsPDF.
14. **Chatbot engine**: deterministic intent matching (keywords and quick-prompt chips) that answers by **running real read-only queries** for the current user's role (examples: trainee "my pending assessments", "what is my weakest competency"; trainer "who has not started course X", "pending grading count"; admin "pending approvals", "completion rate this month"). Unknown intents get a helpful fallback listing supported questions. No external API.
15. **Table hook**: `useTable()` giving server-side style search, filter, sort and pagination through SQL (`LIMIT/OFFSET`, `COUNT(*)`), used by every list.

---

## 5. KPI AND ANALYTICS RULE (important)

Every number shown anywhere (dashboard KPI cards, announcement banner metrics, trainer stats, analytics charts, competency radar, progress rings) **must come from a SQL query**. Examples:

- Admin: Enrolled Trainees = `COUNT(users WHERE role='trainee' AND status='active')`; Certified Trainers; Active Courses = published count; Pending approvals; Certificates issued; Audit events in last 30 days.
- Replace "98.4% Platform Uptime" with a **real** metric: *Storage used / available* from `navigator.storage.estimate()`, or *Database health* (last integrity check result). Do not invent uptime.
- Trainer: Active Courses, Total Enrolled, Pending Reviews (submissions awaiting grading), Average Pass Rate, all from the DB for that trainer.
- `LibraryAnnouncementBanner` metrics (Duty Officers Enrolled, Divisional Readiness) are computed (active trainees, and share of active trainees with profile complete and at least one completed course, by division). Show "No data yet" when the denominator is 0, and never fabricate a percentage.
- Empty state for every card, table, chart and feed, with a short explanation and the primary call to action (for example "No courses yet. Create your first course").
- Charts show an empty-state illustration when there is no data. No placeholder series.

---

## 6. BOOTSTRAP DATA (the only data allowed to pre-exist)

On first run (empty DB) the app runs `bootstrap.ts` inside a transaction and inserts **reference and configuration data only**:

- RBAC: roles, permissions, default role-permission matrix
- Course categories (Meteorology, Radar, Satellite, Numerical Models, Cyclone Tracking, Instrumentation, Agrometeorology, Climatology)
- The competency framework (WMO/IMD-aligned competency codes, names and benchmark percentages)
- Diagnostic question bank for onboarding (at least 15 meteorology questions across the framework, each with a competency tag and an explanation)
- Default `settings`

**First-run setup screen**: when no admin exists, show an "Initial setup" screen to create the Super Admin (name, email, password with strength rules). This is the only way to create the first admin. No hardcoded credentials in the shipped build.

**Developer-only tools** (visible **only** when `VITE_ENABLE_DEV_TOOLS=true`, off in production builds): the "Quick Demo Login" role badges from the manual (they create or reuse fixture accounts for Admin, Dr. Ravi Menon, Asha Verma), a "Simulate admin instant approval" button on the pending screen, and "Generate sample data" (clearly labelled, for QA and E2E tests). With the flag off, none of these exist in the bundle's UI.

---

## 7. CROSS-PORTAL FLOWS (each must work end to end, transactionally)

1. **Registration**: Sign-up validates (zod, unique email, `@imd.gov.in` domain for staff, password rules with live strength meter). Creates `pending` user, queues a verification email to the outbox, goes to `pending-approval`, which watches status via change events. The admin approves or rejects (with reason), which emails the user and notifies them. Rejected users see the reason on login.
2. **Login**: credential check, status check, lockout, session creation, route by role. Trainee with an incomplete profile goes to `trainee-setup`.
3. **Password recovery**: Forgot password creates a 30-minute single-use token, writes an outbox email, "Open Simulated Email Inbox" opens `EmailModal`, the reset link validates the token, the live checklist enforces 8+ characters with upper, lower, digit and symbol, then the password updates and all sessions are revoked.
4. **Onboarding (4 steps)**: Step 1 profile and chips (persisted as a draft per step so a refresh resumes). Step 2 evidence upload (real files, status `Pending` then `Verified` by an admin action in the trainee detail drawer; the UI shows the true status). Step 3 timed diagnostic (timestamp-based timer, resumes after refresh, auto-submit). Step 4 results computed by the engine, recommendations from the engine, "Complete profile & enter portal" sets `profile_complete=1`.
5. **Course lifecycle**: Trainer wizard saves a `draft` (autosave every 10s, resume draft). "Publish" validates completeness (title, at least 1 module, at least 1 lesson, thumbnail, objectives) and sets `pending_review`, which notifies admins. The admin approves (`published`, visible in the catalog) or rejects with a reason (trainer notified, status `rejected`, editable and resubmittable). Courses with enrollments cannot be deleted, only archived.
6. **Enrollment**: Catalog, Detail, "Confirm Enrollment" creates the enrollment (checks published, not already enrolled, prerequisites met) and notifies the trainer.
7. **Learning**: Opening a lesson sets `last_lesson_id`. "Mark Lesson Complete" toggles `lesson_progress` and recalculates progress as `completed/total`. Progress above 0 unlocks the Library for that course. At 100% the final assessment unlocks. Passing it issues the certificate and prompts for feedback.
8. **Assessment**: Start (checks live, window open, attempts left) creates an `attempt` with `ends_at` and opens the fullscreen runner. Every answer or flag is written to `attempt_answers` immediately (autosave). Submit confirm, then auto-score MCQ, multi and true/false. If short-answer questions exist the attempt stays `submitted` until the trainer grades; otherwise it becomes `graded` and the result page is shown. Grading updates the total, `passed`, competencies, notifies the trainee, and issues the certificate if conditions are met.
9. **Feedback loop**: the trainee rating (once per enrollment, editable for 7 days) goes to the trainer feedback page with sentiment derived from rating plus keywords. The trainer reply notifies the trainee.
10. **Announcements**: the admin creates, with audience, priority, schedule and pin. Published ones appear in the `LibraryAnnouncementBanner` carousel (`n of N`, pinned first) for the matching audience, and generate notifications. The "Operational Bulletin (PDF)" button generates a real PDF from the announcement.
11. **RBAC change**: the admin edits the matrix or reassigns a user's role, which is applied immediately to the guards and the UI (the affected user's next call is checked live).

---

## 8. PORTAL-LEVEL REQUIREMENTS

### Trainee
- **Dashboard**: streak (consecutive days with `lesson_progress` or attempt activity), resume card (last lesson), upcoming deadlines (sorted, overdue highlighted), in-progress courses, recommended courses, announcement preview. All computed.
- **Catalog**: FTS search, category, level, enrolled-state filters, sort, pagination. **Detail**: syllabus tree, prerequisites, instructor bio, hours, "Confirm Enrollment".
- **Course Player** (use the design boards for layout): lesson types **video** (`HeroVideoDialog`, YouTube embed via `youtube-nocookie.com`), **reading** (table of contents "On this page", font size and light/dark reader toggle persisted in `user_preferences`), **code lab** (editable code, Copy, Run inside a sandboxed `iframe` with `sandbox="allow-scripts"` and no same-origin), **document** (preview/download), **quiz** (inline knowledge check, scored, retry), **assignment** (file upload plus submit state, graded by the trainer). Previous/Next respects module boundaries, the collapsible syllabus sidebar (X button, state persisted), progress bar, tabs for Overview, Resources, Notes, Discussion (auto-saved notes, bookmarks list with jump, Q&A with replies and likes), "Course Library" button jumping to the filtered library.
- **Library**: progress gating (locked state with enroll or start CTA), real downloads increment `download_count`, file preview for PDF and images.
- **Assessments list**: Pending, In-Progress, Completed filters, derived from DB. **Runner**: timer, palette 1..N, flagging, autosave, submit dialog showing unanswered and flagged counts. **Result**: score, grade, pass/fail, question review with explanations (only after submission, and only the user's own).
- **Competency**: radar and matrix with benchmark overlay from the engine. **Mentors**: availability slots, booking with conflict protection, cancel up to 2 hours before, shown on dashboard. **Certificates**: list, PDF download, copy verify link, verify-by-hash. **Profile**: editable and validated, avatar upload, evidence management. **Notifications** and **Chatbot drawer**.

### Trainer
- **Dashboard**: live KPIs, recent submissions table with "Grade Submission" deep-link, engagement trend (last 8 weeks), recent feedback.
- **Courses**: list with status badges, counts and completion rates, "+ Create course" launching the 3-step wizard.
- **Wizard**: Step 1 details (validation, 16:9 thumbnail upload with crop preview, objectives list, tags chips). Step 2 structure (dnd-kit tree: modules and lessons reorder, type selector, rich text editor with Bold, Italic, bullets, links, code, sanitized by DOMPurify; resource attachments with download and delete). Step 3 review with completeness checklist, "Publish Course" and "Save as Draft".
- **Library**: files grouped under course cards, upload modal (assign course, validation, progress), delete with confirm, search and type filter.
- **Assessments**: cards with real submission rate, pass rate, average. Builder for MCQ, multi, true/false and short answer, with point totals and validation (at least 1 correct option, no empty prompts), Draft to Live toggle (live assessments with attempts become read-only for questions). Submissions drawer with per-question manual grading and feedback; totals recalculate.
- **Trainees**: roster computed from enrollments, with progress, average score, last active, flagged gaps, CSV export. **Feedback**: filters by rating and sentiment, inline reply. **Profile**, **Notifications** (tabs: Announcements, Submissions, System), **Chatbot drawer**.

### Admin
- **Dashboard**: live KPI cards (section 5), audit-log activity feed (paginated), quick actions.
- **Courses**: approve, reject with reason, hide, unpublish, enrollment view. **Trainers / Trainees**: directories with approve/reject pending, suspend and reactivate, evidence verification, filters (division, status), detail drawer, CSV export, CSV import of users (validated, with a dry-run preview).
- **Role Management**: matrix toggles, enforced everywhere, and role reassignment modal. **Announcements**: full CRUD, schedule, pin, audience, banner upload.
- **Analytics**: completion over time, division compliance, score distribution, enrollments per course, all from SQL with date-range filter and CSV export. **Competency**: editable framework (add, edit, benchmark %), changes recompute gaps. **Settings**: session policy, institution info, outbox viewer, audit-log CSV download, storage meter, export/import database, "Reset all data" (typed confirmation, requires admin password). **Chatbot drawer**.

---

## 9. UX AND PRODUCTION QUALITY BAR

- Skeleton loaders for async queries, spinners and disabled states on every submit, double-submit prevention.
- Inline field-level validation errors from zod, with focus moved to the first invalid field.
- Confirmation dialogs for every destructive action. Undo toast where cheap (for example unbookmark).
- Accessibility: WCAG 2.1 AA targets, focus trap and Escape in modals, `aria-live` for toasts, labelled form controls, visible focus rings, radio groups and question palette navigable by keyboard, color is never the only status signal.
- Responsive from 360px to 1920px. The runner and player must work on tablets.
- Code splitting per portal with `React.lazy` and Suspense, and the SQLite worker loaded once.
- Sanitize all rich text output. Never use `dangerouslySetInnerHTML` without DOMPurify.
- Content Security Policy meta tag appropriate for the app (allow `worker-src 'self' blob:`, `script-src 'self' 'wasm-unsafe-eval'`, `frame-src https://www.youtube-nocookie.com`).
- Consistent date and number formatting for India (`en-IN`), timezone from the browser.

---

## 10. EDGE CASES THAT MUST BE HANDLED

Duplicate email on sign-up (case-insensitive). Expired, reused or tampered reset tokens. Refresh mid-assessment (timer and answers restore). Browser closed mid-assessment (auto-submit on next open if `ends_at` passed). Double submit. Attempts exhausted. Assessment past due. Editing a live assessment that has attempts. Deleting a course with enrollments (blocked, archive). Last-admin protection. Role downgrade while the user is logged in. Two tabs open (lock screen). Storage quota exceeded (clear error, storage meter, no corrupted state). Upload larger than the cap or wrong type. Migration failure (rollback, snapshot restore). Clock changes (never trust only client ticks, always compare against `ends_at` and `expires_at`). Concurrent writes inside the worker (serialized by the single connection, with transactions kept short). Importing a DB with a higher `user_version` (refuse with a clear message).

---

## 11. PHASED DELIVERY (do them in order; after each phase run lint, build and tests; report results before continuing)

**Phase 1: Data foundation.** Worker, SQLite WASM, OPFS SAHPool plus IndexedDB fallback, Web Locks, migration runner, full schema (3.3), triggers and views, `sql.ts` helpers, Comlink client, React Query integration, error and recovery screens, bootstrap reference data, first-run admin setup, backup export/import. *Done when:* data survives refresh and a browser restart, migrations are idempotent, the second-tab lock works.

**Phase 2: Cross-cutting engines.** Auth, sessions, rate limit, RBAC, audit, notifications, outbox, scheduler, toasts, route guard with hash sync, file service, `useTable`. *Done when:* the unit tests for each service pass.

**Phase 3: Auth screens.** Sign-in, sign-up, pending approval, forgot, check-email, reset, `EmailModal`, access-denied. Dev-only quick login and instant approval behind the flag.

**Phase 4: Admin core.** Layout, dashboard KPIs from SQL, approvals, users, roles/permissions matrix (enforced), announcements, settings including backup and import.

**Phase 5: Trainer.** Wizard (autosave, dnd, rich text), courses, publish-for-review, admin review, library with uploads.

**Phase 6: Trainee learning.** Setup wizard with the diagnostic, catalog, detail, enrollment, player (all lesson types, notes, bookmarks, discussion), progress, library gating.

**Phase 7: Assessments and grading.** Builder, runner, autosave, auto-scoring, manual grading, results, competency engine, recommendations.

**Phase 8: Completion and engagement.** Certificates (PDF and verify), feedback and replies, mentors, notifications pages, all three chatbot drawers.

**Phase 9: Analytics, hardening and QA.** Analytics and competency admin pages, accessibility pass, performance pass (index review with `EXPLAIN QUERY PLAN` on the heaviest queries), edge-case checklist (section 10), full E2E suite, README.

---

## 12. FINAL ACCEPTANCE (Playwright E2E must pass in a fresh browser profile)

1. Fresh install: first-run setup creates the admin. Every dashboard shows zeros and empty states (no fake numbers).
2. A new trainer signs up, the admin approves, the trainer logs in.
3. The trainer builds a course (2 modules, mixed lesson types, a resource file, a final assessment with MCQ and short answer) and publishes it. The admin rejects it with a reason, the trainer fixes and resubmits, the admin approves.
4. A new trainee signs up, gets approved, completes onboarding (profile, evidence, diagnostic). Competencies and recommendations appear.
5. The trainee enrolls, completes lessons (Library unlocks), takes notes, bookmarks, and posts a discussion question, which the trainer answers.
6. The trainee takes the final assessment (with a refresh in the middle). MCQ is auto-scored, and the trainer grades the short answer. Result, competency update and certificate appear and the PDF downloads. The verify-by-hash modal confirms it.
7. The trainee leaves feedback, and the trainer replies.
8. The admin sees accurate KPIs, analytics and audit entries for all of the above, and the announcement published by the admin shows in both libraries.
9. Revoking a permission in the matrix immediately blocks the corresponding action server-side (service layer), not just in the UI.
10. Export the database, wipe, import it back, and everything is intact.
11. `npm run lint`, `npm run build`, `vitest` and `playwright` all pass. `localStorage` and `sessionStorage` contain no application data (assert in a test).

---

## 13. DELIVERABLES

- Working source following section 3.1's structure and the existing `instruction.md` layout.
- An updated `instruction.md` (new "Data layer" section replacing the "in-memory context stores" language, documenting schema, services, flags, and persistence modes).
- `README.md` with setup, scripts, env flags (`VITE_ENABLE_DEV_TOOLS`), browser support matrix, backup and recovery guide.
- `docs/schema.md` with an ER overview and a migration policy.
- Test suites (unit, component, E2E) and a short `docs/qa-checklist.md`.

## 14. TESTING REQUIREMENTS

- **Unit (vitest, Node, in-memory SQLite WASM)**: migrations, each service's happy path and permission failures, scoring engine, progress engine, competency engine, certificate issuance exactly-once, scheduler, RBAC last-admin rule, lockout, token expiry.
- **Component**: sign-up validation, wizard step validation, assessment runner (timer restore and autosave), player navigation.
- **E2E (playwright)**: section 12 as one scripted journey, plus a refresh-mid-assessment test and a two-tab lock test.

Begin with Phase 1. Before coding, reply with a brief plan listing the files you will create, the exact package versions you will install (pin versions at least two weeks old), and any assumption you are making. Then proceed phase by phase, reporting after each.
