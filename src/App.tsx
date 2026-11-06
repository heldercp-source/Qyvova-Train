/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  WorkoutRoutine,
  WorkoutSession,
  Exercise,
  Achievement,
  ExercisePR,
  ActiveExerciseSession,
  ActiveSet
} from './types';
import {
  initializeStorageIfNeeded,
  getProfile,
  saveProfile,
  getRoutines,
  saveRoutine,
  deleteRoutine,
  duplicateRoutine,
  getExercises,
  saveExercise,
  toggleFavoriteExercise,
  getHistory,
  saveCompletedSession,
  deleteHistorySession,
  getActiveSession,
  saveActiveSession,
  clearActiveSession,
  getAchievements,
  getPersonalRecords
} from './services/storage';

import { Header } from './components/Header';
import { Navigation, NavTab } from './components/Navigation';
import { OfflineBanner } from './components/OfflineBanner';
import { MedicalDisclaimerModal } from './components/MedicalDisclaimerModal';
import { CalculatorModal } from './components/CalculatorModal';
import { ExerciseDetailModal } from './components/ExerciseDetailModal';
import { CustomExerciseModal } from './components/CustomExerciseModal';
import { RoutineEditorModal } from './components/RoutineEditorModal';
import { ActiveWorkoutScreen } from './components/ActiveWorkoutScreen';

