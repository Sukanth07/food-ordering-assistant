import { useState } from "react";

export default function OrderConfirmModal({ orderInfo, onConfirm, onCancel }) {
  const [address, setAddress] = useState("");

  if (!orderInfo) return null;

  const handleConfirm = () => {
    if (!address.trim()) return;
    onConfirm(address.trim());
    setAddress("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl border border-card-border">
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Confirm Your Order
        </h2>
        <p className="text-muted text-sm mb-6">Enter your delivery address</p>
        <div className="bg-page rounded-2xl p-4 mb-4 border border-card-border">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Dish:</span> {orderInfo.dish}
          </p>
          <p className="text-sm text-gray-700 mt-1">
            <span className="font-medium">Restaurant:</span> {orderInfo.restaurant}
          </p>
          {orderInfo.notes && (
            <p className="text-sm text-gray-700 mt-1">
              <span className="font-medium">Special Instructions:</span> {orderInfo.notes}
            </p>
          )}
        </div>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your delivery address..."
          rows={3}
          className="w-full px-4 py-3 bg-input-bg border border-card-border rounded-xl outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none mb-4"
        />
        <div className="flex gap-3">
          <button
            onClick={() => {
              onCancel();
              setAddress("");
            }}
            className="flex-1 py-3 border border-card-border text-gray-600 font-medium rounded-xl hover:bg-page transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!address.trim()}
            className="flex-1 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/30 transition-all disabled:opacity-50"
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
}
