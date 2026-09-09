import React, { useState } from 'react';
import { X, Search, Loader2, PackageCheck, AlertCircle, Calendar, User, Phone, Mail, FileText } from 'lucide-react';
import { OrderDetail } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
}

export const OrderTrackModal: React.FC<Props> = ({ isOpen, onClose, initialOrderId = '' }) => {
  const [orderId, setOrderId] = useState(initialOrderId);
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<OrderDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanId = orderId.trim();
    if (!cleanId) return;

    setLoading(true);
    setError(null);
    setOrderData(null);

    try {
      const res = await fetch(`/api/order/${encodeURIComponent(cleanId)}`);
      const data = await res.json();

      if (res.ok) {
        setOrderData(data);
      } else {
        setError(data.message || 'ऑर्डर नहीं मिला। कृपया अपनी ऑर्डर आईडी जांचें।');
      }
    } catch (err) {
      console.error(err);
      setError('सर्वर से कनेक्ट करने में विफल।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2 text-xl">
            📦
          </div>
          <h3 className="text-xl font-bold text-gray-900">ऑर्डर स्थिति ट्रैक करें</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            (Track your Gouthealth Order Status)
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="mb-6 flex gap-2">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="ऑर्डर आईडी दर्ज करें (उदा. GOUT172588...)"
            className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
          />
          <button
            type="submit"
            disabled={loading || !orderId.trim()}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>ट्रैक करें</span>
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Order Details Found */}
        {orderData && (
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/90 text-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <span className="text-xs font-semibold text-gray-500">स्थिति (Status):</span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${
                  orderData.status === 'delivered'
                    ? 'bg-emerald-100 text-emerald-800'
                    : orderData.status === 'confirmed'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {orderData.status === 'pending'
                  ? 'लंबित (Pending Call Confirmation)'
                  : orderData.status === 'confirmed'
                  ? 'कन्फर्म (Dispatched / Confirmed)'
                  : 'डिलीवर्ड (Delivered)'}
              </span>
            </div>

            <div className="space-y-2 text-xs text-gray-700">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-semibold text-gray-900">ऑर्डर आईडी:</span>
                <span className="font-mono font-bold text-emerald-800">{orderData.orderId}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-semibold text-gray-900">ग्राहक का नाम:</span>
                <span>{orderData.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-semibold text-gray-900">फोन नंबर:</span>
                <span>{orderData.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-semibold text-gray-900">ऑर्डर दिनांक:</span>
                <span>{orderData.dateOrdered || new Date(orderData.timestamp).toLocaleDateString('en-IN')}</span>
              </div>
              {orderData.notes && (
                <div className="pt-2 border-t border-gray-200 text-gray-500">
                  <span className="font-semibold text-gray-700 block">नोट्स:</span>
                  <span>{orderData.notes}</span>
                </div>
              )}
            </div>

            {orderData.source && (
              <div className="text-[10px] text-gray-400 text-right pt-1">
                स्रोत: {orderData.source === 'google_sheets' ? 'Google Sheets' : 'Local Database'}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
