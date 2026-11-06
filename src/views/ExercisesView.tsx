/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  Star,
  Plus,
  Filter,
  Dumbbell,
  Clock,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import { Exercise, MuscleGroup, Equipment } from '../types';

interface ExercisesViewProps {
  exercises: Exercise[];
  onSelectExercise: (exercise: Exercise) => void;
  onToggleFavorite: (exerciseId: string) => void;
  onOpenCreateCustom: () => void;
}

const MUSCLE_CATEGORIES: { id: string; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'Peito', label: 'Peito' },
  { id: 'Costas', label: 'Costas' },
  { id: 'Pernas', label: 'Pernas' },
  { id: 'Ombros', label: 'Ombros' },
  { id: 'Bíceps', label: 'Bíceps' },
  { id: 'Tríceps', label: 'Tríceps' },
  { id: 'Glúteos', label: 'Glúteos' },
  { id: 'Abdômen', label: 'Abdômen' },
  { id: 'Panturrilhas', label: 'Panturrilhas' },
  { id: 'Antebraço', label: 'Antebraço' },
  { id: 'Cardio', label: 'Cardio' }
];

const EQUIPMENTS: string[] = [
  'Todos',
  'Barra',
  'Halteres',
  'Máquina',
  'Polia/Cabo',
  'Peso Corporal',
  'Kettlebell',
  'Elástico'
];

export const ExercisesView: React.FC<ExercisesViewProps> = ({
  exercises,
  onSelectExercise,
  onToggleFavorite,
  onOpenCreateCustom
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('all');
  const [selectedEquipment, setSelectedEquipment] = useState('Todos');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const filteredExercises = exercises.filter(ex => {
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.secondaryMuscles.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMuscle = selectedMuscle === 'all' || ex.category === selectedMuscle;
    const matchesEquipment =
      selectedEquipment === 'Todos' || ex.equipment === selectedEquipment;
    const matchesFavorites = !showOnlyFavorites || !!ex.favorite;

    return matchesSearch && matchesMuscle && matchesEquipment && matchesFavorites;
  });

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            Biblioteca de Exercícios
          </h1>
          <p className="text-xs text-[#A8B0BC]">
            Consulte instruções biomecânicas revisadas, postura, erros comuns e adicione exercícios
          </p>
        </div>

        <button
          onClick={onOpenCreateCustom}
          className="px-4 py-2.5 rounded-xl bg-[#B7F34A] hover:bg-[#c6fb62] text-[#101318] text-xs font-black shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Cadastrar Exercício</span>
        </button>
      </div>

      {/* Search Bar & Equipment Dropdown */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#A8B0BC]" />
          <input
            type="text"
            placeholder="Buscar por nome (ex: supino, agachamento, puxada)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#191F28] border border-[#222A35] rounded-xl pl-10 pr-3 py-2.5 text-white text-xs placeholder:text-[#A8B0BC] focus:border-[#B7F34A] outline-none transition-colors"
          />
        </div>

        <div className="sm:col-span-4 flex gap-2">
          <select
            value={selectedEquipment}
            onChange={e => setSelectedEquipment(e.target.value)}
            className="flex-1 bg-[#191F28] border border-[#222A35] rounded-xl px-3 py-2.5 text-white text-xs font-semibold focus:border-[#B7F34A] outline-none"
          >
            {EQUIPMENTS.map(eq => (
              <option key={eq} value={eq}>
                Equipamento: {eq}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
              showOnlyFavorites
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-[#191F28] text-[#A8B0BC] border-[#222A35] hover:text-white'
            }`}
            title="Filtrar favoritos"
          >
            <Star className={`w-4 h-4 ${showOnlyFavorites ? 'fill-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Muscle Categories Chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
        {MUSCLE_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedMuscle(cat.id)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedMuscle === cat.id
                ? 'bg-[#B7F34A] text-[#101318] shadow'
                : 'bg-[#191F28] text-[#A8B0BC] border border-[#222A35] hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Exercise Count indicator */}
      <div className="flex items-center justify-between text-xs text-[#A8B0BC] px-1">
        <span>Mostrando {filteredExercises.length} exercícios</span>
        {showOnlyFavorites && (
          <span className="text-amber-400 font-semibold flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            Apenas Favoritos
          </span>
        )}
      </div>

      {/* Exercises Grid */}
      {filteredExercises.length === 0 ? (
        <div className="text-center py-12 rounded-3xl bg-[#191F28] border border-dashed border-[#222A35] p-6 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#101318] border border-[#222A35] flex items-center justify-center text-[#B7F34A] mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Nenhum exercício encontrado</h3>
          <p className="text-xs text-[#A8B0BC] max-w-sm mx-auto">
            Tente buscar com outro termo ou cadastre um exercício personalizado.
          </p>
          <button
            onClick={onOpenCreateCustom}
            className="px-4 py-2 rounded-xl bg-[#B7F34A] text-[#101318] font-bold text-xs"
          >
            Cadastrar Novo Exercício
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredExercises.map(exercise => (
            <div
              key={exercise.id}
              onClick={() => onSelectExercise(exercise)}
              className="p-4 rounded-2xl bg-[#191F28] border border-[#222A35] hover:border-[#B7F34A]/50 transition-all cursor-pointer flex flex-col justify-between group relative"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-[#B7F34A]/10 text-[#B7F34A] text-[10px] font-bold border border-[#B7F34A]/30">
                      {exercise.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#101318] text-[#A8B0BC] text-[10px]">
                      {exercise.equipment}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#101318] text-[#A8B0BC] text-[10px]">
                      {exercise.difficulty}
                    </span>
                    {exercise.isCustom && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                        Personalizado
                      </span>
                    )}
                  </div>

                  {/* Favorite star */}
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      onToggleFavorite(exercise.id);
                    }}
                    className={`p-1 rounded-lg transition-colors cursor-pointer ${
                      exercise.favorite
                        ? 'text-amber-400'
                        : 'text-[#A8B0BC] hover:text-amber-400'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${exercise.favorite ? 'fill-amber-400' : ''}`} />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-[#B7F34A] transition-colors">
                  {exercise.name}
                </h3>

                {exercise.secondaryMuscles.length > 0 && (
                  <p className="text-[11px] text-[#A8B0BC] mt-1 line-clamp-1">
                    Sinergistas: {exercise.secondaryMuscles.join(', ')}
                  </p>
                )}
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#222A35]/50 text-[11px] text-[#A8B0BC]">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3 h-3 text-[#B7F34A]" />
                    {exercise.defaultSets} séries
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#B7F34A]" />
                    {exercise.defaultRestSec}s
                  </span>
                </div>

                <span className="text-[#B7F34A] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  Ver detalhes <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
