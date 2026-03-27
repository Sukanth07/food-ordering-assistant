import { NavLink, useNavigate } from "react-router-dom";
import { Home, ListOrdered, LogOut, SlidersHorizontal } from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/orders", label: "Orders", icon: ListOrdered },
  { to: "/preferences", label: "Preferences", icon: SlidersHorizontal },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 min-h-screen bg-sidebar flex-col shrink-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white">🍔 FoodAI</h1>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "text-gray-400 hover:bg-sidebar-hover hover:text-white"
                }`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-sidebar-hover hover:text-red-400 transition-all duration-200"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-sidebar border-t border-sidebar-hover z-50 safe-bottom">
        <div className="flex items-center justify-around px-2 py-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-[10px] font-medium transition-all ${
                  isActive
                    ? "text-primary"
                    : "text-gray-400"
                }`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-[10px] font-medium text-gray-400 active:text-red-400 transition-all"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </nav>
    </>
  );
}
