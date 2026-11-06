/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Achievement } from '../types';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-first-workout',
    title: 'Primeiro Passo',
    description: 'Complete o seu primeiro treino com o QYVOVA FIT.',
    icon: 'Flame',
    category: 'workouts',
    currentValue: 0,
    targetValue: 1
  },
  {
    id: 'ach-5-workouts',
    title: 'Ritmo & Foco',
    description: 'Conclua 5 sessões de treino registradas.',
    icon: 'Trophy',
    category: 'workouts',
    currentValue: 0,
    targetValue: 5
  },
  {
    id: 'ach-10-workouts',
    title: 'Hábito de Ferro',
    description: 'Alcance a marca de 10 treinos completos.',
    icon: 'Zap',
    category: 'workouts',
    currentValue: 0,
    targetValue: 10
  },
  {
    id: 'ach-25-workouts',
    title: 'Guerreiro Dedicado',
    description: 'Conclua 25 treinos com disciplina.',
    icon: 'Shield',
    category: 'workouts',
    currentValue: 0,
    targetValue: 25
  },
  {
    id: 'ach-50-workouts',
    title: 'Veterano da Academia',
    description: 'Conclua 50 treinos e consolide seu estilo de vida.',
    icon: 'Crown',
    category: 'workouts',
    currentValue: 0,
    targetValue: 50
  },
  {
    id: 'ach-100-sets',
    title: 'Clube das 100 Séries',
    description: 'Execute e registre 100 séries com esforço real.',
    icon: 'CheckCircle2',
    category: 'volume',
    currentValue: 0,
    targetValue: 100
  },
  {
    id: 'ach-10k-volume',
    title: 'Toneladas de Força',
    description: 'Acumule mais de 10.000 kg de tonelagem total em treinos.',
    icon: 'Dumbbell',
    category: 'volume',
    currentValue: 0,
    targetValue: 10000
  },
  {
    id: 'ach-first-pr',
    title: 'Quebrando Limites',
    description: 'Supere sua carga anterior e estabeleça um Recorde Pessoal (PR).',
    icon: 'TrendingUp',
    category: 'pr',
    currentValue: 0,
    targetValue: 1
  }
];
