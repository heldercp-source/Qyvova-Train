/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Dumbbell,
  Clock,
  Layers,
  AlertCircle,
  Search,
  Check
} from 'lucide-react';
import {
  WorkoutRoutine,
  WorkoutExerciseConfig,
  Exercise,
  MuscleGroup,
  SplitTag
} from '../types';

interface RoutineEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRoutine: (routine: WorkoutRoutine) => void;
  availableExercises: Exercise[];
  initialRoutine?: WorkoutRoutine | null;
  weightUnit?: 'kg' | 'lb';
}

const SPLIT_OPTIONS: SplitTag[] = ['A', 'B', 'C', 'D', 'E', 'Personalizado', 'Full Body'];

const ALL_MUSCLES: MuscleGroup[] = [
  'Peito',
  'Costas',
  'Pernas',
  'Ombros',
  'Bíceps',
  'Tríceps',
  'Abdômen',
  'Glúteos',
  'Panturrilhas',
  'Antebraço',
  'Cardio'
];

const WEEKDAYS = [
  { day: 0, label: 'Dom' },
  { day: 1, label: 'Seg' },
  { day: 2, label: 'Ter' },
  { day: 3, label: 'Qua' },
  { day: 4, label: 'Qui' },
  { day: 5, label: 'Sex' },
  { day: 6, label: 'Sáb' }
];

