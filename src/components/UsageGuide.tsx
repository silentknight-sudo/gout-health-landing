import React from 'react';
import { USAGE_STEPS } from '../data/landingData';
import { CheckCircle2, Lightbulb, HeartPulse } from 'lucide-react';

export const UsageGuide: React.FC = () => {
  return (
    <section id="usage" className="py-14 bg-gray-50/60 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-2">
            सहज एवं सरल
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            सही प्रयोग विधि (Usage Guide)
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            सर्वोत्तम व स्थायी परिणामों के लिए प्रतिदिन इस सरल दिनचर्या का पालन करें।
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Column 1: Oil */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-extrabold text-lg border border-amber-300">
                  1
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    {USAGE_STEPS.oil.title}
                  </h3>
                  <span className="text-xs text-amber-800 font-semibold">
                    {USAGE_STEPS.oil.subtitle}
                  </span>
                </div>
              </div>

              <div className="space-y-4 text-sm text-gray-700">
                {USAGE_STEPS.oil.points.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs sm:text-sm text-amber-900 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <span>{USAGE_STEPS.oil.tip}</span>
            </div>
          </div>

          {/* Column 2: Capsules */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-extrabold text-lg border border-emerald-300">
                  2
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    {USAGE_STEPS.capsule.title}
                  </h3>
                  <span className="text-xs text-emerald-800 font-semibold">
                    {USAGE_STEPS.capsule.subtitle}
                  </span>
                </div>
              </div>

              <div className="space-y-4 text-sm text-gray-700">
                {USAGE_STEPS.capsule.points.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs sm:text-sm text-emerald-900 flex items-start gap-3">
              <HeartPulse className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{USAGE_STEPS.capsule.recommendedCourse}</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
