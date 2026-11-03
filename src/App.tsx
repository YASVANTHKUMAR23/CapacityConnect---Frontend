import React, { useState, useEffect } from 'react';
import { Screen, AdminTab, TrainerTab, TraineeTab, UserAccount } from './types';
import { AdminDataProvider } from './context/AdminDataContext';
import { TrainerDataProvider } from './context/TrainerDataContext';
import { TraineeDataProvider } from './context/TraineeDataContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SignInScreen } from './components/screens/SignInScreen';
import { SignUpScreen } from './components/screens/SignUpScreen';
import { ForgotPasswordScreen } from './components/screens/ForgotPasswordScreen';
import { CheckEmailScreen } from './components/screens/CheckEmailScreen';
import { ResetPasswordScreen } from './components/screens/ResetPasswordScreen';
import { PendingApprovalScreen } from './components/screens/PendingApprovalScreen';
import { AccessDeniedScreen } from './components/screens/AccessDeniedScreen';
import { EmailModal } from './components/EmailModal';

// Admin Portal Pages
import { AdminLayout } from './components/admin/AdminLayout';
import { DashboardPage } from './components/admin/DashboardPage';
import { CoursesPage } from './components/admin/CoursesPage';
import { TrainersPage } from './components/admin/TrainersPage';
import { TraineesPage } from './components/admin/TraineesPage';
import { RoleManagementPage } from './components/admin/RoleManagementPage';
import { AnnouncementsPage } from './components/admin/AnnouncementsPage';
import { AnalyticsPage } from './components/admin/AnalyticsPage';
import { CompetencyPage } from './components/admin/CompetencyPage';
import { SettingsPage } from './components/admin/SettingsPage';

// Trainer Portal Pages (Dr. Ravi Menon)
import { TrainerLayout } from './components/trainer/TrainerLayout';
import { TrainerDashboardPage } from './components/trainer/TrainerDashboardPage';
import { TrainerCoursesPage } from './components/trainer/TrainerCoursesPage';
import { TrainerLibraryPage } from './components/trainer/TrainerLibraryPage';
import { TrainerAssessmentsPage } from './components/trainer/TrainerAssessmentsPage';
import { TrainerTraineesPage } from './components/trainer/TrainerTraineesPage';
import { TrainerFeedbackPage } from './components/trainer/TrainerFeedbackPage';
import { TrainerProfilePage } from './components/trainer/TrainerProfilePage';
import { TrainerNotificationsPage } from './components/trainer/TrainerNotificationsPage';

// Trainee Portal Pages (Asha Verma)
import { TraineeLayout } from './components/trainee/TraineeLayout';
import { TraineeDashboardPage } from './components/trainee/TraineeDashboardPage';
import { TraineeCourseCatalogPage } from './components/trainee/TraineeCourseCatalogPage';
import { TraineeMyCoursesPage } from './components/trainee/TraineeMyCoursesPage';
import { TraineeCoursePlayerPage } from './components/trainee/TraineeCoursePlayerPage';
import { TraineeCourseFeedbackPage } from './components/trainee/TraineeCourseFeedbackPage';
import { TraineeAssessmentsPage } from './components/trainee/TraineeAssessmentsPage';
import { TraineeTakeAssessmentPage } from './components/trainee/TraineeTakeAssessmentPage';
import { TraineeAssessmentResultPage } from './components/trainee/TraineeAssessmentResultPage';
import { TraineeCompetencyPage } from './components/trainee/TraineeCompetencyPage';
import { TraineeMentorsPage } from './components/trainee/TraineeMentorsPage';
import { TraineeNotificationsPage } from './components/trainee/TraineeNotificationsPage';
import { TraineeProfilePage } from './components/trainee/TraineeProfilePage';
import { TraineeCertificatesPage } from './components/trainee/TraineeCertificatesPage';
import { TraineeSetupModal } from './components/trainee/TraineeSetupModal';

