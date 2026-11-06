/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Calculator, Disc3, Percent, Check } from 'lucide-react';
import { calculate1RM, calculateBarbellPlates } from '../services/calculators';

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  weightUnit?: 'kg' | 'lb';
}

export const CalculatorModal: React.FC<CalculatorModalProps> = ({
  isOpen,
  onClose,
  weightUnit = 'kg'
}) => {
  const [tab, setTab] = useState<'1rm' | 'plates'>('1rm');

  // 1RM state
  const [weight, setWeight] = useState<number>(80);
  const [reps, setReps] = useState<number>(8);

  // Plate state
  const [targetWeight, setTargetWeight] = useState<number>(100);
  const [barWeight, setBarWeight] = useState<number>(20);

  if (!isOpen) return null;

  const rmResult = calculate1RM(weight, reps);
  const plateResult = calculateBarbellPlates(targetWeight, barWeight);

  // Plate color mapping
  const getPlateColor = (kg: number) => {
    switch (kg) {
      case 25: return 'bg-red-600 text-white border-red-700';
      case 20: return 'bg-blue-600 text-white border-blue-700';
      case 15: return 'bg-yellow-500 text-black border-yellow-600';
      case 10: return 'bg-emerald-600 text-white border-emerald-700';
      case 5: return 'bg-gray-100 text-gray-900 border-gray-300';
      case 2.5: return 'bg-zinc-800 text-white border-zinc-600';
      case 1.25: return 'bg-zinc-600 text-white border-zinc-500';
      default: return 'bg-[#B7F34A] text-[#101318] border-[#B7F34A]';
    }
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
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Ferramentas de Carga</h3>
            <p className="text-xs text-[#A8B0BC]">Calculadora 1RM e Distribuição de Anilhas</p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1 bg-[#101318] rounded-xl border border-[#222A35] mb-5">
          <button
            onClick={() => setTab('1rm')}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === '1rm' ? 'bg-[#222A35] text-[#B7F34A] shadow' : 'text-[#A8B0BC] hover:text-white'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            1RM Máxima
          </button>
          <button
            onClick={() => setTab('plates')}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'plates' ? 'bg-[#222A35] text-[#B7F34A] shadow' : 'text-[#A8B0BC] hover:text-white'
            }`}
          >
            <Disc3 className="w-3.5 h-3.5" />
            Anilhas na Barra
          </button>
        </div>

        {tab === '1rm' ? (
          <div>
            {/* Input fields */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div>
                <label className="block text-xs font-semibold text-[#A8B0BC] mb-1.5">
                  Carga levantada ({weightUnit})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="500"
                    step="0.5"
                    value={weight}
                    onChange={e => setWeight(Math.max(1, parseFloat(e.target.value) || 0))}
                    className="w-full bg-[#101318] border border-[#222A35] rounded-xl px-3 py-2.5 text-white font-mono font-bold text-base focus:border-[#B7F34A] outline-none"
                  />
                  <span className="absolute right-3 top-3 text-xs text-[#A8B0BC]">{weightUnit}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#A8B0BC] mb-1.5">
                  Repetições realizadas
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={reps}
                    onChange={e => setReps(Math.min(30, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-full bg-[#101318] border border-[#222A35] rounded-xl px-3 py-2.5 text-white font-mono font-bold text-base focus:border-[#B7F34A] outline-none"
                  />
                  <span className="absolute right-3 top-3 text-xs text-[#A8B0BC]">reps</span>
                </div>
              </div>
            </div>

            {/* Highlighted Result */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#222A35] to-[#191F28] border border-[#B7F34A]/30 mb-5 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#A8B0BC] font-bold">1RM Estimada</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-3xl font-black text-[#B7F34A] font-mono">{rmResult.average}</span>
                  <span className="text-sm font-bold text-[#A8B0BC]">{weightUnit}</span>
                </div>
              </div>
              <div className="text-right text-xs text-[#A8B0BC]">
                <div>Epley: <strong className="text-white font-mono">{rmResult.epley}</strong> {weightUnit}</div>
                <div>Brzycki: <strong className="text-white font-mono">{rmResult.brzycki}</strong> {weightUnit}</div>
              </div>
            </div>

            {/* Percentages Table */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-[#A8B0BC] uppercase tracking-wider block mb-2">
                Zonas de Treinamento e Repetições Alvo
              </span>
              <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                {rmResult.percentages.map(item => (
                  <div
                    key={item.percentage}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#101318] border border-[#222A35] text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-10 font-bold font-mono text-[#B7F34A]">{item.percentage}%</span>
                      <span className="text-white font-medium">{item.focus}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#A8B0BC]">{item.targetReps}</span>
                      <span className="font-bold font-mono text-white min-w-[50px] text-right">
                        {item.weight} {weightUnit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Plate calculator */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-[#A8B0BC] mb-1.5">
                  Carga Total Desejada ({weightUnit})
                </label>
                <input
                  type="number"
                  min="20"
                  max="400"
                  step="2.5"
                  value={targetWeight}
                  onChange={e => setTargetWeight(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full bg-[#101318] border border-[#222A35] rounded-xl px-3 py-2.5 text-white font-mono font-bold text-base focus:border-[#B7F34A] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#A8B0BC] mb-1.5">
                  Peso da Barra ({weightUnit})
                </label>
                <select
                  value={barWeight}
                  onChange={e => setBarWeight(parseFloat(e.target.value))}
                  className="w-full bg-[#101318] border border-[#222A35] rounded-xl px-3 py-2.5 text-white font-semibold text-sm focus:border-[#B7F34A] outline-none"
                >
                  <option value={20}>20 {weightUnit} (Olímpica Masculina)</option>
                  <option value={15}>15 {weightUnit} (Olímpica Feminina)</option>
                  <option value={10}>10 {weightUnit} (Barra Padrão)</option>
                  <option value={8}>8 {weightUnit} (Barra W / Média)</option>
                </select>
              </div>
            </div>

            {/* Visual Barbell Representation */}
            <div className="p-4 rounded-xl bg-[#101318] border border-[#222A35] mb-4">
              <div className="text-center text-xs text-[#A8B0BC] mb-3">
                Distribuição por lado (Barra {barWeight}{weightUnit} + 2 lados)
              </div>

              {/* Barbell sleeve graphic */}
              <div className="relative h-20 flex items-center justify-center">
                {/* Center Bar */}
                <div className="absolute w-full h-3 bg-zinc-700 rounded-full" />
                <div className="absolute w-8 h-8 bg-zinc-600 rounded border border-zinc-500 z-10" />

                {/* Plates loaded on one side */}
                <div className="relative z-20 flex items-center gap-1">
                  {plateResult.platesPerSide.length === 0 ? (
                    <span className="text-xs text-[#A8B0BC] italic">Nenhuma anilha necessária</span>
                  ) : (
                    plateResult.platesPerSide.map(plate => (
                      <React.Fragment key={plate.weight}>
                        {Array.from({ length: plate.count }).map((_, i) => (
                          <div
                            key={`${plate.weight}-${i}`}
                            className={`flex flex-col items-center justify-center font-mono font-bold text-[10px] rounded-sm border shadow ${getPlateColor(
                              plate.weight
                            )}`}
                            style={{
                              width: `${Math.max(14, Math.min(24, plate.weight * 0.9))}px`,
                              height: `${Math.max(34, Math.min(68, plate.weight * 2.3))}px`
                            }}
                          >
                            <span className="rotate-90 origin-center whitespace-nowrap text-[8px] font-black">
                              {plate.weight}
                            </span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* List of plates */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#A8B0BC] uppercase tracking-wider block">
                Coloque em CADA LADO da barra:
              </span>
              {plateResult.platesPerSide.length === 0 ? (
                <div className="text-center py-3 text-xs text-[#A8B0BC]">
                  O peso alvo é menor ou igual ao peso da barra vazia ({barWeight}{weightUnit}).
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {plateResult.platesPerSide.map(plate => (
                    <div
                      key={plate.weight}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#101318] border border-[#222A35]"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-3.5 h-3.5 rounded-full ${getPlateColor(plate.weight)}`} />
                        <span className="text-xs font-bold text-white font-mono">
                          {plate.weight} {weightUnit}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-[#222A35] text-[#B7F34A] text-xs font-mono font-bold">
                        {plate.count}x
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {plateResult.remainder > 0 && (
                <div className="mt-2 text-xs text-amber-400 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                  Diferença de {plateResult.remainder} {weightUnit} não divisível pelas anilhas disponíveis.
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-5 py-3 px-4 rounded-xl bg-[#222A35] hover:bg-[#2b3542] text-white font-bold text-sm transition-all cursor-pointer"
        >
          Fechar Calculadora
        </button>
      </div>
    </div>
  );
};
