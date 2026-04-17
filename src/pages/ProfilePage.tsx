import { User, MapPin, Clock, Settings, ChevronRight, LogOut, Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const ProfilePage = () => {
  const { theme, setTheme } = useTheme();

  const stats = [
    { label: "Trips This Month", value: "42" },
    { label: "Time Saved", value: "3.5h" },
    { label: "Favorite Route", value: "Virar→Oshiwara" },
  ];

  const themes = [
    { id: "light" as const, icon: Sun, label: "Light" },
    { id: "dark" as const, icon: Moon, label: "Dark" },
    { id: "system" as const, icon: Monitor, label: "System" },
  ];

  return (
    <div className="min-h-screen pb-24 px-4 pt-12">
      {/* Avatar */}
      <div className="flex flex-col items-center mb-8 animate-float-up">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-3">
          <User className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-lg font-bold text-foreground">Mumbai Commuter</h1>
        <p className="text-sm text-muted-foreground">Western Line Regular</p>
      </div>

      {/* Theme toggle */}
      <div className="glass-card p-4 mb-5 animate-float-up" style={{ animationDelay: "60ms" }}>
        <h3 className="text-sm font-semibold text-foreground mb-3">Appearance</h3>
        <div className="flex gap-2">
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all active:scale-95 ${
                theme === t.id ? "bg-primary/15 border border-primary/30" : "bg-secondary/50 border border-transparent"
              }`}
            >
              <t.icon className={`w-5 h-5 ${theme === t.id ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-xs font-medium ${theme === t.id ? "text-primary" : "text-muted-foreground"}`}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {stats.map((s, i) => (
          <div key={s.label} className="glass-card p-3 text-center animate-float-up" style={{ animationDelay: `${(i + 2) * 60}ms` }}>
            <p className="text-lg font-bold text-primary">{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div className="glass-card overflow-hidden animate-float-up" style={{ animationDelay: "300ms" }}>
        {[
          { icon: MapPin, label: "Saved Routes" },
          { icon: Clock, label: "Travel History" },
          { icon: Settings, label: "Preferences" },
        ].map((item, i) => (
          <button key={item.label} className={`w-full flex items-center gap-3 px-4 py-3.5 active:bg-secondary/50 ${
            i > 0 ? "border-t border-border/30" : ""
          }`}>
            <item.icon className="w-5 h-5 text-muted-foreground" />
            <span className="flex-1 text-sm text-foreground text-left">{item.label}</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
      </div>

      <button className="w-full mt-6 flex items-center justify-center gap-2 text-destructive text-sm py-3 active:opacity-70">
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </div>
  );
};

export default ProfilePage;
