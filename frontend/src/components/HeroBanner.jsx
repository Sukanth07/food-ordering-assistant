const cuisines = [
  { label: "North Indian", emoji: "🍛", value: "North Indian" },
  { label: "South Indian", emoji: "🥘", value: "South Indian" },
  { label: "Chinese", emoji: "🥡", value: "Chinese" },
  { label: "Burgers", emoji: "🍔", value: "Burgers" },
  { label: "Pizza", emoji: "🍕", value: "Pizza" },
  { label: "Biryani", emoji: "🍚", value: "Hyderabadi" },
  { label: "Street Food", emoji: "🥙", value: "Street Food" },
  { label: "Desserts", emoji: "🍰", value: "Desserts" },
  { label: "Healthy", emoji: "🥗", value: "Healthy" },
  { label: "Mughlai", emoji: "🍢", value: "Mughlai" },
];

export default function HeroBanner({ activeCuisine, onCuisineSelect }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
      {cuisines.map((c) => (
        <button
          key={c.value}
          onClick={() => onCuisineSelect(activeCuisine === c.value ? null : c.value)}
          className={`flex flex-col items-center gap-1.5 min-w-[72px] py-3 px-2 rounded-2xl transition-all shrink-0 ${
            activeCuisine === c.value
              ? "bg-primary/10 border-2 border-primary scale-105"
              : "bg-card border-2 border-transparent hover:bg-card-border/30"
          }`}
        >
          <span className="text-2xl">{c.emoji}</span>
          <span className="text-[11px] font-medium text-gray-700 whitespace-nowrap">
            {c.label}
          </span>
        </button>
      ))}
    </div>
  );
}
