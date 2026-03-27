import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, Leaf, Drumstick, Egg, Flame, Cookie, AlertTriangle, Check } from "lucide-react";
import api from "../services/api";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const ALLERGIES = ["Dairy", "Nuts", "Gluten", "Shellfish", "Soy", "Eggs"];

export default function PreferenceOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [direction, setDirection] = useState("next");
  const [prefs, setPrefs] = useState({
    diet_type: "",
    non_veg_free_days: [],
    spice_level: "",
    flavor_profile: "",
    allergies: [],
    dislikes: "",
  });

  const totalSteps = prefs.diet_type === "veg" ? 4 : 5;

  const getStepIndex = () => {
    if (prefs.diet_type === "veg" && step >= 1) return step + 1;
    return step;
  };

  const canProceed = () => {
    const idx = getStepIndex();
    if (idx === 0) return prefs.diet_type !== "";
    if (idx === 1) return true; // non-veg free days is optional
    if (idx === 2) return prefs.spice_level !== "";
    if (idx === 3) return prefs.flavor_profile !== "";
    if (idx === 4) return true; // allergies optional
    return true;
  };

  const goNext = () => {
    if (step < totalSteps - 1) {
      setDirection("next");
      setStep(step + 1);
    }
  };

  const goBack = () => {
    if (step > 0) {
      setDirection("back");
      setStep(step - 1);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post("/preferences/save", {
        diet_type: prefs.diet_type,
        non_veg_free_days: prefs.non_veg_free_days.join(","),
        spice_level: prefs.spice_level,
        flavor_profile: prefs.flavor_profile,
        allergies: prefs.allergies.join(","),
        dislikes: prefs.dislikes,
      });
      navigate("/");
    } catch {
      setSaving(false);
    }
  };

  const isLastStep = step === totalSteps - 1;

  const slides = [];

  // Slide 0: Diet Type
  slides.push(
    <div key="diet" className="space-y-6">
      <div className="text-center">
        <div className="text-5xl mb-4">🥗</div>
        <h2 className="text-2xl font-bold text-gray-900">What's your diet?</h2>
        <p className="text-muted mt-2">This helps us suggest the perfect dishes for you</p>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 sm:mt-8">
        {[
          { value: "veg", label: "Vegetarian", icon: Leaf, emoji: "🌿", color: "text-veg", bg: "bg-green-50", border: "border-veg", shadow: "shadow-green-200/50" },
          { value: "non-veg", label: "Non-Veg", icon: Drumstick, emoji: "🍗", color: "text-nonveg", bg: "bg-red-50", border: "border-nonveg", shadow: "shadow-red-200/50" },
          { value: "eggetarian", label: "Eggetarian", icon: Egg, emoji: "🥚", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-400", shadow: "shadow-amber-200/50" },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setPrefs({ ...prefs, diet_type: opt.value, non_veg_free_days: opt.value === "veg" ? [] : prefs.non_veg_free_days })}
            className={`relative flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
              prefs.diet_type === opt.value
                ? `${opt.border} ${opt.bg} ${opt.shadow} shadow-lg scale-105`
                : "border-card-border bg-white hover:border-gray-300 hover:shadow-md"
            }`}
          >
            {prefs.diet_type === opt.value && (
              <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center`}>
                <Check size={14} className="text-white" />
              </div>
            )}
            <span className="text-3xl">{opt.emoji}</span>
            <span className={`text-sm font-semibold ${prefs.diet_type === opt.value ? opt.color : "text-gray-700"}`}>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // Slide 1: Non-veg free days (only for non-veg / eggetarian)
  if (prefs.diet_type !== "veg") {
    slides.push(
      <div key="days" className="space-y-6">
        <div className="text-center">
          <div className="text-5xl mb-4">📅</div>
          <h2 className="text-2xl font-bold text-gray-900">Any veg-only days?</h2>
          <p className="text-muted mt-2">Select the days you prefer to eat vegetarian (optional)</p>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-8">
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                  selected
                    ? "border-veg bg-green-50 text-veg shadow-md"
                    : "border-card-border bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  selected ? "border-veg bg-veg" : "border-gray-300"
                }`}>
                  {selected && <Check size={12} className="text-white" />}
                </div>
                <span className="font-medium text-sm">{day}</span>
              </button>
            );
          })}
        </div>
        <p className="text-center text-xs text-muted">Skip this if you eat non-veg every day</p>
      </div>
    );
  }

  // Slide 2: Spice Level
  slides.push(
    <div key="spice" className="space-y-6">
      <div className="text-center">
        <div className="text-5xl mb-4">🌶️</div>
        <h2 className="text-2xl font-bold text-gray-900">How spicy do you like it?</h2>
        <p className="text-muted mt-2">We'll match dishes to your heat tolerance</p>
      </div>
      <div className="space-y-3 mt-8">
        {[
          { value: "mild", label: "Mild", desc: "Keep it gentle", emoji: "😌", flames: 1 },
          { value: "medium", label: "Medium", desc: "A nice kick", emoji: "😊", flames: 2 },
          { value: "spicy", label: "Spicy", desc: "Bring the heat!", emoji: "🥵", flames: 3 },
          { value: "extra-spicy", label: "Extra Spicy", desc: "Fire breather!", emoji: "🔥", flames: 4 },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setPrefs({ ...prefs, spice_level: opt.value })}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 transition-all duration-200 ${
              prefs.spice_level === opt.value
                ? "border-primary bg-highlight shadow-md scale-[1.02]"
                : "border-card-border bg-white hover:border-gray-300 hover:shadow-sm"
            }`}
          >
            <span className="text-2xl">{opt.emoji}</span>
            <div className="flex-1 text-left">
              <div className="font-semibold text-gray-900 text-sm">{opt.label}</div>
              <div className="text-xs text-muted">{opt.desc}</div>
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: opt.flames }).map((_, i) => (
                <Flame key={i} size={16} className={prefs.spice_level === opt.value ? "text-primary fill-primary" : "text-gray-300"} />
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // Slide 3: Flavor Profile
  slides.push(
    <div key="flavor" className="space-y-6">
      <div className="text-center">
        <div className="text-5xl mb-4">👅</div>
        <h2 className="text-2xl font-bold text-gray-900">What flavors do you crave?</h2>
        <p className="text-muted mt-2">Your go-to taste profile</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-8">
        {[
          { value: "sweet", label: "Sweet", emoji: "🍯", desc: "Love the sweetness", color: "amber" },
          { value: "savory", label: "Savory", emoji: "🧂", desc: "Rich & flavorful", color: "blue" },
          { value: "sour", label: "Tangy / Sour", emoji: "🍋", desc: "That citrus zing", color: "yellow" },
          { value: "balanced", label: "Balanced", emoji: "⚖️", desc: "A bit of everything", color: "green" },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setPrefs({ ...prefs, flavor_profile: opt.value })}
            className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300 ${
              prefs.flavor_profile === opt.value
                ? "border-primary bg-highlight shadow-lg scale-105"
                : "border-card-border bg-white hover:border-gray-300 hover:shadow-md"
            }`}
          >
            <span className="text-3xl">{opt.emoji}</span>
            <div className="text-center">
              <div className="font-semibold text-gray-900 text-sm">{opt.label}</div>
              <div className="text-xs text-muted">{opt.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // Slide 4: Allergies & Dislikes
  slides.push(
    <div key="allergies" className="space-y-6">
      <div className="text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900">Any allergies or dislikes?</h2>
        <p className="text-muted mt-2">We'll make sure to warn you about these</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Common allergies</p>
        <div className="flex flex-wrap gap-2">
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
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 text-sm font-medium transition-all duration-200 ${
                  selected
                    ? "border-red-400 bg-red-50 text-red-700 shadow-sm"
                    : "border-card-border bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                {selected && <AlertTriangle size={14} />}
                {item}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Anything else you dislike?</p>
        <textarea
          value={prefs.dislikes}
          onChange={(e) => setPrefs({ ...prefs, dislikes: e.target.value })}
          placeholder="e.g., no onion, no garlic, don't like mushrooms..."
          className="w-full px-4 py-3 bg-input-bg rounded-xl outline-none focus:ring-2 focus:ring-primary/30 text-sm border border-card-border resize-none h-24"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-page relative overflow-hidden">
      <div className="absolute top-10 left-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-lg mx-4 px-2 sm:px-0">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">🍔 Let's personalize your experience</h1>
          <p className="text-muted mt-1 text-sm">Quick setup — takes less than a minute</p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-6">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i <= step ? "bg-primary" : "bg-card-border"
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="bg-surface rounded-3xl shadow-2xl p-5 sm:p-8 border border-card-border min-h-105 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {slides[step]}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-card-border">
            <button
              onClick={goBack}
              disabled={step === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                step === 0
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <ChevronLeft size={18} />
              Back
            </button>

            <span className="text-xs text-muted">{step + 1} / {totalSteps}</span>

            {isLastStep ? (
              <button
                onClick={handleSave}
                disabled={saving || !canProceed()}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-hover shadow-lg shadow-primary/30 transition-all disabled:opacity-50"
              >
                {saving ? "Saving..." : "Let's Go!"}
                <Check size={18} />
              </button>
            ) : (
              <button
                onClick={goNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-hover shadow-lg shadow-primary/30 transition-all disabled:opacity-50"
              >
                Next
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
