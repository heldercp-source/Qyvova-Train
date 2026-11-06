/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Plus, PlusCircle, AlertCircle } from 'lucide-react';
import { Exercise, MuscleGroup, Equipment, DifficultyLevel } from '../types';

interface CustomExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveExercise: (exercise: Exercise) => void;
}

const MUSCLE_GROUPS: MuscleGroup[] = [
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

const EQUIPMENTS: Equipment[] = [
  'Barra',
  'Halteres',
  'Máquina',
  'Polia/Cabo',
  'Peso Corporal',
  'Kettlebell',
  'Elástico',
  'Outro'
];

export const CustomExerciseModal: React.FC<CustomExerciseModalProps> = ({
  isOpen,
  onClose,
  onSaveExercise
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<MuscleGroup>('Peito');
  const [equipment, setEquipment] = useState<Equipment>('Halteres');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Iniciante');
  const [instructionsText, setInstructionsText] = useState('');
  const [tipsText, setTipsText] = useState('');
  const [defaultSets, setDefaultSets] = useState(3);
  const [defaultReps, setDefaultReps] = useState(10);
  const [defaultRestSec, setDefaultRestSec] = useState(60);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, informe o nome do exercício.');
      return;
    }

    const instructions = instructionsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const tips = tipsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const newExercise: Exercise = {
      id: `custom-ex-${Date.now()}`,
      name: name.trim(),
      category,
      secondaryMuscles: [],
      equipment,
      difficulty,
      instructions: instructions.length > 0 ? instructions : ['Execute com postura adequada e controle de movimento.'],
      tips: tips.length > 0 ? tips : ['Mantenha a respiração compassada e o core ativado.'],
      securityWarnings: ['Ajuste a carga adequadamente ao seu nível de condicionamento.'],
      commonErrors: ['Evite usar impulsos ou balanço do tronco.'],
      alternatives: [],
      isCustom: true,
      favorite: false,
      defaultSets: Number(defaultSets) || 3,
      defaultReps: Number(defaultReps) || 10,
      defaultRestSec: Number(defaultRestSec) || 60
    };

    onSaveExercise(newExercise);
    setName('');
    setInstructionsText('');
    setTipsText('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#191F28] border border-[#222A35] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 text-white relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[#222A35] text-[#A8B0BC] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-[#B7F34A]/10 border border-[#B7F34A]/30 flex items-center justify-center text-[#B7F34A]">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Novo Exercício Personalizado</h3>
            <p className="text-xs text-[#A8B0BC]">Adicione exercícios próprios à sua biblioteca</p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#A8B0BC] mb-1">
              Nome do Exercício *
            </label>
            <input
              type="text"
              placeholder="Ex: Supino Declinado com Halteres"
              value={name}
              onChange={e => {
                setName(e.target.value);
                setError('');
              }}
              className="w-full bg-[#101318] border border-[#222A35] rounded-xl px-3 py-2.5 text-white font-medium text-sm focus:border-[#B7F34A] outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#A8B0BC] mb-1">
                Grupo Muscular Principal *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as MuscleGroup)}
                className="w-full bg-[#101318] border border-[#222A35] rounded-xl px-3 py-2.5 text-white text-xs font-semibold focus:border-[#B7F34A] outline-none"
              >
                {MUSCLE_GROUPS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A8B0BC] mb-1">
                Equipamento *
              </label>
              <select
                value={equipment}
                onChange={e => setEquipment(e.target.value as Equipment)}
                className="w-full bg-[#101318] border border-[#222A35] rounded-xl px-3 py-2.5 text-white text-xs font-semibold focus:border-[#B7F34A] outline-none"
              >
                {EQUIPMENTS.map(eq => (
                  <option key={eq} value={eq}>{eq}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-[#A8B0BC] mb-1">
                Séries Padrão
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={defaultSets}
                onChange={e => setDefaultSets(parseInt(e.target.value) || 3)}
                className="w-full bg-[#101318] border border-[#222A35] rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-[#B7F34A] outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#A8B0BC] mb-1">
                Reps Padrão
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={defaultReps}
                onChange={e => setDefaultReps(parseInt(e.target.value) || 10)}
                className="w-full bg-[#101318] border border-[#222A35] rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-[#B7F34A] outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#A8B0BC] mb-1">
                Descanso (s)
              </label>
              <input
                type="number"
                min="15"
                max="300"
                step="5"
                value={defaultRestSec}
                onChange={e => setDefaultRestSec(parseInt(e.target.value) || 60)}
                className="w-full bg-[#101318] border border-[#222A35] rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-[#B7F34A] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A8B0BC] mb-1">
              Instruções de Execução (opcional, uma por linha)
            </label>
            <textarea
              rows={3}
              placeholder="Ex: Deite no banco com halteres&#10;Desça com controle até a linha do peito&#10;Empurre até o topo sem travar cotovelos"
              value={instructionsText}
              onChange={e => setInstructionsText(e.target.value)}
              className="w-full bg-[#101318] border border-[#222A35] rounded-xl p-3 text-white text-xs focus:border-[#B7F34A] outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A8B0BC] mb-1">
              Dicas de Postura (opcional)
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Escápulas travadas no banco. Pés firmes no chão."
              value={tipsText}
              onChange={e => setTipsText(e.target.value)}
              className="w-full bg-[#101318] border border-[#222A35] rounded-xl p-3 text-white text-xs focus:border-[#B7F34A] outline-none resize-none"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-[#222A35] hover:bg-[#2b3542] text-white text-xs font-bold transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-[#B7F34A] hover:bg-[#c6fb62] text-[#101318] text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Salvar Exercício
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
