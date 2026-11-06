/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  User,
  Settings,
  Download,
  Upload,
  Trash2,
  ShieldCheck,
  Volume2,
  Vibrate,
  Clock,
  Sun,
  Moon,
  Scale,
  Calculator,
  Check,
  AlertCircle,
  FileText,
  AlertTriangle,
  Award
} from 'lucide-react';
import { UserProfile, DifficultyLevel } from '../types';
import {
  exportAllDataAsJSON,
  importAllDataFromJSON,
  wipeAllData
} from '../services/storage';

interface ProfileViewProps {
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onOpenCalculator: () => void;
  onOpenDisclaimer: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onDataReset: () => void;
}

const FITNESS_GOALS = [
  'Hipertrofia',
  'Força',
  'Emagrecimento',
  'Condicionamento',
  'Saúde Geral'
] as const;

const LEVELS: DifficultyLevel[] = ['Iniciante', 'Intermediário', 'Avançado'];

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile: initialProfile,
  onSaveProfile,
  onOpenCalculator,
  onOpenDisclaimer,
  theme,
  onToggleTheme,
  onDataReset
}) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [showWipeConfirm, setShowWipeConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = (field: keyof UserProfile, value: any) => {
    const updated = { ...profile, [field]: value };
    setProfile(updated);
    onSaveProfile(updated);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  const handleExportBackup = () => {
    const jsonStr = exportAllDataAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qyvova_fit_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const success = importAllDataFromJSON(content);
        if (success) {
          setImportStatus('Backup importado com sucesso!');
          onDataReset(); // Reload state
        } else {
          setImportStatus('Arquivo de backup inválido.');
        }
        setTimeout(() => setImportStatus(null), 3500);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleWipeData = () => {
    wipeAllData();
    setShowWipeConfirm(false);
    onDataReset();
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">Perfil &amp; Ajustes</h1>
          <p className="text-xs text-[#A8B0BC]">
            Gerencie seus dados pessoais, unidades de medida e backup offline
          </p>
        </div>

        {isSavedNotice && (
          <span className="flex items-center gap-1 text-xs text-[#B7F34A] bg-[#B7F34A]/10 px-3 py-1.5 rounded-xl border border-[#B7F34A]/30 animate-fadeIn">
            <Check className="w-3.5 h-3.5" />
            Salvo
          </span>
        )}
      </div>

      {importStatus && (
        <div className="p-3 rounded-xl bg-[#222A35] border border-[#B7F34A]/40 text-xs text-white flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-[#B7F34A]" />
          <span>{importStatus}</span>
        </div>
      )}

      {/* Profile Info Card */}
      <div className="p-5 rounded-2xl bg-[#191F28] border border-[#222A35] space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#B7F34A] text-[#101318] flex items-center justify-center font-black text-xl shadow-lg">
            {(profile.nickname || profile.name).charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{profile.name}</h3>
            <span className="text-xs text-[#A8B0BC]">Nível: {profile.level}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-[#A8B0BC] mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={e => handleUpdate('name', e.target.value)}
              className="w-full bg-[#101318] border border-[#222A35] rounded-xl px-3 py-2 text-white text-xs focus:border-[#B7F34A] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A8B0BC] mb-1">
              Como prefere ser chamado (Apelido)
            </label>
            <input
              type="text"
              value={profile.nickname || ''}
              onChange={e => handleUpdate('nickname', e.target.value)}
              className="w-full bg-[#101318] border border-[#222A35] rounded-xl px-3 py-2 text-white text-xs focus:border-[#B7F34A] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A8B0BC] mb-1">
              Nível de Experiência
            </label>
            <select
              value={profile.level}
              onChange={e => handleUpdate('level', e.target.value as DifficultyLevel)}
              className="w-full bg-[#101318] border border-[#222A35] rounded-xl px-3 py-2 text-white text-xs font-semibold focus:border-[#B7F34A] outline-none"
            >
              {LEVELS.map(lvl => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A8B0BC] mb-1">
              Objetivo Principal
            </label>
            <select
              value={profile.goal || 'Hipertrofia'}
              onChange={e => handleUpdate('goal', e.target.value)}
              className="w-full bg-[#101318] border border-[#222A35] rounded-xl px-3 py-2 text-white text-xs font-semibold focus:border-[#B7F34A] outline-none"
            >
              {FITNESS_GOALS.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A8B0BC] mb-1">
              Peso Corporal (opcional, em {profile.weightUnit})
            </label>
            <input
              type="number"
              step="0.5"
              min="30"
              max="300"
              value={profile.weightKg || ''}
              onChange={e => handleUpdate('weightKg', parseFloat(e.target.value) || undefined)}
              placeholder="Ex: 78.5"
              className="w-full bg-[#101318] border border-[#222A35] rounded-xl px-3 py-2 text-white text-xs font-mono focus:border-[#B7F34A] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A8B0BC] mb-1">
              Altura (opcional, em cm)
            </label>
            <input
              type="number"
              min="100"
              max="240"
              value={profile.heightCm || ''}
              onChange={e => handleUpdate('heightCm', parseInt(e.target.value) || undefined)}
              placeholder="Ex: 178"
              className="w-full bg-[#101318] border border-[#222A35] rounded-xl px-3 py-2 text-white text-xs font-mono focus:border-[#B7F34A] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Preferences & Workout Settings */}
      <div className="p-5 rounded-2xl bg-[#191F28] border border-[#222A35] space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Settings className="w-4 h-4 text-[#B7F34A]" />
          Preferências do Aplicativo
        </h3>

        <div className="space-y-3 divide-y divide-[#222A35]">
          {/* Unit Switcher */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-xs font-bold text-white block">Unidade de Medida</span>
              <span className="text-[11px] text-[#A8B0BC]">Quilogramas (kg) ou Libras (lb)</span>
            </div>
            <div className="flex bg-[#101318] p-1 rounded-xl border border-[#222A35]">
              <button
                type="button"
                onClick={() => handleUpdate('weightUnit', 'kg')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  profile.weightUnit === 'kg'
                    ? 'bg-[#B7F34A] text-[#101318]'
                    : 'text-[#A8B0BC]'
                }`}
              >
                kg
              </button>
              <button
                type="button"
                onClick={() => handleUpdate('weightUnit', 'lb')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  profile.weightUnit === 'lb'
                    ? 'bg-[#B7F34A] text-[#101318]'
                    : 'text-[#A8B0BC]'
                }`}
              >
                lb
              </button>
            </div>
          </div>

          {/* Theme switcher */}
          <div className="flex items-center justify-between pt-3">
            <div>
              <span className="text-xs font-bold text-white block">Tema Visual</span>
              <span className="text-[11px] text-[#A8B0BC]">Escuro (padrão esportivo) ou Claro</span>
            </div>
            <button
              onClick={onToggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#101318] border border-[#222A35] text-xs font-bold text-white hover:border-[#B7F34A]/40"
            >
              {theme === 'dark' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-blue-300" />
                  <span>Escuro (#101318)</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Claro</span>
                </>
              )}
            </button>
          </div>

          {/* Timer Sound Toggle */}
          <div className="flex items-center justify-between pt-3">
            <div>
              <span className="text-xs font-bold text-white block">Sons do Cronômetro</span>
              <span className="text-[11px] text-[#A8B0BC]">Avisos sonoros nos últimos 3s e ao finalizar</span>
            </div>
            <button
              type="button"
              onClick={() => handleUpdate('timerSoundEnabled', !profile.timerSoundEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                profile.timerSoundEnabled ? 'bg-[#B7F34A]' : 'bg-[#222A35]'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-[#101318] transition-transform ${
                  profile.timerSoundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Timer Vibration Toggle */}
          <div className="flex items-center justify-between pt-3">
            <div>
              <span className="text-xs font-bold text-white block">Vibração no Dispositivo</span>
              <span className="text-[11px] text-[#A8B0BC]">Feedback tátil ao término do descanso (Android/celular)</span>
            </div>
            <button
              type="button"
              onClick={() => handleUpdate('timerVibrationEnabled', !profile.timerVibrationEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                profile.timerVibrationEnabled ? 'bg-[#B7F34A]' : 'bg-[#222A35]'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-[#101318] transition-transform ${
                  profile.timerVibrationEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Timer Autostart */}
          <div className="flex items-center justify-between pt-3">
            <div>
              <span className="text-xs font-bold text-white block">Auto-início do Descanso</span>
              <span className="text-[11px] text-[#A8B0BC]">Disparar cronômetro imediatamente ao concluir uma série</span>
            </div>
            <button
              type="button"
              onClick={() => handleUpdate('timerAutostart', !profile.timerAutostart)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                profile.timerAutostart ? 'bg-[#B7F34A]' : 'bg-[#222A35]'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-[#101318] transition-transform ${
                  profile.timerAutostart ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Tools & Legal */}
      <div className="p-5 rounded-2xl bg-[#191F28] border border-[#222A35] space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Calculator className="w-4 h-4 text-[#B7F34A]" />
          Ferramentas &amp; Saúde
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={onOpenCalculator}
            className="p-3.5 rounded-xl bg-[#101318] border border-[#222A35] hover:border-[#B7F34A]/40 text-left transition-colors cursor-pointer"
          >
            <div className="text-xs font-bold text-white">Calculadora 1RM &amp; Anilhas</div>
            <div className="text-[10px] text-[#A8B0BC] mt-0.5">Estime repetições máximas e barras</div>
          </button>

          <button
            onClick={onOpenDisclaimer}
            className="p-3.5 rounded-xl bg-[#101318] border border-[#222A35] hover:border-amber-400/40 text-left transition-colors cursor-pointer"
          >
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Aviso de Saúde &amp; LGPD
            </div>
            <div className="text-[10px] text-[#A8B0BC] mt-0.5">Orientações de segurança médica e privacidade</div>
          </button>
        </div>
      </div>

      {/* Backup, Export & LGPD Data Deletion */}
      <div className="p-5 rounded-2xl bg-[#191F28] border border-[#222A35] space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Download className="w-4 h-4 text-[#B7F34A]" />
          Backup &amp; Privacidade dos Dados (LGPD)
        </h3>
        <p className="text-xs text-[#A8B0BC] leading-relaxed">
          Seus dados pertencem a você e ficam armazenados offline no seu aparelho. Você pode exportar seu histórico completo ou restaurar em outro dispositivo.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
          <button
            onClick={handleExportBackup}
            className="py-2.5 px-3 rounded-xl bg-[#101318] border border-[#222A35] hover:border-[#B7F34A]/50 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#B7F34A]" />
            <span>Exportar Backup</span>
          </button>

          <label className="py-2.5 px-3 rounded-xl bg-[#101318] border border-[#222A35] hover:border-[#B7F34A]/50 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-blue-400" />
            <span>Importar Backup</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>

          <button
            onClick={() => setShowWipeConfirm(true)}
            className="py-2.5 px-3 rounded-xl bg-red-950/20 border border-red-500/30 hover:bg-red-950/40 text-red-400 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Excluir Dados</span>
          </button>
        </div>
      </div>

      {/* Wipe Confirmation Modal */}
      {showWipeConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#191F28] border border-red-500/40 rounded-2xl max-w-sm w-full p-5 text-white">
            <div className="w-11 h-11 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold mb-1">Apagar TODOS os dados?</h3>
            <p className="text-xs text-[#A8B0BC] leading-relaxed mb-4">
              Esta ação excluirá permanentemente todos os seus treinos, histórico de sessões, PRs e preferências locais, restaurando o aplicativo para as configurações de fábrica.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowWipeConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#222A35] text-white text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleWipeData}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Apagar Tudo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
