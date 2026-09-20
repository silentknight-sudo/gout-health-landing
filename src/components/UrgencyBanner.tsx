import React, { useState } from 'react';
import { Flame, X } from 'lucide-react';
import { HERO_DATA } from '../data/landingData';
import { CountdownTimer } from './CountdownTimer';

interface Props {
  onDismiss: () => void;
  visible: boolean;
}

export const UrgencyBanner: React.FC<Props> = ({ onDismiss, visible }) => {
  if (!visible) return null;

  return (
    <div
      id="urgency-banner"
      className="fixed top-0 left-0 right-0 h-14 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white z-50 flex items-center justify-between gap-2 px-3 sm:px-6 py-1.5 shadow-md transition-all duration-300"
    >
      <div className="flex-1 flex items-center justify-center flex-wrap gap-1.5 sm:gap-2 text-[11px] sm:text-sm font-semibold tracking-wide text-center">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500/40 animate-pulse shrink-0">
          <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
        </span>
        <span>{HERO_DATA.urgencyBanner}</span>
        <span className="flex items-center gap-1.5 text-amber-200">
          <span className="hidden sm:inline text-xs font-bold">ऑफर समाप्त:</span>
          <CountdownTimer compact className="text-xs sm:text-sm bg-white/15 px-1.5 py-0.5 rounded" />
        </span>
      </div>

      <button
        id="dismiss-banner-btn"
        onClick={onDismiss}
        aria-label="Dismiss urgency banner"
        className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
