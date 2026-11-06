/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Play,
  RotateCcw,
  Plus,
  Flame,
  Calendar,
  Clock,
  Dumbbell,
  TrendingUp,
  Award,
  ChevronRight,
  BookOpen,
  Calculator,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import {
  UserProfile,
  WorkoutRoutine,
  WorkoutSession,
  Exercise
} from '../types';

interface DashboardViewProps {
  profile: UserProfile;
  routines: WorkoutRoutine[];
  history: WorkoutSession[];
  activeSession: WorkoutSession | null;
  onStartWorkout: (routine: WorkoutRoutine) => void;
  onResumeWorkout: () => void;
  onNavigateToTab: (tab: 'routines' | 'exercises' | 'analytics' | 'profile') => void;
  onOpenCreateRoutine: () => void;
  onOpenCalculator: () => void;
  weightUnit?: 'kg' | 'lb';
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  routines,
  history,
  activeSession,
  onStartWorkout,
  onResumeWorkout,
  onNavigateToTab,
  onOpenCreateRoutine,
  onOpenCalculator,
  weightUnit = 'kg'
}) => {
  const now = new Date();
  const currentDayOfWeek = now.getDay(); // 0 = Domingo, 1 = Segunda...

  // Personalized Greeting
  const getGreeting = () => {
    const hour = now.getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // Formatted date string in pt-BR
  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(now);
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  // Today's scheduled routine (or first available routine)
  const scheduledRoutine = routines.find(r => r.scheduledDays.includes(currentDayOfWeek)) || routines[0];

  // Stats calculation
  const completedWorkouts = history.filter(h => h.status === 'completed');
  const totalCompletedCount = completedWorkouts.length;

  // Calculate workouts done this week (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const thisWeekWorkouts = completedWorkouts.filter(
    h => new Date(h.startedAt) >= sevenDaysAgo
  );

  // Total accumulated training minutes
  const totalTrainingSeconds = completedWorkouts.reduce(
    (acc, curr) => acc + (curr.durationSeconds || 0),
    0
  );
  const totalHours = Math.floor(totalTrainingSeconds / 3600);
  const totalMinutes = Math.floor((totalTrainingSeconds % 3600) / 60);

  // Total volume kg
  const totalVolume = completedWorkouts.reduce(
    (acc, curr) => acc + (curr.totalVolumeKg || 0),
    0
  );

  // Last finished session
  const lastSession = completedWorkouts[0] || null;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#191F28] via-[#151A22] to-[#101318] border border-[#222A35] relative overflow-hidden shadow-xl">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#B7F34A]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#A8B0BC] uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5 text-[#B7F34A]" />
              <span>{capitalizedDate}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {getGreeting()},{' '}
              <span className="text-[#B7F34A]">{profile.nickname || profile.name}</span>!
            </h1>
            <p className="text-xs text-[#A8B0BC] mt-1">
              {activeSession
                ? 'Você possui um treino em andamento. Continue agora mesmo!'
                : scheduledRoutine
                ? `Hoje é dia de ${scheduledRoutine.name}. Mantenha o foco e a disciplina!`
                : 'Crie seu primeiro treino ou escolha um exercício para começar!'}
            </p>
          </div>

          {/* Primary Action Button */}
          <div className="shrink-0">
            {activeSession ? (
              <button
                onClick={onResumeWorkout}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#B7F34A] hover:bg-[#c6fb62] text-[#101318] font-black text-sm transition-all shadow-[0_4px_20px_rgba(183,243,74,0.3)] flex items-center justify-center gap-2 cursor-pointer animate-lime-pulse"
              >
                <RotateCcw className="w-4 h-4 stroke-[3]" />
                <span>CONTINUAR TREINO</span>
              </button>
            ) : scheduledRoutine ? (
              <button
                onClick={() => onStartWorkout(scheduledRoutine)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#B7F34A] hover:bg-[#c6fb62] text-[#101318] font-black text-sm transition-all shadow-[0_4px_20px_rgba(183,243,74,0.3)] flex items-center justify-center gap-2 cursor-pointer group"
              >
                <Play className="w-4 h-4 fill-[#101318] group-hover:scale-110 transition-transform" />
                <span>COMEÇAR TREINO</span>
              </button>
            ) : (
              <button
                onClick={onOpenCreateRoutine}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#B7F34A] hover:bg-[#c6fb62] text-[#101318] font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>CRIAR PRIMEIRO TREINO</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#191F28] border border-[#222A35]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#A8B0BC] uppercase tracking-wider">
              Treinos Feitos
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#B7F34A]/10 flex items-center justify-center text-[#B7F34A]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white">{totalCompletedCount}</div>
          <span className="text-[10px] text-[#A8B0BC]">sessões concluídas</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#191F28] border border-[#222A35]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#A8B0BC] uppercase tracking-wider">
              Semanal
            </span>
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {thisWeekWorkouts.length} <span className="text-xs text-[#A8B0BC] font-sans">treinos</span>
          </div>
          <span className="text-[10px] text-[#A8B0BC]">últimos 7 dias</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#191F28] border border-[#222A35]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#A8B0BC] uppercase tracking-wider">
              Tempo Total
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {totalHours > 0 ? `${totalHours}h ${totalMinutes}m` : `${totalMinutes} min`}
          </div>
          <span className="text-[10px] text-[#A8B0BC]">dedicados à saúde</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#191F28] border border-[#222A35]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#A8B0BC] uppercase tracking-wider">
              Volume Total
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Dumbbell className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {totalVolume > 1000
              ? `${(totalVolume / 1000).toFixed(1)}k`
              : totalVolume}{' '}
            <span className="text-xs text-[#A8B0BC] font-sans">{weightUnit}</span>
          </div>
          <span className="text-[10px] text-[#A8B0BC]">tonelagem levantada</span>
        </div>
      </div>

      {/* Programmed Workout Card & Last Workout Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Scheduled Routine Card */}
        <div className="p-5 rounded-2xl bg-[#191F28] border border-[#222A35] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#B7F34A]/10 text-[#B7F34A] text-xs font-bold border border-[#B7F34A]/30">
                Treino Sugerido para Hoje
              </span>
              <button
                onClick={() => onNavigateToTab('routines')}
                className="text-xs text-[#A8B0BC] hover:text-white flex items-center gap-1 cursor-pointer"
              >
                Ver todos <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {scheduledRoutine ? (
              <>
                <h3 className="text-base font-extrabold text-white mt-2">
                  {scheduledRoutine.name}
                </h3>
                <p className="text-xs text-[#A8B0BC] mt-1 line-clamp-2">
                  {scheduledRoutine.description || 'Rotina planejada para evolução muscular contínua.'}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {scheduledRoutine.targetMuscleGroups.map(m => (
                    <span
                      key={m}
                      className="px-2 py-0.5 rounded bg-[#101318] text-[#A8B0BC] text-[10px] font-semibold border border-[#222A35]"
                    >
                      {m}
                    </span>
                  ))}
                  <span className="px-2 py-0.5 rounded bg-[#101318] text-[#B7F34A] text-[10px] font-mono font-bold border border-[#222A35]">
                    {scheduledRoutine.exercises.length} exercícios
                  </span>
                </div>
              </>
            ) : (
              <div className="py-6 text-center text-xs text-[#A8B0BC]">
                Nenhuma rotina cadastrada ainda.
              </div>
            )}
          </div>

          {scheduledRoutine && (
            <button
              onClick={() => onStartWorkout(scheduledRoutine)}
              className="mt-4 w-full py-2.5 rounded-xl bg-[#222A35] hover:bg-[#B7F34A] hover:text-[#101318] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Iniciar Esta Sessão</span>
            </button>
          )}
        </div>

        {/* Last Workout Session */}
        <div className="p-5 rounded-2xl bg-[#191F28] border border-[#222A35] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#A8B0BC] uppercase tracking-wider">
                Último Treino Realizado
              </span>
              <button
                onClick={() => onNavigateToTab('analytics')}
                className="text-xs text-[#A8B0BC] hover:text-white flex items-center gap-1 cursor-pointer"
              >
                Histórico <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {lastSession ? (
              <>
                <h3 className="text-base font-extrabold text-white mt-2">
                  {lastSession.routineName}
                </h3>
                <div className="text-xs text-[#A8B0BC] mt-1 flex items-center gap-2">
                  <span>
                    {new Intl.DateTimeFormat('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    }).format(new Date(lastSession.startedAt))}
                  </span>
                  <span>•</span>
                  <span>{Math.round(lastSession.durationSeconds / 60)} min</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="p-2.5 rounded-xl bg-[#101318] border border-[#222A35] text-center">
                    <span className="text-[10px] text-[#A8B0BC] block">Séries Concluídas</span>
                    <span className="text-xs font-mono font-bold text-white">
                      {lastSession.totalSetsCompleted} séries
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#101318] border border-[#222A35] text-center">
                    <span className="text-[10px] text-[#A8B0BC] block">Volume Levantado</span>
                    <span className="text-xs font-mono font-bold text-[#B7F34A]">
                      {lastSession.totalVolumeKg} {weightUnit}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-6 text-center text-xs text-[#A8B0BC]">
                Ainda não há registros de treinos finalizados. Seu primeiro treino aparecerá aqui!
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigateToTab('analytics')}
            className="mt-4 w-full py-2.5 rounded-xl bg-[#101318] border border-[#222A35] hover:border-[#B7F34A]/40 text-[#A8B0BC] hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#B7F34A]" />
            <span>Consultar Evolução Completa</span>
          </button>
        </div>
      </div>

      {/* Quick Access Shortcuts */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => onNavigateToTab('exercises')}
          className="p-4 rounded-2xl bg-[#191F28] border border-[#222A35] hover:border-[#B7F34A]/40 transition-all text-left group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#101318] border border-[#222A35] flex items-center justify-center text-[#B7F34A] mb-2 group-hover:scale-105 transition-transform">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-white">Biblioteca</div>
          <div className="text-[10px] text-[#A8B0BC]">Consultar exercícios</div>
        </button>

        <button
          onClick={onOpenCalculator}
          className="p-4 rounded-2xl bg-[#191F28] border border-[#222A35] hover:border-[#B7F34A]/40 transition-all text-left group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#101318] border border-[#222A35] flex items-center justify-center text-[#B7F34A] mb-2 group-hover:scale-105 transition-transform">
            <Calculator className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-white">Calculadora 1RM</div>
          <div className="text-[10px] text-[#A8B0BC]">Cargas e anilhas</div>
        </button>

        <button
          onClick={onOpenCreateRoutine}
          className="p-4 rounded-2xl bg-[#191F28] border border-[#222A35] hover:border-[#B7F34A]/40 transition-all text-left group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#101318] border border-[#222A35] flex items-center justify-center text-[#B7F34A] mb-2 group-hover:scale-105 transition-transform">
            <Plus className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-white">Novo Treino</div>
          <div className="text-[10px] text-[#A8B0BC]">Planejar rotina</div>
        </button>
      </div>
    </div>
  );
};
