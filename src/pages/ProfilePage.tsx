import { User, MapPin, Clock, Settings, ChevronRight, LogOut, Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "../components/ThemeProvider";

const ProfilePage = () => {
  const { theme, setTheme } = useTheme();

  const stats = [
    { label: "Trips This Month", value: "42" },
    { label: "Time Saved", value: "3.5h" },
    { label: "Favorite Route", value: "Virar to Oshiwara" },
  ];

  const themes = [
    { id: "light" as const, icon: Sun, label: "Light" },
    { id: "dark" as const, icon: Moon, label: "Dark" },
    { id: "system" as const, icon: Monitor, label: "System" },
  ];

  return (
    <div className="min-h-screen pb-24 px-4 pt-12">
      <div className="flex flex-col items-center mb-8 animate-float-up">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-3">
          <User className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-lg font-bold text-foreground">Mumbai Commuter</h1>
        <p className="text-sm text-muted-foreground">Western Line Regular</p>
      </div>

      <div className="glass-card p-4 mb-5 animate-float-up" style={{ animationDelay: "60ms" }}>
        <h3 className="text-sm font-semibold text-foreground mb-3">Appearance</h3>
        <div className="flex gap-2">
          {themes.map((themeOption) => (
            <button
              key={themeOption.id}
              onClick={() => setTheme(themeOption.id)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all active:scale-95 ${
                theme === themeOption.id ? "bg-primary/15 border border-primary/30" : "bg-secondary/50 border border-transparent"
              }`}
            >
              <themeOption.icon className={`w-5 h-5 ${theme === themeOption.id ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-xs font-medium ${theme === themeOption.id ? "text-primary" : "text-muted-foreground"}`}>
                {themeOption.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {stats.map((stat, index) => (
          <div key={stat.label} className="glass-card p-3 text-center animate-float-up" style={{ animationDelay: `${(index + 2) * 60}ms` }}>
            <p className="text-lg font-bold text-primary">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="glass-card overflow-hidden animate-float-up" style={{ animationDelay: "300ms" }}>
        {[
          { icon: MapPin, label: "Saved Routes" },
          { icon: Clock, label: "Travel History" },
          { icon: Settings, label: "Preferences" },
        ].map((item, index) => (
          <button key={item.label} className={`w-full flex items-center gap-3 px-4 py-3.5 active:bg-secondary/50 ${index > 0 ? "border-t border-border/30" : ""}`}>
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
