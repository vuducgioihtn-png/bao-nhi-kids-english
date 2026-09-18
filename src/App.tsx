/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { TopicModal } from './components/TopicModal';
import { ChildProfileModal } from './components/ChildProfileModal';
import { TopicSliderBar } from './components/TopicSliderBar';
import { FlashcardView } from './components/FlashcardView';
import { ListenSpellView } from './components/ListenSpellView';
import { GameCenter } from './components/GameCenter';
import { SpeakingView } from './components/SpeakingView';
import { AssessmentTestView } from './components/AssessmentTestView';
import { ProgressReportView } from './components/ProgressReportView';
import { LoginModal } from './components/auth/LoginModal';
import { RegisterModal } from './components/auth/RegisterModal';
import { AdminPortalModal } from './components/auth/AdminPortalModal';
import { PendingApprovalScreen } from './components/auth/PendingApprovalScreen';
import { LearningMode, Topic, UserProgress, TestResult, ChildProfile } from './types';
import { StudentAccount } from './types/account';
import { TOPICS } from './data/topics';
import { getWordsByTopic } from './data/vocabulary';
import { loadUserProgress, toggleMasteredWord, addStars, saveTestResult, updateChildProfile } from './utils/storage';
import {
  getActiveUser,
  setActiveUser,
  getAllAccounts,
  syncStudentStars,
} from './utils/accountStorage';
import { sound } from './utils/audio';

