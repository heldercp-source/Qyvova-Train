/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PlateResult {
  weight: number;
  count: number;
}

export function calculate1RM(weight: number, reps: number): {
  epley: number;
  brzycki: number;
  average: number;
  percentages: { percentage: number; weight: number; targetReps: string; focus: string }[];
} {
  if (weight <= 0 || reps <= 0) {
    return { epley: 0, brzycki: 0, average: 0, percentages: [] };
  }

  if (reps === 1) {
    const rm = weight;
    return generatePercentages(rm);
  }

  // Epley formula: w * (1 + r / 30)
  const epley = Math.round(weight * (1 + reps / 30));
  // Brzycki formula: w / (1.0278 - 0.0278 * r)
  const brzycki = reps < 36 ? Math.round(weight / (1.0278 - 0.0278 * reps)) : epley;
  const average = Math.round((epley + brzycki) / 2);

  return generatePercentages(average);
}

function generatePercentages(oneRM: number) {
  const table = [
    { percentage: 100, targetReps: '1 rep', focus: 'Força Máxima' },
    { percentage: 95, targetReps: '2 reps', focus: 'Potência / Força' },
    { percentage: 90, targetReps: '3-4 reps', focus: 'Força Pura' },
    { percentage: 85, targetReps: '5-6 reps', focus: 'Força & Hipertrofia' },
    { percentage: 80, targetReps: '7-8 reps', focus: 'Hipertrofia Densa' },
    { percentage: 75, targetReps: '9-10 reps', focus: 'Hipertrofia Muscular' },
    { percentage: 70, targetReps: '11-12 reps', focus: 'Hipertrofia & Volume' },
    { percentage: 65, targetReps: '13-15 reps', focus: 'Resistência Muscular' },
    { percentage: 60, targetReps: '16-20 reps', focus: 'Resistência & Queima' }
  ];

  return {
    epley: oneRM,
    brzycki: oneRM,
    average: oneRM,
    percentages: table.map(item => ({
      ...item,
      weight: Math.round((oneRM * item.percentage) / 100 * 2) / 2 // round to nearest 0.5kg
    }))
  };
}

export function calculateBarbellPlates(
  targetWeight: number,
  barWeight: number = 20,
  availablePlates: number[] = [25, 20, 15, 10, 5, 2.5, 1.25]
): {
  platesPerSide: PlateResult[];
  achievedTotalWeight: number;
  remainder: number;
} {
  if (targetWeight <= barWeight) {
    return {
      platesPerSide: [],
      achievedTotalWeight: barWeight,
      remainder: 0
    };
  }

  const weightPerSide = (targetWeight - barWeight) / 2;
  let remaining = weightPerSide;
  const platesPerSide: PlateResult[] = [];

  const sortedPlates = [...availablePlates].sort((a, b) => b - a);

  for (const plate of sortedPlates) {
    if (remaining >= plate) {
      const count = Math.floor(remaining / plate);
      platesPerSide.push({ weight: plate, count });
      remaining = Math.round((remaining - count * plate) * 100) / 100;
    }
  }

  const loadedPerSide = weightPerSide - remaining;
  const achievedTotalWeight = barWeight + loadedPerSide * 2;

  return {
    platesPerSide,
    achievedTotalWeight,
    remainder: Math.round(remaining * 2 * 100) / 100
  };
}
