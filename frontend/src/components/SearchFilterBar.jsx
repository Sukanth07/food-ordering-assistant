import { Search, X } from "lucide-react";

const typeFilters = [
  { label: "Veg", value: "veg", emoji: "🟢" },
  { label: "Non-Veg", value: "non-veg", emoji: "🔴" },
];

const spiceFilters = [
  { label: "Mild", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "Spicy", value: "high" },
];

export default function SearchFilterBar({ filters, onFilterChange, onSearch }) {
  const toggleFilter = (key, value) => {
    onFilterChange(key, filters[key] === value ? null : value);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={filters.search || ""}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search for dishes, restaurants..."
          className="w-full pl-11 pr-10 py-3 bg-card border border-card-border rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
        {filters.search && (
          <button
            onClick={() => onSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-gray-700"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {typeFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => toggleFilter("type", f.value)}
            className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
              filters.type === f.value
                ? "bg-primary text-white border-primary shadow-sm"
                : "bg-card text-gray-600 border-card-border hover:border-primary/40"
            }`}
          >
            {f.emoji} {f.label}
          </button>
        ))}

        <div className="w-px h-5 bg-card-border mx-1" />

        {spiceFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => toggleFilter("spice_level", f.value)}
            className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
              filters.spice_level === f.value
                ? "bg-primary text-white border-primary shadow-sm"
                : "bg-card text-gray-600 border-card-border hover:border-primary/40"
            }`}
          >
            {f.label}
          </button>
        ))}

        {(filters.type || filters.spice_level || filters.cuisine) && (
          <button
            onClick={() => {
              onFilterChange("type", null);
              onFilterChange("spice_level", null);
              onFilterChange("cuisine", null);
            }}
            className="px-3 py-2 text-xs text-primary font-medium hover:underline"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
