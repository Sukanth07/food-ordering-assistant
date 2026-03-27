import { useState, useEffect } from "react";
import { Leaf, Drumstick, Egg, Flame, Check, AlertTriangle, Save } from "lucide-react";
import api from "../services/api";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const ALLERGIES = ["Dairy", "Nuts", "Gluten", "Shellfish", "Soy", "Eggs"];

export default function Preferences() {
  const [prefs, setPrefs] = useState({
    diet_type: "veg",
    non_veg_free_days: [],
    spice_level: "medium",
    flavor_profile: "savory",
    allergies: [],
    dislikes: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get("/preferences/me").then(({ data }) => {
      setPrefs({
        diet_type: data.diet_type,
        non_veg_free_days: data.non_veg_free_days ? data.non_veg_free_days.split(",").filter(Boolean) : [],
        spice_level: data.spice_level,
        flavor_profile: data.flavor_profile,
        allergies: data.allergies ? data.allergies.split(",").filter(Boolean) : [],
        dislikes: data.dislikes || "",
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await api.post("/preferences/save", {
        diet_type: prefs.diet_type,
        non_veg_free_days: prefs.non_veg_free_days.join(","),
        spice_level: prefs.spice_level,
        flavor_profile: prefs.flavor_profile,
        allergies: prefs.allergies.join(","),
        dislikes: prefs.dislikes,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // handle error
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-muted">Loading preferences...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-page">
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Food Preferences</h1>
          <p className="text-muted mt-1 text-sm">Update your preferences anytime — the AI assistant will adapt to your choices</p>
        </div>

        <div className="space-y-8">
          {/* Diet Type */}
          <section className="bg-surface rounded-2xl p-6 border border-card-border shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">🥗 Diet Type</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "veg", label: "Vegetarian", emoji: "🌿", color: "text-veg", border: "border-veg", bg: "bg-green-50" },
                { value: "non-veg", label: "Non-Veg", emoji: "🍗", color: "text-nonveg", border: "border-nonveg", bg: "bg-red-50" },
                { value: "eggetarian", label: "Eggetarian", emoji: "🥚", color: "text-amber-600", border: "border-amber-400", bg: "bg-amber-50" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPrefs({ ...prefs, diet_type: opt.value, non_veg_free_days: opt.value === "veg" ? [] : prefs.non_veg_free_days })}
                  className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                    prefs.diet_type === opt.value
                      ? `${opt.border} ${opt.bg} shadow-md`
                      : "border-card-border bg-white hover:border-gray-300"
                  }`}
                >
                  {prefs.diet_type === opt.value && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className={`text-xs font-semibold ${prefs.diet_type === opt.value ? opt.color : "text-gray-600"}`}>{opt.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Non-veg free days */}
          {prefs.diet_type !== "veg" && (
            <section className="bg-surface rounded-2xl p-6 border border-card-border shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">📅 Veg-only Days</h2>
              <p className="text-xs text-muted mb-4">Days you prefer to eat vegetarian</p>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((day) => {
                  const selected = prefs.non_veg_free_days.includes(day.toLowerCase());
                  return (
                    <button
                      key={day}
                      onClick={() => {
                        const d = day.toLowerCase();
                        setPrefs({
                          ...prefs,
                          non_veg_free_days: selected
                            ? prefs.non_veg_free_days.filter((x) => x !== d)
                            : [...prefs.non_veg_free_days, d],
                        });
                      }}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        selected
                          ? "border-veg bg-green-50 text-veg"
                          : "border-card-border bg-white text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* Spice Level */}
          <section className="bg-surface rounded-2xl p-6 border border-card-border shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">🌶️ Spice Level</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { value: "mild", label: "Mild", emoji: "😌", flames: 1 },
                { value: "medium", label: "Medium", emoji: "😊", flames: 2 },
                { value: "spicy", label: "Spicy", emoji: "🥵", flames: 3 },
                { value: "extra-spicy", label: "Extra Spicy", emoji: "🔥", flames: 4 },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPrefs({ ...prefs, spice_level: opt.value })}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                    prefs.spice_level === opt.value
                      ? "border-primary bg-highlight shadow-md"
                      : "border-card-border bg-white hover:border-gray-300"
                  }`}
                >
                  <span className="text-xl">{opt.emoji}</span>
                  <span className="text-xs font-semibold text-gray-700">{opt.label}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: opt.flames }).map((_, i) => (
                      <Flame key={i} size={12} className={prefs.spice_level === opt.value ? "text-primary fill-primary" : "text-gray-300"} />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Flavor Profile */}
          <section className="bg-surface rounded-2xl p-6 border border-card-border shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">👅 Flavor Profile</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { value: "sweet", label: "Sweet", emoji: "🍯" },
                { value: "savory", label: "Savory", emoji: "🧂" },
                { value: "sour", label: "Tangy", emoji: "🍋" },
                { value: "balanced", label: "Balanced", emoji: "⚖️" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPrefs({ ...prefs, flavor_profile: opt.value })}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                    prefs.flavor_profile === opt.value
                      ? "border-primary bg-highlight shadow-md"
                      : "border-card-border bg-white hover:border-gray-300"
                  }`}
                >
                  <span className="text-xl">{opt.emoji}</span>
                  <span className="text-xs font-semibold text-gray-700">{opt.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Allergies & Dislikes */}
          <section className="bg-surface rounded-2xl p-6 border border-card-border shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">⚠️ Allergies & Dislikes</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {ALLERGIES.map((item) => {
                const selected = prefs.allergies.includes(item.toLowerCase());
                return (
                  <button
                    key={item}
                    onClick={() => {
                      const a = item.toLowerCase();
                      setPrefs({
                        ...prefs,
                        allergies: selected
                          ? prefs.allergies.filter((x) => x !== a)
                          : [...prefs.allergies, a],
                      });
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 text-xs font-medium transition-all ${
                      selected
                        ? "border-red-400 bg-red-50 text-red-700"
                        : "border-card-border bg-white text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {selected && <AlertTriangle size={12} />}
                    {item}
                  </button>
                );
              })}
            </div>
            <textarea
              value={prefs.dislikes}
              onChange={(e) => setPrefs({ ...prefs, dislikes: e.target.value })}
              placeholder="e.g., no onion, no garlic, don't like mushrooms..."
              className="w-full px-4 py-3 bg-input-bg rounded-xl outline-none focus:ring-2 focus:ring-primary/30 text-sm border border-card-border resize-none h-20"
            />
          </section>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover shadow-lg shadow-primary/30 transition-all disabled:opacity-50"
          >
            {saved ? (
              <>
                <Check size={20} />
                Saved!
              </>
            ) : saving ? (
              "Saving..."
            ) : (
              <>
                <Save size={20} />
                Save Preferences
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
