import { useState, useEffect } from "react";
import api from "../services/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders/user_orders")
      .then(({ data }) => setOrders(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Your Orders</h1>
      <p className="text-muted text-xs md:text-sm mb-4 md:mb-6">Track all your food orders</p>
      {orders.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-bold text-gray-900">No orders yet</h3>
          <p className="text-muted mt-1">
            Start a conversation to place your first order!
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-card rounded-2xl p-4 md:p-5 shadow-sm border border-card-border hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{order.dish}</h3>
                  <p className="text-sm text-muted mt-1">
                    {order.restaurant}
                  </p>
                  <p className="text-sm text-muted mt-1">
                    📍 {order.address}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                      : order.status === "Delivered"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-blue-100 text-blue-700 border border-blue-200"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-muted mt-3">
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
