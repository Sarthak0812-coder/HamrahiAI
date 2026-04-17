import { crowdTimeline, stationHeatmap } from "@/data/mockData";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

const AnalyticsPage = () => {
  const getBarColor = (d: number) =>
    d >= 80 ? "hsl(0,84%,60%)" : d >= 50 ? "hsl(45,93%,47%)" : "hsl(142,71%,45%)";

  return (
    <div className="min-h-screen pb-24 px-4 pt-12">
      <h1 className="text-xl font-bold text-foreground mb-1">Analytics</h1>
      <p className="text-sm text-muted-foreground mb-6">Real-time crowd insights</p>

      {/* Peak prediction */}
      <div className="glass-card p-4 mb-5 animate-float-up">
        <h3 className="text-sm font-semibold text-foreground mb-1">⏰ Peak Hours Prediction</h3>
        <p className="text-xs text-muted-foreground">Morning: <span className="text-crowd-high font-semibold">8:30–10:00 AM</span></p>
        <p className="text-xs text-muted-foreground">Evening: <span className="text-crowd-high font-semibold">5:30–7:30 PM</span></p>
      </div>

      {/* Crowd over time */}
      <div className="glass-card p-4 mb-5 animate-float-up" style={{ animationDelay: "80ms" }}>
        <h3 className="text-sm font-semibold text-foreground mb-3">Crowd Density Over Time</h3>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={crowdTimeline}>
              <defs>
                <linearGradient id="crowdGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(217,91%,60%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(217,91%,60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(215,20%,55%)" }} axisLine={false} tickLine={false} />
              <YAxis hide domain={[0, 100]} />
              <Area type="monotone" dataKey="density" stroke="hsl(217,91%,60%)" fill="url(#crowdGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Station heatmap */}
      <div className="glass-card p-4 animate-float-up" style={{ animationDelay: "160ms" }}>
        <h3 className="text-sm font-semibold text-foreground mb-3">Station Heatmap</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stationHeatmap} layout="vertical">
              <XAxis type="number" hide domain={[0, 100]} />
              <YAxis type="category" dataKey="station" tick={{ fontSize: 10, fill: "hsl(215,20%,55%)" }} axisLine={false} tickLine={false} width={80} />
              <Bar dataKey="density" radius={[0, 6, 6, 0]} barSize={14}>
                {stationHeatmap.map((entry, i) => (
                  <Cell key={i} fill={getBarColor(entry.density)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
