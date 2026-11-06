/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MuscleGroup =
  | 'Peito'
  | 'Costas'
  | 'Pernas'
  | 'Ombros'
  | 'Bíceps'
  | 'Tríceps'
  | 'Abdômen'
  | 'Glúteos'
  | 'Panturrilhas'
  | 'Antebraço'
  | 'Cardio';

export type Equipment =
  | 'Barra'
  | 'Halteres'
  | 'Máquina'
  | 'Polia/Cabo'
  | 'Peso Corporal'
  | 'Kettlebell'
  | 'Elástico'
  | 'Outro';

export type DifficultyLevel = 'Iniciante' | 'Intermediário' | 'Avançado';

export type SplitTag = 'A' | 'B' | 'C' | 'D' | 'E' | 'Personalizado' | 'Full Body';

export interface Exercise {
  id: string;
  name: string;
  category: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  equipment: Equipment;
  difficulty: DifficultyLevel;
  instructions: string[];
  tips: string[];
  securityWarnings: string[];
  commonErrors: string[];
  alternatives: string[];
  isCustom?: boolean;
  favorite?: boolean;
  defaultSets?: number;
  defaultReps?: number;
  defaultRestSec?: number;
}

export interface WorkoutExerciseConfig {
  exerciseId: string;
  targetSets: number;
  targetReps: number;
  targetWeight?: number;
  restSeconds: number;
  notes?: string;
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  splitTag: SplitTag;
  description?: string;
  targetMuscleGroups: MuscleGroup[];
  scheduledDays: number[]; // 0=Domingo, 1=Segunda, etc.
  exercises: WorkoutExerciseConfig[];
  createdAt: string;
  updatedAt: string;
}

export interface ActiveSet {
  setNumber: number;
  targetWeight?: number;
  targetReps: number;
  weight: number;
  reps: number;
  completed: boolean;
  rpe?: number; // 1-10
  completedAt?: string;
  notes?: string;
  isPR?: boolean;
}

export interface ActiveExerciseSession {
  exerciseId: string;
  sets: ActiveSet[];
  notes?: string;
  restSeconds: number;
}

export interface WorkoutSession {
  id: string;
  routineId?: string;
  routineName: string;
  startedAt: string;
  endedAt?: string;
  durationSeconds: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  exercises: ActiveExerciseSession[];
  totalVolumeKg: number;
  totalSetsCompleted: number;
  notes?: string;
  prsAchieved: { exerciseName: string; weight: number; reps: number }[];
}

export interface UserProfile {
  name: string;
  nickname?: string;
  level: DifficultyLevel;
  goal?: 'Hipertrofia' | 'Força' | 'Emagrecimento' | 'Condicionamento' | 'Saúde Geral';
  weightKg?: number;
  heightCm?: number;
  weightUnit: 'kg' | 'lb';
  theme: 'dark' | 'light';
  timerSoundEnabled: boolean;
  timerVibrationEnabled: boolean;
  timerAutostart: boolean;
  privacyAccepted: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'workouts' | 'volume' | 'streak' | 'pr';
  unlockedAt?: string;
  currentValue: number;
  targetValue: number;
}

export interface ExercisePR {
  exerciseId: string;
  exerciseName: string;
  maxWeight: number;
  maxReps: number;
  estimated1RM: number;
  achievedAt: string;
}
