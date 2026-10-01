import React from 'react';
import { OrderData } from './OrderPage';
import { X, PackageCheck, Clock, ReceiptText } from 'lucide-react';

interface TrackOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderData[];
  onSelectOrder: (order: OrderData) => void;
}

export const TrackOrdersModal: React.FC<TrackOrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
  onSelectOrder,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="bg-[#5a1427] text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <PackageCheck className="w-6 h-6 text-amber-300" />
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">আপনার অর্ডার সমূহ</h3>
          </div>
          <p className="text-xs text-rose-200 mt-1">
            আপনার সকল পূর্ববর্তী চুড়ির অর্ডারের ডেলিভারি স্ট্যাটাস ও রসিদ
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <Clock className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
              <p className="text-sm font-medium">বর্তমানে আপনার কোনো অর্ডার নেই</p>
              <p className="text-xs text-slate-400">পছন্দের চুড়ি অর্ডার করুন এবং এখানে ট্র্যাকিং দেখুন।</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((ord) => {
                const totalQuantity = ord.items && ord.items.length > 0
                  ? ord.items.reduce((sum, item) => sum + item.quantity, 0)
                  : ord.quantity || 1;

                const designCount = ord.items ? ord.items.length : 1;

                return (
                  <div
                    key={ord.orderId}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-[#5a1427]/40 hover:shadow-md transition-all space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <div>
                        <span className="font-bold text-slate-900 text-sm">{ord.orderId}</span>
                        <span className="text-slate-500 block text-[11px]">{ord.orderDate}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                        {ord.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-slate-700">
                      <div>
                        <span className="text-slate-400 block text-[10px]">গ্রাহক</span>
                        <span className="font-semibold text-slate-900">{ord.customerName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">মোবাইল</span>
                        <span className="font-mono text-slate-900">{ord.phone}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">পরিমাণ</span>
                        <span className="font-medium text-slate-900">
                          {totalQuantity} সেট ({designCount}টি ডিজাইন)
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">মোট বিল</span>
                        <span className="font-mono font-bold text-[#5a1427] text-sm">
                          {ord.total}৳
                        </span>
                      </div>
                    </div>

                    {/* Ordered items with SKU */}
                    {ord.items && ord.items.length > 0 && (
                      <div className="pt-2 border-t border-slate-200/80 space-y-1">
                        {ord.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-[11px] text-slate-600">
                            <span className="truncate pr-2">
                              • {item.name} ({item.size})
                            </span>
                            <span className="font-mono text-[9px] font-bold text-[#551627] bg-amber-50 px-1 py-0.2 rounded border border-amber-200 shrink-0">
                              {item.sku || 'CDB-GLD-01'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          onClose();
                          onSelectOrder(ord);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#5a1427] hover:bg-[#430c1b] text-white rounded-lg font-medium text-xs transition-colors cursor-pointer"
                      >
                        <ReceiptText className="w-3.5 h-3.5" />
                        <span>রসিদ দেখুন</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
