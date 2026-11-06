/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Check,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Info,
  Volume2,
  VolumeX,
  X,
  AlertTriangle,
  Award,
  Sparkles,
  RotateCcw,
  SkipForward,
  Dumbbell
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  WorkoutSession,
  ActiveExerciseSession,
  ActiveSet,
  Exercise,
  ExercisePR
} from '../types';
import {
  saveActiveSession,
  clearActiveSession,
  getPreviousExercisePerformance,
  getPersonalRecords
} from '../services/storage';
import {
  playCountdownTick,
  playRestFinishedChime,
  triggerVibration
} from '../services/audio';

interface ActiveWorkoutScreenProps {
  session: WorkoutSession;
  exercisesLibrary: Exercise[];
  onFinishSession: (completedSession: WorkoutSession) => void;
  onDiscardSession: () => void;
  weightUnit?: 'kg' | 'lb';
  timerSoundEnabled?: boolean;
  timerVibrationEnabled?: boolean;
  timerAutostart?: boolean;
  onOpenExerciseDetails: (exercise: Exercise) => void;
}

export const ActiveWorkoutScreen: React.FC<ActiveWorkoutScreenProps> = ({
  session: initialSession,
  exercisesLibrary,
  onFinishSession,
  onDiscardSession,
  weightUnit = 'kg',
  timerSoundEnabled = true,
  timerVibrationEnabled = true,
  timerAutostart = true,
  onOpenExerciseDetails
}) => {
  const [currentSession, setCurrentSession] = useState<WorkoutSession>(initialSession);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(initialSession.durationSeconds || 0);

  // Rest Timer State
  const [restSecondsRemaining, setRestSecondsRemaining] = useState<number | null>(null);
  const [restInitialSeconds, setRestInitialSeconds] = useState<number>(60);
  const [isRestPaused, setIsRestPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(timerSoundEnabled);

  // Modals
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [sessionNotes, setSessionNotes] = useState(initialSession.notes || '');

  // Track new PR achieved during active session
  const [achievedPRs, setAchievedPRs] = useState<
    { exerciseName: string; weight: number; reps: number }[]
  >([]);

  const workoutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const restTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Workout duration timer
  useEffect(() => {
    if (!isPaused) {
      workoutTimerRef.current = setInterval(() => {
        setElapsedSeconds(prev => {
          const next = prev + 1;
          // Autosave updated duration
          saveActiveSession({
            ...currentSession,
            durationSeconds: next
          });
          return next;
        });
      }, 1000);
    }

    return () => {
      if (workoutTimerRef.current) clearInterval(workoutTimerRef.current);
    };
  }, [isPaused, currentSession]);

  // Rest Countdown Timer
  useEffect(() => {
    if (restSecondsRemaining !== null && restSecondsRemaining > 0 && !isRestPaused) {
      restTimerRef.current = setInterval(() => {
        setRestSecondsRemaining(prev => {
          if (prev === null) return null;
          if (prev <= 1) {
            // Rest finished!
            if (soundEnabled) {
              playRestFinishedChime();
            }
            if (timerVibrationEnabled) {
              triggerVibration([200, 100, 300]);
            }
            return 0;
          }
          // Tick at 3, 2, 1
          if (prev <= 4 && prev > 1 && soundEnabled) {
            playCountdownTick();
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    };
  }, [restSecondsRemaining, isRestPaused, soundEnabled, timerVibrationEnabled]);

  // Current Exercise data
  const currentExConfig = currentSession.exercises[currentExerciseIndex];
  const currentExerciseData = exercisesLibrary.find(
    e => e.id === currentExConfig?.exerciseId
  );
  const previousPerformance = currentExConfig
    ? getPreviousExercisePerformance(currentExConfig.exerciseId)
    : null;

  // Format time mm:ss or hh:mm:ss
  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Set completion toggle
  const toggleSetCompleted = (setIndex: number) => {
    if (!currentExConfig) return;

    const updatedExercises = [...currentSession.exercises];
    const targetExercise = { ...updatedExercises[currentExerciseIndex] };
    const targetSet = { ...targetExercise.sets[setIndex] };

    const newCompleted = !targetSet.completed;
    targetSet.completed = newCompleted;
    targetSet.completedAt = newCompleted ? new Date().toISOString() : undefined;

    // Check for PR if completed
    if (newCompleted && targetSet.weight > 0) {
      const allPRs = getPersonalRecords();
      const existingPR = allPRs.find(p => p.exerciseId === targetExercise.exerciseId);
      if (!existingPR || targetSet.weight > existingPR.maxWeight) {
        targetSet.isPR = true;
        const exName = currentExerciseData?.name || 'Exercício';
        if (!achievedPRs.some(p => p.exerciseName === exName && p.weight === targetSet.weight)) {
          setAchievedPRs(prev => [
            ...prev,
            { exerciseName: exName, weight: targetSet.weight, reps: targetSet.reps }
          ]);
          try {
            confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
          } catch {
            // ignore
          }
        }
      }
    }

    targetExercise.sets[setIndex] = targetSet;
    updatedExercises[currentExerciseIndex] = targetExercise;

    // Calculate total stats
    let totalVolume = 0;
    let totalSetsDone = 0;
    updatedExercises.forEach(ex => {
      ex.sets.forEach(s => {
        if (s.completed) {
          totalSetsDone += 1;
          totalVolume += (s.weight || 0) * (s.reps || 0);
        }
      });
    });

    const updatedSession: WorkoutSession = {
      ...currentSession,
      exercises: updatedExercises,
      totalVolumeKg: totalVolume,
      totalSetsCompleted: totalSetsDone,
      durationSeconds: elapsedSeconds
    };

    setCurrentSession(updatedSession);
    saveActiveSession(updatedSession);

    // Trigger Rest Timer automatically
    if (newCompleted && timerAutostart) {
      const restSec = targetExercise.restSeconds || currentExerciseData?.defaultRestSec || 60;
      setRestInitialSeconds(restSec);
      setRestSecondsRemaining(restSec);
      setIsRestPaused(false);
    }
  };

  // Update set weight / reps
  const updateSet = (
    setIndex: number,
    field: 'weight' | 'reps' | 'notes',
    value: number | string
  ) => {
    if (!currentExConfig) return;

    const updatedExercises = [...currentSession.exercises];
    const targetExercise = { ...updatedExercises[currentExerciseIndex] };
    const targetSet = { ...targetExercise.sets[setIndex], [field]: value };

    targetExercise.sets[setIndex] = targetSet;
    updatedExercises[currentExerciseIndex] = targetExercise;

    const updatedSession: WorkoutSession = {
      ...currentSession,
      exercises: updatedExercises,
      durationSeconds: elapsedSeconds
    };

    setCurrentSession(updatedSession);
    saveActiveSession(updatedSession);
  };

  // Add new set to current exercise
  const addSet = () => {
    if (!currentExConfig) return;
    const lastSet = currentExConfig.sets[currentExConfig.sets.length - 1];
    const newSet: ActiveSet = {
      setNumber: currentExConfig.sets.length + 1,
      targetWeight: lastSet?.weight || 0,
      targetReps: lastSet?.reps || 10,
      weight: lastSet?.weight || 0,
      reps: lastSet?.reps || 10,
      completed: false
    };

    const updatedExercises = [...currentSession.exercises];
    updatedExercises[currentExerciseIndex].sets.push(newSet);

    const updatedSession = { ...currentSession, exercises: updatedExercises };
    setCurrentSession(updatedSession);
    saveActiveSession(updatedSession);
  };

  // Remove set
  const removeSet = (setIndex: number) => {
    if (!currentExConfig || currentExConfig.sets.length <= 1) return;

    const updatedExercises = [...currentSession.exercises];
    const filteredSets = updatedExercises[currentExerciseIndex].sets
      .filter((_, i) => i !== setIndex)
      .map((s, idx) => ({ ...s, setNumber: idx + 1 }));

    updatedExercises[currentExerciseIndex].sets = filteredSets;
    const updatedSession = { ...currentSession, exercises: updatedExercises };
    setCurrentSession(updatedSession);
    saveActiveSession(updatedSession);
  };

  // Rest Timer Adjustments
  const adjustRest = (delta: number) => {
    setRestSecondsRemaining(prev => Math.max(0, (prev || 0) + delta));
  };

  const closeRestTimer = () => {
    setRestSecondsRemaining(null);
  };

  // Finish Workout
  const handleOpenFinish = () => {
    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
    setShowFinishModal(true);
  };

  const handleConfirmFinish = () => {
    const completed: WorkoutSession = {
      ...currentSession,
      status: 'completed',
      durationSeconds: elapsedSeconds,
      endedAt: new Date().toISOString(),
      notes: sessionNotes.trim(),
      prsAchieved: achievedPRs
    };
    onFinishSession(completed);
  };

  return (
    <div className="min-h-screen bg-[#101318] text-white flex flex-col pb-nav">
      {/* Top Session Status Bar */}
      <div className="sticky top-0 z-30 bg-[#191F28]/95 border-b border-[#222A35] backdrop-blur-md px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          {/* Pause / Resume */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isPaused
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse'
                  : 'bg-[#101318] text-[#A8B0BC] border-[#222A35] hover:text-white'
              }`}
              title={isPaused ? 'Retomar treino' : 'Pausar treino'}
            >
              {isPaused ? <Play className="w-4 h-4 fill-amber-400" /> : <Pause className="w-4 h-4" />}
            </button>

            <div>
              <div className="flex items-center gap-1.5 font-mono text-base font-extrabold text-[#B7F34A]">
                <Clock className="w-4 h-4" />
                <span>{formatTime(elapsedSeconds)}</span>
                {isPaused && (
                  <span className="text-[10px] uppercase font-bold text-amber-400 ml-1">Pausado</span>
                )}
              </div>
              <h1 className="text-xs font-semibold text-[#A8B0BC] truncate max-w-[180px] sm:max-w-xs">
                {currentSession.routineName}
              </h1>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDiscardConfirm(true)}
              className="p-2 rounded-xl bg-[#101318] border border-[#222A35] text-[#A8B0BC] hover:text-red-400 hover:border-red-500/30 transition-colors cursor-pointer"
              title="Cancelar / Descartar treino"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleOpenFinish}
              className="px-4 py-2 rounded-xl bg-[#B7F34A] hover:bg-[#c6fb62] text-[#101318] font-black text-xs transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Concluir</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Execution Area */}
      <div className="flex-1 max-w-3xl w-full mx-auto p-4 space-y-4">
        {/* Exercise Progress Header & Navigation Stepper */}
        <div className="flex items-center justify-between bg-[#191F28] p-3 rounded-2xl border border-[#222A35]">
          <button
            onClick={() => setCurrentExerciseIndex(prev => Math.max(0, prev - 1))}
            disabled={currentExerciseIndex === 0}
            className="p-2 rounded-xl bg-[#101318] text-[#A8B0BC] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <span className="text-[11px] font-bold text-[#A8B0BC] uppercase tracking-wider block">
              Exercício {currentExerciseIndex + 1} de {currentSession.exercises.length}
            </span>
            <div className="flex items-center justify-center gap-1 mt-1">
              {currentSession.exercises.map((ex, idx) => {
                const allDone = ex.sets.every(s => s.completed);
                const someDone = ex.sets.some(s => s.completed);
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentExerciseIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === currentExerciseIndex
                        ? 'w-6 bg-[#B7F34A]'
                        : allDone
                        ? 'w-3 bg-emerald-500'
                        : someDone
                        ? 'w-3 bg-amber-400'
                        : 'w-2 bg-[#222A35]'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <button
            onClick={() =>
              setCurrentExerciseIndex(prev =>
                Math.min(currentSession.exercises.length - 1, prev + 1)
              )
            }
            disabled={currentExerciseIndex === currentSession.exercises.length - 1}
            className="p-2 rounded-xl bg-[#101318] text-[#A8B0BC] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Current Exercise Card */}
        {currentExerciseData && (
          <div className="bg-[#191F28] p-4 rounded-2xl border border-[#222A35]">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-[#B7F34A]/10 text-[#B7F34A] text-[10px] font-bold border border-[#B7F34A]/30">
                    {currentExerciseData.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#101318] text-[#A8B0BC] text-[10px]">
                    {currentExerciseData.equipment}
                  </span>
                  {currentExConfig?.restSeconds && (
                    <span className="px-2 py-0.5 rounded-md bg-[#101318] text-[#A8B0BC] text-[10px] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#B7F34A]" />
                      {currentExConfig.restSeconds}s descanso
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-black text-white">{currentExerciseData.name}</h2>
              </div>

              {/* View technical tips modal trigger */}
              <button
                onClick={() => onOpenExerciseDetails(currentExerciseData)}
                className="p-2.5 rounded-xl bg-[#101318] border border-[#222A35] text-[#A8B0BC] hover:text-[#B7F34A] transition-colors cursor-pointer shrink-0"
                title="Ver postura e instruções técnicas"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>

            {/* Previous Session Reference (Progressive Overload Assistant) */}
            {previousPerformance ? (
              <div className="mt-2 p-2.5 rounded-xl bg-[#101318] border border-[#222A35] text-xs flex items-center justify-between">
                <span className="text-[#A8B0BC] font-medium flex items-center gap-1.5">
                  <Dumbbell className="w-3.5 h-3.5 text-[#B7F34A]" />
                  Treino anterior:
                </span>
                <span className="font-mono font-bold text-white">
                  {previousPerformance.sets.map(s => `${s.weight}k×${s.reps}`).join(' | ')}
                </span>
              </div>
            ) : (
              <div className="mt-2 text-[11px] text-[#A8B0BC] italic">
                Primeira vez registrando este exercício no QYVOVA FIT. Defina sua marca!
              </div>
            )}
          </div>
        )}

        {/* Sets Logger Table */}
        <div className="bg-[#191F28] rounded-2xl border border-[#222A35] overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 px-3 py-2.5 bg-[#101318] border-b border-[#222A35] text-[11px] font-bold text-[#A8B0BC] uppercase tracking-wider text-center">
            <span className="col-span-2">Série</span>
            <span className="col-span-4">Carga ({weightUnit})</span>
            <span className="col-span-4">Repetições</span>
            <span className="col-span-2">Status</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-[#222A35]">
            {currentExConfig?.sets.map((set, setIndex) => {
              return (
                <div
                  key={set.setNumber}
                  className={`grid grid-cols-12 gap-2 items-center px-3 py-3 transition-colors ${
                    set.completed ? 'bg-[#B7F34A]/5' : ''
                  }`}
                >
                  {/* Set Number */}
                  <div className="col-span-2 flex items-center justify-center gap-1">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-black ${
                        set.completed
                          ? 'bg-[#B7F34A] text-[#101318]'
                          : 'bg-[#101318] text-white border border-[#222A35]'
                      }`}
                    >
                      {set.setNumber}
                    </span>
                  </div>

                  {/* Weight Input with quick buttons */}
                  <div className="col-span-4 flex items-center justify-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        updateSet(setIndex, 'weight', Math.max(0, (set.weight || 0) - 2.5))
                      }
                      className="w-6 h-7 rounded bg-[#101318] text-[#A8B0BC] hover:text-white font-mono text-xs font-bold border border-[#222A35] flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={set.weight}
                      onChange={e =>
                        updateSet(setIndex, 'weight', Math.max(0, parseFloat(e.target.value) || 0))
                      }
                      className="w-14 bg-[#101318] border border-[#222A35] rounded-lg py-1 text-center font-mono font-bold text-sm text-white focus:border-[#B7F34A] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => updateSet(setIndex, 'weight', (set.weight || 0) + 2.5)}
                      className="w-6 h-7 rounded bg-[#101318] text-[#A8B0BC] hover:text-white font-mono text-xs font-bold border border-[#222A35] flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Reps Input with quick buttons */}
                  <div className="col-span-4 flex items-center justify-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        updateSet(setIndex, 'reps', Math.max(1, (set.reps || 1) - 1))
                      }
                      className="w-6 h-7 rounded bg-[#101318] text-[#A8B0BC] hover:text-white font-mono text-xs font-bold border border-[#222A35] flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={set.reps}
                      onChange={e =>
                        updateSet(setIndex, 'reps', Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-12 bg-[#101318] border border-[#222A35] rounded-lg py-1 text-center font-mono font-bold text-sm text-white focus:border-[#B7F34A] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => updateSet(setIndex, 'reps', (set.reps || 1) + 1)}
                      className="w-6 h-7 rounded bg-[#101318] text-[#A8B0BC] hover:text-white font-mono text-xs font-bold border border-[#222A35] flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Check completion button */}
                  <div className="col-span-2 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => toggleSetCompleted(setIndex)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-md ${
                        set.completed
                          ? 'bg-[#B7F34A] text-[#101318]'
                          : 'bg-[#101318] text-[#A8B0BC] border border-[#222A35] hover:border-[#B7F34A]'
                      }`}
                      title={set.completed ? 'Série concluída' : 'Marcar como concluída'}
                    >
                      <Check
                        className={`w-5 h-5 ${set.completed ? 'stroke-[3]' : 'stroke-2'}`}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table Footer: Add set or remove set */}
          <div className="p-3 bg-[#101318] border-t border-[#222A35] flex items-center justify-between">
            <button
              onClick={addSet}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#222A35] hover:bg-[#2b3542] text-xs font-bold text-white transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#B7F34A]" />
              <span>Adicionar Série</span>
            </button>

            {currentExConfig && currentExConfig.sets.length > 1 && (
              <button
                onClick={() => removeSet(currentExConfig.sets.length - 1)}
                className="text-xs text-[#A8B0BC] hover:text-red-400 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remover Última</span>
              </button>
            )}
          </div>
        </div>

        {/* PRs achieved banner if any */}
        {achievedPRs.length > 0 && (
          <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 to-[#191F28] border border-amber-500/40 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/30 flex items-center justify-center text-amber-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                Novo Recorde Pessoal Registrado!
              </span>
              <div className="text-xs font-bold text-white">
                {achievedPRs[achievedPRs.length - 1].exerciseName} —{' '}
                {achievedPRs[achievedPRs.length - 1].weight} {weightUnit} ×{' '}
                {achievedPRs[achievedPRs.length - 1].reps} reps
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Rest Countdown Timer Card */}
      {restSecondsRemaining !== null && (
        <div className="fixed bottom-20 left-4 right-4 max-w-sm mx-auto z-40 animate-slideUp">
          <div className="bg-[#191F28] border-2 border-[#B7F34A] rounded-2xl p-4 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#B7F34A] animate-spin" />
                <span className="text-xs font-bold text-[#A8B0BC] uppercase tracking-wider">
                  Descanso
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-1 rounded bg-[#101318] text-[#A8B0BC] hover:text-white"
                  title={soundEnabled ? 'Silenciar som' : 'Ativar som'}
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#B7F34A]" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={closeRestTimer}
                  className="p-1 rounded bg-[#101318] text-[#A8B0BC] hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Countdown Display */}
            <div className="text-center py-2">
              <div
                className={`text-4xl font-black font-mono tracking-tight ${
                  restSecondsRemaining <= 5 ? 'text-amber-400 animate-pulse' : 'text-[#B7F34A]'
                }`}
              >
                {formatTime(restSecondsRemaining)}
              </div>
              {restSecondsRemaining === 0 && (
                <div className="text-xs font-bold text-[#B7F34A] mt-1">Hora da próxima série!</div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-1 pt-2 border-t border-[#222A35]">
              <button
                onClick={() => adjustRest(-15)}
                className="px-2.5 py-1 rounded-lg bg-[#101318] text-xs font-mono font-bold text-[#A8B0BC] hover:text-white"
              >
                -15s
              </button>
              <button
                onClick={() => setIsRestPaused(!isRestPaused)}
                className="px-3 py-1 rounded-lg bg-[#222A35] text-xs font-bold text-white hover:bg-[#2b3542]"
              >
                {isRestPaused ? 'Retomar' : 'Pausar'}
              </button>
              <button
                onClick={() => adjustRest(30)}
                className="px-2.5 py-1 rounded-lg bg-[#101318] text-xs font-mono font-bold text-[#A8B0BC] hover:text-white"
              >
                +30s
              </button>
              <button
                onClick={closeRestTimer}
                className="px-3 py-1 rounded-lg bg-[#B7F34A] text-[#101318] text-xs font-bold"
              >
                Pular
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Discard Confirmation Modal */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#191F28] border border-red-500/30 rounded-2xl max-w-sm w-full p-5 text-white">
            <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold mb-1">Descartar treino em andamento?</h3>
            <p className="text-xs text-[#A8B0BC] leading-relaxed mb-4">
              As séries registradas nesta sessão serão descartadas e não serão salvas no histórico.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDiscardConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#222A35] text-white text-xs font-bold"
              >
                Continuar Treino
              </button>
              <button
                onClick={() => {
                  clearActiveSession();
                  onDiscardSession();
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Sim, Descartar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Workout Completion Summary Modal */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#191F28] border border-[#222A35] rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 text-white relative shadow-2xl">
            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-[#B7F34A]/20 border border-[#B7F34A]/40 flex items-center justify-center text-[#B7F34A] mx-auto mb-3 shadow-[0_0_24px_rgba(183,243,74,0.3)]">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white">Treino Concluído com Sucesso!</h3>
              <p className="text-xs text-[#A8B0BC] mt-1">{currentSession.routineName}</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              <div className="p-3 rounded-xl bg-[#101318] border border-[#222A35]">
                <span className="text-[10px] text-[#A8B0BC] uppercase font-bold block">Duração</span>
                <span className="text-sm font-black font-mono text-[#B7F34A]">
                  {formatTime(elapsedSeconds)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#101318] border border-[#222A35]">
                <span className="text-[10px] text-[#A8B0BC] uppercase font-bold block">Séries Feitas</span>
                <span className="text-sm font-black font-mono text-white">
                  {currentSession.totalSetsCompleted}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#101318] border border-[#222A35]">
                <span className="text-[10px] text-[#A8B0BC] uppercase font-bold block">Volume Total</span>
                <span className="text-sm font-black font-mono text-white">
                  {currentSession.totalVolumeKg} {weightUnit}
                </span>
              </div>
            </div>

            {/* PRs achieved */}
            {achievedPRs.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-4">
                <span className="text-[11px] font-bold text-amber-400 block mb-1">
                  🏆 Novos Recordes Pessoais:
                </span>
                <div className="space-y-1 text-xs text-white">
                  {achievedPRs.map((pr, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{pr.exerciseName}</span>
                      <strong className="text-[#B7F34A] font-mono">
                        {pr.weight} {weightUnit} × {pr.reps} reps
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-[#A8B0BC] mb-1">
                Observações do Treino (como se sentiu, pump, etc.)
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Treino muito produtivo, boa progressão no supino..."
                value={sessionNotes}
                onChange={e => setSessionNotes(e.target.value)}
                className="w-full bg-[#101318] border border-[#222A35] rounded-xl p-3 text-white text-xs focus:border-[#B7F34A] outline-none resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowFinishModal(false)}
                className="flex-1 py-3 rounded-xl bg-[#222A35] text-white text-xs font-bold"
              >
                Voltar
              </button>
              <button
                onClick={handleConfirmFinish}
                className="flex-2 py-3 rounded-xl bg-[#B7F34A] hover:bg-[#c6fb62] text-[#101318] text-xs font-black shadow-lg"
              >
                Finalizar e Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
