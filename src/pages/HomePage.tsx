import { useState, useEffect } from "react";
import { Search, AlertTriangle, Zap, Users, ChevronRight, Ticket, QrCode, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { alerts, type BookedTicket } from "../data/mockData";

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const [tickets, setTickets] = useState<BookedTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<BookedTicket | null>(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("hamrahi-tickets") || "[]") as BookedTicket[];
    setTickets(stored);
  }, [location]);

  useEffect(() => {
    const state = location.state as { showTicket?: BookedTicket } | null;
    if (state?.showTicket) {
      setSelectedTicket(state.showTicket);
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  const activeTickets = tickets.filter((ticket) => ticket.status === "active");

  return (
    <div className="min-h-screen pb-24 px-4 pt-12">
      <div className="mb-6 animate-float-up" style={{ animationDelay: "0ms" }}>
        <p className="text-muted-foreground text-sm">{greeting}</p>
        <h1 className="text-2xl font-bold text-foreground">Commuter</h1>
      </div>

      <button
        onClick={() => navigate("/routes")}
        className="w-full glass-card p-4 mb-5 animate-float-up text-left active:scale-[0.98] transition-transform"
        style={{ animationDelay: "80ms" }}
      >
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-primary font-medium">Search routes across Local & Metro</p>
            <p className="text-xs text-muted-foreground mt-0.5">Find the best route with AI</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </button>

      {activeTickets.length > 0 && (
        <div className="mb-5 animate-float-up" style={{ animationDelay: "100ms" }}>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Ticket className="w-4 h-4 text-primary" />
            Active Tickets
          </h3>
          <div className="space-y-2">
            {activeTickets.slice(0, 3).map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className="w-full glass-card p-4 text-left active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-primary">{ticket.id}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-crowd-low/15 text-crowd-low font-semibold">ACTIVE</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{ticket.from} to {ticket.to}</p>
                    <p className="text-xs text-muted-foreground">{ticket.date} • {ticket.modes.join(" + ")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <QrCode className="w-8 h-8 text-primary/50" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={() => navigate("/coach")}
          className="w-full glass-card p-4 text-left animate-float-up active:scale-[0.98] transition-transform"
          style={{ animationDelay: "160ms" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-crowd-medium/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-crowd-medium" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">Today's Crowd Status</h3>
              <p className="text-xs text-muted-foreground">Medium density • Coach C3 recommended</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </button>

        <div className="glass-card p-4 animate-float-up" style={{ animationDelay: "240ms" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Delays & Alerts</h3>
          </div>
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                    alert.type === "delay" ? "bg-destructive" : alert.type === "good" ? "bg-crowd-low" : "bg-primary"
                  }`}
                />
                <p className="text-xs text-muted-foreground">{alert.title}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => navigate("/routes")}
          className="w-full glass-card p-4 text-left animate-float-up active:scale-[0.98] transition-transform"
          style={{ animationDelay: "320ms" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">AI Suggested Route</h3>
              <p className="text-xs text-muted-foreground">Find optimized routes across lines</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </button>

        <button
          onClick={() => navigate("/crowd-detection")}
          className="w-full glass-card p-4 text-left animate-float-up active:scale-[0.98] transition-transform"
          style={{ animationDelay: "400ms" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-crowd-high/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-crowd-high" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">AI Crowd Detection</h3>
              <p className="text-xs text-muted-foreground">Live camera simulation • 128 detected</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </button>
      </div>

      {selectedTicket && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center px-6"
          onClick={() => setSelectedTicket(null)}
        >
          <div className="glass-card p-6 w-full max-w-sm animate-float-up" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Your Ticket</h3>
              <button onClick={() => setSelectedTicket(null)} className="text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-center mb-4">
              <div className="bg-white p-4 rounded-2xl">
                <QRCodeSVG value={selectedTicket.qrData} size={180} level="H" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Ticket ID</span>
                <span className="text-xs font-bold text-primary">{selectedTicket.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Passenger</span>
                <span className="text-xs font-semibold text-foreground">{selectedTicket.passengerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Route</span>
                <span className="text-xs text-foreground">{selectedTicket.from} to {selectedTicket.to}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Modes</span>
                <span className="text-xs text-foreground">{selectedTicket.modes.join(" + ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Date</span>
                <span className="text-xs text-foreground">{selectedTicket.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Time</span>
                <span className="text-xs text-foreground">{selectedTicket.time}</span>
              </div>
              <div className="border-t border-border/50 my-2" />
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-foreground">Amount Paid</span>
                <span className="text-lg font-bold text-primary">{selectedTicket.price}</span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="text-[10px] text-muted-foreground">Show this QR at the gate for entry</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
