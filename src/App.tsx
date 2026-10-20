import React, { useState, useEffect } from 'react';
import { Screen, AdminTab, UserAccount } from './types';
import { AdminDataProvider } from './context/AdminDataContext';
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
import { Check, X } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [currentAdminTab, setCurrentAdminTab] = useState<AdminTab>('dashboard');
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
      <div className="min-h-screen text-slate-900 flex flex-col justify-between relative selection:bg-slate-900 selection:text-white">
        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-medium animate-in fade-in slide-in-from-top-3 duration-200">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white ml-2 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* If Admin Portal is active */}
        {currentScreen === 'admin-portal' ? (
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
    </AdminDataProvider>
  );
}
