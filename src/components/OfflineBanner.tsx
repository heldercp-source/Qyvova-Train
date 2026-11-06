/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-300 px-4 py-2 text-xs flex items-center justify-center gap-2 animate-fadeIn">
      <WifiOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
      <span>
        <strong>Modo Offline ativo:</strong> Suas rotinas, exercícios, cronômetro e registros funcionam 100% no seu dispositivo.
      </span>
    </div>
  );
};
