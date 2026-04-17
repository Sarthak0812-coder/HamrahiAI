import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, TrainFront, Ticket, Eye } from "lucide-react";
import type { Route } from "@/data/mockData";

const RouteDetails = () => {
  const navigate = useNavigate();
  const { state: route } = useLocation() as { state: Route | null };

  if (!route) {
    navigate("/routes");
    return null;
  }

  return (
    <div className="min-h-screen pb-8 px-4 pt-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground mb-6 active:opacity-70">
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm">Back</span>
      </button>

      <h1 className="text-xl font-bold text-foreground mb-1">Route Details</h1>
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-4 h-4 text-primary" />
        <span className="text-sm text-primary font-semibold">{route.time}</span>
        <span className="text-xs text-muted-foreground">• {route.interchanges} interchange(s)</span>
      </div>

      {/* Timeline */}
      <div className="relative ml-4 border-l-2 border-primary/30 pl-6 space-y-6 mb-8">
        {route.stops.map((stop, i) => (
          <div key={`${stop}-${i}`} className="relative animate-float-up" style={{ animationDelay: `${i * 60}ms` }}>
            <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-2 ${
              i === 0 || i === route.stops.length - 1
                ? "bg-primary border-primary"
                : "bg-card border-primary/50"
            }`} />
            <p className={`text-sm ${i === 0 || i === route.stops.length - 1 ? "font-bold text-foreground" : "text-muted-foreground"}`}>
              {stop}
            </p>
            {i === 0 && <p className="text-xs text-primary mt-0.5">Boarding</p>}
            {i === route.stops.length - 1 && <p className="text-xs text-crowd-low mt-0.5">Destination</p>}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => navigate("/coach", { state: { route } })}
          className="flex-1 bg-secondary text-foreground py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <Eye className="w-5 h-5 text-primary" />
          View Coaches
        </button>
        <button
          onClick={() => navigate("/ticketing", { state: { route } })}
          className="flex-1 bg-primary text-primary-foreground py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <Ticket className="w-5 h-5" />
          Book Ticket
        </button>
      </div>
    </div>
  );
};

export default RouteDetails;
