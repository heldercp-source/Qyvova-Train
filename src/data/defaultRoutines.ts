/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WorkoutRoutine } from '../types';

export const DEFAULT_ROUTINES: WorkoutRoutine[] = [
  {
    id: 'routine-treino-a-push',
    name: 'Treino A — Peito, Ombros e Tríceps (Push)',
    splitTag: 'A',
    description: 'Foco no padrão de empurrar: hipertrofia do peitoral, deltoides anterior e lateral, e tríceps.',
    targetMuscleGroups: ['Peito', 'Ombros', 'Tríceps'],
    scheduledDays: [1, 4], // Segunda e Quinta
    exercises: [
      {
        exerciseId: 'ex-peito-supino-reto',
        targetSets: 4,
        targetReps: 10,
        targetWeight: 60,
        restSeconds: 90,
        notes: 'Aquecimento prévio com barra vazia. Mantenha adução escapular.'
      },
      {
        exerciseId: 'ex-peito-supino-inclinado-halteres',
        targetSets: 4,
        targetReps: 10,
        targetWeight: 22,
        restSeconds: 75,
        notes: 'Banco a 30-45 graus. Foco na porção clavicular.'
      },
      {
        exerciseId: 'ex-peito-crossover-polia',
        targetSets: 3,
        targetReps: 12,
        targetWeight: 20,
        restSeconds: 60,
        notes: 'Aperte 1 segundo no pico de contração.'
      },
      {
        exerciseId: 'ex-ombros-desenvolvimento-militar',
        targetSets: 4,
        targetReps: 8,
        targetWeight: 35,
        restSeconds: 90,
        notes: 'Glúteos e abdômen firmes.'
      },
      {
        exerciseId: 'ex-ombros-elevacao-lateral',
        targetSets: 4,
        targetReps: 12,
        targetWeight: 10,
        restSeconds: 60,
        notes: 'Conduza pelos cotovelos sem balançar o corpo.'
      },
      {
        exerciseId: 'ex-triceps-corda-polia',
        targetSets: 4,
        targetReps: 12,
        targetWeight: 25,
        restSeconds: 60,
        notes: 'Afaste as pontas da corda na base.'
      },
      {
        exerciseId: 'ex-triceps-testa-w',
        targetSets: 3,
        targetReps: 10,
        targetWeight: 24,
        restSeconds: 60,
        notes: 'Mantenha cotovelos fechados.'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'routine-treino-b-pull',
    name: 'Treino B — Costas, Bíceps e Antebraço (Pull)',
    splitTag: 'B',
    description: 'Padrão de puxar: largura dorsal, espessura e densidade das costas, bíceps e pegada.',
    targetMuscleGroups: ['Costas', 'Bíceps', 'Antebraço'],
    scheduledDays: [2, 5], // Terça e Sexta
    exercises: [
      {
        exerciseId: 'ex-costas-puxada-alta',
        targetSets: 4,
        targetReps: 10,
        targetWeight: 50,
        restSeconds: 75,
        notes: 'Puxe com os cotovelos deprimindo as escápulas.'
      },
      {
        exerciseId: 'ex-costas-remada-curvada-barra',
        targetSets: 4,
        targetReps: 8,
        targetWeight: 50,
        restSeconds: 90,
        notes: 'Coluna neutra travada a 45 graus.'
      },
      {
        exerciseId: 'ex-costas-remada-baixa-triangulo',
        targetSets: 3,
        targetReps: 12,
        targetWeight: 45,
        restSeconds: 60,
        notes: 'Aperte a musculatura dorsal por 1 segundo.'
      },
      {
        exerciseId: 'ex-ombros-crucifixo-inverso',
        targetSets: 3,
        targetReps: 12,
        targetWeight: 35,
        restSeconds: 60,
        notes: 'Foco na porção posterior do ombro.'
      },
      {
        exerciseId: 'ex-biceps-rosca-direta-w',
        targetSets: 3,
        targetReps: 10,
        targetWeight: 20,
        restSeconds: 60,
        notes: 'Cotovelos imóveis colados ao corpo.'
      },
      {
        exerciseId: 'ex-biceps-rosca-martelo',
        targetSets: 3,
        targetReps: 12,
        targetWeight: 14,
        restSeconds: 60,
        notes: 'Trabalho do braquial e antebraço.'
      },
      {
        exerciseId: 'ex-antebraco-rosca-punho',
        targetSets: 3,
        targetReps: 15,
        targetWeight: 16,
        restSeconds: 45,
        notes: 'Alongamento completo na descida.'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'routine-treino-c-legs',
    name: 'Treino C — Pernas Completo, Glúteos e Abdômen (Legs)',
    splitTag: 'C',
    description: 'Treino completo de membros inferiores com ênfase em quadríceps, posteriores, glúteos e core.',
    targetMuscleGroups: ['Pernas', 'Glúteos', 'Panturrilhas', 'Abdômen'],
    scheduledDays: [3, 6], // Quarta e Sábado
    exercises: [
      {
        exerciseId: 'ex-pernas-agachamento-livre',
        targetSets: 4,
        targetReps: 8,
        targetWeight: 70,
        restSeconds: 120,
        notes: 'Profundidade paralela ou além. Joelhos acompanhando os pés.'
      },
      {
        exerciseId: 'ex-pernas-leg-press-45',
        targetSets: 4,
        targetReps: 10,
        targetWeight: 160,
        restSeconds: 90,
        notes: 'NÃO trave as articulações dos joelhos na subida.'
      },
      {
        exerciseId: 'ex-pernas-cadeira-extensora',
        targetSets: 3,
        targetReps: 12,
        targetWeight: 45,
        restSeconds: 60,
        notes: 'Controle a descida em 3 segundos.'
      },
      {
        exerciseId: 'ex-pernas-stiff-barra',
        targetSets: 4,
        targetReps: 10,
        targetWeight: 50,
        restSeconds: 75,
        notes: 'Dobradiça de quadril rente às pernas.'
      },
      {
        exerciseId: 'ex-gluteos-elevacao-pelvica',
        targetSets: 4,
        targetReps: 10,
        targetWeight: 70,
        restSeconds: 90,
        notes: 'Pausa de 2 segundos no topo esmagando os glúteos.'
      },
      {
        exerciseId: 'ex-panturrilha-em-pe-maquina',
        targetSets: 4,
        targetReps: 15,
        targetWeight: 60,
        restSeconds: 60,
        notes: 'Pausa de 1 segundo no alongamento de fundo.'
      },
      {
        exerciseId: 'ex-abdomen-prancha-isometrica',
        targetSets: 3,
        targetReps: 45,
        targetWeight: 0,
        restSeconds: 60,
        notes: 'Core e glúteos firmes sem afundar a bacia.'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
