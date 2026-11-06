/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Exercise,
  WorkoutRoutine,
  WorkoutSession,
  UserProfile,
  Achievement,
  ExercisePR
} from '../types';
import { INITIAL_EXERCISES } from '../data/exercises';
import { DEFAULT_ROUTINES } from '../data/defaultRoutines';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';

const KEYS = {
  EXERCISES: 'qyvova_fit_exercises_v1',
  ROUTINES: 'qyvova_fit_routines_v1',
  HISTORY: 'qyvova_fit_history_v1',
  ACTIVE_SESSION: 'qyvova_fit_active_session_v1',
  PROFILE: 'qyvova_fit_profile_v1',
  ACHIEVEMENTS: 'qyvova_fit_achievements_v1',
  PRS: 'qyvova_fit_prs_v1',
  FAVORITES: 'qyvova_fit_favorites_v1'
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Atleta Qyvova',
  nickname: 'Atleta',
  level: 'Intermediário',
  goal: 'Hipertrofia',
  weightKg: 78,
  heightCm: 178,
  weightUnit: 'kg',
  theme: 'dark',
  timerSoundEnabled: true,
  timerVibrationEnabled: true,
  timerAutostart: true,
  privacyAccepted: true
};

// Safe storage access with error handling
function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error reading key ${key} from localStorage:`, err);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing key ${key} to localStorage:`, err);
  }
}

// Initialize seed data if first time
export function initializeStorageIfNeeded(): void {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(KEYS.EXERCISES)) {
    safeSet(KEYS.EXERCISES, INITIAL_EXERCISES);
  }
  if (!localStorage.getItem(KEYS.ROUTINES)) {
    safeSet(KEYS.ROUTINES, DEFAULT_ROUTINES);
  }
  if (!localStorage.getItem(KEYS.PROFILE)) {
    safeSet(KEYS.PROFILE, DEFAULT_PROFILE);
  }
  if (!localStorage.getItem(KEYS.ACHIEVEMENTS)) {
    safeSet(KEYS.ACHIEVEMENTS, INITIAL_ACHIEVEMENTS);
  }
  if (!localStorage.getItem(KEYS.HISTORY)) {
    safeSet(KEYS.HISTORY, []);
  }
  if (!localStorage.getItem(KEYS.PRS)) {
    safeSet(KEYS.PRS, []);
  }
}

// EXERCISES
export function getExercises(): Exercise[] {
  return safeGet<Exercise[]>(KEYS.EXERCISES, INITIAL_EXERCISES);
}

export function saveExercise(exercise: Exercise): Exercise[] {
  const current = getExercises();
  const index = current.findIndex(e => e.id === exercise.id);
  let updated: Exercise[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = exercise;
  } else {
    updated = [exercise, ...current];
  }
  safeSet(KEYS.EXERCISES, updated);
  return updated;
}

export function deleteCustomExercise(id: string): Exercise[] {
  const current = getExercises();
  const updated = current.filter(e => e.id !== id);
  safeSet(KEYS.EXERCISES, updated);
  return updated;
}

export function toggleFavoriteExercise(exerciseId: string): Exercise[] {
  const exercises = getExercises();
  const updated = exercises.map(ex => {
    if (ex.id === exerciseId) {
      return { ...ex, favorite: !ex.favorite };
    }
    return ex;
  });
  safeSet(KEYS.EXERCISES, updated);
  return updated;
}

// ROUTINES (TREINOS)
export function getRoutines(): WorkoutRoutine[] {
  return safeGet<WorkoutRoutine[]>(KEYS.ROUTINES, DEFAULT_ROUTINES);
}

