import React from 'react';
import { TESTIMONIALS } from '../data/landingData';
import { Star, CheckCircle } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-14 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-2">
            सच्चे अनुभव, प्रामाणिक नतीजे
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            हमारे 10,000+ संतुष्ट ग्राहकों की जुबानी
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            देखें कैसे Gouthealth ने लोगों को दर्दभरी रात से मुक्ति दिलाकर सक्रिय जीवन वापस दिया।
          </p>
        </div>

        {/* 3-Column Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              id={`testimonial-card-${t.id}`}
              className="bg-gray-50/70 rounded-2xl p-6 border border-gray-200 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars and Relief Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {t.reliefBadge}
                  </span>
                </div>

                {/* Quote */}
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200/80">
                <div className="w-10 h-10 rounded-full bg-emerald-200/80 text-emerald-900 flex items-center justify-center font-bold text-base">
                  {t.avatarInitial}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    {t.name}, {t.age} वर्ष
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-gray-500">
                    <span>{t.location}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                      <CheckCircle className="w-3 h-3 text-emerald-600" /> सत्यापित खरीदार
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Bar Below */}
        <div className="mt-12 bg-emerald-50/50 rounded-2xl p-6 border border-emerald-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <span className="block text-2xl sm:text-3xl font-black text-emerald-800">
              10,000+
            </span>
            <span className="text-xs sm:text-sm text-gray-600 font-medium">
              संतुष्ट भारतीय परिवार
            </span>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-black text-emerald-800">
              98%
            </span>
            <span className="text-xs sm:text-sm text-gray-600 font-medium">
              क्लीनिकल सफलता दर
            </span>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-black text-emerald-800">
              4.9 / 5
            </span>
            <span className="text-xs sm:text-sm text-gray-600 font-medium">
              सत्यापित ग्राहक रेटिंग ⭐
            </span>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-black text-emerald-800">
              0%
            </span>
            <span className="text-xs sm:text-sm text-gray-600 font-medium">
              हानिकारक साइड-इफ़ेक्ट्स
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
