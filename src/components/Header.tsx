/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Dumbbell, Calculator, Sun, Moon, Play, ShieldAlert, Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { WorkoutSession } from '../types';

interface HeaderProps {
  activeSession: WorkoutSession | null;
  onResumeWorkout: () => void;
  onOpenCalculator: () => void;
  onOpenDisclaimer: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSession,
  onResumeWorkout,
  onOpenCalculator,
  onOpenDisclaimer,
  theme,
  onToggleTheme
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  return (
    <header className="sticky top-0 z-30 border-b border-[#222A35] bg-[#101318]/90 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#191F28] to-[#101318] border border-[#222A35] flex items-center justify-center shadow-lg relative group">
            <div className="absolute inset-0 bg-[#B7F34A]/10 rounded-xl blur-sm group-hover:bg-[#B7F34A]/20 transition-all"></div>
            <Dumbbell className="w-5 h-5 text-[#B7F34A] relative z-10 transform -rotate-12" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-wider text-white">QYVOVA</span>
              <span className="font-black text-lg tracking-wider text-[#B7F34A]">FIT</span>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-[#A8B0BC] font-semibold -mt-1 hidden sm:block">
              Assistente de Musculação
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          {/* Active Workout Resume pill if workout is running */}
          {activeSession && (
            <button
              onClick={onResumeWorkout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#B7F34A] text-[#101318] font-bold text-xs shadow-md animate-lime-pulse hover:bg-[#cbfb6f] transition-all cursor-pointer"
              title="Continuar treino em andamento"
            >
              <span className="w-2 h-2 rounded-full bg-[#101318] animate-ping" />
              <Play className="w-3.5 h-3.5 fill-[#101318]" />
              <span className="hidden sm:inline">Treino Ativo</span>
            </button>
          )}

          {/* 1RM Calculator */}
          <button
            onClick={onOpenCalculator}
            className="p-2 rounded-xl bg-[#191F28] border border-[#222A35] text-[#A8B0BC] hover:text-[#B7F34A] hover:border-[#B7F34A]/40 transition-colors cursor-pointer"
            title="Calculadora 1RM e Anilhas"
          >
            <Calculator className="w-4 h-4" />
          </button>

          {/* Medical disclaimer */}
          <button
            onClick={onOpenDisclaimer}
            className="p-2 rounded-xl bg-[#191F28] border border-[#222A35] text-[#A8B0BC] hover:text-white hover:border-[#222A35] transition-colors cursor-pointer"
            title="Aviso de Saúde & LGPD"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>

          {/* PWA Install Button */}
          {!isInstalled && (isInstallable || isIOS) && (
            <button
              onClick={install}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#191F28] border border-[#B7F34A]/30 text-[#B7F34A] hover:bg-[#B7F34A]/10 text-xs font-semibold transition-all cursor-pointer"
              title="Instalar QYVOVA FIT no celular ou PC"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instalar App</span>
            </button>
          )}

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-[#191F28] border border-[#222A35] text-[#A8B0BC] hover:text-white transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-300" />}
          </button>
        </div>
      </div>
    </header>
  );
};
