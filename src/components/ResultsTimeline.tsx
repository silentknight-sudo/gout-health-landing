import React from 'react';
import { RESULTS_TIMELINE } from '../data/landingData';
import { CheckCircle, TrendingDown, Activity, Sparkles } from 'lucide-react';

export const ResultsTimeline: React.FC = () => {
  return (
    <section id="results" className="py-14 bg-gradient-to-b from-gray-50/50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-2">
            क्लिनिकली प्रमाणित रिकवरी
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            उपचार का क्रमिक परिणाम: शरीर में क्या परिवर्तन आता है?
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-3">
            Gouthealth का द्वि-चरणीय फॉर्मूला पहले दिन से ही रक्त परिसंचरण और जोड़ों के द्रव में सक्रिय हो जाता है।
          </p>
        </div>

        {/* 4 Steps Timeline */}
        <div className="space-y-6">
          {RESULTS_TIMELINE.map((item, index) => (
            <div
              key={index}
              id={`timeline-step-${index + 1}`}
              className={`bg-white rounded-2xl p-6 sm:p-7 border border-gray-200 shadow-xs hover:shadow-md transition-all duration-300 border-l-4 ${item.accentColor}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    {item.step}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {item.timeframe}
                  </span>
                </div>
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full w-fit ${item.badgeBg}`}>
                  <CheckCircle className="w-3.5 h-3.5" />
                  {item.tag}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {item.title}
              </h3>
              
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
