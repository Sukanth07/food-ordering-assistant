import { Star, Clock, Bike } from "lucide-react";

export default function RestaurantCard({ restaurant, onSelect, isActive }) {
  return (
    <div
      onClick={() => onSelect(restaurant.id)}
      className={`bg-card rounded-2xl border overflow-hidden cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${
        isActive
          ? "border-primary shadow-md ring-2 ring-primary/20"
          : "border-card-border"
      }`}
    >
      <div className="h-32 overflow-hidden relative">
        <img
          src={restaurant.image_url}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        {restaurant.is_veg_only && (
          <span className="absolute top-2 left-2 bg-veg text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            PURE VEG
          </span>
        )}
        {restaurant.delivery_fee === 0 && (
          <span className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            FREE DELIVERY
          </span>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{restaurant.name}</h3>
            <p className="text-xs text-muted mt-0.5">{restaurant.cuisine_type}</p>
          </div>
          <div className="flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-md">
            <Star size={10} fill="white" />
            {restaurant.rating}
          </div>
        </div>
        <div className="flex items-center gap-3 mt-2 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Clock size={12} /> {restaurant.delivery_time_min} min
          </span>
          <span className="flex items-center gap-1">
            <Bike size={12} /> {restaurant.delivery_fee > 0 ? `₹${restaurant.delivery_fee}` : "Free"}
          </span>
          {restaurant.item_count && (
            <span>{restaurant.item_count} items</span>
          )}
        </div>
      </div>
    </div>
  );
}
