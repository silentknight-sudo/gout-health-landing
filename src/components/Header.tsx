import React from 'react';
import { ShoppingBag, Search, ShieldCheck } from 'lucide-react';

interface Props {
  bannerVisible: boolean;
  onOpenOrderLookup: () => void;
  onOpenAdmin?: () => void;
  onOrderNowClick: () => void;
}

export const Header: React.FC<Props> = ({
  bannerVisible,
  onOpenOrderLookup,
  onOrderNowClick,
}) => {
  return (
    <header
      id="main-header"
      style={{ top: bannerVisible ? '48px' : '0px' }}
      className="sticky left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          id="header-brand-logo"
          className="flex items-center gap-2 group transition-transform"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl shadow-xs border border-emerald-200 group-hover:scale-105 transition-transform">
            🌿
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 block leading-tight">
              Gout<span className="text-emerald-700">health</span>
            </span>
            <span className="text-[10px] tracking-wider font-semibold text-emerald-700 uppercase block -mt-0.5">
              प्रामाणिक आयुर्वेद
            </span>
          </div>
        </a>

        {/* Quick Trust Badges (Desktop) */}
        <div className="hidden lg:flex items-center gap-6 text-xs text-gray-600 font-medium">
          <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>AYUSH & GMP प्रमाणित</span>
          </div>
          <a
            href="#results"
            className="hover:text-emerald-700 transition-colors font-semibold"
          >
            परिणाम
          </a>
          <a
            href="#ingredients"
            className="hover:text-emerald-700 transition-colors font-semibold"
          >
            सामग्री
          </a>
          <a
            href="#usage"
            className="hover:text-emerald-700 transition-colors font-semibold"
          >
            प्रयोग विधि
          </a>
          <a
            href="#faq"
            className="hover:text-emerald-700 transition-colors font-semibold"
          >
            FAQ
          </a>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Order Lookup Button */}
          <button
            id="track-order-header-btn"
            onClick={onOpenOrderLookup}
            title="ऑर्डर ट्रैक करें (Track Order)"
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-gray-600" />
            <span className="hidden sm:inline">ऑर्डर ट्रैक</span>
          </button>

          {/* Primary CTA */}
          <button
            id="header-order-now-btn"
            onClick={onOrderNowClick}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs sm:text-sm px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>अभी ऑर्डर करें</span>
          </button>
        </div>
      </div>
    </header>
  );
};
