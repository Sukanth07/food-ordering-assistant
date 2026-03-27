import { useState, useEffect, useCallback, useMemo } from "react";
import api from "../services/api";
import SearchFilterBar from "../components/SearchFilterBar";
import HeroBanner from "../components/HeroBanner";
import RestaurantCard from "../components/RestaurantCard";
import DishCard from "../components/DishCard";
import ChatPanel from "../components/ChatPanel";
import OrderConfirmModal from "../components/OrderConfirmModal";

export default function Dashboard() {
  // Browse state
  const [menuItems, setMenuItems] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    type: null,
    spice_level: null,
    cuisine: null,
    restaurant_id: null,
  });
  const [browseLoading, setBrowseLoading] = useState(true);

  // Chat state
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
  const [highlightedItemIds, setHighlightedItemIds] = useState(new Set());

  // Order state
  const [orderModal, setOrderModal] = useState(null);

  // Fetch browse data
  useEffect(() => {
    Promise.all([
      api.get("/menu/items"),
      api.get("/menu/restaurants"),
    ])
      .then(([itemsRes, restRes]) => {
        setMenuItems(itemsRes.data);
        setRestaurants(restRes.data);
      })
      .catch(console.error)
      .finally(() => setBrowseLoading(false));
  }, []);

  // Create chat session
  const createChat = useCallback(async () => {
    try {
      const { data } = await api.post("/chat/create");
      setChatId(data.id);
      return data.id;
    } catch (err) {
      console.error("Failed to create chat:", err);
    }
  }, []);

  useEffect(() => {
    createChat();
  }, [createChat]);

  // Filter logic (client-side)
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (filters.type && item.type !== filters.type) return false;
      if (filters.spice_level && item.spice_level !== filters.spice_level) return false;
      if (filters.restaurant_id && item.restaurant_id !== filters.restaurant_id) return false;
      if (filters.cuisine) {
        const rest = restaurants.find((r) => r.id === item.restaurant_id);
        if (!rest || !rest.cuisine_type.toLowerCase().includes(filters.cuisine.toLowerCase()))
          return false;
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !item.name.toLowerCase().includes(q) &&
          !item.restaurant.toLowerCase().includes(q) &&
          !(item.description || "").toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [menuItems, restaurants, filters]);

  const filteredRestaurants = useMemo(() => {
    if (!filters.cuisine && !filters.restaurant_id) return restaurants;
    return restaurants.filter((r) => {
      if (filters.cuisine && !r.cuisine_type.toLowerCase().includes(filters.cuisine.toLowerCase()))
        return false;
      if (filters.restaurant_id && r.id !== filters.restaurant_id) return false;
      return true;
    });
  }, [restaurants, filters]);

  // Detect mentioned dishes from AI response
  const extractMentionedItems = useCallback(
    (text) => {
      const ids = new Set();
      for (const item of menuItems) {
        if (text.toLowerCase().includes(item.name.toLowerCase())) {
          ids.add(item.id);
        }
      }
      return ids;
    },
    [menuItems]
  );

  // Send chat message
  const sendMessage = useCallback(
    async (content) => {
      if (!chatId) return;
      if (!chatOpen) setChatOpen(true);

      setMessages((prev) => [...prev, { role: "user", content }]);
      setChatLoading(true);
      try {
        const { data } = await api.post(`/chat/message?chat_id=${chatId}`, {
          role: "user",
          content,
        });
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.content },
        ]);
        const mentioned = extractMentionedItems(data.content);
        setHighlightedItemIds(mentioned);
      } catch (err) {
        console.error("Failed to send message:", err);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, something went wrong. Please try again." },
        ]);
      } finally {
        setChatLoading(false);
      }
    },
    [chatId, chatOpen, extractMentionedItems]
  );

  // Add dish to chat
  const handleAddToChat = useCallback(
    (dish) => {
      const msg = `I'd like to order ${dish.name} from ${dish.restaurant}`;
      sendMessage(msg);
    },
    [sendMessage]
  );

  // Order flow
  const handleOrderConfirm = useCallback((dish, restaurant, notes) => {
    setOrderModal({ dish, restaurant, notes: notes || "" });
  }, []);

  const handlePlaceOrder = useCallback(
    async (address) => {
      try {
        await api.post("/orders/create", {
          dish: orderModal.dish,
          restaurant: orderModal.restaurant,
          address,
        });
        alert("Order placed successfully!");
        setOrderModal(null);
        setMessages([]);
        setHighlightedItemIds(new Set());
        await createChat();
      } catch (err) {
        console.error("Failed to place order:", err);
        alert("Failed to place order. Please try again.");
      }
    },
    [orderModal, createChat]
  );

  // Filter handlers
  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSearch = useCallback((value) => {
    setFilters((prev) => ({ ...prev, search: value }));
  }, []);

  const handleCuisineSelect = useCallback((cuisine) => {
    setFilters((prev) => ({ ...prev, cuisine, restaurant_id: null }));
  }, []);

  const handleRestaurantSelect = useCallback((id) => {
    setFilters((prev) => ({
      ...prev,
      restaurant_id: prev.restaurant_id === id ? null : id,
    }));
  }, []);

  return (
    <div className="flex-1 flex h-screen overflow-hidden">
      {/* Main Browse Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 py-4 md:p-6 space-y-4 md:space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              What would you like to eat?
            </h1>
            <p className="text-muted text-xs md:text-sm mt-1">
              Browse restaurants & dishes, or chat with AI for recommendations
            </p>
          </div>

          {/* Search & Filters */}
          <SearchFilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
          />

          {/* Cuisine Quick Links */}
          <HeroBanner
            activeCuisine={filters.cuisine}
            onCuisineSelect={handleCuisineSelect}
          />

          {/* Restaurants */}
          {!filters.restaurant_id && (
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                Restaurants near you
              </h2>
              {browseLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-card rounded-2xl border border-card-border h-52 animate-pulse" />
                  ))}
                </div>
              ) : filteredRestaurants.length === 0 ? (
                <p className="text-muted text-sm py-8 text-center">No restaurants found for this filter.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {filteredRestaurants.map((r) => (
                    <RestaurantCard
                      key={r.id}
                      restaurant={r}
                      onSelect={handleRestaurantSelect}
                      isActive={filters.restaurant_id === r.id}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Selected restaurant header */}
          {filters.restaurant_id && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleFilterChange("restaurant_id", null)}
                className="text-primary text-sm font-medium hover:underline"
              >
                ← All Restaurants
              </button>
              <span className="text-muted text-sm">
                / {restaurants.find((r) => r.id === filters.restaurant_id)?.name}
              </span>
            </div>
          )}

          {/* Dishes */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              {filters.restaurant_id
                ? "Menu"
                : filters.search
                ? `Results for "${filters.search}"`
                : "All Dishes"}
            </h2>
            {browseLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl border border-card-border h-64 animate-pulse" />
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-3">🍽️</div>
                <p className="text-muted">No dishes match your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 pb-6">
                {filteredItems.map((dish) => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    onAddToChat={handleAddToChat}
                    isHighlighted={highlightedItemIds.has(dish.id)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* AI Chat Panel */}
      <ChatPanel
        isOpen={chatOpen}
        onToggle={() => setChatOpen(!chatOpen)}
        messages={messages}
        onSend={sendMessage}
        loading={chatLoading}
        onOrderConfirm={handleOrderConfirm}
      />

      {/* Order Confirmation Modal */}
      <OrderConfirmModal
        orderInfo={orderModal}
        onConfirm={handlePlaceOrder}
        onCancel={() => setOrderModal(null)}
      />
    </div>
  );
}
