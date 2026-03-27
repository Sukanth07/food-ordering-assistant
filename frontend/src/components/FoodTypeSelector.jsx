export default function FoodTypeSelector({ onSelect }) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          What are you in the mood for?
        </h2>
        <p className="text-muted mb-10">Choose your preference to get started</p>
        <div className="flex gap-6 justify-center">
          <button
            onClick={() => onSelect("veg")}
            className="group w-56 p-8 bg-card rounded-3xl shadow-md border border-card-border hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
              🥗
            </div>
            <h3 className="text-xl font-bold text-gray-900">Pure Veg</h3>
            <p className="text-sm text-muted mt-1">Fresh & healthy options</p>
          </button>
          <button
            onClick={() => onSelect("non-veg")}
            className="group w-56 p-8 bg-card rounded-3xl shadow-md border border-card-border hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
              🍗
            </div>
            <h3 className="text-xl font-bold text-gray-900">Non-Veg</h3>
            <p className="text-sm text-muted mt-1">Meaty & delicious</p>
          </button>
        </div>
      </div>
    </div>
  );
}
