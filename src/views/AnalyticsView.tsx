/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Dumbbell,
  TrendingUp,
  Award,
  ChevronDown,
  ChevronUp,
  Trash2,
  Trophy,
  Zap,
  Shield,
  Crown,
  Flame,
  CheckCircle2,
  Sparkles,
  BarChart2,
  History,
  AlertTriangle
} from 'lucide-react';
import {
  WorkoutSession,
  Achievement,
  ExercisePR,
  Exercise
} from '../types';

interface AnalyticsViewProps {
  history: WorkoutSession[];
  achievements: Achievement[];
  personalRecords: ExercisePR[];
  exercisesLibrary: Exercise[];
  onDeleteSession: (sessionId: string) => void;
  weightUnit?: 'kg' | 'lb';
}

const PERIOD_FILTERS = [
  { id: '7d', label: '7 dias' },
  { id: '30d', label: '30 dias' },
  { id: '90d', label: '3 meses' },
  { id: '1y', label: '1 ano' },
  { id: 'all', label: 'Todos' }
];

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  history,
  achievements,
  personalRecords,
  exercisesLibrary,
  onDeleteSession,
  weightUnit = 'kg'
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'charts' | 'achievements'>('history');
  const [periodFilter, setPeriodFilter] = useState('30d');
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [selectedExerciseForProgression, setSelectedExerciseForProgression] = useState<string>('');
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);

  // Filter sessions by period
  const now = new Date();
  const filteredSessions = history.filter(session => {
    if (periodFilter === 'all') return true;
    const sessionDate = new Date(session.startedAt);
    const diffDays = (now.getTime() - sessionDate.getTime()) / (1000 * 3600 * 24);

    if (periodFilter === '7d') return diffDays <= 7;
    if (periodFilter === '30d') return diffDays <= 30;
    if (periodFilter === '90d') return diffDays <= 90;
    if (periodFilter === '1y') return diffDays <= 365;
    return true;
  });

  const completedSessions = filteredSessions.filter(s => s.status === 'completed');

  // Exercise progression data extraction
  // Find which exercises have been performed at least once
  const exercisesWithHistory = Array.from(
    new Set(
      history.flatMap(s => s.exercises.map(e => e.exerciseId))
    )
  );

  const selectedExerciseId =
    selectedExerciseForProgression || exercisesWithHistory[0] || 'ex-peito-supino-reto';

  // Progression datapoints for selected exercise (ordered chronological)
  const progressionData = [...history]
    .reverse()
    .flatMap(session => {
      const match = session.exercises.find(e => e.exerciseId === selectedExerciseId);
      if (!match) return [];
      const completedSets = match.sets.filter(s => s.completed && s.weight > 0);
      if (completedSets.length === 0) return [];
      const maxWeight = Math.max(...completedSets.map(s => s.weight));
      const maxReps = completedSets.find(s => s.weight === maxWeight)?.reps || 0;
      return [
        {
          date: new Date(session.startedAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit'
          }),
          weight: maxWeight,
          reps: maxReps,
          totalVolume: completedSets.reduce((sum, s) => sum + s.weight * s.reps, 0)
        }
      ];
    });

  // Icon selector for achievements
  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return <Flame className="w-5 h-5 text-orange-400" />;
      case 'Trophy': return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-[#B7F34A]" />;
      case 'Shield': return <Shield className="w-5 h-5 text-blue-400" />;
      case 'Crown': return <Crown className="w-5 h-5 text-amber-400" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'Dumbbell': return <Dumbbell className="w-5 h-5 text-purple-400" />;
      default: return <Award className="w-5 h-5 text-[#B7F34A]" />;
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white">Evolução &amp; Resultados</h1>
        <p className="text-xs text-[#A8B0BC]">
          Acompanhe seu histórico real, progressão de carga por exercício e conquistas
        </p>
      </div>

      {/* Main Subtab Switcher */}
      <div className="grid grid-cols-3 p-1 bg-[#191F28] rounded-2xl border border-[#222A35]">
        <button
          onClick={() => setActiveTab('history')}
          className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'history'
              ? 'bg-[#B7F34A] text-[#101318] shadow'
              : 'text-[#A8B0BC] hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Histórico</span>
        </button>

        <button
          onClick={() => setActiveTab('charts')}
          className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'charts'
              ? 'bg-[#B7F34A] text-[#101318] shadow'
              : 'text-[#A8B0BC] hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Gráficos &amp; PRs</span>
        </button>

        <button
          onClick={() => setActiveTab('achievements')}
          className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'achievements'
              ? 'bg-[#B7F34A] text-[#101318] shadow'
              : 'text-[#A8B0BC] hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Conquistas</span>
        </button>
      </div>

      {/* TAB 1: HISTÓRICO */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {/* Period Filter Buttons */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
            {PERIOD_FILTERS.map(p => (
              <button
                key={p.id}
                onClick={() => setPeriodFilter(p.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  periodFilter === p.id
                    ? 'bg-[#222A35] text-[#B7F34A] border border-[#B7F34A]/40'
                    : 'bg-[#191F28] text-[#A8B0BC] border border-[#222A35] hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Sessions List */}
          {completedSessions.length === 0 ? (
            <div className="text-center py-12 rounded-3xl bg-[#191F28] border border-dashed border-[#222A35] p-6 space-y-2">
              <History className="w-10 h-10 text-[#A8B0BC] mx-auto mb-2" />
              <h3 className="text-base font-bold text-white">Nenhum treino no período</h3>
              <p className="text-xs text-[#A8B0BC]">
                Conclua treinos no aplicativo para visualizar seu histórico detalhado aqui.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {completedSessions.map(session => {
                const isExpanded = expandedSessionId === session.id;
                const formattedDate = new Intl.DateTimeFormat('pt-BR', {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }).format(new Date(session.startedAt));

                return (
                  <div
                    key={session.id}
                    className="rounded-2xl bg-[#191F28] border border-[#222A35] overflow-hidden"
                  >
                    {/* Header */}
                    <div
                      onClick={() =>
                        setExpandedSessionId(prev => (prev === session.id ? null : session.id))
                      }
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-xs text-[#A8B0BC] mb-1">
                          <Calendar className="w-3.5 h-3.5 text-[#B7F34A]" />
                          <span>{formattedDate}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#B7F34A]" />
                            {Math.round(session.durationSeconds / 60)} min
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white">{session.routineName}</h3>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#222A35]">
                        <div className="text-right">
                          <div className="text-xs font-mono font-bold text-[#B7F34A]">
                            {session.totalVolumeKg} {weightUnit}
                          </div>
                          <span className="text-[10px] text-[#A8B0BC]">
                            {session.totalSetsCompleted} séries concluídas
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              setDeleteCandidateId(session.id);
                            }}
                            className="p-2 rounded-xl bg-[#101318] text-[#A8B0BC] hover:text-red-400 hover:border-red-500/30 transition-colors"
                            title="Excluir registro deste treino"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="p-2 text-[#A8B0BC]">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="p-4 bg-[#101318]/70 border-t border-[#222A35] space-y-3">
                        {session.notes && (
                          <div className="p-2.5 rounded-xl bg-[#191F28] border border-[#222A35] text-xs text-gray-300 italic">
                            &ldquo;{session.notes}&rdquo;
                          </div>
                        )}

                        {session.prsAchieved && session.prsAchieved.length > 0 && (
                          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
                            <span>
                              <strong>Recordes neste treino:</strong>{' '}
                              {session.prsAchieved.map(pr => `${pr.exerciseName} (${pr.weight}${weightUnit} × ${pr.reps})`).join(', ')}
                            </span>
                          </div>
                        )}

                        <div className="space-y-2">
                          {session.exercises.map((ex, exIdx) => {
                            const exData = exercisesLibrary.find(e => e.id === ex.exerciseId);
                            const completedSets = ex.sets.filter(s => s.completed);

                            return (
                              <div
                                key={exIdx}
                                className="p-3 rounded-xl bg-[#191F28] border border-[#222A35] space-y-1.5"
                              >
                                <div className="text-xs font-bold text-white flex items-center justify-between">
                                  <span>{exData?.name || 'Exercício'}</span>
                                  <span className="text-[11px] text-[#A8B0BC] font-mono">
                                    {completedSets.length} séries
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {completedSets.map((set, sIdx) => (
                                    <span
                                      key={sIdx}
                                      className="px-2 py-1 rounded bg-[#101318] text-[11px] font-mono text-white border border-[#222A35]"
                                    >
                                      S{set.setNumber}: <strong>{set.weight}</strong>
                                      {weightUnit} × <strong>{set.reps}</strong>
                                    </span>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: GRÁFICOS & RECORDES PESSOAIS */}
      {activeTab === 'charts' && (
        <div className="space-y-5">
          {/* Exercise Progression Selector */}
          <div className="p-5 rounded-2xl bg-[#191F28] border border-[#222A35] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#B7F34A]" />
                  Evolução de Carga por Exercício
                </h3>
                <p className="text-xs text-[#A8B0BC]">
                  Selecione um exercício para visualizar a evolução das cargas máximas
                </p>
              </div>

              <select
                value={selectedExerciseId}
                onChange={e => setSelectedExerciseForProgression(e.target.value)}
                className="bg-[#101318] border border-[#222A35] rounded-xl px-3 py-2 text-white text-xs font-semibold focus:border-[#B7F34A] outline-none"
              >
                {exercisesLibrary.map(ex => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name}
                  </option>
                ))}
              </select>
            </div>

            {progressionData.length < 1 ? (
              <div className="text-center py-8 rounded-xl bg-[#101318] border border-[#222A35] text-xs text-[#A8B0BC]">
                Nenhum treino registrado ainda para este exercício. Conclua treinos com ele para ver o gráfico!
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#101318] border border-[#222A35]">
                <div className="h-44 w-full flex items-end gap-2 sm:gap-4 pt-6 pb-2 px-2 overflow-x-auto">
                  {(() => {
                    const maxWeightOverall = Math.max(...progressionData.map(d => d.weight), 1);
                    return progressionData.map((d, i) => {
                      const heightPercent = Math.max(15, Math.round((d.weight / maxWeightOverall) * 100));
                      return (
                        <div
                          key={i}
                          className="flex-1 min-w-[42px] max-w-[64px] flex flex-col items-center gap-1.5 h-full justify-end group"
                        >
                          <span className="text-[10px] font-mono font-bold text-[#B7F34A] group-hover:scale-110 transition-transform">
                            {d.weight}
                          </span>
                          <div
                            className="w-full bg-gradient-to-t from-[#B7F34A]/40 to-[#B7F34A] rounded-t-lg transition-all group-hover:brightness-125"
                            style={{ height: `${heightPercent}%` }}
                          />
                          <span className="text-[9px] font-mono text-[#A8B0BC] whitespace-nowrap">
                            {d.date}
                          </span>
                        </div>
                      );
                    });
                  })()}
                </div>
                <div className="text-right text-[10px] text-[#A8B0BC] mt-2">
                  Valores em {weightUnit} (carga máxima registrada na sessão)
                </div>
              </div>
            )}
          </div>

          {/* Personal Records (PRs) Leaderboard */}
          <div className="p-5 rounded-2xl bg-[#191F28] border border-[#222A35]">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <div>
                <h3 className="text-sm font-bold text-white">Quadro de Recordes Pessoais (PRs)</h3>
                <p className="text-xs text-[#A8B0BC]">Suas maiores cargas registradas e 1RM estimada</p>
              </div>
            </div>

            {personalRecords.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#A8B0BC]">
                Nenhum recorde registrado ainda. Inicie seu treino para marcar seu primeiro PR!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {personalRecords.map((pr, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#101318] border border-[#222A35] flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-white block">{pr.exerciseName}</span>
                      <span className="text-[10px] text-[#A8B0BC]">
                        {pr.maxWeight} {weightUnit} × {pr.maxReps} reps
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-[#A8B0BC] uppercase block">1RM Est.</span>
                      <span className="text-sm font-black font-mono text-[#B7F34A]">
                        {pr.estimated1RM} {weightUnit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CONQUISTAS */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {achievements.map(ach => {
            const isUnlocked = ach.currentValue >= ach.targetValue;
            const progressPercent = Math.min(
              100,
              Math.round((ach.currentValue / ach.targetValue) * 100)
            );

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isUnlocked
                    ? 'bg-[#191F28] border-[#B7F34A]/40 shadow-[0_0_15px_rgba(183,243,74,0.05)]'
                    : 'bg-[#191F28]/50 border-[#222A35] opacity-75'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      isUnlocked
                        ? 'bg-[#B7F34A]/20 border border-[#B7F34A]/50'
                        : 'bg-[#101318] border border-[#222A35]'
                    }`}
                  >
                    {getAchievementIcon(ach.icon)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-white truncate">{ach.title}</h4>
                      {isUnlocked && (
                        <span className="px-1.5 py-0.5 rounded bg-[#B7F34A] text-[#101318] text-[9px] font-black uppercase">
                          Desbloqueado
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-[#A8B0BC] mt-0.5 leading-snug">
                      {ach.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-2.5">
                      <div className="flex justify-between text-[10px] font-mono text-[#A8B0BC] mb-1">
                        <span>Progresso</span>
                        <span className="font-bold text-white">
                          {ach.currentValue} / {ach.targetValue}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-[#101318] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isUnlocked ? 'bg-[#B7F34A]' : 'bg-[#222A35]'
                          }`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidateId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#191F28] border border-red-500/30 rounded-2xl max-w-sm w-full p-5 text-white">
            <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold mb-1">Remover registro do histórico?</h3>
            <p className="text-xs text-[#A8B0BC] leading-relaxed mb-4">
              Esta ação remove a sessão selecionada do histórico de treinos. Os modelos de treino permanecem intactos.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteCandidateId(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#222A35] text-white text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDeleteSession(deleteCandidateId);
                  setDeleteCandidateId(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Sim, Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