export default function App() {
  const [currentMode, setCurrentMode] = useState<LearningMode>('flashcards');
  const [currentTopic, setCurrentTopic] = useState<Topic>(TOPICS[0]);
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Authentication & Admin State
  const [currentUser, setCurrentUserState] = useState<StudentAccount | null>(getActiveUser);
  const [accounts, setAccounts] = useState<StudentAccount[]>(getAllAccounts);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);

  // Refresh accounts and user from storage
  const refreshAccountsAndUser = useCallback(() => {
    const freshAccounts = getAllAccounts();
    setAccounts(freshAccounts);
    const freshUser = getActiveUser();
    setCurrentUserState(freshUser);
  }, []);

  // Sync child profile whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      setProgress((prev) => ({
        ...prev,
        childProfile: {
          ...prev.childProfile,
          name: currentUser.fullName,
          nickname: currentUser.nickname || currentUser.fullName,
          avatar: currentUser.avatar || '👧',
          grade: currentUser.grade || prev.childProfile.grade,
        },
        stars: currentUser.stars ?? prev.stars,
      }));
    }
  }, [currentUser]);

  // Sync sound manager
  useEffect(() => {
    sound.setSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  const currentTopicWords = useMemo(() => {
    return getWordsByTopic(currentTopic.id);
  }, [currentTopic.id]);

  const handleToggleMastered = useCallback((wordId: string) => {
    setProgress(prev => toggleMasteredWord(wordId, prev));
  }, []);

  const handleAddStars = useCallback((count: number) => {
    setProgress(prev => {
      const updated = addStars(count, prev);
      const user = getActiveUser();
      if (user) {
        syncStudentStars(user.id, updated.stars);
      }
      return updated;
    });
  }, []);

  const handleSaveTestResult = useCallback((result: TestResult) => {
    setProgress(prev => saveTestResult(result, prev));
  }, []);

  const handleUpdateProfile = useCallback((profileData: Partial<ChildProfile>) => {
    setProgress(prev => updateChildProfile(profileData, prev));
  }, []);

  const handleToggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  // Login handler
  const handleLoginSuccess = useCallback((account: StudentAccount) => {
    setCurrentUserState(account);
    refreshAccountsAndUser();
    // If admin, open admin portal directly or announce welcome
    if (account.role === 'admin') {
      setIsAdminPortalOpen(true);
    }
  }, [refreshAccountsAndUser]);

  // Logout handler
  const handleLogout = useCallback(() => {
    sound.playTap();
    setActiveUser(null);
    setCurrentUserState(null);
    setIsLoginModalOpen(true);
  }, []);

  // Pending count for Admin notification badge
  const pendingApprovalsCount = useMemo(() => {
    return accounts.filter((a) => a.status === 'pending').length;
  }, [accounts]);

  // Check if current user is blocked by pending/rejected/locked status
  const isStudentWaitingApproval =
    currentUser &&
    currentUser.role === 'student' &&
    currentUser.status !== 'approved';

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50/40 via-orange-50/20 to-amber-50/50 flex flex-col">
      {/* Sticky Header with Navigation, Topic selector, Stats & Auth controls */}
      <Header
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        currentTopic={currentTopic}
        onOpenTopicModal={() => setIsTopicModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        progress={progress}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        currentUser={currentUser}
        pendingApprovalsCount={pendingApprovalsCount}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenRegister={() => setIsRegisterModalOpen(true)}
        onOpenAdminPortal={() => {
          if (!currentUser || currentUser.role !== 'admin') {
            // If not logged in as admin, prompt admin login
            setIsLoginModalOpen(true);
          } else {
            setIsAdminPortalOpen(true);
          }
        }}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto py-2">
        {isStudentWaitingApproval ? (
          /* Màn hình thông báo khi tài khoản học sinh đang Chờ Duyệt / Khóa */
          <PendingApprovalScreen
            account={currentUser}
            onRefreshUser={refreshAccountsAndUser}
            onOpenAdminLogin={() => setIsLoginModalOpen(true)}
            onLogout={handleLogout}
          />
        ) : (
          /* Màn hình học tập đầy đủ cho học sinh đã được duyệt và Admin */
          <>
            {/* Quick Topic Switcher with Interactive Slider & Drag Controls */}
            {currentMode !== 'progress' && currentMode !== 'speaking' && (
              <TopicSliderBar
                currentTopic={currentTopic}
                onSelectTopic={setCurrentTopic}
                onOpenTopicModal={() => setIsTopicModalOpen(true)}
              />
            )}

            {/* View Routing */}
            {currentMode === 'flashcards' && (
              <FlashcardView
                key={currentTopic.id}
                topic={currentTopic}
                words={currentTopicWords}
                progress={progress}
                onToggleMastered={handleToggleMastered}
              />
            )}

            {currentMode === 'listen-spell' && (
              <ListenSpellView
                key={currentTopic.id}
                topic={currentTopic}
                words={currentTopicWords}
                progress={progress}
                onAddStars={handleAddStars}
              />
            )}

            {currentMode === 'speaking' && (
              <SpeakingView
                onAddStars={handleAddStars}
                soundEnabled={soundEnabled}
                childProfile={progress.childProfile}
              />
            )}

            {currentMode === 'games' && (
              <GameCenter
                key={currentTopic.id}
                topic={currentTopic}
                words={currentTopicWords}
                onAddStars={handleAddStars}
                childProfile={progress.childProfile}
              />
            )}

            {currentMode === 'test' && (
              <AssessmentTestView
                key={currentTopic.id}
                currentTopic={currentTopic}
                onSaveTestResult={handleSaveTestResult}
                childProfile={progress.childProfile}
              />
            )}

            {currentMode === 'progress' && (
              <ProgressReportView
                progress={progress}
                onSelectTopic={setCurrentTopic}
                onNavigateToFlashcards={() => setCurrentMode('flashcards')}
                onOpenProfileModal={() => setIsProfileModalOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Topic Selection Modal */}
      <TopicModal
        isOpen={isTopicModalOpen}
        onClose={() => setIsTopicModalOpen(false)}
        currentTopicId={currentTopic.id}
        onSelectTopic={setCurrentTopic}
        progress={progress}
      />

      {/* Child Profile Personalization Modal */}
      <ChildProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        progress={progress}
        onUpdateProfile={handleUpdateProfile}
      />

      {/* Student Registration Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
        onRegisterSuccess={() => {
          refreshAccountsAndUser();
        }}
      />

      {/* User & Admin Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Admin Management & Approval Portal */}
      {isAdminPortalOpen && currentUser?.role === 'admin' && (
        <AdminPortalModal
          isOpen={isAdminPortalOpen}
          onClose={() => setIsAdminPortalOpen(false)}
          currentUser={currentUser}
          onStudentSelected={(selectedStudent) => {
            setCurrentUserState(selectedStudent);
            refreshAccountsAndUser();
          }}
          onRefreshData={refreshAccountsAndUser}
        />
      )}

      {/* Bottom Footer Info */}
      <footer className="mt-auto py-4 text-center text-xs text-slate-400 font-medium border-t border-amber-100 bg-white/60">
        <p>
          BMyC English Kids &bull; Dành tặng {progress.childProfile?.nickname || 'Bé Bảo Nhi'} &bull; 600+ từ vựng 35 chủ đề & Luyện nói giao tiếp chuẩn Tiểu học
        </p>
      </footer>
    </div>
  );
}

