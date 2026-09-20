import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';

interface Props {
  onOrderClick: () => void;
}

export const FloatingCta: React.FC<Props> = ({ onOrderClick }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 450);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Mobile: full-width sticky bottom bar (highest-visibility conversion point) */}
      <div
        id="floating-cta-mobile-bar"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-red-200 shadow-[0_-4px_20px_rgba(0,0,0,0.12)] px-3 py-2.5 flex items-center gap-2.5"
      >
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] font-bold text-red-600">ऑफर समाप्त:</span>
          <CountdownTimer compact className="text-xs text-gray-900" />
        </div>
        <button
          id="floating-cta-btn-mobile"
          onClick={onOrderClick}
          className="flex-1 flex items-center justify-center gap-2 bg-red-600 active:bg-red-800 text-white font-black text-sm py-3 rounded-xl shadow-lg cursor-pointer animate-pulse-subtle"
        >
          <ShoppingBag className="w-4 h-4 text-amber-300" />
          <span>अभी ऑर्डर करें - COD</span>
        </button>
      </div>

      {/* Desktop: floating pill button */}
      <div
        id="floating-cta-container"
        className="hidden sm:flex fixed bottom-6 right-6 z-40 items-end gap-2"
      >
        <button
          id="floating-cta-btn"
          onClick={onOrderClick}
          className="flex items-center gap-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black text-base px-6 py-4 rounded-full shadow-2xl hover:shadow-red-500/30 transition-all duration-300 border-2 border-white cursor-pointer animate-pulse-subtle"
        >
          <ShoppingBag className="w-5 h-5 text-amber-300" />
          <span>अभी ऑर्डर करें - कैश ऑन डिलीवरी</span>
        </button>
      </div>
    </>
  );
};
