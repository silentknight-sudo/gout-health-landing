import React from 'react';
import { BEFORE_AFTER } from '../data/landingData';
import { X, Check } from 'lucide-react';

export const BeforeAfterSection: React.FC = () => {
  return (
    <section id="before-after" className="py-14 bg-gray-50/70 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-2">
            जीवन बदलने वाला अंतर
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            पहले बनाम बाद में (Before vs After)
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            देखें Gouthealth आपकी दिनचर्या और जोड़ों के स्वास्थ्य को कैसे पूरी तरह बदल देता है।
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Left Column: Before (Red Theme) */}
          <div className="bg-red-50/40 rounded-3xl p-6 sm:p-8 border border-red-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-red-200/60">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                  <X className="w-6 h-6 stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-red-950">
                    Gouthealth शुरू करने से पहले
                  </h3>
                  <span className="text-xs text-red-700 font-semibold">
                    जोड़ों का असहनीय दर्द और लाचारी
                  </span>
                </div>
              </div>

              <ul className="space-y-4">
                {BEFORE_AFTER.before.map((text, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-red-100/40 transition-colors"
                  >
                    <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <span className="text-xs sm:text-sm text-gray-700 leading-snug">
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: After (Green Theme) */}
          <div className="bg-emerald-50/40 rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-emerald-200/60">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-emerald-950">
                    Gouthealth उपयोग के बाद
                  </h3>
                  <span className="text-xs text-emerald-700 font-semibold">
                    दर्द मुक्त, सक्रिय व आनंदमय जीवन
                  </span>
                </div>
              </div>

              <ul className="space-y-4">
                {BEFORE_AFTER.after.map((text, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-emerald-100/40 transition-colors"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <span className="text-xs sm:text-sm text-gray-800 leading-snug font-medium">
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
