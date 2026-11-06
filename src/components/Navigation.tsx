/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, Dumbbell, BookOpen, TrendingUp, User } from 'lucide-react';

export type NavTab = 'home' | 'routines' | 'exercises' | 'analytics' | 'profile';

interface NavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Início', icon: Home },
    { id: 'routines' as NavTab, label: 'Treinos', icon: Dumbbell },
    { id: 'exercises' as NavTab, label: 'Exercícios', icon: BookOpen },
    { id: 'analytics' as NavTab, label: 'Evolução', icon: TrendingUp },
    { id: 'profile' as NavTab, label: 'Perfil', icon: User }
  ];

  return (
    <>
      {/* Desktop/Tablet Horizontal Navigation Subheader */}
      <nav className="hidden md:block border-b border-[#222A35] bg-[#191F28]/60 backdrop-blur-sm sticky top-16 z-20">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#B7F34A] text-[#B7F34A] bg-[#B7F34A]/5'
                    : 'border-transparent text-[#A8B0BC] hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#B7F34A]' : 'text-[#A8B0BC]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar (Android & Web Mobile Ergonomics) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#101318]/95 backdrop-blur-lg border-t border-[#222A35] pb-safe">
        <div className="grid grid-cols-5 h-16 items-center px-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex flex-col items-center justify-center h-full transition-all cursor-pointer relative py-1 ${
                  isActive ? 'text-[#B7F34A]' : 'text-[#A8B0BC] hover:text-white'
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 w-8 h-1 bg-[#B7F34A] rounded-full shadow-[0_2px_8px_rgba(183,243,74,0.6)]" />
                )}
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-[#B7F34A]' : ''
                  }`}
                />
                <span className={`text-[11px] mt-1 font-medium ${isActive ? 'font-bold' : ''}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
