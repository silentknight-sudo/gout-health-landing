import React from 'react';
import { OIL_INGREDIENTS, CAPSULE_INGREDIENTS } from '../data/landingData';
import { Shield, Sparkles, Droplet, Heart, Check, Leaf, Award } from 'lucide-react';

export const IngredientsSection: React.FC = () => {
  return (
    <section id="ingredients" className="py-14 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-2">
            शुद्ध वानस्पतिक अर्क
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            प्राचीन आयुर्वेद का वैज्ञानिक संतुलन
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            शून्य रसायन, शून्य कृत्रिम तत्व। 8 शक्तिशाली औषधियों का दुर्लभ अर्क जो यूरिक एसिड को तोड़ता है।
          </p>
        </div>

        {/* 2-Column Grid: Oil vs Capsules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: Pain Relief Oil */}
          <div className="bg-amber-50/40 rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl border border-amber-300">
                  🪔
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    दर्द निवारक तेल (External Application)
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-800 font-medium">
                    त्वचा में 3 गुना तेजी से समाने वाला औषधीय अर्क
                  </p>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                {OIL_INGREDIENTS.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-4 border border-amber-100/80 shadow-xs flex items-start gap-3 hover:border-amber-300 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-baseline gap-2 mb-1">
                        <span className="font-bold text-gray-900 text-sm sm:text-base">
                          {item.nameHindi}
                        </span>
                        <span className="text-xs text-amber-700 italic font-medium">
                          ({item.nameBotanical})
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-amber-200 text-xs text-amber-900 font-medium flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>सीधे जोड़ों की नसों और कार्टिलेज में पहुंचकर सूजन शांत करता है।</span>
            </div>
          </div>

          {/* Card 2: Detox Capsules */}
          <div className="bg-emerald-50/40 rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl border border-emerald-300">
                  💊
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    डिटॉक्स कैप्सूल (Internal Cleansing)
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-800 font-medium">
                    अंदरूनी यूरिक एसिड क्रिस्टल्स का पूर्ण निष्कासन
                  </p>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                {CAPSULE_INGREDIENTS.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-4 border border-emerald-100/80 shadow-xs flex items-start gap-3 hover:border-emerald-300 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-baseline gap-2 mb-1">
                        <span className="font-bold text-gray-900 text-sm sm:text-base">
                          {item.nameHindi}
                        </span>
                        <span className="text-xs text-emerald-700 italic font-medium">
                          ({item.nameBotanical})
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-emerald-200 text-xs text-emerald-900 font-medium flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>गुर्दों की शोधन क्षमता बढ़ाकर अतिरिक्त यूरिक एसिड को मूत्र मार्ग से बाहर करता है।</span>
            </div>
          </div>

        </div>

        {/* Quality Badges Ribbon */}
        <div className="mt-10 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white rounded-2xl p-4 sm:p-5 shadow-md flex flex-wrap items-center justify-around gap-4 text-center text-xs sm:text-sm font-semibold">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-300 shrink-0" />
            <span>GMP प्रमाणित प्रयोगशाला में निर्मित</span>
          </div>
          <div className="hidden md:block text-white/30">•</div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>आयुष मंत्रालय (Govt. of India) अनुमोदित</span>
          </div>
          <div className="hidden md:block text-white/30">•</div>
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-green-300 shrink-0" />
            <span>100% शुद्ध व प्रामाणिक हिमालयी जड़ी-बूटियां</span>
          </div>
        </div>

      </div>
    </section>
  );
};