export function saveRoutine(routine: WorkoutRoutine): WorkoutRoutine[] {
  const current = getRoutines();
  const index = current.findIndex(r => r.id === routine.id);
  let updated: WorkoutRoutine[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = { ...routine, updatedAt: new Date().toISOString() };
  } else {
    updated = [{ ...routine, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...current];
  }
  safeSet(KEYS.ROUTINES, updated);
  return updated;
}

export function deleteRoutine(id: string): WorkoutRoutine[] {
  const current = getRoutines();
  const updated = current.filter(r => r.id !== id);
  safeSet(KEYS.ROUTINES, updated);
  return updated;
}

export function duplicateRoutine(id: string): WorkoutRoutine[] {
  const current = getRoutines();
  const source = current.find(r => r.id === id);
  if (!source) return current;

  const newId = `routine-${Date.now()}`;
  const duplicate: WorkoutRoutine = {
    ...source,
    id: newId,
    name: `${source.name} (Cópia)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const updated = [duplicate, ...current];
  safeSet(KEYS.ROUTINES, updated);
  return updated;
}

// ACTIVE SESSION (EXECUÇÃO ATIVA & RECUPERAÇÃO)
export function getActiveSession(): WorkoutSession | null {
  return safeGet<WorkoutSession | null>(KEYS.ACTIVE_SESSION, null);
}

export function saveActiveSession(session: WorkoutSession): void {
  safeSet(KEYS.ACTIVE_SESSION, session);
}

export function clearActiveSession(): void {
  try {
    localStorage.removeItem(KEYS.ACTIVE_SESSION);
  } catch (err) {
    console.error('Failed to clear active session:', err);
  }
}

// HISTORY & COMPLETED SESSIONS
export function getHistory(): WorkoutSession[] {
  return safeGet<WorkoutSession[]>(KEYS.HISTORY, []);
}

export function saveCompletedSession(session: WorkoutSession): {
  history: WorkoutSession[];
  newPRs: ExercisePR[];
  unlockedAchievements: Achievement[];
} {
  const history = getHistory();
  const updatedHistory = [session, ...history];
  safeSet(KEYS.HISTORY, updatedHistory);
  clearActiveSession();

  // Evaluate Personal Records (PRs)
  const currentPRs = getPersonalRecords();
  const newPRs: ExercisePR[] = [];
  const exercises = getExercises();

  session.exercises.forEach(exSession => {
    const exercise = exercises.find(e => e.id === exSession.exerciseId);
    const exerciseName = exercise?.name || 'Exercício';

    exSession.sets.forEach(set => {
      if (set.completed && set.weight > 0) {
        const existingPR = currentPRs.find(p => p.exerciseId === exSession.exerciseId);
        // Compare max weight or estimated 1RM
        const est1RM = Math.round(set.weight * (1 + set.reps / 30));
        if (!existingPR || set.weight > existingPR.maxWeight || est1RM > existingPR.estimated1RM) {
          const newPR: ExercisePR = {
            exerciseId: exSession.exerciseId,
            exerciseName,
            maxWeight: Math.max(existingPR?.maxWeight || 0, set.weight),
            maxReps: set.reps,
            estimated1RM: Math.max(existingPR?.estimated1RM || 0, est1RM),
            achievedAt: new Date().toISOString()
          };
          newPRs.push(newPR);
          // update PR map
          const prIdx = currentPRs.findIndex(p => p.exerciseId === exSession.exerciseId);
          if (prIdx >= 0) {
            currentPRs[prIdx] = newPR;
          } else {
            currentPRs.push(newPR);
          }
        }
      }
    });
  });

  safeSet(KEYS.PRS, currentPRs);

  // Update achievements
  const unlockedAchievements = updateAchievementsOnSessionFinish(updatedHistory, currentPRs);

  return {
    history: updatedHistory,
    newPRs,
    unlockedAchievements
  };
}

export function deleteHistorySession(id: string): WorkoutSession[] {
  const history = getHistory();
  const updated = history.filter(s => s.id !== id);
  safeSet(KEYS.HISTORY, updated);
  return updated;
}

export function getPersonalRecords(): ExercisePR[] {
  return safeGet<ExercisePR[]>(KEYS.PRS, []);
}

// Retrieve previous session data for an exercise (for comparison)
export function getPreviousExercisePerformance(exerciseId: string): {
  date: string;
  sets: { weight: number; reps: number }[];
} | null {
  const history = getHistory();
  for (const session of history) {
    if (session.status === 'completed') {
      const match = session.exercises.find(e => e.exerciseId === exerciseId);
      if (match && match.sets.some(s => s.completed)) {
        return {
          date: session.startedAt,
          sets: match.sets.filter(s => s.completed).map(s => ({ weight: s.weight, reps: s.reps }))
        };
      }
    }
  }
  return null;
}

// ACHIEVEMENTS
export function getAchievements(): Achievement[] {
  return safeGet<Achievement[]>(KEYS.ACHIEVEMENTS, INITIAL_ACHIEVEMENTS);
}

function updateAchievementsOnSessionFinish(history: WorkoutSession[], prs: ExercisePR[]): Achievement[] {
  const achievements = getAchievements();
  const completedWorkouts = history.filter(h => h.status === 'completed');
  const totalCount = completedWorkouts.length;

  let totalSets = 0;
  let totalVolume = 0;

  completedWorkouts.forEach(s => {
    totalSets += s.totalSetsCompleted || 0;
    totalVolume += s.totalVolumeKg || 0;
  });

  const newlyUnlocked: Achievement[] = [];

  const updated = achievements.map(ach => {
    let current = ach.currentValue;
    if (ach.id === 'ach-first-workout') current = totalCount >= 1 ? 1 : 0;
    else if (ach.id === 'ach-5-workouts') current = Math.min(totalCount, 5);
    else if (ach.id === 'ach-10-workouts') current = Math.min(totalCount, 10);
    else if (ach.id === 'ach-25-workouts') current = Math.min(totalCount, 25);
    else if (ach.id === 'ach-50-workouts') current = Math.min(totalCount, 50);
    else if (ach.id === 'ach-100-sets') current = Math.min(totalSets, 100);
    else if (ach.id === 'ach-10k-volume') current = Math.min(totalVolume, 10000);
    else if (ach.id === 'ach-first-pr') current = prs.length > 0 ? 1 : 0;

    const isNowUnlocked = current >= ach.targetValue;
    const wasUnlocked = !!ach.unlockedAt;

    if (isNowUnlocked && !wasUnlocked) {
      const unlockedItem = { ...ach, currentValue: current, unlockedAt: new Date().toISOString() };
      newlyUnlocked.push(unlockedItem);
      return unlockedItem;
    }

    return { ...ach, currentValue: current };
  });

  safeSet(KEYS.ACHIEVEMENTS, updated);
  return newlyUnlocked;
}

// PROFILE
export function getProfile(): UserProfile {
  return safeGet<UserProfile>(KEYS.PROFILE, DEFAULT_PROFILE);
}

export function saveProfile(profile: UserProfile): UserProfile {
  safeSet(KEYS.PROFILE, profile);
  return profile;
}

// BACKUP, EXPORT & IMPORT (LGPD & Privacy Compliant)
export function exportAllDataAsJSON(): string {
  const exportPayload = {
    version: '1.0.0',
    appName: 'QYVOVA FIT',
    exportedAt: new Date().toISOString(),
    profile: getProfile(),
    routines: getRoutines(),
    exercises: getExercises(),
    history: getHistory(),
    achievements: getAchievements(),
    personalRecords: getPersonalRecords()
  };
  return JSON.stringify(exportPayload, null, 2);
}

export function importAllDataFromJSON(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (!data || typeof data !== 'object') return false;

    if (data.profile) safeSet(KEYS.PROFILE, data.profile);
    if (data.routines) safeSet(KEYS.ROUTINES, data.routines);
    if (data.exercises) safeSet(KEYS.EXERCISES, data.exercises);
    if (data.history) safeSet(KEYS.HISTORY, data.history);
    if (data.achievements) safeSet(KEYS.ACHIEVEMENTS, data.achievements);
    if (data.personalRecords) safeSet(KEYS.PRS, data.personalRecords);

    return true;
  } catch (err) {
    console.error('Failed to import backup data:', err);
    return false;
  }
}

export function wipeAllData(): void {
  try {
    localStorage.removeItem(KEYS.EXERCISES);
    localStorage.removeItem(KEYS.ROUTINES);
    localStorage.removeItem(KEYS.HISTORY);
    localStorage.removeItem(KEYS.ACTIVE_SESSION);
    localStorage.removeItem(KEYS.PROFILE);
    localStorage.removeItem(KEYS.ACHIEVEMENTS);
    localStorage.removeItem(KEYS.PRS);
    localStorage.removeItem(KEYS.FAVORITES);

    initializeStorageIfNeeded();
  } catch (err) {
    console.error('Failed to wipe data:', err);
  }
}
