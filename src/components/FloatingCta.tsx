import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowUp } from 'lucide-react';
import { HERO_DATA } from '../data/landingData';

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
    <div
      id="floating-cta-container"
      className="fixed bottom-4 right-4 z-40 flex flex-col sm:flex-row items-end gap-2 animate-bounce-subtle"
    >
      <button
        id="floating-cta-btn"
        onClick={onOrderClick}
        className="flex items-center gap-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black text-sm sm:text-base px-5 py-3.5 rounded-full shadow-2xl hover:shadow-red-500/30 transition-all duration-300 border-2 border-white cursor-pointer"
      >
        <ShoppingBag className="w-4 h-4 text-amber-300" />
        <span>अभी ऑर्डर करें (₹{HERO_DATA.discountedPrice.toLocaleString('en-IN')})</span>
      </button>
    </div>
  );
};
