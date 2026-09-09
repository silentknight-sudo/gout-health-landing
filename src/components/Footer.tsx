import React from 'react';
import { Mail, Clock, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="main-footer" className="bg-gray-900 text-gray-300 pt-12 pb-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 pb-12 border-b border-gray-800">
          
          {/* Column 1: Brand & Certification */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-lg">
                🌿
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Gouthealth
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              प्राचीन आयुर्वेदिक विज्ञान और आधुनिक नैदानिक अनुसंधान का संगम। यूरिक एसिड नियंत्रण एवं जोड़ों के दर्द में 100% प्राकृतिक समाधान।
            </p>
            <div className="flex flex-wrap gap-2 pt-2 text-[11px] text-gray-300">
              <span className="bg-gray-800 px-2.5 py-1 rounded border border-gray-700">
                AYUSH प्रमाणित
              </span>
              <span className="bg-gray-800 px-2.5 py-1 rounded border border-gray-700">
                GMP प्रमाणित
              </span>
              <span className="bg-gray-800 px-2.5 py-1 rounded border border-gray-700">
                NABL टेस्टेड
              </span>
            </div>
          </div>

          {/* Column 2: Delivery & Policies */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase border-b border-gray-800 pb-2">
              डिलीवरी एवं गारंटी
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> कैश ऑन डिलीवरी (Cash on Delivery) उपलब्ध
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> पैन-इंडिया 3-5 दिनों में सुरक्षित एक्सप्रेस शिपिंग
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> 30-दिन मनी बैक गारंटी पॉलिसी
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> 100% हर्बल एवं साइड-इफेक्ट मुक्त सुरक्षा
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase border-b border-gray-800 pb-2">
              संपर्क एवं सहायता
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-gray-400">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ईमेल: support@gouthealth.in</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>समय: सोम-शनि: सुबह 9:00 - शाम 7:00</span>
              </div>
            </div>
          </div>

        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="pt-8 text-center space-y-3 text-[11px] text-gray-500 leading-relaxed max-w-4xl mx-auto">
          <p>
            अस्वीकरण (Disclaimer): यह उत्पाद किसी बीमारी के निदान, उपचार अथवा रोकथाम के लिए नहीं है। व्यक्तिगत परिणाम भिन्न हो सकते हैं। उपयोग से पहले अपने आयुर्वेदिक चिकित्सक से परामर्श अवश्य लें।
          </p>
          <p>© {new Date().getFullYear()} Gouthealth भारत. सर्वाधिकार सुरक्षित। निर्मित एवं विपणित: आरोग्य बायो साइंसेज प्रा. लि.</p>
        </div>

      </div>
    </footer>
  );
};
