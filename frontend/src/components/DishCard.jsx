import { Plus } from "lucide-react";

export default function DishCard({ dish, onAddToChat, isHighlighted }) {
  return (
    <div
      className={`bg-card rounded-2xl border overflow-hidden transition-all hover:shadow-md ${
        isHighlighted
          ? "border-primary ring-2 ring-highlight shadow-lg scale-[1.02]"
          : "border-card-border"
      }`}
    >
      <div className="h-36 overflow-hidden relative">
        <img
          src={dish.image_url || "https://placehold.co/300x200/ddd/999?text=No+Image"}
          alt={dish.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2">
          <span
            className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center ${
              dish.type === "veg"
                ? "border-veg"
                : "border-nonveg"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                dish.type === "veg" ? "bg-veg" : "bg-nonveg"
              }`}
            />
          </span>
        </div>
        {dish.spice_level === "high" && (
          <span className="absolute top-2 right-2 text-xs bg-red-500/90 text-white px-1.5 py-0.5 rounded-full font-medium">
            🌶️ Spicy
          </span>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="font-semibold text-gray-900 text-sm truncate">{dish.name}</h4>
            <p className="text-xs text-muted mt-0.5">{dish.restaurant}</p>
          </div>
          <span className="text-sm font-bold text-gray-900 shrink-0">₹{dish.price}</span>
        </div>
        {dish.description && (
          <p className="text-xs text-muted mt-1.5 line-clamp-2">{dish.description}</p>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToChat(dish);
          }}
          className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 bg-primary/10 text-primary text-xs font-semibold rounded-xl hover:bg-primary hover:text-white transition-all"
        >
          <Plus size={14} />
          Add via Chat
        </button>
      </div>
    </div>
  );
}
