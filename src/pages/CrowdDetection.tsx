import { useState, useEffect } from "react";
import { ArrowLeft, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CrowdDetection = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(128);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * 5) - 2);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Simulated bounding boxes
  const boxes = [
    { x: 15, y: 25, w: 8, h: 16 },
    { x: 30, y: 30, w: 7, h: 14 },
    { x: 50, y: 20, w: 9, h: 18 },
    { x: 65, y: 28, w: 7, h: 15 },
    { x: 80, y: 22, w: 8, h: 16 },
    { x: 22, y: 50, w: 7, h: 14 },
    { x: 42, y: 45, w: 8, h: 16 },
    { x: 58, y: 52, w: 7, h: 14 },
    { x: 75, y: 48, w: 8, h: 15 },
    { x: 35, y: 65, w: 9, h: 17 },
    { x: 55, y: 68, w: 7, h: 14 },
    { x: 70, y: 62, w: 8, h: 16 },
  ];

  return (
    <div className="min-h-screen pb-8 px-4 pt-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground mb-6 active:opacity-70">
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm">Back</span>
      </button>

      <h1 className="text-xl font-bold text-foreground mb-1">AI Crowd Detection</h1>
      <p className="text-sm text-muted-foreground mb-6">Simulated camera feed analysis</p>

      {/* Camera view */}
      <div className="relative glass-card overflow-hidden mb-5 aspect-video animate-float-up">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary to-card" />
        {/* Grid pattern to simulate camera */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "linear-gradient(hsl(217,91%,60%) 1px, transparent 1px), linear-gradient(90deg, hsl(217,91%,60%) 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }} />
        {/* Bounding boxes */}
        {boxes.map((box, i) => (
          <div
            key={i}
            className="absolute border-2 border-crowd-low rounded-sm"
            style={{
              left: `${box.x}%`,
              top: `${box.y}%`,
              width: `${box.w}%`,
              height: `${box.h}%`,
            }}
          >
            <div className="absolute -top-3 left-0 bg-crowd-low/80 px-1 rounded text-[7px] text-background font-bold">
              {(85 + Math.random() * 14).toFixed(0)}%
            </div>
          </div>
        ))}
        {/* Live badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-destructive/90 px-2 py-1 rounded-full">
          <div className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse" />
          <span className="text-[10px] font-bold text-primary-foreground">LIVE</span>
        </div>
      </div>

      {/* Counter */}
      <div className="glass-card p-4 flex items-center gap-4 animate-float-up" style={{ animationDelay: "100ms" }}>
        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
          <Eye className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{count}</p>
          <p className="text-xs text-muted-foreground">People Detected</p>
        </div>
      </div>
    </div>
  );
};

export default CrowdDetection;
