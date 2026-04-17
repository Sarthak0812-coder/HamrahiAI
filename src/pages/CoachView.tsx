import { useState } from "react";
import { generateCoaches, stations } from "@/data/mockData";
import { ArrowLeft, Sparkles, TrainFront, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TrainOption {
  id: string;
  name: string;
  line: string;
  from: string;
  to: string;
  departure: string;
  seed: number;
}

const mockTrains: TrainOption[] = [
  { id: "T1", name: "Virar Fast", line: "Western", from: "Virar", to: "Churchgate", departure: "8:15 AM", seed: 1 },
  { id: "T2", name: "Borivali Slow", line: "Western", from: "Borivali", to: "Churchgate", departure: "8:22 AM", seed: 2 },
  { id: "T3", name: "Andheri Fast", line: "Western", from: "Andheri", to: "Churchgate", departure: "8:30 AM", seed: 3 },
  { id: "T4", name: "Kalyan Fast", line: "Central", from: "Kalyan", to: "CSMT", departure: "8:10 AM", seed: 4 },
  { id: "T5", name: "Thane Slow", line: "Central", from: "Thane", to: "CSMT", departure: "8:25 AM", seed: 5 },
  { id: "T6", name: "Metro Line 1", line: "Metro", from: "Versova", to: "Ghatkopar (M)", departure: "8:18 AM", seed: 6 },
];

const CoachView = () => {
  const navigate = useNavigate();
  const [selectedTrain, setSelectedTrain] = useState<TrainOption | null>(null);
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);
  const [lineFilter, setLineFilter] = useState<string>("All");

  const lines = ["All", "Western", "Central", "Metro"];
  const filteredTrains = lineFilter === "All" ? mockTrains : mockTrains.filter(t => t.line === lineFilter);

  const coaches = selectedTrain ? generateCoaches(selectedTrain.seed) : [];
  const bestCoach = coaches.length > 0 ? coaches.reduce((a, b) => a.crowd < b.crowd ? a : b) : null;
  const coach = coaches.find(c => c.id === selectedCoach);

  const crowdColor = (status: string) =>
    status === "low" ? "bg-crowd-low" : status === "medium" ? "bg-crowd-medium" : "bg-crowd-high";
  const crowdBorder = (status: string) =>
    status === "low" ? "border-crowd-low/40" : status === "medium" ? "border-crowd-medium/40" : "border-crowd-high/40";
  const crowdText = (status: string) =>
    status === "low" ? "text-crowd-low" : status === "medium" ? "text-crowd-medium" : "text-crowd-high";

  const predictionStops = selectedTrain
    ? stations.filter(s => s.line === selectedTrain.line.toLowerCase()).slice(0, 3).map(s => s.name)
    : [];

  // Train selection screen
  if (!selectedTrain) {
    return (
      <div className="min-h-screen pb-24 px-4 pt-6">
        <h1 className="text-xl font-bold text-foreground mb-1">Coach Recommendation</h1>
        <p className="text-sm text-muted-foreground mb-5">Select a train to view coach details</p>

        {/* Line filter */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {lines.map(line => (
            <button
              key={line}
              onClick={() => setLineFilter(line)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 ${
                lineFilter === line
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {line}
            </button>
          ))}
        </div>

        {/* Train list */}
        <div className="space-y-3">
          {filteredTrains.map((train, i) => {
            const trainCoaches = generateCoaches(train.seed);
            const avgCrowd = Math.round(trainCoaches.reduce((s, c) => s + c.crowd, 0) / trainCoaches.length);
            const status = avgCrowd < 40 ? "low" : avgCrowd < 65 ? "medium" : "high";
            return (
              <button
                key={train.id}
                onClick={() => { setSelectedTrain(train); setSelectedCoach(null); }}
                className="w-full glass-card p-4 text-left active:scale-[0.98] transition-transform animate-float-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${crowdColor(status)}/20 flex items-center justify-center`}>
                    <TrainFront className={`w-5 h-5 ${crowdText(status)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-foreground truncate">{train.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground shrink-0">{train.line}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{train.from} → {train.to}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-muted-foreground">🕐 {train.departure}</span>
                      <span className={`text-[10px] font-semibold ${crowdText(status)}`}>Avg: {avgCrowd}%</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Coach detail screen
  return (
    <div className="min-h-screen pb-24 px-4 pt-4">
      <button onClick={() => { setSelectedTrain(null); setSelectedCoach(null); }} className="flex items-center gap-2 text-muted-foreground mb-4 active:opacity-70">
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm">Back to trains</span>
      </button>

      <h1 className="text-xl font-bold text-foreground mb-1">Coach View</h1>
      <p className="text-sm text-muted-foreground mb-6">{selectedTrain.name} • {selectedTrain.from} → {selectedTrain.to}</p>

      {/* Recommended */}
      {bestCoach && (
        <div className="glass-card p-3 mb-5 flex items-center gap-3 border-primary/30">
          <Sparkles className="w-5 h-5 text-primary" />
          <p className="text-sm text-foreground">
            Recommended: <span className="font-bold text-primary">{bestCoach.id}</span> — {bestCoach.crowd}% occupancy
          </p>
        </div>
      )}

      {/* Train visual */}
      <div className="mb-6">
        <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Tap a coach to view details</p>
        <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 snap-x">
          {coaches.map((c) => {
            const isRecommended = c.id === bestCoach?.id;
            const isSelected = c.id === selectedCoach;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCoach(c.id === selectedCoach ? null : c.id)}
                className={`shrink-0 snap-center w-20 rounded-2xl border-2 p-3 flex flex-col items-center gap-1.5 transition-all duration-200 active:scale-95
                  ${isSelected ? `${crowdBorder(c.status)} bg-secondary` : "border-border bg-card"}
                  ${c.status === "high" ? "animate-pulse-crowd" : ""}
                `}
              >
                <div className={`w-8 h-8 rounded-lg ${crowdColor(c.status)} flex items-center justify-center`}>
                  <span className="text-xs font-bold text-primary-foreground">{c.crowd}%</span>
                </div>
                <span className={`text-xs font-semibold ${isRecommended ? "text-primary" : "text-foreground"}`}>{c.id}</span>
                <span className={`text-[10px] ${crowdText(c.status)}`}>{c.label}</span>
                {isRecommended && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected coach details */}
      {coach && (
        <div className="glass-card p-4 animate-float-up">
          <h3 className="text-base font-bold text-foreground mb-3">Coach {coach.id} Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Current Occupancy</span>
              <span className={`text-sm font-bold ${crowdText(coach.status)}`}>{coach.crowd}%</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${crowdColor(coach.status)}`}
                style={{ width: `${coach.crowd}%` }}
              />
            </div>
            <div className="pt-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-2">Predicted at next stations:</p>
              <div className="flex gap-2">
                {predictionStops.map((s, i) => (
                  <div key={s} className="glass-card px-3 py-2 text-center flex-1">
                    <p className="text-[10px] text-muted-foreground">{s}</p>
                    <p className={`text-xs font-bold ${crowdText(coach.status)}`}>
                      {Math.min(100, coach.crowd + (i + 1) * 8)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-4">
        {[
          { label: "Low", color: "bg-crowd-low" },
          { label: "Medium", color: "bg-crowd-medium" },
          { label: "High", color: "bg-crowd-high" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
            <span className="text-xs text-muted-foreground">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoachView;
