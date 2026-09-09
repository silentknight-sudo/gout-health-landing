import React from 'react';
import { FAQ_DATA } from '../data/landingData';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  return (
    <section id="faq" className="py-14 bg-gray-50/50 border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-2">
            आपकी सभी शंकाओं का समाधान
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            अक्सर पूछे जाने वाले सवाल (24x7)
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            यदि आपका कोई अन्य प्रश्न है, तो हमारी 24x7 हेल्पलाइन पर निःसंकोच कॉल करें।
          </p>
        </div>

        {/* Semantic <details> / <summary> Accordion */}
        <div className="space-y-4">
          {FAQ_DATA.map((faq) => (
            <details
              key={faq.id}
              id={faq.id}
              className="group bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden transition-all duration-300"
            >
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none select-none font-bold text-gray-900 text-sm sm:text-base hover:text-emerald-700 transition-colors">
                <span className="pr-4">{faq.question}</span>
                <ChevronDown className="w-5 h-5 text-emerald-600 shrink-0 transform group-open:rotate-180 transition-transform duration-300" />
              </summary>
              <div className="px-5 pb-5 pt-1 text-gray-600 text-sm leading-relaxed border-t border-gray-100 mt-1">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>

      </div>
    </section>
  );
};
