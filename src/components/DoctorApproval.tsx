import React from 'react';
import { DOCTOR_DATA } from '../data/landingData';
import { Quote, Award, CheckCircle2 } from 'lucide-react';

export const DoctorApproval: React.FC = () => {
  return (
    <section id="doctor-approval" className="py-14 bg-white border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="bg-gradient-to-br from-emerald-50/50 via-white to-gray-50/50 rounded-3xl p-6 sm:p-10 border border-emerald-200/80 shadow-md">
          
          {/* Top Doctor Profile */}
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-100 border-4 border-white shadow-md flex items-center justify-center text-4xl shrink-0 overflow-hidden">
              👨‍⚕️
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>चिकित्सकीय सत्यापन एवं अनुमोदन</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                {DOCTOR_DATA.name}
              </h3>
              <p className="text-sm font-semibold text-emerald-800">
                {DOCTOR_DATA.qualifications}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {DOCTOR_DATA.institution}
              </p>
            </div>
          </div>

          {/* Quote Box with Left Border (4px primary color) */}
          <div className="relative bg-white rounded-2xl p-5 sm:p-6 border-l-4 border-l-emerald-600 border border-gray-200/80 shadow-xs mb-8">
            <Quote className="w-8 h-8 text-emerald-200 absolute top-4 right-4 pointer-events-none" />
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed italic relative z-10">
              "{DOCTOR_DATA.quote}"
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            {DOCTOR_DATA.stats.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-3 sm:p-4 border border-emerald-100 shadow-2xs"
              >
                <span className="block text-2xl font-black text-emerald-700">
                  {item.value}
                </span>
                <span className="text-xs text-gray-600 font-medium mt-0.5 block">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
