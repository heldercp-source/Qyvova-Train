/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ShieldAlert, CheckCircle2, Lock, HeartHandshake } from 'lucide-react';

interface MedicalDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MedicalDisclaimerModal: React.FC<MedicalDisclaimerModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#191F28] border border-[#222A35] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 text-white relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[#222A35] text-[#A8B0BC] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Aviso de Saúde &amp; Privacidade</h3>
            <p className="text-xs text-[#A8B0BC]">Orientações legais e de segurança (LGPD)</p>
          </div>
        </div>

        {/* Mandatory Health Disclaimer */}
        <div className="p-4 rounded-xl bg-[#101318] border border-amber-500/20 text-sm text-gray-200 leading-relaxed mb-4">
          <p className="font-semibold text-amber-300 mb-2 flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            Declaração Importante de Saúde:
          </p>
          <p className="italic">
            &ldquo;O Qyvova Fit é uma ferramenta de organização e registro de atividades físicas. Não substitui orientação profissional, avaliação física ou acompanhamento médico. O aplicativo não prescreve automaticamente exercícios, cargas ou tratamentos.&rdquo;
          </p>
        </div>

        <div className="space-y-3 text-xs text-[#A8B0BC] leading-relaxed mb-6">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#B7F34A] shrink-0 mt-0.5" />
            <span>
              <strong>Consulta Prévia:</strong> Antes de iniciar qualquer programa de exercícios ou musculação de alta intensidade, consulte um médico e um profissional de Educação Física habilitado (CREF).
            </span>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#B7F34A] shrink-0 mt-0.5" />
            <span>
              <strong>Execução Segura:</strong> Priorize a postura e a amplitude correta antes de aumentar cargas. Interrompa imediatamente em caso de dores anormais ou tonturas.
            </span>
          </div>

          <div className="flex items-start gap-2">
            <Lock className="w-4 h-4 text-[#B7F34A] shrink-0 mt-0.5" />
            <span>
              <strong>Privacidade e LGPD:</strong> Seus dados de treino, peso e histórico são armazenados estritamente no seu próprio dispositivo (armazenamento local offline). Você possui controle total para exportar ou excluir seus dados a qualquer momento nas configurações.
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl bg-[#B7F34A] hover:bg-[#c6fb62] text-[#101318] font-bold text-sm transition-all shadow-lg cursor-pointer"
        >
          Entendido e Aceito
        </button>
      </div>
    </div>
  );
};
