/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Play,
  Plus,
  Copy,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Dumbbell,
  Clock,
  Calendar,
  Layers,
  AlertTriangle
} from 'lucide-react';
import { WorkoutRoutine, Exercise, SplitTag } from '../types';

interface RoutinesViewProps {
  routines: WorkoutRoutine[];
  exercisesLibrary: Exercise[];
  onStartWorkout: (routine: WorkoutRoutine) => void;
  onEditRoutine: (routine: WorkoutRoutine) => void;
  onDuplicateRoutine: (id: string) => void;
  onDeleteRoutine: (id: string) => void;
  onOpenCreateModal: () => void;
  weightUnit?: 'kg' | 'lb';
}

const SPLIT_FILTERS: { id: string; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'A', label: 'Divisão A' },
  { id: 'B', label: 'Divisão B' },
  { id: 'C', label: 'Divisão C' },
  { id: 'D', label: 'Divisão D' },
  { id: 'E', label: 'Divisão E' },
  { id: 'Personalizado', label: 'Personalizados' }
];

const WEEKDAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const RoutinesView: React.FC<RoutinesViewProps> = ({
  routines,
  exercisesLibrary,
  onStartWorkout,
  onEditRoutine,
  onDuplicateRoutine,
  onDeleteRoutine,
  onOpenCreateModal,
  weightUnit = 'kg'
}) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [expandedRoutineId, setExpandedRoutineId] = useState<string | null>(null);
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);

  const filteredRoutines = routines.filter(r => {
    if (selectedFilter === 'all') return true;
    return r.splitTag === selectedFilter;
  });

  const toggleExpand = (id: string) => {
    setExpandedRoutineId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">Minhas Rotinas de Treino</h1>
          <p className="text-xs text-[#A8B0BC]">
            Organize divisões A, B, C, D e E, configure cargas e planeje sua semana
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="px-4 py-2.5 rounded-xl bg-[#B7F34A] hover:bg-[#c6fb62] text-[#101318] text-xs font-black shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Criar Treino</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
        {SPLIT_FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setSelectedFilter(f.id)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedFilter === f.id
                ? 'bg-[#B7F34A] text-[#101318] shadow'
                : 'bg-[#191F28] text-[#A8B0BC] border border-[#222A35] hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Routine Cards List */}
      {filteredRoutines.length === 0 ? (
        <div className="text-center py-12 rounded-3xl bg-[#191F28] border border-dashed border-[#222A35] p-6 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#101318] border border-[#222A35] flex items-center justify-center text-[#B7F34A] mx-auto">
            <Dumbbell className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Nenhum treino encontrado</h3>
          <p className="text-xs text-[#A8B0BC] max-w-sm mx-auto">
            Crie sua primeira rotina de treino personalizada com exercícios, séries e cargas previstas.
          </p>
          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-[#B7F34A] text-[#101318] font-bold text-xs"
          >
            Criar Treino Agora
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRoutines.map(routine => {
            const isExpanded = expandedRoutineId === routine.id;

            return (
              <div
                key={routine.id}
                className="rounded-2xl bg-[#191F28] border border-[#222A35] hover:border-[#2b3542] transition-all overflow-hidden"
              >
                {/* Main Card Header */}
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1 cursor-pointer" onClick={() => toggleExpand(routine.id)}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-[#B7F34A] text-[#101318] text-xs font-black">
                        Divisão {routine.splitTag}
                      </span>
                      {routine.scheduledDays.length > 0 && (
                        <span className="flex items-center gap-1 text-[11px] text-[#A8B0BC] bg-[#101318] px-2 py-0.5 rounded-md border border-[#222A35]">
                          <Calendar className="w-3 h-3 text-[#B7F34A]" />
                          {routine.scheduledDays.map(d => WEEKDAY_NAMES[d]).join(', ')}
                        </span>
                      )}
                      <span className="text-[11px] text-[#A8B0BC] bg-[#101318] px-2 py-0.5 rounded-md border border-[#222A35]">
                        {routine.exercises.length} exercícios
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold text-white">
                      {routine.name}
                    </h3>

                    {routine.description && (
                      <p className="text-xs text-[#A8B0BC] line-clamp-1">
                        {routine.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1 pt-1">
                      {routine.targetMuscleGroups.map(m => (
                        <span
                          key={m}
                          className="px-2 py-0.5 rounded bg-[#101318] text-[#A8B0BC] text-[10px] font-semibold border border-[#222A35]"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#222A35]">
                    <button
                      onClick={() => onStartWorkout(routine)}
                      className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-[#B7F34A] hover:bg-[#c6fb62] text-[#101318] font-black text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-[#101318]" />
                      <span>Iniciar</span>
                    </button>

                    <button
                      onClick={() => onEditRoutine(routine)}
                      className="p-2.5 rounded-xl bg-[#101318] border border-[#222A35] text-[#A8B0BC] hover:text-white hover:border-[#2b3542] transition-colors cursor-pointer"
                      title="Editar rotina"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDuplicateRoutine(routine.id)}
                      className="p-2.5 rounded-xl bg-[#101318] border border-[#222A35] text-[#A8B0BC] hover:text-[#B7F34A] hover:border-[#B7F34A]/30 transition-colors cursor-pointer"
                      title="Duplicar treino"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeleteCandidateId(routine.id)}
                      className="p-2.5 rounded-xl bg-[#101318] border border-[#222A35] text-[#A8B0BC] hover:text-red-400 hover:border-red-500/30 transition-colors cursor-pointer"
                      title="Excluir rotina"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => toggleExpand(routine.id)}
                      className="p-2.5 rounded-xl bg-[#101318] border border-[#222A35] text-[#A8B0BC] hover:text-white transition-colors cursor-pointer"
                      title="Expandir exercícios"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Exercises Breakdown */}
                {isExpanded && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 border-t border-[#222A35] bg-[#101318]/50 space-y-2">
                    <span className="text-[11px] font-bold text-[#A8B0BC] uppercase tracking-wider block mb-2">
                      Sequência de Exercícios e Metas Planejadas:
                    </span>
                    <div className="space-y-1.5">
                      {routine.exercises.map((item, idx) => {
                        const exData = exercisesLibrary.find(e => e.id === item.exerciseId);
                        return (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-[#101318] border border-[#222A35] flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-[#222A35] font-mono text-[10px] font-bold text-[#B7F34A] flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <span className="font-bold text-white">
                                {exData?.name || 'Exercício'}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 text-[#A8B0BC] font-mono text-[11px]">
                              <span>
                                {item.targetSets} séries × {item.targetReps} reps
                              </span>
                              {item.targetWeight ? (
                                <span className="font-bold text-white">
                                  {item.targetWeight} {weightUnit}
                                </span>
                              ) : null}
                              <span className="flex items-center gap-1 text-[#B7F34A]">
                                <Clock className="w-3 h-3" />
                                {item.restSeconds}s
                              </span>
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

      {/* Delete Confirmation Modal */}
      {deleteCandidateId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#191F28] border border-red-500/30 rounded-2xl max-w-sm w-full p-5 text-white">
            <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold mb-1">Excluir esta rotina?</h3>
            <p className="text-xs text-[#A8B0BC] leading-relaxed mb-4">
              O modelo do treino será apagado. Seu histórico de treinos passados permanecerá 100% intacto e protegido.
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
                  onDeleteRoutine(deleteCandidateId);
                  setDeleteCandidateId(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
