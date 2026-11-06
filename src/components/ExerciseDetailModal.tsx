/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  X,
  Star,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  XCircle,
  Repeat,
  ShieldAlert,
  Clock,
  Layers,
  Award
} from 'lucide-react';
import { Exercise, ExercisePR } from '../types';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  personalRecord?: ExercisePR | null;
  weightUnit?: 'kg' | 'lb';
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  onClose,
  onToggleFavorite,
  personalRecord,
  weightUnit = 'kg'
}) => {
  if (!exercise) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#191F28] border border-[#222A35] rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 text-white relative">
        {/* Top controls */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(exercise.id)}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              exercise.favorite
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-[#222A35] text-[#A8B0BC] hover:text-amber-400'
            }`}
            title={exercise.favorite ? 'Remover dos favoritos' : 'Favoritar exercício'}
          >
            <Star className={`w-5 h-5 ${exercise.favorite ? 'fill-amber-400' : ''}`} />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#222A35] text-[#A8B0BC] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-2 pr-20">
          <span className="px-2.5 py-1 rounded-lg bg-[#B7F34A]/10 text-[#B7F34A] text-xs font-bold border border-[#B7F34A]/30">
            {exercise.category}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#222A35] text-[#A8B0BC] text-xs font-medium">
            {exercise.equipment}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#222A35] text-[#A8B0BC] text-xs font-medium">
            {exercise.difficulty}
          </span>
          {exercise.defaultRestSec && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#222A35] text-[#A8B0BC] text-xs">
              <Clock className="w-3 h-3 text-[#B7F34A]" />
              {exercise.defaultRestSec}s descanso
            </span>
          )}
        </div>

        <h2 className="text-xl font-extrabold text-white mb-2">{exercise.name}</h2>

        {/* Secondary Muscles */}
        {exercise.secondaryMuscles.length > 0 && (
          <p className="text-xs text-[#A8B0BC] mb-4">
            Músculos sinergistas/secundários:{' '}
            <span className="text-white font-medium">{exercise.secondaryMuscles.join(', ')}</span>
          </p>
        )}

        {/* Personal Best Card if any */}
        {personalRecord && (
          <div className="mb-5 p-3.5 rounded-xl bg-gradient-to-r from-[#222A35] to-[#101318] border border-[#B7F34A]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#B7F34A]/20 flex items-center justify-center text-[#B7F34A]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#A8B0BC] tracking-wider">Seu Recorde Pessoal</span>
                <div className="text-sm font-extrabold text-white">
                  {personalRecord.maxWeight} {weightUnit} × {personalRecord.maxReps} reps
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#A8B0BC]">1RM estimada</span>
              <div className="text-sm font-black text-[#B7F34A] font-mono">
                {personalRecord.estimated1RM} {weightUnit}
              </div>
            </div>
          </div>
        )}

        {/* Step by step Instructions */}
        <div className="mb-5">
          <h3 className="text-xs font-bold text-[#B7F34A] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Passo a Passo da Execução
          </h3>
          <div className="space-y-2">
            {exercise.instructions.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-300 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-[#101318] border border-[#222A35] flex items-center justify-center font-mono text-[10px] font-bold text-[#B7F34A] shrink-0">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Posture Tips */}
        {exercise.tips.length > 0 && (
          <div className="mb-5 p-3.5 rounded-xl bg-[#101318] border border-[#222A35]">
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              Dicas de Postura e Ativação
            </h3>
            <ul className="space-y-1.5 text-xs text-gray-300">
              {exercise.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Common Errors & Safety */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {exercise.commonErrors.length > 0 && (
            <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/20">
              <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" />
                Erros Comuns
              </h3>
              <ul className="space-y-1 text-xs text-red-200">
                {exercise.commonErrors.map((err, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span>✕</span>
                    <span>{err}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {exercise.securityWarnings.length > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                Cuidados de Segurança
              </h3>
              <ul className="space-y-1 text-xs text-amber-200">
                {exercise.securityWarnings.map((warn, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span>⚠</span>
                    <span>{warn}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Alternatives */}
        {exercise.alternatives.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-bold text-[#A8B0BC] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Repeat className="w-3.5 h-3.5" />
              Exercícios Alternativos / Substitutos
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {exercise.alternatives.map((alt, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-[#101318] border border-[#222A35] text-xs text-gray-300"
                >
                  {alt}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl bg-[#B7F34A] hover:bg-[#c6fb62] text-[#101318] font-bold text-sm transition-all shadow-lg cursor-pointer"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};