import { Check, X } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [currentAdminTab, setCurrentAdminTab] = useState<AdminTab>('dashboard');
  const [currentTrainerTab, setCurrentTrainerTab] = useState<TrainerTab>('dashboard');
  const [currentTraineeTab, setCurrentTraineeTab] = useState<TraineeTab>('dashboard');
  const [activeAssessmentId, setActiveAssessmentId] = useState<string>('asmt-1');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [resetEmail, setResetEmail] = useState<string>('asha.verma@imd.gov.in');
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AdminDataProvider>
      <TrainerDataProvider>
        <TraineeDataProvider>
          <div className="min-h-screen text-slate-900 flex flex-col justify-between relative selection:bg-slate-900 selection:text-white">
            {/* Global Toast Notification */}
            {toastMessage && (
              <div className="fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 sm:gap-2.5 bg-slate-900 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-2xl text-[11px] sm:text-xs font-medium max-w-[calc(100vw-2rem)] w-auto animate-in fade-in slide-in-from-top-3 duration-200">
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                <span className="truncate">{toastMessage}</span>
                <button
                  type="button"
                  onClick={() => setToastMessage(null)}
                  className="text-slate-400 hover:text-white ml-1.5 sm:ml-2 cursor-pointer shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* If Trainer Portal is active (Dr. Ravi Menon) */}
            {currentScreen === 'trainer-portal' ? (
              <TrainerLayout
                currentTab={currentTrainerTab}
                onSelectTab={setCurrentTrainerTab}
                onNavigateScreen={handleNavigate}
                showToast={showToast}
              >
                {currentTrainerTab === 'dashboard' && (
                  <TrainerDashboardPage onSelectTab={setCurrentTrainerTab} showToast={showToast} />
                )}
                {currentTrainerTab === 'my-courses' && (
                  <TrainerCoursesPage showToast={showToast} />
                )}
                {currentTrainerTab === 'trainer-library' && (
                  <TrainerLibraryPage showToast={showToast} />
                )}
                {currentTrainerTab === 'assessments' && (
                  <TrainerAssessmentsPage showToast={showToast} />
                )}
                {currentTrainerTab === 'trainees' && (
                  <TrainerTraineesPage showToast={showToast} />
                )}
                {currentTrainerTab === 'feedback' && (
                  <TrainerFeedbackPage showToast={showToast} />
                )}
                {currentTrainerTab === 'profile' && (
                  <TrainerProfilePage showToast={showToast} />
                )}
                {currentTrainerTab === 'notifications' && (
                  <TrainerNotificationsPage onSelectTab={setCurrentTrainerTab} showToast={showToast} />
                )}
              </TrainerLayout>
            ) : currentScreen === 'admin-portal' ? (
              <AdminLayout
                currentTab={currentAdminTab}
                onSelectTab={setCurrentAdminTab}
                onNavigateScreen={handleNavigate}
                showToast={showToast}
              >
                {currentAdminTab === 'dashboard' && (
                  <DashboardPage onNavigateTab={setCurrentAdminTab} showToast={showToast} />
                )}
                {currentAdminTab === 'courses' && <CoursesPage showToast={showToast} />}
                {currentAdminTab === 'trainers' && <TrainersPage showToast={showToast} />}
                {currentAdminTab === 'trainees' && <TraineesPage showToast={showToast} />}
                {currentAdminTab === 'role-management' && (
                  <RoleManagementPage showToast={showToast} />
                )}
                {currentAdminTab === 'announcements' && (
                  <AnnouncementsPage showToast={showToast} />
                )}
                {currentAdminTab === 'analytics' && (
                  <AnalyticsPage showToast={showToast} />
                )}
                {currentAdminTab === 'competency' && <CompetencyPage />}
                {currentAdminTab === 'settings' && <SettingsPage showToast={showToast} />}
              </AdminLayout>
            ) : currentScreen === 'trainee-setup' ? (
              /* Gated 4-Step Trainee Profile Setup Flow (Screens 01-04: No sidebar/navbar) */
              <TraineeSetupModal
                onComplete={() => {
                  setCurrentScreen('trainee-portal');
                  setCurrentTraineeTab('dashboard');
                  showToast('Profile setup complete! Welcome to Capacity Connect.');
                }}
                onSignOut={() => {
                  setCurrentUser(null);
                  handleNavigate('login');
                }}
                showToast={showToast}
              />
            ) : currentScreen === 'trainee-take-assessment' ? (
              /* Gated Fullscreen Take Assessment Mode (Screen 12: No sidebar/navbar) */
              <TraineeTakeAssessmentPage
                assessmentId={activeAssessmentId}
                onFinishTest={() => {
                  setCurrentScreen('trainee-portal');
                  setCurrentTraineeTab('assessment-result');
                }}
                showToast={showToast}
              />
            ) : currentScreen === 'trainee-portal' ? (
              /* Trainee Portal (Screens 05-20) */
              <TraineeLayout
                currentTab={currentTraineeTab}
                onSelectTab={setCurrentTraineeTab}
                onNavigateScreen={handleNavigate}
                showToast={showToast}
              >
                {currentTraineeTab === 'dashboard' && (
                  <TraineeDashboardPage onSelectTab={setCurrentTraineeTab} showToast={showToast} />
                )}
                {currentTraineeTab === 'course-catalog' && (
                  <TraineeCourseCatalogPage onSelectTab={setCurrentTraineeTab} showToast={showToast} />
                )}
                {currentTraineeTab === 'my-courses' && (
                  <TraineeMyCoursesPage onSelectTab={setCurrentTraineeTab} showToast={showToast} />
                )}
                {currentTraineeTab === 'course-player' && (
                  <TraineeCoursePlayerPage onSelectTab={setCurrentTraineeTab} showToast={showToast} />
                )}
                {currentTraineeTab === 'course-feedback' && (
                  <TraineeCourseFeedbackPage onSelectTab={setCurrentTraineeTab} showToast={showToast} />
                )}
                {currentTraineeTab === 'assessments' && (
                  <TraineeAssessmentsPage
                    onSelectTab={setCurrentTraineeTab}
                    onStartAssessment={(asmtId) => {
                      setActiveAssessmentId(asmtId);
                      setCurrentScreen('trainee-take-assessment');
                    }}
                    showToast={showToast}
                  />
                )}
                {currentTraineeTab === 'assessment-result' && (
                  <TraineeAssessmentResultPage onSelectTab={setCurrentTraineeTab} showToast={showToast} />
                )}
                {currentTraineeTab === 'my-competency' && (
                  <TraineeCompetencyPage onSelectTab={setCurrentTraineeTab} showToast={showToast} />
                )}
                {currentTraineeTab === 'mentors' && (
                  <TraineeMentorsPage onSelectTab={setCurrentTraineeTab} showToast={showToast} />
                )}
                {currentTraineeTab === 'notifications' && (
                  <TraineeNotificationsPage onSelectTab={setCurrentTraineeTab} showToast={showToast} />
                )}
                {currentTraineeTab === 'profile' && (
                  <TraineeProfilePage onSelectTab={setCurrentTraineeTab} showToast={showToast} />
                )}
                {currentTraineeTab === 'certificates' && (
                  <TraineeCertificatesPage onSelectTab={setCurrentTraineeTab} showToast={showToast} />
                )}
              </TraineeLayout>
            ) : (
              /* Authentication & Public Verification Flow */
              <div className="min-h-screen bg-[#fafbfc] flex flex-col justify-between">
                {/* Top Header */}
                <Header currentScreen={currentScreen} onNavigate={handleNavigate} />

                {/* Main Auth Content Area */}
                <main className="flex-1 flex flex-col justify-center items-center py-6 sm:py-10">
                  {currentScreen === 'login' && (
                    <SignInScreen
                      onNavigate={handleNavigate}
                      currentUser={currentUser}
                      setCurrentUser={setCurrentUser}
                      showToast={showToast}
                    />
                  )}

                  {currentScreen === 'signup' && (
                    <SignUpScreen
                      onNavigate={handleNavigate}
                      setCurrentUser={setCurrentUser}
                      showToast={showToast}
                    />
                  )}

                  {currentScreen === 'forgot-password' && (
                    <ForgotPasswordScreen
                      onNavigate={handleNavigate}
                      resetEmail={resetEmail}
                      setResetEmail={setResetEmail}
                      showToast={showToast}
                    />
                  )}

                  {currentScreen === 'check-email' && (
                    <CheckEmailScreen
                      onNavigate={handleNavigate}
                      resetEmail={resetEmail}
                      setEmailModalOpen={setEmailModalOpen}
                      showToast={showToast}
                    />
                  )}

                  {currentScreen === 'reset-password' && (
                    <ResetPasswordScreen
                      onNavigate={handleNavigate}
                      showToast={showToast}
                    />
                  )}

                  {currentScreen === 'pending-approval' && (
                    <PendingApprovalScreen
                      onNavigate={handleNavigate}
                      currentUser={currentUser}
                      setCurrentUser={setCurrentUser}
                      showToast={showToast}
                    />
                  )}

                  {currentScreen === 'access-denied' && (
                    <AccessDeniedScreen
                      onNavigate={handleNavigate}
                      currentUser={currentUser}
                      setCurrentUser={setCurrentUser}
                      showToast={showToast}
                    />
                  )}
                </main>

                {/* Footer */}
                <Footer />

                {/* Simulated Email Client Modal */}
                <EmailModal
                  isOpen={emailModalOpen}
                  onClose={() => setEmailModalOpen(false)}
                  resetEmail={resetEmail}
                  onNavigate={handleNavigate}
                />
              </div>
            )}
          </div>
        </TraineeDataProvider>
      </TrainerDataProvider>
    </AdminDataProvider>
  );
}
