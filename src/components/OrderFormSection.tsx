import React, { useState } from 'react';
import { ShieldCheck, Truck, CheckCircle, AlertCircle, Loader2, Sparkles, Lock, FileSpreadsheet, User, Phone, ExternalLink } from 'lucide-react';
import { HERO_DATA } from '../data/landingData';
import { OrderResponse } from '../types';

interface Props {
  onOrderSuccess: (orderId: string, response: OrderResponse) => void;
}

export const OrderFormSection: React.FC<Props> = ({ onOrderSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<OrderResponse | null>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'कृपया अपना पूरा नाम दर्ज करें (Full Name is required)';
    }

    const cleanPhone = formData.phone.trim().replace(/[\s-]/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      newErrors.phone = 'कृपया 10 अंकों का वैध भारतीय मोबाइल नंबर दर्ज करें (Valid 10-digit number starting with 6-9)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: '',
          address: '',
          notes: 'त्वरित COD ऑर्डर (नाम व फोन - कॉल द्वारा पता पुष्टि)',
          combo: 'Gouthealth 60-Day Complete Healing Pack (₹1,999)',
        }),
      });

      let data: OrderResponse;
      try {
        data = await response.json();
      } catch {
        const text = await response.text();
        throw new Error(text || 'सर्वर से संपर्क नहीं हो पाया');
      }

      if (response.ok && data.success) {
        setSubmitResult(data);
        if (data.orderId) {
          onOrderSuccess(data.orderId, data);
        }
        // Reset form
        setFormData({
          name: '',
          phone: '',
        });
      } else {
        setErrors({ form: data?.message || 'ऑर्डर दर्ज करने में त्रुटि हुई। कृपया पुनः प्रयास करें।' });
      }
    } catch (err: any) {
      console.error('Submit error:', err);
      setErrors({ form: err?.message?.includes('सर्वर') ? err.message : 'सर्वर से कनेक्ट करने में असमर्थ। कृपया पुनः प्रयास करें।' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="order-form-section"
      className="py-16 bg-gradient-to-b from-amber-50/50 via-white to-emerald-50/40 border-t border-gray-200"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Main Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-red-500/20 shadow-xl relative overflow-hidden">
          
          {/* Header Badge */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold tracking-wide uppercase mb-3 border border-red-200">
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              <span>सीमित समय की 20% विशेष छूट</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              कैश ऑन डिलीवरी (COD) ऑर्डर फॉर्म
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-2">
              बस अपना नाम और मोबाइल नंबर दर्ज करें — हमारी टीम डिलीवरी पते की पुष्टि हेतु आपसे तुरंत कॉल पर संपर्क करेगी!
            </p>
          </div>

          {/* Success Banner if ordered */}
          {submitResult && (
            <div className="mb-8 p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 shadow-sm animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-emerald-900">
                    बधाई हो! आपका ऑर्डर सफलतापूर्वक दर्ज कर लिया गया है!
                  </h3>
                  <p className="text-sm text-emerald-800 mt-1">
                    ऑर्डर आईडी (Order ID):{' '}
                    <span className="font-mono font-black text-emerald-950 bg-emerald-200/60 px-2 py-0.5 rounded">
                      {submitResult.orderId}
                    </span>
                  </p>
                  <p className="text-xs text-emerald-700 mt-2">
                    {submitResult.message}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <span className="flex items-center gap-1.5 bg-white/90 text-emerald-900 px-3 py-1.5 rounded-lg border border-emerald-200">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>ऑर्डर डेटा सुरक्षित रूप से दर्ज</span>
                    </span>
                    <span className="bg-white/90 px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-800">
                      डिलीवरी: 3-5 कार्य दिवस (COD)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Order Summary Item Card */}
          <div className="bg-gray-50/90 rounded-2xl p-4 sm:p-5 border border-gray-200 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <img
                src="/assets/product-hero.jpg"
                alt="Gouthealth Pack"
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-xl object-cover border border-emerald-300 shrink-0 shadow-xs"
              />
              <div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                  Arogya Bio Gouthealth 60-दिन कंप्लीट हीलिंग पैक
                </h3>
                <p className="text-xs text-gray-500">
                  1 बोतल दर्द निवारक तेल (100ml) + 1 जार डिटॉक्स कैप्सूल (30x2 कैप्सूल)
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right shrink-0">
              <div className="text-2xl sm:text-3xl font-black text-red-600">
                ₹{HERO_DATA.discountedPrice.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-gray-400 line-through">
                ₹{HERO_DATA.regularPrice.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* General Form Error */}
          {errors.form && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          {/* Form with ONLY Name and Phone Number */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-800 mb-1.5">
                <User className="w-4 h-4 text-emerald-700" />
                <span>आपका पूरा नाम (Full Name) *</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                placeholder="उदा. राजेश कुमार"
                className={`w-full px-4 py-3.5 text-base rounded-xl border ${
                  errors.name ? 'border-red-500 bg-red-50/20' : 'border-gray-300 focus:border-emerald-600'
                } focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium`}
                required
              />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>

            {/* Phone Input */}
            <div>
              <label htmlFor="phone" className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-800 mb-1.5">
                <Phone className="w-4 h-4 text-emerald-700" />
                <span>मोबाइल नंबर (Phone Number - डिलीवरी कॉल हेतु) *</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-sm sm:text-base font-bold text-gray-600 select-none">
                  +91
                </span>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  placeholder="10 अंकों का मोबाइल नंबर"
                  maxLength={10}
                  className={`w-full pl-14 pr-4 py-3.5 text-base rounded-xl border ${
                    errors.phone ? 'border-red-500 bg-red-50/20' : 'border-gray-300 focus:border-emerald-600'
                  } focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium tracking-wide`}
                  required
                />
              </div>
              {errors.phone ? (
                <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">
                  इस नंबर पर हमारी टीम डिलीवरी पते की पुष्टि (Address Confirmation) हेतु कॉल करेगी।
                </p>
              )}
            </div>

            {/* COD Notice Box */}
            <div className="p-4 rounded-2xl bg-blue-50/90 border border-blue-200 text-xs sm:text-sm text-blue-950 flex items-start gap-3">
              <Truck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-sm">कैश ऑन डिलीवरी (COD) - 100% सुरक्षित:</span>
                <span className="text-blue-900 leading-relaxed block mt-0.5">
                  कोई ऑनलाइन भुगतान करने की आवश्यकता नहीं है! ऑर्डर बुक करने के बाद हमारे प्रतिनिधि आपको कॉल करके डिलीवरी का पूरा पता नोट करेंगे। जब पार्सल आपके घर पहुंचेगा, तभी नकद पैसे दें।
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="submit-order-form-btn"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black text-base sm:text-xl py-4 sm:py-5 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer disabled:opacity-75"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>ऑर्डर प्रोसेस हो रहा है...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>
                    ⚡ अभी ऑर्डर कन्फर्म करें (₹{HERO_DATA.discountedPrice.toLocaleString('en-IN')}) - फ्री होम डिलीवरी
                  </span>
                </>
              )}
            </button>

            {/* Trust Footer Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-center text-xs text-gray-500 font-medium">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-gray-400" /> 256-Bit SSL सुरक्षित
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-gray-400" /> 100% गोपनीय व सुरक्षित पार्सल
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-gray-400" /> 30-दिन मनी बैक गारंटी
              </span>
            </div>

          </form>

        </div>

      </div>
    </section>
  );
};
