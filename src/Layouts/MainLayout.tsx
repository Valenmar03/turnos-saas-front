import { useState } from "react";
import {
  CalendarDays,
  Scissors,
  Users,
  UserCircle2,
  Building2,
  Settings,
  Menu,
  X
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { id: "calendar", label: "Agenda", path: "/calendar", icon: CalendarDays },
  { id: "services", label: "Servicios", path: "/services", icon: Scissors },
  { id: "professionals", label: "Profesionales", path: "/professionals", icon: Users },
  { id: "clients", label: "Clientes", path: "/clients", icon: UserCircle2 },
  { id: "business", label: "Negocios", path: "/business", icon: Building2 },
  { id: "settings", label: "Configuración", path: "/settings", icon: Settings }
];

export function MainLayout() {
  const [active, setActive] = useState("calendar");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <aside className="hidden md:flex md:flex-col w-64 border-r border-slate-800 bg-slate-900/60 backdrop-blur">
        <div className="h-16 flex items-center px-4 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-violet-500 flex items-center justify-center font-bold text-sm">
            T
          </div>
          <div className="ml-3">
            <p className="text-sm font-semibold">Turnos SaaS</p>
            <p className="text-xs text-slate-400">Panel administrador</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                  ${isActive ? "bg-violet-600 text-white" : "text-slate-300 hover:bg-slate-800"}`
                }
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>


        <div className="border-t border-slate-800 p-3 flex items-center">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">
            VM
          </div>
          <div className="ml-2">
            <p className="text-xs font-medium">Valentín</p>
            <p className="text-[11px] text-slate-400">Admin</p>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="relative z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
              <div className="flex items-center">
                <div className="w-9 h-9 rounded-xl bg-violet-500 flex items-center justify-center font-bold text-sm">
                  T
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold">Turnos SaaS</p>
                  <p className="text-xs text-slate-400">Panel admin</p>
                </div>
              </div>
              <button
                className="p-2 rounded-lg hover:bg-slate-800"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-2 py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id;

                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition 
                      ${isActive
                        ? "bg-violet-600 text-white shadow-sm"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur flex items-center justify-between px-4">
          <div className="flex items-center gap-2 md:hidden">
            <button
              className="p-2 rounded-lg hover:bg-slate-800"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-sm font-semibold">Turnos SaaS</span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-sm text-slate-300">
            <span className="text-xs uppercase tracking-wide text-slate-400">
              Negocio actual
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs">
              Estética Demo
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-slate-400">
              Hoy es{" "}
              {new Date().toLocaleDateString("es-AR", {
                weekday: "short",
                day: "2-digit",
                month: "short"
              })}
            </span>
            <button className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs">
              VM
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-950">
          <div className="max-w-6xl mx-auto p-4 md:p-6">
            <Outlet/>
          </div>
        </main>
      </div>
    </div>
  );
}