import { DashboardView } from './views/DashboardView';
import { RoutinesView } from './views/RoutinesView';
import { ExercisesView } from './views/ExercisesView';
import { AnalyticsView } from './views/AnalyticsView';
import { ProfileView } from './views/ProfileView';

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentTab, setCurrentTab] = useState<NavTab>('home');

  // Core Data
  const [profile, setProfile] = useState<UserProfile>(() => {
    initializeStorageIfNeeded();
    return getProfile();
  });
  const [routines, setRoutines] = useState<WorkoutRoutine[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [history, setHistory] = useState<WorkoutSession[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [personalRecords, setPersonalRecords] = useState<ExercisePR[]>([]);
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);

  // Active Screen mode
  const [isWorkoutScreenOpen, setIsWorkoutScreenOpen] = useState(false);

  // Modals
  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState<Exercise | null>(null);
  const [isCustomExerciseModalOpen, setIsCustomExerciseModalOpen] = useState(false);
  const [isRoutineEditorOpen, setIsRoutineEditorOpen] = useState(false);
  const [routineToEdit, setRoutineToEdit] = useState<WorkoutRoutine | null>(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  // Theme
  const [theme, setTheme] = useState<'dark' | 'light'>(profile.theme || 'dark');

  // Load and sync data from storage
  const loadData = () => {
    initializeStorageIfNeeded();
    const loadedProfile = getProfile();
    setProfile(loadedProfile);
    setTheme(loadedProfile.theme || 'dark');
    setRoutines(getRoutines());
    setExercises(getExercises());
    setHistory(getHistory());
    setAchievements(getAchievements());
    setPersonalRecords(getPersonalRecords());

    const active = getActiveSession();
    if (active && active.status === 'in_progress') {
      setActiveSession(active);
    } else {
      setActiveSession(null);
    }
  };

  useEffect(() => {
    loadData();
    setIsInitialized(true);
  }, []);

  // Sync theme with document element
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-[#101318]', 'text-white');
      document.body.classList.add('bg-gray-100', 'text-gray-900');
    } else {
      document.documentElement.classList.add('dark');
      document.body.classList.remove('bg-gray-100', 'text-gray-900');
      document.body.classList.add('bg-[#101318]', 'text-white');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    const nextTheme: 'dark' | 'light' = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    const updated: UserProfile = { ...profile, theme: nextTheme };
    setProfile(updated);
    saveProfile(updated);
  };

  // START WORKOUT SESSION
  const handleStartWorkout = (routine: WorkoutRoutine) => {
    const newSessionExercises: ActiveExerciseSession[] = routine.exercises.map(cfg => {
      const sets: ActiveSet[] = [];
      const numSets = cfg.targetSets || 3;
      for (let i = 1; i <= numSets; i++) {
        sets.push({
          setNumber: i,
          targetWeight: cfg.targetWeight || 0,
          targetReps: cfg.targetReps || 10,
          weight: cfg.targetWeight || 0,
          reps: cfg.targetReps || 10,
          completed: false
        });
      }

      return {
        exerciseId: cfg.exerciseId,
        sets,
        notes: cfg.notes || '',
        restSeconds: cfg.restSeconds || 60
      };
    });

    const newSession: WorkoutSession = {
      id: `session-${Date.now()}`,
      routineId: routine.id,
      routineName: routine.name,
      startedAt: new Date().toISOString(),
      durationSeconds: 0,
      status: 'in_progress',
      exercises: newSessionExercises,
      totalVolumeKg: 0,
      totalSetsCompleted: 0,
      prsAchieved: []
    };

    saveActiveSession(newSession);
    setActiveSession(newSession);
    setIsWorkoutScreenOpen(true);
  };

  // RESUME ONGOING WORKOUT
  const handleResumeWorkout = () => {
    const current = getActiveSession();
    if (current) {
      setActiveSession(current);
      setIsWorkoutScreenOpen(true);
    }
  };

  // FINISH COMPLETED WORKOUT
  const handleFinishSession = (completedSession: WorkoutSession) => {
    const result = saveCompletedSession(completedSession);
    setHistory(result.history);
    setAchievements(getAchievements());
    setPersonalRecords(getPersonalRecords());
    setActiveSession(null);
    setIsWorkoutScreenOpen(false);
    setCurrentTab('analytics');
  };

  // DISCARD WORKOUT
  const handleDiscardSession = () => {
    clearActiveSession();
    setActiveSession(null);
    setIsWorkoutScreenOpen(false);
  };

  // ROUTINES MANAGEMENT
  const handleSaveRoutine = (routine: WorkoutRoutine) => {
    const updated = saveRoutine(routine);
    setRoutines(updated);
    setIsRoutineEditorOpen(false);
    setRoutineToEdit(null);
  };

  const handleDeleteRoutine = (id: string) => {
    const updated = deleteRoutine(id);
    setRoutines(updated);
  };

  const handleDuplicateRoutine = (id: string) => {
    const updated = duplicateRoutine(id);
    setRoutines(updated);
  };

  // EXERCISES MANAGEMENT
  const handleSaveCustomExercise = (exercise: Exercise) => {
    const updated = saveExercise(exercise);
    setExercises(updated);
  };

  const handleToggleFavorite = (exerciseId: string) => {
    const updated = toggleFavoriteExercise(exerciseId);
    setExercises(updated);
    if (selectedExerciseForModal && selectedExerciseForModal.id === exerciseId) {
      setSelectedExerciseForModal(prev => (prev ? { ...prev, favorite: !prev.favorite } : null));
    }
  };

  // HISTORY DELETE
  const handleDeleteSession = (sessionId: string) => {
    const updated = deleteHistorySession(sessionId);
    setHistory(updated);
    setAchievements(getAchievements());
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#101318] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#B7F34A]/20 border border-[#B7F34A] flex items-center justify-center animate-spin">
            <span className="w-4 h-4 bg-[#B7F34A] rounded-full" />
          </div>
          <span className="text-xs font-bold tracking-widest text-[#B7F34A] uppercase">
            Iniciando QYVOVA FIT...
          </span>
        </div>
      </div>
    );
  }

  // If active full-screen workout mode is open
  if (isWorkoutScreenOpen && activeSession) {
    return (
      <ActiveWorkoutScreen
        session={activeSession}
        exercisesLibrary={exercises}
        onFinishSession={handleFinishSession}
        onDiscardSession={handleDiscardSession}
        weightUnit={profile.weightUnit}
        timerSoundEnabled={profile.timerSoundEnabled}
        timerVibrationEnabled={profile.timerVibrationEnabled}
        timerAutostart={profile.timerAutostart}
        onOpenExerciseDetails={ex => setSelectedExerciseForModal(ex)}
      />
    );
  }

  // Find PR for selected exercise modal
  const selectedExPR = selectedExerciseForModal
    ? personalRecords.find(p => p.exerciseId === selectedExerciseForModal.id)
    : null;

  return (
    <div className={`min-h-screen flex flex-col transition-colors ${theme === 'dark' ? 'bg-[#101318] text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Offline Status Notice */}
      <OfflineBanner />

      {/* Main Header */}
      <Header
        activeSession={activeSession}
        onResumeWorkout={handleResumeWorkout}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Desktop / Tablet Navigation */}
      <Navigation currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 pb-nav">
        {currentTab === 'home' && (
          <DashboardView
            profile={profile}
            routines={routines}
            history={history}
            activeSession={activeSession}
            onStartWorkout={handleStartWorkout}
            onResumeWorkout={handleResumeWorkout}
            onNavigateToTab={setCurrentTab}
            onOpenCreateRoutine={() => {
              setRoutineToEdit(null);
              setIsRoutineEditorOpen(true);
            }}
            onOpenCalculator={() => setIsCalculatorOpen(true)}
            weightUnit={profile.weightUnit}
          />
        )}

        {currentTab === 'routines' && (
          <RoutinesView
            routines={routines}
            exercisesLibrary={exercises}
            onStartWorkout={handleStartWorkout}
            onEditRoutine={routine => {
              setRoutineToEdit(routine);
              setIsRoutineEditorOpen(true);
            }}
            onDuplicateRoutine={handleDuplicateRoutine}
            onDeleteRoutine={handleDeleteRoutine}
            onOpenCreateModal={() => {
              setRoutineToEdit(null);
              setIsRoutineEditorOpen(true);
            }}
            weightUnit={profile.weightUnit}
          />
        )}

        {currentTab === 'exercises' && (
          <ExercisesView
            exercises={exercises}
            onSelectExercise={ex => setSelectedExerciseForModal(ex)}
            onToggleFavorite={handleToggleFavorite}
            onOpenCreateCustom={() => setIsCustomExerciseModalOpen(true)}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsView
            history={history}
            achievements={achievements}
            personalRecords={personalRecords}
            exercisesLibrary={exercises}
            onDeleteSession={handleDeleteSession}
            weightUnit={profile.weightUnit}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            profile={profile}
            onSaveProfile={updated => {
              setProfile(updated);
              saveProfile(updated);
            }}
            onOpenCalculator={() => setIsCalculatorOpen(true)}
            onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            onDataReset={loadData}
          />
        )}
      </main>

      {/* Global Modals */}
      <ExerciseDetailModal
        exercise={selectedExerciseForModal}
        onClose={() => setSelectedExerciseForModal(null)}
        onToggleFavorite={handleToggleFavorite}
        personalRecord={selectedExPR}
        weightUnit={profile.weightUnit}
      />

      <CustomExerciseModal
        isOpen={isCustomExerciseModalOpen}
        onClose={() => setIsCustomExerciseModalOpen(false)}
        onSaveExercise={handleSaveCustomExercise}
      />

      <RoutineEditorModal
        isOpen={isRoutineEditorOpen}
        onClose={() => {
          setIsRoutineEditorOpen(false);
          setRoutineToEdit(null);
        }}
        onSaveRoutine={handleSaveRoutine}
        availableExercises={exercises}
        initialRoutine={routineToEdit}
        weightUnit={profile.weightUnit}
      />

      <CalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        weightUnit={profile.weightUnit}
      />

      <MedicalDisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />
    </div>
  );
}