export const RoutineEditorModal: React.FC<RoutineEditorModalProps> = ({
  isOpen,
  onClose,
  onSaveRoutine,
  availableExercises,
  initialRoutine,
  weightUnit = 'kg'
}) => {
  const [name, setName] = useState(initialRoutine?.name || '');
  const [splitTag, setSplitTag] = useState<SplitTag>(initialRoutine?.splitTag || 'A');
  const [description, setDescription] = useState(initialRoutine?.description || '');
  const [targetMuscles, setTargetMuscles] = useState<MuscleGroup[]>(
    initialRoutine?.targetMuscleGroups || ['Peito']
  );
  const [scheduledDays, setScheduledDays] = useState<number[]>(
    initialRoutine?.scheduledDays || [1]
  );
  const [exercises, setExercises] = useState<WorkoutExerciseConfig[]>(
    initialRoutine?.exercises || []
  );

  // Exercise Picker sub-modal
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerCategory, setPickerCategory] = useState<string>('all');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const toggleMuscle = (muscle: MuscleGroup) => {
    if (targetMuscles.includes(muscle)) {
      if (targetMuscles.length > 1) {
        setTargetMuscles(targetMuscles.filter(m => m !== muscle));
      }
    } else {
      setTargetMuscles([...targetMuscles, muscle]);
    }
  };

  const toggleWeekday = (day: number) => {
    if (scheduledDays.includes(day)) {
      setScheduledDays(scheduledDays.filter(d => d !== day));
    } else {
      setScheduledDays([...scheduledDays, day].sort());
    }
  };

  const addExerciseFromPicker = (exerciseId: string) => {
    const exData = availableExercises.find(e => e.id === exerciseId);
    if (!exData) return;

    const newConfig: WorkoutExerciseConfig = {
      exerciseId,
      targetSets: exData.defaultSets || 3,
      targetReps: exData.defaultReps || 10,
      targetWeight: 0,
      restSeconds: exData.defaultRestSec || 60,
      notes: ''
    };

    setExercises([...exercises, newConfig]);
    setIsPickerOpen(false);
    setError('');
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const moveExercise = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === exercises.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...exercises];
    const item = reordered.splice(index, 1)[0];
    reordered.splice(targetIndex, 0, item);
    setExercises(reordered);
  };

  const updateExerciseConfig = (
    index: number,
    field: keyof WorkoutExerciseConfig,
    value: number | string
  ) => {
    const updated = [...exercises];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setExercises(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('O nome do treino é obrigatório.');
      return;
    }

    if (exercises.length === 0) {
      setError('Adicione pelo menos um exercício ao treino.');
      return;
    }

    const routineToSave: WorkoutRoutine = {
      id: initialRoutine?.id || `routine-${Date.now()}`,
      name: name.trim(),
      splitTag,
      description: description.trim(),
      targetMuscleGroups: targetMuscles,
      scheduledDays,
      exercises,
      createdAt: initialRoutine?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSaveRoutine(routineToSave);
    onClose();
  };

  // Filtered exercises for picker
  const filteredAvailable = availableExercises.filter(ex => {
    const matchesSearch =
      ex.name.toLowerCase().includes(pickerSearch.toLowerCase()) ||
      ex.category.toLowerCase().includes(pickerSearch.toLowerCase());
    const matchesCategory = pickerCategory === 'all' || ex.category === pickerCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#191F28] border border-[#222A35] rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 text-white relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[#222A35] text-[#A8B0BC] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-[#B7F34A]/10 border border-[#B7F34A]/30 flex items-center justify-center text-[#B7F34A]">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">
              {initialRoutine ? 'Editar Treino' : 'Criar Nova Rotina de Treino'}
            </h3>
            <p className="text-xs text-[#A8B0BC]">Planeje séries, repetições, intervalos e cargas</p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Routine Name & Split */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#A8B0BC] mb-1">
                Nome do Treino *
              </label>
              <input
                type="text"
                placeholder="Ex: Treino A — Peito, Deltoide e Tríceps"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  setError('');
                }}
                className="w-full bg-[#101318] border border-[#222A35] rounded-xl px-3 py-2.5 text-white font-medium text-sm focus:border-[#B7F34A] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#A8B0BC] mb-1">
                Divisão / Tag
              </label>
              <select
                value={splitTag}
                onChange={e => setSplitTag(e.target.value as SplitTag)}
                className="w-full bg-[#101318] border border-[#222A35] rounded-xl px-3 py-2.5 text-white text-xs font-bold focus:border-[#B7F34A] outline-none"
              >
                {SPLIT_OPTIONS.map(s => (
                  <option key={s} value={s}>Divisão {s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#A8B0BC] mb-1">
              Descrição ou Foco (opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: Foco em hipertrofia e progressão de carga no supino"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-[#101318] border border-[#222A35] rounded-xl px-3 py-2 text-white text-xs focus:border-[#B7F34A] outline-none"
            />
          </div>

          {/* Muscle Groups Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#A8B0BC] mb-2">
              Grupos Musculares Alvo
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_MUSCLES.map(muscle => {
                const isSelected = targetMuscles.includes(muscle);
                return (
                  <button
                    key={muscle}
                    type="button"
                    onClick={() => toggleMuscle(muscle)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#B7F34A] text-[#101318] shadow'
                        : 'bg-[#101318] text-[#A8B0BC] border border-[#222A35] hover:text-white'
                    }`}
                  >
                    {muscle}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scheduled Days of Week */}
          <div>
            <label className="block text-xs font-semibold text-[#A8B0BC] mb-2">
              Dias Programados da Semana
            </label>
            <div className="grid grid-cols-7 gap-1.5">
              {WEEKDAYS.map(w => {
                const isScheduled = scheduledDays.includes(w.day);
                return (
                  <button
                    key={w.day}
                    type="button"
                    onClick={() => toggleWeekday(w.day)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                      isScheduled
                        ? 'bg-[#B7F34A] text-[#101318] shadow'
                        : 'bg-[#101318] text-[#A8B0BC] border border-[#222A35] hover:text-white'
                    }`}
                  >
                    <span>{w.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Exercises list with ordering and config */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#B7F34A]" />
                Exercícios do Treino ({exercises.length})
              </span>
              <button
                type="button"
                onClick={() => setIsPickerOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#B7F34A] hover:bg-[#c6fb62] text-[#101318] text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar Exercício
              </button>
            </div>

            {exercises.length === 0 ? (
              <div className="text-center py-8 rounded-xl bg-[#101318] border border-dashed border-[#222A35] text-xs text-[#A8B0BC]">
                Nenhum exercício adicionado. Clique no botão acima para escolher exercícios da biblioteca.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {exercises.map((item, index) => {
                  const exData = availableExercises.find(e => e.id === item.exerciseId);
                  const exName = exData?.name || 'Exercício';
                  const exCategory = exData?.category || 'Geral';

                  return (
                    <div
                      key={`${item.exerciseId}-${index}`}
                      className="p-3 rounded-xl bg-[#101318] border border-[#222A35] space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="w-5 h-5 rounded-full bg-[#222A35] text-[10px] font-bold text-[#B7F34A] flex items-center justify-center shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-xs font-bold text-white truncate">{exName}</span>
                          <span className="px-1.5 py-0.5 rounded bg-[#222A35] text-[10px] text-[#A8B0BC] shrink-0">
                            {exCategory}
                          </span>
                        </div>

                        {/* Reorder and Delete controls */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveExercise(index, 'up')}
                            disabled={index === 0}
                            className="p-1 rounded bg-[#222A35] text-[#A8B0BC] hover:text-white disabled:opacity-30 cursor-pointer"
                            title="Mover para cima"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveExercise(index, 'down')}
                            disabled={index === exercises.length - 1}
                            className="p-1 rounded bg-[#222A35] text-[#A8B0BC] hover:text-white disabled:opacity-30 cursor-pointer"
                            title="Mover para baixo"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeExercise(index)}
                            className="p-1 rounded bg-red-950/50 text-red-400 hover:text-red-300 ml-1 cursor-pointer"
                            title="Remover"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Config inputs: Sets, Reps, Weight, Rest */}
                      <div className="grid grid-cols-4 gap-2 pt-1 border-t border-[#222A35]/50">
                        <div>
                          <span className="text-[10px] text-[#A8B0BC] block">Séries</span>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={item.targetSets}
                            onChange={e =>
                              updateExerciseConfig(index, 'targetSets', Math.max(1, parseInt(e.target.value) || 1))
                            }
                            className="w-full bg-[#191F28] border border-[#222A35] rounded-lg px-2 py-1 text-white font-mono text-xs focus:border-[#B7F34A] outline-none"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-[#A8B0BC] block">Reps</span>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={item.targetReps}
                            onChange={e =>
                              updateExerciseConfig(index, 'targetReps', Math.max(1, parseInt(e.target.value) || 1))
                            }
                            className="w-full bg-[#191F28] border border-[#222A35] rounded-lg px-2 py-1 text-white font-mono text-xs focus:border-[#B7F34A] outline-none"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-[#A8B0BC] block">Carga ({weightUnit})</span>
                          <input
                            type="number"
                            min="0"
                            max="500"
                            step="0.5"
                            value={item.targetWeight || 0}
                            onChange={e =>
                              updateExerciseConfig(index, 'targetWeight', Math.max(0, parseFloat(e.target.value) || 0))
                            }
                            className="w-full bg-[#191F28] border border-[#222A35] rounded-lg px-2 py-1 text-white font-mono text-xs focus:border-[#B7F34A] outline-none"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-[#A8B0BC] block">Descanso (s)</span>
                          <input
                            type="number"
                            min="15"
                            max="300"
                            step="5"
                            value={item.restSeconds}
                            onChange={e =>
                              updateExerciseConfig(index, 'restSeconds', Math.max(15, parseInt(e.target.value) || 60))
                            }
                            className="w-full bg-[#191F28] border border-[#222A35] rounded-lg px-2 py-1 text-white font-mono text-xs focus:border-[#B7F34A] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-[#222A35] hover:bg-[#2b3542] text-white text-xs font-bold transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-[#B7F34A] hover:bg-[#c6fb62] text-[#101318] text-xs font-bold transition-all shadow-lg cursor-pointer"
            >
              Salvar Treino
            </button>
          </div>
        </form>

        {/* Exercise Picker Modal */}
        {isPickerOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
            <div className="bg-[#191F28] border border-[#222A35] rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col p-5 text-white">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-white">Selecionar Exercício</h4>
                <button
                  onClick={() => setIsPickerOpen(false)}
                  className="p-1.5 rounded-lg bg-[#222A35] text-[#A8B0BC] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search & Category Filter */}
              <div className="space-y-2 mb-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#A8B0BC]" />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou músculo..."
                    value={pickerSearch}
                    onChange={e => setPickerSearch(e.target.value)}
                    className="w-full bg-[#101318] border border-[#222A35] rounded-xl pl-9 pr-3 py-2 text-white text-xs focus:border-[#B7F34A] outline-none"
                  />
                </div>

                <div className="flex gap-1 overflow-x-auto pb-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setPickerCategory('all')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-all ${
                      pickerCategory === 'all'
                        ? 'bg-[#B7F34A] text-[#101318]'
                        : 'bg-[#101318] text-[#A8B0BC] border border-[#222A35]'
                    }`}
                  >
                    Todos
                  </button>
                  {ALL_MUSCLES.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setPickerCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-all ${
                        pickerCategory === cat
                          ? 'bg-[#B7F34A] text-[#101318]'
                          : 'bg-[#101318] text-[#A8B0BC] border border-[#222A35]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exercises List */}
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                {filteredAvailable.length === 0 ? (
                  <div className="text-center py-8 text-xs text-[#A8B0BC]">
                    Nenhum exercício encontrado para essa busca.
                  </div>
                ) : (
                  filteredAvailable.map(ex => {
                    const alreadyAdded = exercises.some(item => item.exerciseId === ex.id);
                    return (
                      <button
                        key={ex.id}
                        type="button"
                        onClick={() => addExerciseFromPicker(ex.id)}
                        className={`w-full text-left p-3 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                          alreadyAdded
                            ? 'bg-[#101318]/50 border-[#222A35] opacity-70'
                            : 'bg-[#101318] border-[#222A35] hover:border-[#B7F34A]/50'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-white">{ex.name}</div>
                          <div className="text-[10px] text-[#A8B0BC] mt-0.5">
                            {ex.category} • {ex.equipment} • {ex.difficulty}
                          </div>
                        </div>
                        <div className="shrink-0">
                          {alreadyAdded ? (
                            <span className="text-[10px] font-bold text-[#A8B0BC] px-2 py-1 rounded bg-[#222A35]">
                              Já incluído
                            </span>
                          ) : (
                            <div className="w-7 h-7 rounded-lg bg-[#B7F34A]/10 border border-[#B7F34A]/30 flex items-center justify-center text-[#B7F34A]">
                              <Plus className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
