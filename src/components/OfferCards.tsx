import React from 'react';
import { Truck, Zap, ShieldCheck, Clock } from 'lucide-react';
import { OFFER_CARDS } from '../data/landingData';

export const OfferCards: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Truck':
        return <Truck className="w-7 h-7 text-emerald-600" />;
      case 'Zap':
        return <Zap className="w-7 h-7 text-amber-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-7 h-7 text-blue-600" />;
      case 'Clock':
        return <Clock className="w-7 h-7 text-rose-600" />;
      default:
        return <ShieldCheck className="w-7 h-7 text-emerald-600" />;
    }
  };

  return (
    <section id="offers-section" className="py-12 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            सुविधाजनक और सुरक्षित खरीदारी
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            हम आपके स्वास्थ्य, गोपनीयता और संतुष्टि को सर्वोच्च प्राथमिकता देते हैं
          </p>
        </div>

        {/* 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {OFFER_CARDS.map((card) => (
            <div
              key={card.id}
              id={`offer-card-${card.id}`}
              className="bg-gray-50/70 hover:bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-start"
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 border ${card.highlightColor}`}
              >
                {getIcon(card.icon)}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">
                {card.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
