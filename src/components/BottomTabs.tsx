import { Home, Map, TrainFront, Ticket, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/routes", icon: Map, label: "Routes" },
  { path: "/coach", icon: TrainFront, label: "Coach" },
  { path: "/ticketing", icon: Ticket, label: "Tickets" },
  { path: "/profile", icon: User, label: "Profile" },
];

const BottomTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (["/chatbot", "/route-details", "/crowd-detection"].includes(location.pathname)) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border/50 safe-bottom">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`relative flex flex-col items-center justify-center gap-0.5 w-14 h-12 rounded-xl transition-all duration-200 ${
                active
                  ? "text-primary"
                  : "text-muted-foreground active:text-foreground"
              }`}
            >
              <tab.icon className={`w-[18px] h-[18px] ${active ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
              <span className="text-[9px] font-medium leading-none">{tab.label}</span>
              {active && (
                <div className="absolute -top-0.5 w-6 h-[2px] bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomTabs;
