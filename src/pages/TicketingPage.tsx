import { ArrowLeft, TrainFront, Waypoints, CreditCard, Check, Ticket, QrCode, X, Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { stations, type BookedTicket } from "@/data/mockData";
import { QRCodeSVG } from "qrcode.react";

type Tab = "book" | "tickets";

const TicketingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = (location.state as { route?: any })?.route;

  const [tab, setTab] = useState<Tab>(routeState ? "book" : "tickets");
  const [booked, setBooked] = useState(false);
  const [passengerName, setPassengerName] = useState("Mumbai Commuter");
  const [from, setFrom] = useState(routeState?.from || "");
  const [to, setTo] = useState(routeState?.to || "");
  const [modes, setModes] = useState<string[]>(routeState?.modes || ["Local Train"]);
  const [tickets, setTickets] = useState<BookedTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<BookedTicket | null>(null);

  const stationNames = stations.map(s => s.name);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("hamrahi-tickets") || "[]");
    setTickets(stored);
  }, [booked]);

  const hasLocal = modes.some(m => m.includes("Train"));
  const hasMetro = modes.some(m => m.includes("Metro"));
  const isCombined = hasLocal && hasMetro;
  const localPrice = 15;
  const metroPrice = 40;
  const combinedPrice = isCombined ? 50 : hasMetro ? metroPrice : localPrice;
  const savings = isCombined ? (localPrice + metroPrice - combinedPrice) : 0;

  const handleBook = () => {
    if (!from || !to) return;
    const ticket: BookedTicket = {
      id: `TKT-${Date.now().toString(36).toUpperCase()}`,
      from, to, modes,
      price: `₹${combinedPrice}`,
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      status: "active",
      qrData: JSON.stringify({ id: `TKT-${Date.now()}`, from, to, modes, price: combinedPrice, ts: Date.now() }),
      passengerName,
    };
    const existing = JSON.parse(localStorage.getItem("hamrahi-tickets") || "[]");
    existing.unshift(ticket);
    localStorage.setItem("hamrahi-tickets", JSON.stringify(existing));
    setBooked(true);
    setTimeout(() => { setBooked(false); setTab("tickets"); setFrom(""); setTo(""); }, 1800);
  };

  if (booked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 rounded-full bg-crowd-low/20 flex items-center justify-center mb-4 animate-float-up">
          <Check className="w-10 h-10 text-crowd-low" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2 animate-float-up" style={{ animationDelay: "100ms" }}>Ticket Booked!</h2>
        <p className="text-sm text-muted-foreground animate-float-up" style={{ animationDelay: "200ms" }}>Your QR ticket is ready</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      <h1 className="text-xl font-bold text-foreground mb-1">Joint Ticketing</h1>
      <p className="text-sm text-muted-foreground mb-5">One ticket for Metro + Local</p>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-secondary/50 rounded-2xl p-1 mb-6">
        <button
          onClick={() => setTab("book")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            tab === "book" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          }`}
        >
          Book Ticket
        </button>
        <button
          onClick={() => setTab("tickets")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            tab === "tickets" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          }`}
        >
          My Tickets ({tickets.length})
        </button>
      </div>

      {tab === "book" && (
        <div className="animate-float-up">
          {/* Station selectors */}
          <div className="glass-card p-4 mb-4">
            <label className="text-xs text-muted-foreground mb-1.5 block">From</label>
            <select
              value={from}
              onChange={e => setFrom(e.target.value)}
              className="w-full bg-secondary/50 rounded-xl px-3 py-2.5 text-sm text-foreground outline-none mb-3 appearance-none"
            >
              <option value="">Select station</option>
              {stationNames.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <label className="text-xs text-muted-foreground mb-1.5 block">To</label>
            <select
              value={to}
              onChange={e => setTo(e.target.value)}
              className="w-full bg-secondary/50 rounded-xl px-3 py-2.5 text-sm text-foreground outline-none appearance-none"
            >
              <option value="">Select station</option>
              {stationNames.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Mode selection */}
          <div className="glass-card p-4 mb-4">
            <label className="text-xs text-muted-foreground mb-2 block">Travel Modes</label>
            <div className="flex gap-2">
              {["Local Train", "Metro"].map(m => (
                <button
                  key={m}
                  onClick={() => {
                    setModes(prev =>
                      prev.includes(m) ? (prev.length > 1 ? prev.filter(x => x !== m) : prev) : [...prev, m]
                    );
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    modes.includes(m) ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {m.includes("Train") ? <TrainFront className="w-3.5 h-3.5" /> : <Waypoints className="w-3.5 h-3.5" />}
                  {m}
                </button>
              ))}
            </div>
            {isCombined && (
              <div className="bg-primary/10 rounded-xl px-3 py-2 flex items-center gap-2 mt-3">
                <CreditCard className="w-4 h-4 text-primary" />
                <span className="text-xs text-primary font-semibold">Combined ticket — Save ₹{savings}!</span>
              </div>
            )}
          </div>

          {/* Passenger */}
          <div className="glass-card p-4 mb-4">
            <label className="text-xs text-muted-foreground mb-1.5 block">Passenger Name</label>
            <input
              value={passengerName}
              onChange={e => setPassengerName(e.target.value)}
              className="w-full bg-secondary/50 rounded-xl px-3 py-2.5 text-sm text-foreground outline-none"
            />
          </div>

          {/* Price */}
          <div className="glass-card p-4 mb-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Price Breakdown</h3>
            {hasLocal && (
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Local Train</span>
                <span className="text-sm text-foreground">₹{localPrice}</span>
              </div>
            )}
            {hasMetro && (
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Metro</span>
                <span className="text-sm text-foreground">₹{metroPrice}</span>
              </div>
            )}
            {isCombined && savings > 0 && (
              <div className="flex justify-between mb-2">
                <span className="text-sm text-crowd-low">Combined Discount</span>
                <span className="text-sm text-crowd-low font-semibold">-₹{savings}</span>
              </div>
            )}
            <div className="border-t border-border/50 my-3" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-foreground">Total</span>
              <span className="text-lg font-bold text-primary">₹{combinedPrice}</span>
            </div>
          </div>

          <button
            onClick={handleBook}
            disabled={!from || !to}
            className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-semibold active:scale-[0.98] transition-transform disabled:opacity-40"
          >
            Pay ₹{combinedPrice} & Get QR Ticket
          </button>
        </div>
      )}

      {tab === "tickets" && (
        <div className="animate-float-up">
          {tickets.length === 0 ? (
            <div className="text-center py-16">
              <Ticket className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No tickets yet</p>
              <button onClick={() => setTab("book")} className="mt-3 text-xs text-primary font-semibold flex items-center gap-1 mx-auto">
                <Plus className="w-3.5 h-3.5" /> Book your first ticket
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className="w-full glass-card p-4 text-left active:scale-[0.98] transition-transform animate-float-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-primary">{t.id}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          t.status === "active" ? "bg-crowd-low/15 text-crowd-low" : "bg-secondary text-muted-foreground"
                        }`}>
                          {t.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-foreground">{t.from} → {t.to}</p>
                      <p className="text-xs text-muted-foreground">{t.date} • {t.modes.join(" + ")} • {t.price}</p>
                    </div>
                    <QrCode className="w-8 h-8 text-primary/40" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* QR Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center px-6" onClick={() => setSelectedTicket(null)}>
          <div className="glass-card p-6 w-full max-w-sm animate-float-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Your Ticket</h3>
              <button onClick={() => setSelectedTicket(null)} className="text-muted-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex justify-center mb-4">
              <div className="bg-white p-4 rounded-2xl">
                <QRCodeSVG value={selectedTicket.qrData} size={180} level="H" />
              </div>
            </div>
            <div className="space-y-2">
              {[
                ["Ticket ID", selectedTicket.id],
                ["Passenger", selectedTicket.passengerName],
                ["Route", `${selectedTicket.from} → ${selectedTicket.to}`],
                ["Modes", selectedTicket.modes.join(" + ")],
                ["Date", selectedTicket.date],
                ["Time", selectedTicket.time],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className="text-xs font-semibold text-foreground">{val}</span>
                </div>
              ))}
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

export default TicketingPage;
