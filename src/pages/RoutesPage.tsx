import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, ArrowRightLeft, Sparkles, TrainFront, Waypoints, Search, MapPin, Navigation, X } from "lucide-react";
import { stations, findRoutes, findNearestStations, type Route } from "../data/mockData";

const lineBadge = (line: string) => {
  if (line === "western") return { label: "W", color: "bg-primary" };
  if (line === "central") return { label: "C", color: "bg-crowd-medium" };
  return { label: "M", color: "bg-crowd-low" };
};

const RoutesPage = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [showFromList, setShowFromList] = useState(false);
  const [showToList, setShowToList] = useState(false);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [searched, setSearched] = useState(false);
  const [nearbyStations, setNearbyStations] = useState<ReturnType<typeof findNearestStations>>([]);
  const [showNearby, setShowNearby] = useState(false);
  const [locating, setLocating] = useState(false);

  const filteredFrom = useMemo(() => stations.filter((station) => station.name.toLowerCase().includes(from.toLowerCase())), [from]);
  const filteredTo = useMemo(() => stations.filter((station) => station.name.toLowerCase().includes(to.toLowerCase())), [to]);

  const handleSearch = () => {
    if (!from || !to) return;
    const results = findRoutes(from, to);
    setRoutes(results);
    setSearched(true);
    setShowFromList(false);
    setShowToList(false);
  };

  const handleFindNearby = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nearby = findNearestStations(position.coords.latitude, position.coords.longitude);
        setNearbyStations(nearby);
        setShowNearby(true);
        setLocating(false);
      },
      () => {
        const nearby = findNearestStations(19.076, 72.8777);
        setNearbyStations(nearby);
        setShowNearby(true);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 5000 },
    );
  };

  const crowdColor = (crowd: string) =>
    crowd === "low" ? "text-crowd-low" : crowd === "medium" ? "text-crowd-medium" : "text-crowd-high";
  const crowdBg = (crowd: string) =>
    crowd === "low" ? "bg-crowd-low/15" : crowd === "medium" ? "bg-crowd-medium/15" : "bg-crowd-high/15";

  return (
    <div className="min-h-screen pb-24 px-4 pt-12">
      <h1 className="text-xl font-bold text-foreground mb-1">Smart Route Finder</h1>
      <p className="text-sm text-muted-foreground mb-5">Search across Local & Metro lines</p>

      <div className="glass-card p-4 mb-4 animate-float-up space-y-3">
        <div className="relative">
          <div className="flex items-center gap-3 bg-secondary/50 rounded-xl px-3 py-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-crowd-low" />
            <input
              value={from}
              onChange={(event) => {
                setFrom(event.target.value);
                setShowFromList(true);
                setSearched(false);
              }}
              onFocus={() => setShowFromList(true)}
              placeholder="From station..."
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            {from && (
              <button onClick={() => { setFrom(""); setSearched(false); }} className="text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {showFromList && from && filteredFrom.length > 0 && (
            <div className="absolute z-20 top-full left-0 right-0 mt-1 glass-card max-h-48 overflow-y-auto">
              {filteredFrom.map((station) => {
                const badge = lineBadge(station.line);
                return (
                  <button
                    key={station.id}
                    onClick={() => { setFrom(station.name); setShowFromList(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left active:bg-secondary/50 border-b border-border/20 last:border-0"
                  >
                    <span className={`text-[10px] font-bold text-primary-foreground ${badge.color} w-5 h-5 rounded-full flex items-center justify-center`}>
                      {badge.label}
                    </span>
                    <span className="text-sm text-foreground">{station.name}</span>
                    <span className="text-[10px] text-muted-foreground ml-auto capitalize">{station.line}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => { setFrom(to); setTo(from); setSearched(false); }}
            className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center active:scale-90 transition-transform"
          >
            <ArrowRightLeft className="w-4 h-4 text-primary" />
          </button>
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 bg-secondary/50 rounded-xl px-3 py-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
            <input
              value={to}
              onChange={(event) => {
                setTo(event.target.value);
                setShowToList(true);
                setSearched(false);
              }}
              onFocus={() => setShowToList(true)}
              placeholder="To station..."
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            {to && (
              <button onClick={() => { setTo(""); setSearched(false); }} className="text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {showToList && to && filteredTo.length > 0 && (
            <div className="absolute z-20 top-full left-0 right-0 mt-1 glass-card max-h-48 overflow-y-auto">
              {filteredTo.map((station) => {
                const badge = lineBadge(station.line);
                return (
                  <button
                    key={station.id}
                    onClick={() => { setTo(station.name); setShowToList(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left active:bg-secondary/50 border-b border-border/20 last:border-0"
                  >
                    <span className={`text-[10px] font-bold text-primary-foreground ${badge.color} w-5 h-5 rounded-full flex items-center justify-center`}>
                      {badge.label}
                    </span>
                    <span className="text-sm text-foreground">{station.name}</span>
                    <span className="text-[10px] text-muted-foreground ml-auto capitalize">{station.line}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            disabled={!from || !to}
            className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-40"
          >
            <Search className="w-4 h-4" />
            Find Routes
          </button>
          <button
            onClick={handleFindNearby}
            className="px-4 py-2.5 rounded-xl bg-secondary text-foreground text-sm font-medium flex items-center gap-2 active:scale-[0.98] transition-transform"
          >
            <Navigation className={`w-4 h-4 text-primary ${locating ? "animate-pulse" : ""}`} />
            Nearby
          </button>
        </div>
      </div>

      {showNearby && (
        <div className="glass-card p-4 mb-4 animate-float-up">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Nearest Stations
            </h3>
            <button onClick={() => setShowNearby(false)} className="text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {nearbyStations.map((station) => {
              const badge = lineBadge(station.line);
              return (
                <button
                  key={station.id}
                  onClick={() => { setFrom(station.name); setShowNearby(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-secondary/50 active:bg-secondary text-left transition-colors"
                >
                  <span className={`text-[10px] font-bold text-primary-foreground ${badge.color} w-5 h-5 rounded-full flex items-center justify-center`}>
                    {badge.label}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{station.name}</p>
                    <p className="text-[10px] text-muted-foreground capitalize">{station.line} line</p>
                  </div>
                  <span className="text-xs text-primary font-semibold">{station.distance.toFixed(1)} km</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {searched && (
        <div className="space-y-3">
          {routes.length === 0 ? (
            <div className="glass-card p-6 text-center animate-float-up">
              <p className="text-sm text-muted-foreground">No routes found between these stations</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground">{routes.length} route{routes.length !== 1 ? "s" : ""} found</p>
              {routes.map((route, index) => (
                <button
                  key={route.id}
                  onClick={() => navigate("/route-details", { state: route })}
                  className="w-full glass-card p-4 text-left animate-float-up active:scale-[0.98] transition-transform"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  {route.optimized && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-semibold text-primary">Best Route (AI Optimized)</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-semibold text-foreground">{route.time}</span>
                    </div>
                    <div className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${crowdBg(route.crowd)} ${crowdColor(route.crowd)}`}>
                      {route.crowd.toUpperCase()} CROWD
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ArrowRightLeft className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{route.interchanges} interchange{route.interchanges !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {route.modes.map((mode) => (
                        <div key={mode} className="flex items-center gap-1 bg-secondary px-2 py-0.5 rounded-full">
                          {mode.includes("Train") ? <TrainFront className="w-3 h-3 text-primary" /> : <Waypoints className="w-3 h-3 text-primary" />}
                          <span className="text-[10px] text-foreground">{mode}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">{route.trainName}</p>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default RoutesPage;
