import React, { useState } from 'react';
import { Flame, X } from 'lucide-react';
import { HERO_DATA } from '../data/landingData';

interface Props {
  onDismiss: () => void;
  visible: boolean;
}

export const UrgencyBanner: React.FC<Props> = ({ onDismiss, visible }) => {
  if (!visible) return null;

  return (
    <div
      id="urgency-banner"
      className="fixed top-0 left-0 right-0 h-12 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white z-50 flex items-center justify-between px-4 sm:px-6 shadow-md transition-all duration-300"
    >
      <div className="flex-1 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold tracking-wide text-center">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500/40 animate-pulse">
          <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
        </span>
        <span>{HERO_DATA.urgencyBanner}</span>
        <span className="hidden md:inline-block px-2 py-0.5 rounded bg-white/20 text-xs font-bold text-amber-200">
          सीमित स्टॉक
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
