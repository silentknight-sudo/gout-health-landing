import React, { useState, useEffect } from 'react';
import { X, RefreshCw, FileSpreadsheet, Database, CheckCircle2, Clock, AlertTriangle, ExternalLink } from 'lucide-react';
import { AdminStats, OrderDetail } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminOrdersModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [token, setToken] = useState('secret_admin_token');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders?token=${encodeURIComponent(token)}`);
      const json = await res.json();
      if (res.ok) {
        setData(json);
      } else {
        setError(json.message || 'अनाधिकृत या सर्वर त्रुटि।');
      }
    } catch (err) {
      setError('डेटा लोड करने में विफल।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                Google Sheets बैकएंड और ऑर्डर डेटाबेस
              </h3>
              <a
                href="https://docs.google.com/spreadsheets/d/1QuUEAhHn8qd5jm-1bbb5Mf4KdqcwRIT43trV_-cBFHY/edit"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-emerald-700 hover:text-emerald-900 font-medium flex items-center gap-1 hover:underline mt-0.5"
              >
                <span>Google Sheet खोलें (ID: 1QuUEAh...cBFHY)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          
          {/* Status Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-xs">
              <span className="text-gray-500 block mb-0.5">कुल ऑर्डर (Total Orders)</span>
              <span className="text-xl font-bold text-gray-900">
                {data ? data.totalOrders : '...'}
              </span>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 text-xs">
              <span className="text-emerald-800 block mb-0.5">सक्रिय स्रोत (Active Source)</span>
              <span className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                {data?.dataSource === 'google_sheets' ? (
                  <>
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Google Sheets API v4</span>
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 text-amber-600" />
                    <span>लोकल इन-मेमोरी बैकअप</span>
                  </>
                )}
              </span>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 border border-blue-200 text-xs">
              <span className="text-blue-800 block mb-0.5">शीट्स कॉलम संरचना (A-H)</span>
              <span className="text-[11px] font-mono font-medium text-blue-900 block truncate">
                Timestamp, Name, Phone, Email, Status, ID, Date, Notes
              </span>
            </div>
          </div>

          {/* Token controls */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Admin Token (e.g. secret_admin_token)"
              className="text-xs px-3 py-2 border border-gray-300 rounded-lg flex-1 font-mono"
            />
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="px-3 py-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>रिफ्रेश</span>
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
              {error}
            </div>
          )}

          {/* Orders Table */}
          {data && data.orders && data.orders.length > 0 ? (
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-gray-100 text-gray-700 border-b border-gray-200 font-bold">
                  <tr>
                    <th className="p-2.5">ऑर्डर आईडी</th>
                    <th className="p-2.5">नाम</th>
                    <th className="p-2.5">फोन</th>
                    <th className="p-2.5">ईमेल</th>
                    <th className="p-2.5">स्थिति</th>
                    <th className="p-2.5">दिनांक</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.orders.map((ord, i) => (
                    <tr key={i} className="hover:bg-gray-50/80">
                      <td className="p-2.5 font-mono font-semibold text-emerald-800">{ord.orderId}</td>
                      <td className="p-2.5 text-gray-900 font-medium">{ord.name}</td>
                      <td className="p-2.5 text-gray-600">{ord.phone}</td>
                      <td className="p-2.5 text-gray-600">{ord.email}</td>
                      <td className="p-2.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ord.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.status === 'confirmed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-2.5 text-gray-500">{ord.dateOrdered || ord.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center bg-gray-50 rounded-xl border border-gray-200 text-gray-500 text-xs">
              {loading ? 'डेटा लोड हो रहा है...' : 'अभी कोई ऑर्डर दर्ज नहीं है। फॉर्म भरकर पहला ऑर्डर दर्ज करें!'}
            </div>
          )}

          {/* Quick Setup Note */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Google Sheets सेटअप सूचना:</span>
              <span>
                जब <code>GOOGLE_SHEETS_KEY</code> सेट नहीं होता, तो बैकएंड स्वतः स्थानीय मेमोरी में ऑर्डर सुरक्षित रखता है ताकि कोई ऑर्डर छूटे नहीं। पूर्ण Google Sheets सिंक के लिए <code>SETUP_GOOGLE_SHEETS.md</code> का पालन करें।
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
