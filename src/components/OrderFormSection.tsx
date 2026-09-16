import React, { useState } from 'react';
import { ShieldCheck, Truck, CheckCircle, AlertCircle, Loader2, Sparkles, Lock, FileSpreadsheet, User, Phone, ExternalLink } from 'lucide-react';
import { HERO_DATA } from '../data/landingData';
import { OrderResponse } from '../types';

interface Props {
  onOrderSuccess: (orderId: string, response: OrderResponse) => void;
}

function normalizeIndianPhone(input: string): string {
  let cleaned = (input || '').toString().trim().replace(/[\s\-\(\)\+\.]/g, '');
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.slice(1);
  } else if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.slice(2);
  }
  return cleaned;
}

export const OrderFormSection: React.FC<Props> = ({ onOrderSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Restore recent confirmed order from session storage so page refresh won't show blank form or re-trigger leads
  const [submitResult, setSubmitResult] = useState<OrderResponse | null>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = sessionStorage.getItem('gouthealth_confirmed_order');
        if (saved) {
          const parsed = JSON.parse(saved);
          // Keep active if within last 2 hours
          if (parsed && parsed.timestamp && Date.now() - parsed.timestamp < 2 * 60 * 60 * 1000) {
            return parsed.data;
          }
        }
      }
    } catch {
      // Ignore parse error
    }
    return null;
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'कृपया अपना पूरा नाम दर्ज करें (Full Name is required)';
    }

    const cleanPhone = normalizeIndianPhone(formData.phone);
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

    const cleanPhone = normalizeIndianPhone(formData.phone);

    // Capture Meta / UTM parameters
    let utmSource = '';
    let utmMedium = '';
    let utmCampaign = '';
    try {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        utmSource = urlParams.get('utm_source') || (urlParams.get('fbclid') ? 'meta_ads' : '');
        utmMedium = urlParams.get('utm_medium') || '';
        utmCampaign = urlParams.get('utm_campaign') || '';
      }
    } catch (e) {
      // Ignore URL parse error
    }

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: cleanPhone,
          email: '',
          address: '',
          notes: 'त्वरित COD ऑर्डर (नाम व फोन - कॉल द्वारा पता पुष्टि)',
          combo: 'Gouthealth 60-Day Complete Healing Pack',
          utmSource,
          utmMedium,
          utmCampaign,
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

        // Persist confirmed order so page refreshes/reloads will not show an empty form
        try {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('gouthealth_confirmed_order', JSON.stringify({
              timestamp: Date.now(),
              data,
            }));
          }
        } catch {
          // Ignore storage error
        }

        // Meta Pixel Lead Deduplication Guard:
        // 1. Skip if server flagged as duplicate submission
        // 2. Skip if this phone or order was already fired in this browser session
        // 3. Use Meta's official eventID deduplication parameter
        try {
          if (typeof window !== 'undefined' && (window as any).fbq) {
            const phoneLeadKey = `meta_lead_phone_${cleanPhone}`;
            const orderLeadKey = data.orderId ? `meta_lead_order_${data.orderId}` : '';
            
            const alreadyFiredForPhone = sessionStorage.getItem(phoneLeadKey) || localStorage.getItem(phoneLeadKey);
            const alreadyFiredForOrder = orderLeadKey && (sessionStorage.getItem(orderLeadKey) || localStorage.getItem(orderLeadKey));

            if (!data.isDuplicate && !alreadyFiredForPhone && !alreadyFiredForOrder) {
              // Pass eventID so Meta automatically deduplicates any retries
              const eventOptions = data.orderId ? { eventID: data.orderId } : undefined;

              (window as any).fbq('track', 'Lead', {
                content_name: 'Gouthealth 60-Day Healing Pack',
                status: 'order_confirmed',
              }, eventOptions);
              
              (window as any).fbq('track', 'Purchase', {
                content_name: 'Gouthealth 60-Day Healing Pack',
                order_id: data.orderId || undefined,
              }, eventOptions);

              // Mark as tracked in session and local storage
              sessionStorage.setItem(phoneLeadKey, 'true');
              localStorage.setItem(phoneLeadKey, String(Date.now()));
              if (orderLeadKey) {
                sessionStorage.setItem(orderLeadKey, 'true');
                localStorage.setItem(orderLeadKey, String(Date.now()));
              }
            } else {
              console.log('[Meta Pixel] Lead event skipped: Order already tracked or duplicate submission.');
            }
          }
        } catch (pixelErr) {
          console.warn('Meta Pixel tracking error:', pixelErr);
        }

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

          {/* If already submitted (or page was refreshed after submitting), show Confirmed Order State instead of blank form */}
          {submitResult ? (
            <div id="order-confirmed-view" className="text-center py-6 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 border-2 border-emerald-300 shadow-xs">
                <CheckCircle className="w-9 h-9 stroke-[2.5]" />
              </div>

              <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-2 border border-emerald-300">
                ऑर्डर सफलतापूर्वक दर्ज (Order Confirmed)
              </span>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
                बधाई हो! आपका ऑर्डर प्राप्त हो चुका है
              </h3>

              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 max-w-md mx-auto my-5 text-left shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-200 mb-3">
                  <span className="text-xs font-bold text-emerald-900">ऑर्डर आईडी (Order ID):</span>
                  <span className="font-mono font-black text-emerald-950 bg-white px-3 py-1 rounded-md border border-emerald-300 text-sm tracking-wide">
                    {submitResult.orderId}
                  </span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                  {submitResult.message}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto text-xs font-semibold text-gray-700 mb-6 text-left">
                <div className="flex items-center gap-2.5 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                  <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>फ्री होम डिलीवरी (3-5 कार्य दिवस)</span>
                </div>
                <div className="flex items-center gap-2.5 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>100% कैश ऑन डिलीवरी (COD)</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 max-w-md mx-auto mb-6 text-left">
                <span className="font-bold block mb-1">महत्वपूर्ण सूचना:</span>
                हमारी टीम डिलीवरी पते की पुष्टि हेतु आपसे कुछ ही समय में कॉल पर संपर्क करेगी। पार्सल घर पहुँचने पर ही नकद भुगतान करें।
              </div>

              <button
                type="button"
                id="place-new-order-btn"
                onClick={() => {
                  setSubmitResult(null);
                  try {
                    sessionStorage.removeItem('gouthealth_confirmed_order');
                  } catch {}
                }}
                className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                <span>नया ऑर्डर दर्ज करें (Place Another Order)</span>
              </button>
            </div>
          ) : (
            <>
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
                        ⚡ अभी ऑर्डर कन्फर्म करें - फ्री होम डिलीवरी
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
                    <CheckCircle className="w-3.5 h-3.5 text-gray-400" /> 100% शुद्ध आयुर्वेदिक फॉर्मूला
                  </span>
                </div>

              </form>
            </>
          )}

        </div>

      </div>
    </section>
  );
};
